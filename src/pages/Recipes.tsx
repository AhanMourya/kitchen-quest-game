import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Clock, 
  Star, 
  Lock, 
  ChefHat,
  Filter,
  Grid3X3,
  List
} from "lucide-react";

const cuisineTypes = [
  { id: "african", label: " African", count: 45 },
  { id: "asian", label: " Asian", count: 38 },
  { id: "american", label: " American", count: 32 },
  { id: "british", label: " British", count: 29 },
  { id: "cajun", label: " Cajun", count: 25 },
  { id: "caribbean", label: " Caribbean", count: 52 },
  { id: "eastern_european", label: " Eastern European", count: 52 },
  { id: "european", label: " European", count: 52 },
  { id: "french", label: " French", count: 52 },
  { id: "german", label: " German", count: 52 },
  { id: "greek", label: " Greek", count: 52 },
  { id: "indian", label: " Indian", count: 52 },
  { id: "irish", label: " Irish", count: 52 },
  { id: "italian", label: " Italian", count: 52 },
  { id: "japanese", label: " Japanese", count: 52 },
  { id: "jewish", label: " Jewish", count: 52 },
  { id: "korean", label: " Korean", count: 52 },
  { id: "latin_american", label: " Latin American", count: 52 },
  { id: "mediterranean", label: " Mediterranean", count: 52 },
  { id: "mexican", label: " Mexican", count: 52 },
  { id: "middle_eastern", label: " Middle Eastern", count: 52 },
  { id: "nordic", label: " Nordic", count: 52 },
  { id: "Southern", label: " Southern", count: 52 },
  { id: "spanish", label: " Spanish", count: 52 },
  { id: "thai", label: " Thai", count: 52 },
  { id: "vietnamese", label: " Vietnamese", count: 52 },
];

const recipes = [
  {
    id: 1,
    title: "Spicy Thai Green Curry",
    cuisine: "Thai",
    difficulty: "Medium",
    time: "45 min",
    xp: 150,
    rating: 4.8,
    image: "/api/placeholder/300/200",
    isLocked: false,
    description: "Authentic Thai green curry with coconut milk and fresh herbs"
  },
  {
    id: 2,
    title: "Classic Pasta Carbonara",
    cuisine: "Italian",
    difficulty: "Easy",
    time: "20 min",
    xp: 80,
    rating: 4.9,
    image: "/api/placeholder/300/200",
    isLocked: false,
    description: "Traditional Roman pasta dish with eggs, cheese, and pancetta"
  },
  {
    id: 3,
    title: "Beef Wellington",
    cuisine: "British",
    difficulty: "Advanced",
    time: "2 hours",
    xp: 300,
    rating: 4.7,
    image: "/api/placeholder/300/200",
    isLocked: true,
    description: "Gordon Ramsay's signature dish wrapped in puff pastry"
  },
  {
    id: 4,
    title: "Chicken Tikka Masala",
    cuisine: "Indian",
    difficulty: "Medium",
    time: "1 hour",
    xp: 120,
    rating: 4.6,
    image: "/api/placeholder/300/200",
    isLocked: false,
    description: "Creamy tomato-based curry with tender marinated chicken"
  },
  {
    id: 5,
    title: "Perfect Sushi Rolls",
    cuisine: "Japanese",
    difficulty: "Hard",
    time: "90 min",
    xp: 200,
    rating: 4.5,
    image: "/api/placeholder/300/200",
    isLocked: true,
    description: "Master the art of sushi making with fresh fish and perfect rice"
  },
  {
    id: 6,
    title: "Mexican Street Tacos",
    cuisine: "Mexican",
    difficulty: "Easy",
    time: "30 min",
    xp: 90,
    rating: 4.7,
    image: "/api/placeholder/300/200",
    isLocked: false,
    description: "Authentic street-style tacos with fresh salsa and lime"
  }
];

export default function Recipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisines.length === 0 || 
                          selectedCuisines.some(cuisine => 
                            recipe.cuisine.toLowerCase().includes(cuisine.toLowerCase())
                          );
    const matchesLock = !showUnlockedOnly || !recipe.isLocked;
    
    return matchesSearch && matchesCuisine && matchesLock;
  });

  const handleCuisineToggle = (cuisineId: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisineId) 
        ? prev.filter(id => id !== cuisineId)
        : [...prev, cuisineId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-orange-100 text-orange-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Recipe Library</h1>
          <p className="text-muted-foreground">Discover, cook, and master delicious recipes from around the world</p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Recipes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search for recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Cuisine Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Cuisine Types
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cuisineTypes.map((cuisine) => (
                  <div key={cuisine.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={cuisine.id}
                        checked={selectedCuisines.includes(cuisine.id)}
                        onCheckedChange={() => handleCuisineToggle(cuisine.id)}
                      />
                      <label htmlFor={cuisine.id} className="text-sm font-medium cursor-pointer">
                        {cuisine.label}
                      </label>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {cuisine.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unlocked-only"
                    checked={showUnlockedOnly}
                    onCheckedChange={(checked) => setShowUnlockedOnly(checked === true)}
                  />
                  <label htmlFor="unlocked-only" className="text-sm font-medium cursor-pointer">
                    Unlocked recipes only
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredRecipes.length} recipes
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Recipe Grid */}
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredRecipes.map((recipe) => (
                <Card 
                  key={recipe.id} 
                  className={`shadow-card hover:shadow-glow transition-all duration-300 group ${
                    recipe.isLocked ? "opacity-75" : "hover:-translate-y-1"
                  }`}
                >
                  <div className="relative">
                    <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-secondary/20 flex items-center justify-center">
                        <ChefHat className="w-12 h-12 text-muted-foreground" />
                      </div>
                    </div>
                    
                    {recipe.isLocked && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                    )}
                    
                    <div className="absolute top-3 right-3">
                      <Badge variant="gaming">
                        +{recipe.xp} XP
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{recipe.title}</CardTitle>
                        <CardDescription className="mt-1">{recipe.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline">{recipe.cuisine}</Badge>
                      <Badge className={getDifficultyColor(recipe.difficulty)}>
                        {recipe.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {recipe.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {recipe.rating}
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      variant={recipe.isLocked ? "outline" : "hero"}
                      disabled={recipe.isLocked}
                    >
                      {recipe.isLocked ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </>
                      ) : (
                        <>
                          <ChefHat className="w-4 h-4 mr-2" />
                          Start Cooking
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}