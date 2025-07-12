import { useState, useEffect } from "react";
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
  List,
  X
} from "lucide-react";

const API_KEY = "11e83c6ceb5b450b9f8da21d23d7bab4"; // YOUR SPOONACULAR API KEY

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

// MOCK: Replace with your real backend fetch to get user's saved XP
async function fetchUserXP(): Promise<number> {
  // Example: fetch('/api/user/xp').then(r => r.json()).then(data => data.xp)
  // For now, return 0 as starting point
  return 0;
}

// MOCK: Replace with your real backend call to update XP
async function updateUserXP(newXP: number): Promise<void> {
  // Example: await fetch('/api/user/xp', { method: 'POST', body: JSON.stringify({ xp: newXP }) })
  console.log("Updating XP on backend to:", newXP);
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // USER XP STATE
  const [userXP, setUserXP] = useState(0);

  // On mount, fetch user XP from backend (e.g. Google login tied DB)
  useEffect(() => {
    fetchUserXP().then((xp) => setUserXP(xp));
  }, []);

  const fetchRecipes = async (cuisineList: string[]) => {
    try {
      const cuisineParam = cuisineList.length > 0 ? `&cuisine=${cuisineList.join(",")}` : "";
      const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=18&addRecipeInformation=true${cuisineParam}`;
      const res = await fetch(url);
      const data = await res.json();

      const mapped = data.results.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        cuisine: recipe.cuisines[0] || "Global",
        difficulty:
          recipe.readyInMinutes < 25
            ? "Easy"
            : recipe.readyInMinutes < 45
              ? "Medium"
              : recipe.readyInMinutes < 90
                ? "Hard"
                : "Advanced",
        time: `${recipe.readyInMinutes} min`,
        xp: Math.floor(recipe.readyInMinutes * 2),
        rating: recipe.spoonacularScore ? (recipe.spoonacularScore / 20).toFixed(1) : 4.5,
        image: recipe.image,
        isLocked: Math.random() < 0.25,
        description: recipe.summary?.replace(/<[^>]+>/g, "").slice(0, 120) + "..."
      }));

      setRecipes(mapped);
    } catch (error) {
      console.error("Failed to fetch recipes", error);
    }
  };

  const fetchRecipeDetails = async (recipe: any) => {
    try {
      setIsLoadingDetails(true);
      const res = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`);
      const data = await res.json();

      const detailedRecipe = {
        ...recipe,
        ingredients: data.extendedIngredients || [],
        instructions: data.analyzedInstructions?.[0]?.steps || []
      };

      setSelectedRecipe(detailedRecipe);
    } catch (err) {
      console.error("Failed to fetch full recipe", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchRecipes(selectedCuisines);
  }, [selectedCuisines]);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLock = !showUnlockedOnly || !recipe.isLocked;
    return matchesSearch && matchesLock;
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

  // XP awarding logic on finishing cooking
  const handleFinishCooking = async () => {
    if (!selectedRecipe) return;
    const newXP = userXP + selectedRecipe.xp;
    setUserXP(newXP);

    // Save XP to backend (persist for logged-in user)
    await updateUserXP(newXP);

    setSelectedRecipe(null);
    alert(`Congrats! You earned +${selectedRecipe.xp} XP! Your total XP is now ${newXP}.`);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 p-8">
        {!selectedRecipe ? (
          <>
            {/* Top Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Recipe Library</h1>
              <p className="text-muted-foreground">Discover, cook, and master delicious recipes from around the world</p>
              <p className="mt-1 text-sm text-primary font-semibold">Your XP: {userXP}</p>
            </div>

            {/* Main Body */}
            <div className="flex gap-8">
              {/* Sidebar */}
              <div className="w-80 space-y-6">
                {/* Search */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Search className="w-5 h-5" />Search Recipes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="Search for recipes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </CardContent>
                </Card>

                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5" />Cuisine Types</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {cuisineTypes.map(cuisine => (
                      <div key={cuisine.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={cuisine.id}
                            checked={selectedCuisines.includes(cuisine.id)}
                            onCheckedChange={() => handleCuisineToggle(cuisine.id)}
                          />
                          <label htmlFor={cuisine.id} className="text-sm font-medium">{cuisine.label}</label>
                        </div>
                        <Badge variant="outline" className="text-xs">{cuisine.count}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Options */}
                <Card>
                  <CardHeader><CardTitle>Options</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="unlocked-only"
                        checked={showUnlockedOnly}
                        onCheckedChange={(v) => setShowUnlockedOnly(v === true)}
                      />
                      <label htmlFor="unlocked-only" className="text-sm font-medium">Unlocked recipes only</label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recipe Cards */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-muted-foreground">Showing {filteredRecipes.length} recipes</span>
                  <div className="flex items-center gap-2">
                    <Button variant={viewMode === "grid" ? "default" : "outline"} onClick={() => setViewMode("grid")} size="sm"><Grid3X3 className="w-4 h-4" /></Button>
                    <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")} size="sm"><List className="w-4 h-4" /></Button>
                  </div>
                </div>

                <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                  {filteredRecipes.map(recipe => (
                    <Card key={recipe.id} className={`shadow-card group transition-all duration-300 ${recipe.isLocked ? "opacity-75" : "hover:-translate-y-1"}`}>
                      <div className="relative">
                        <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                        </div>
                        {recipe.isLocked && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                            <Lock className="w-8 h-8 text-white" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge variant="gaming">+{recipe.xp} XP</Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{recipe.title}</CardTitle>
                        <CardDescription>{recipe.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="outline">{recipe.cuisine}</Badge>
                          <Badge className={getDifficultyColor(recipe.difficulty)}>{recipe.difficulty}</Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex gap-1 items-center"><Clock className="w-4 h-4" />{recipe.time}</div>
                          <div className="flex gap-1 items-center"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{recipe.rating}</div>
                        </div>
                        <Button
                          className="w-full"
                          variant={recipe.isLocked ? "outline" : "hero"}
                          disabled={recipe.isLocked}
                          onClick={() => fetchRecipeDetails(recipe)}
                        >
                          Cook this recipe
                          <ChefHat className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          // Detailed recipe view
          <div className="max-w-4xl mx-auto">
            <Button
              variant="outline"
              className="mb-4"
              onClick={() => setSelectedRecipe(null)}
            >
              <X className="w-4 h-4 mr-2" /> Back to recipes
            </Button>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>{selectedRecipe.title}</CardTitle>
                <CardDescription>{selectedRecipe.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.title}
                    className="w-full rounded-lg"
                  />
                </div>

                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc pl-5 mb-6">
                  {selectedRecipe.ingredients.map((ing: any) => (
                    <li key={ing.id}>{ing.original}</li>
                  ))}
                </ul>

                <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                <ol className="list-decimal pl-5 space-y-2 mb-6">
                  {selectedRecipe.instructions.length > 0
                    ? selectedRecipe.instructions.map((step: any, idx: number) => (
                      <li key={idx}>{step.step}</li>
                    ))
                    : <li>No instructions available.</li>
                  }
                </ol>

                <Button
                  variant="hero"
                  className="w-full"
                  onClick={handleFinishCooking}
                  disabled={isLoadingDetails}
                >
                  {isLoadingDetails ? "Saving XP..." : `Finish Cooking (+${selectedRecipe.xp} XP)`}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
