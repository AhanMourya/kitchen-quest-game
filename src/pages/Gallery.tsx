import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MessageCircle, Share2, Upload, Star, Filter, Camera } from "lucide-react";

const galleryItems = [
  {
    id: 1,
    image: "/placeholder.svg",
    title: "Perfect Margherita Pizza",
    chef: "PizzaMaestro",
    chefLevel: 7,
    recipe: "Classic Margherita",
    cuisine: "Italian",
    rating: 5,
    likes: 42,
    comments: 8,
    caption: "Finally nailed the perfect crust! The secret is the overnight dough.",
    tags: ["crispy", "homemade", "perfect"],
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    image: "/placeholder.svg",
    title: "Spicy Ramen Bowl",
    chef: "RamenLover",
    chefLevel: 4,
    recipe: "Korean Spicy Ramen",
    cuisine: "Korean",
    rating: 4,
    likes: 28,
    comments: 5,
    caption: "So spicy but so good! Added extra kimchi.",
    tags: ["spicy", "comfort-food", "delicious"],
    timeAgo: "1 day ago",
  },
  {
    id: 3,
    image: "/placeholder.svg",
    title: "Chocolate Soufflé",
    chef: "BakingQueen",
    chefLevel: 9,
    recipe: "French Chocolate Soufflé",
    cuisine: "French",
    rating: 5,
    likes: 156,
    comments: 23,
    caption: "It didn't collapse! I'm so proud of this one.",
    tags: ["elegant", "challenging", "achievement"],
    timeAgo: "2 days ago",
  },
  {
    id: 4,
    image: "/placeholder.svg",
    title: "Colorful Buddha Bowl",
    chef: "HealthyChef",
    chefLevel: 6,
    recipe: "Rainbow Buddha Bowl",
    cuisine: "Healthy",
    rating: 4,
    likes: 67,
    comments: 12,
    caption: "So fresh and colorful! Perfect for meal prep.",
    tags: ["healthy", "colorful", "fresh"],
    timeAgo: "3 days ago",
  },
];

export default function Gallery() {
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [filterCuisine, setFilterCuisine] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleLike = (itemId: number) => {
    setLikedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredItems = galleryItems.filter(item => {
    if (filterCuisine !== "all" && item.cuisine.toLowerCase() !== filterCuisine) return false;
    if (filterRating !== "all" && item.rating < parseInt(filterRating)) return false;
    return true;
  });

  return (
    <div className=" flex min-h-screen bg-background">
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cuisines</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="korean">Korean</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars Only</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                  <div>
                    <Label htmlFor="image">Upload Image</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="recipe">Recipe Used</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the recipe you followed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="margherita">Classic Margherita Pizza</SelectItem>
                        <SelectItem value="ramen">Korean Spicy Ramen</SelectItem>
                        <SelectItem value="souffle">French Chocolate Soufflé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="caption">Caption</Label>
                    <Textarea id="caption" placeholder="Tell us about your cooking experience..." />
                  </div>
                  <div>
                    <Label htmlFor="rating">Your Rating</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-6 h-6 text-muted-foreground hover:text-yellow-500 cursor-pointer" />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input id="tags" placeholder="e.g. spicy, homemade, perfect (comma separated)" />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="hero" onClick={() => setIsUploadDialogOpen(false)}>
                      Share Dish
                    </Button>
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