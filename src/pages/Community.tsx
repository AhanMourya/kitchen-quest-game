import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThumbsUp, MessageCircle, Share2, Plus, Trophy, Star, Users, Clock } from "lucide-react";

const communityRecipes = [
  {
    id: 1,
    title: "Spicy Korean Ramen Bowl",
    description: "A fiery twist on classic ramen with kimchi and gochujang",
    creator: "SpiceKing92",
    creatorLevel: 8,
    votes: 156,
    comments: 23,
    status: "Trending",
    cuisine: "Korean",
    difficulty: "Intermediate",
    image: "/placeholder.svg",
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    title: "Mediterranean Quinoa Salad",
    description: "Fresh and healthy salad with olives, feta, and herbs",
    creator: "HealthyChef",
    creatorLevel: 5,
    votes: 89,
    comments: 12,
    status: "Accepted",
    cuisine: "Mediterranean",
    difficulty: "Beginner",
    image: "/placeholder.svg",
    timeAgo: "1 day ago",
  },
  {
    id: 3,
    title: "Chocolate Lava Cake",
    description: "Decadent dessert with molten chocolate center",
    creator: "DessertMaster",
    creatorLevel: 12,
    votes: 234,
    comments: 45,
    status: "Community Favorite",
    cuisine: "French",
    difficulty: "Advanced",
    image: "/placeholder.svg",
    timeAgo: "3 days ago",
  },
];

const topChefs = [
  {
    username: "DessertMaster",
    level: 12,
    recipesSubmitted: 24,
    votesReceived: 1250,
    dishesCooked: 156,
    rank: 1,
  },
  {
    username: "SpiceKing92",
    level: 8,
    recipesSubmitted: 18,
    votesReceived: 892,
    dishesCooked: 98,
    rank: 2,
  },
  {
    username: "HealthyChef",
    level: 5,
    recipesSubmitted: 12,
    votesReceived: 567,
    dishesCooked: 67,
    rank: 3,
  },
];

export default function Community() {
  const [votedRecipes, setVotedRecipes] = useState<number[]>([]);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  const handleVote = (recipeId: number) => {
    setVotedRecipes(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Community Hub
            </h1>
            <p className="text-muted-foreground text-lg">
              Share recipes, vote on favorites, and connect with fellow chefs
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Community Recipes */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Community Recipes</h2>
                <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="hero" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Submit Recipe
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Submit Your Recipe</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Recipe Title</Label>
                        <Input id="title" placeholder="e.g., Grandma's Secret Pasta" />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Brief description of your recipe..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Cuisine Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select cuisine" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="italian">Italian</SelectItem>
                              <SelectItem value="mexican">Mexican</SelectItem>
                              <SelectItem value="asian">Asian</SelectItem>
                              <SelectItem value="american">American</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Difficulty</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="ingredients">Ingredients</Label>
                        <Textarea id="ingredients" placeholder="List ingredients..." />
                      </div>
                      <div>
                        <Label htmlFor="instructions">Instructions</Label>
                        <Textarea id="instructions" placeholder="Step-by-step instructions..." />
                      </div>
                      <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="hero" onClick={() => setIsSubmitDialogOpen(false)}>
                          Submit Recipe
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {communityRecipes.map((recipe) => (
                  <Card key={recipe.id} className="shadow-card hover:shadow-glow transition-all">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title}
                          className="w-24 h-24 rounded-lg object-cover bg-muted"
                        />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{recipe.title}</h3>
                              <p className="text-muted-foreground text-sm">{recipe.description}</p>
                            </div>
                            <Badge 
                              variant={recipe.status === "Trending" ? "default" : 
                                      recipe.status === "Community Favorite" ? "secondary" : "outline"}
                            >
                              {recipe.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>by {recipe.creator} (Level {recipe.creatorLevel})</span>
                            <span>•</span>
                            <span>{recipe.cuisine}</span>
                            <span>•</span>
                            <span>{recipe.difficulty}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {recipe.timeAgo}
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            <Button
                              variant={votedRecipes.includes(recipe.id) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleVote(recipe.id)}
                              className="gap-2"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              {recipe.votes + (votedRecipes.includes(recipe.id) ? 1 : 0)}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <MessageCircle className="w-4 h-4" />
                              {recipe.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Share2 className="w-4 h-4" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Top Chefs Sidebar */}
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-accent" />
                    Top Chefs This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topChefs.map((chef, index) => (
                      <div key={chef.username} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white" :
                          index === 1 ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white" :
                          index === 2 ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {chef.rank}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{chef.username}</div>
                          <div className="text-xs text-muted-foreground">Level {chef.level}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-semibold">{chef.votesReceived}</div>
                          <div className="text-xs text-muted-foreground">votes</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Chefs</span>
                      <span className="font-semibold">2,341</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recipes Shared</span>
                      <span className="font-semibold">1,287</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Votes</span>
                      <span className="font-semibold">15,678</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">This Week</span>
                      <span className="font-semibold">+127 recipes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}