"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Heart,
  MessageCircle,
  Share2,
  Upload,
  Star,
  Filter,
  Camera,
} from "lucide-react";

export default function Gallery() {
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [filterCuisine, setFilterCuisine] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadedDishes, setUploadedDishes] = useState<any[]>([]);

  const [form, setForm] = useState({
    image: "",
    title: "",
    chef: "You",
    chefLevel: 1,
    recipe: "",
    cuisine: "",
    rating: 5,
    likes: 0,
    comments: 0,
    caption: "",
    tags: "",
    timeAgo: "Just now",
  });

  useEffect(() => {
    const stored = localStorage.getItem("uploadedDishes");
    const cooked = localStorage.getItem("cookedRecipes");

    let uploaded = stored ? JSON.parse(stored) : [];
    let cookedRecipes = cooked ? JSON.parse(cooked) : [];

    // Add cooked recipes if not already present
    cookedRecipes.forEach((recipe: any) => {
      const exists = uploaded.some((item: any) => item.id === recipe.id);
      if (!exists) {
        uploaded.unshift({
          id: recipe.id,
          image: recipe.image,
          title: recipe.title,
          cuisine: recipe.cuisine || "Global",
          recipe: recipe.title,
          caption: "Made this from the recipe library!",
          tags: [recipe.cuisine || "global", "auto-uploaded"],
          rating: parseFloat(recipe.rating) || 5,
          chef: "You",
          chefLevel: 1,
          likes: 0,
          comments: 0,
          timeAgo: "Just now",
        });
      }
    });

    setUploadedDishes(uploaded);
    localStorage.setItem("uploadedDishes", JSON.stringify(uploaded));
  }, []);

  const handleLike = (itemId: number) => {
    setLikedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result as string }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleShare = () => {
    const newDish = {
      ...form,
      id: Date.now(),
      tags: form.tags.split(",").map(tag => tag.trim()),
    };
    const updated = [newDish, ...uploadedDishes];
    localStorage.setItem("uploadedDishes", JSON.stringify(updated));
    setUploadedDishes(updated);
    setIsUploadDialogOpen(false);
    setForm({
      image: "",
      title: "",
      chef: "You",
      chefLevel: 1,
      recipe: "",
      cuisine: "",
      rating: 5,
      likes: 0,
      comments: 0,
      caption: "",
      tags: "",
      timeAgo: "Just now",
    });
  };

  const filteredItems = uploadedDishes.filter(item => {
    if (filterCuisine !== "all" && item.cuisine.toLowerCase() !== filterCuisine) return false;
    if (filterRating !== "all" && item.rating < parseInt(filterRating)) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Dish Gallery
            </h1>
            <p className="text-muted-foreground text-lg">
              Share your culinary creations and discover amazing dishes from the community
            </p>
          </div>

          {/* Upload and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <Select value={filterCuisine} onValueChange={setFilterCuisine}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Cuisines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cuisines</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="korean">Korean</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="thai">Thai</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars Only</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Upload Dialog */}
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" className="gap-2">
                  <Camera className="w-4 h-4" />
                  Upload Dish
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Share Your Dish</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Label htmlFor="image">Upload Image</Label>
                  <Input type="file" accept="image/*" onChange={handleImageUpload} />

                  <Label htmlFor="title">Dish Title</Label>
                  <Input id="title" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />

                  <Label htmlFor="recipe">Recipe Used</Label>
                  <Input id="recipe" value={form.recipe} onChange={e => setForm(prev => ({ ...prev, recipe: e.target.value }))} />

                  <Label htmlFor="cuisine">Cuisine Type</Label>
                  <Input id="cuisine" value={form.cuisine} onChange={e => setForm(prev => ({ ...prev, cuisine: e.target.value }))} />

                  <Label htmlFor="caption">Caption</Label>
                  <Textarea id="caption" value={form.caption} onChange={e => setForm(prev => ({ ...prev, caption: e.target.value }))} />

                  <Label htmlFor="rating">Your Rating</Label>
                  <Select value={String(form.rating)} onValueChange={val => setForm(prev => ({ ...prev, rating: parseInt(val) }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={String(num)}>{num} Stars</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="spicy, homemade" value={form.tags} onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))} />

                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
                    <Button variant="hero" onClick={handleShare}>Share Dish</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="shadow-card hover:shadow-glow transition-all overflow-hidden">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover bg-muted"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-black/20 text-white backdrop-blur-sm">
                      {item.cuisine}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      by {item.chef} (Level {item.chefLevel}) • {item.timeAgo}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < item.rating ? "text-yellow-500 fill-current" : "text-muted-foreground"}`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">({item.rating})</span>
                  </div>

                  <p className="text-sm text-muted-foreground">{item.caption}</p>

                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(item.id)}
                        className={`gap-1 ${likedItems.includes(item.id) ? "text-red-500" : ""}`}
                      >
                        <Heart className={`w-4 h-4 ${likedItems.includes(item.id) ? "fill-current" : ""}`} />
                        {item.likes + (likedItems.includes(item.id) ? 1 : 0)}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {item.comments}
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No dishes found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or be the first to share!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
