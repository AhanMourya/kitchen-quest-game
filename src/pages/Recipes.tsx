import React from "react";
import { useState, useEffect, useRef } from "react";
import { incrementRecipeCount, getRecipeCount } from "@/lib/utils";
import { Navigation } from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  X,
} from "lucide-react";

const API_KEY = "697f709e3dca49799197579e6336c862"; // CURRENT API KEY

const cuisineTypes = [
  { id: "african", label: " African" },
  { id: "asian", label: " Asian" },
  { id: "american", label: " American" },
  { id: "british", label: " British" },
  { id: "cajun", label: " Cajun" },
  { id: "chinese", label: " Chinese" },
  { id: "caribbean", label: " Caribbean" },
  { id: "eastern_european", label: " Eastern European" },
  { id: "european", label: " European" },
  { id: "french", label: " French" },
  { id: "german", label: " German" },
  { id: "greek", label: " Greek" },
  { id: "indian", label: " Indian" },
  { id: "irish", label: " Irish" },
  { id: "italian", label: " Italian" },
  { id: "japanese", label: " Japanese" },
  { id: "jewish", label: " Jewish" },
  { id: "korean", label: " Korean" },
  { id: "latin_american", label: " Latin American" },
  { id: "mediterranean", label: " Mediterranean" },
  { id: "mexican", label: " Mexican" },
  { id: "middle_eastern", label: " Middle Eastern" },
  { id: "nordic", label: " Nordic" },
  { id: "southern", label: " Southern" },
  { id: "spanish", label: " Spanish" },
  { id: "thai", label: " Thai" },
  { id: "vietnamese", label: " Vietnamese" },
];

// LocalStorage: XP/level data
function getUserProfileLocal() {
  const data = localStorage.getItem("userProfile");
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return {
        xp: typeof parsed.xp === "number" ? parsed.xp : 0,
        level: typeof parsed.level === "number" ? parsed.level : 1,
        xpToNextLevel:
          typeof parsed.xpToNextLevel === "number" ? parsed.xpToNextLevel : 400,
      };
    } catch {
      return { xp: 0, level: 1, xpToNextLevel: 400 };
    }
  }
  return { xp: 0, level: 1, xpToNextLevel: 400 };
}

function setUserProfileLocal(profile: {
  xp: number;
  level: number;
  xpToNextLevel: number;
}) {
  localStorage.setItem("userProfile", JSON.stringify(profile));
  window.dispatchEvent(new Event("userProfileUpdated"));
}


function addToCookedRecipes(recipe: any) {
  const existing = JSON.parse(localStorage.getItem("cookedRecipes") || "[]");
  const alreadyAdded = existing.some((r: any) => r.id === recipe.id);
  if (!alreadyAdded) {
    localStorage.setItem("cookedRecipes", JSON.stringify([...existing, recipe]));
  }
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [totalResults, setTotalResults] = useState<number | null>(null);

  const [userXP, setUserXP] = useState(() => getUserProfileLocal().xp);
  const [userLevel, setUserLevel] = useState(() => getUserProfileLocal().level);
  const [xpToNextLevel, setXpToNextLevel] = useState(
    () => getUserProfileLocal().xpToNextLevel
  );

  // Pagination state
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const { xp, level, xpToNextLevel } = getUserProfileLocal();
    setUserXP(xp);
    setUserLevel(level);
    setXpToNextLevel(xpToNextLevel);
  }, []);

  // Fetch recipes on search or cuisine change (reset page to 1)
  useEffect(() => {
    setPage(1);
    fetchRecipesBySearch(searchQuery, selectedCuisines, 1, true);
  }, [searchQuery, selectedCuisines, showUnlockedOnly]);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchRecipesBySearch(searchQuery, selectedCuisines, 1, true);
    }, 500);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery, selectedCuisines, showUnlockedOnly]);

  async function fetchRecipesBySearch(
    query: string,
    cuisineList: string[],
    pageToFetch: number,
    reset: boolean = false
  ) {
    try {
      if (pageToFetch === 1 && !reset) return; // skip duplicate calls

      if (pageToFetch === 1) {
        setIsLoadingMore(true);
      }

      const numberPerPage = 18;
      const cuisineParam =
        cuisineList.length > 0 ? `&cuisine=${cuisineList.join(",")}` : "";
      const queryParam = query.trim() !== "" ? `&query=${encodeURIComponent(query.trim())}` : "";
      const offset = (pageToFetch - 1) * numberPerPage;

      const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=${numberPerPage}&offset=${offset}&addRecipeInformation=true${cuisineParam}${queryParam}`;

      const res = await fetch(url);
      const data = await res.json();

      setTotalResults(typeof data.totalResults === "number" ? data.totalResults : null);

      if (!data.results) {
        if (reset) setRecipes([]);
        return;
      }

      const mapped = data.results.map((recipe: any) => {
        const difficulty =
          recipe.readyInMinutes < 25
            ? "Easy"
            : recipe.readyInMinutes < 45
              ? "Medium"
              : recipe.readyInMinutes < 90
                ? "Hard"
                : "Advanced";
        // Locking system by user level
        let isLocked = false;
        if (userLevel === 1) {
          isLocked = difficulty !== "Easy";
        } else if (userLevel === 2) {
          isLocked = !["Easy", "Medium"].includes(difficulty);
        } else if (userLevel === 3) {
          isLocked = !["Easy", "Medium", "Hard"].includes(difficulty);
        } // level 4+ unlocks all

        return {
          id: recipe.id,
          title: recipe.title,
          cuisine: recipe.cuisines?.[0] || "Global",
          difficulty,
          time: `${recipe.readyInMinutes} min`,
          xp: Math.floor(recipe.readyInMinutes * 2),
          rating: recipe.spoonacularScore
            ? (recipe.spoonacularScore / 20).toFixed(1)
            : "4.5",
          image: recipe.image,
          isLocked,
          description: recipe.summary?.replace(/<[^>]+>/g, "").slice(0, 120) + "...",
        };
      });

      if (reset) {
        setRecipes(mapped);
      } else {
        setRecipes((prev) => [...prev, ...mapped]);
      }

      setIsLoadingMore(false);
    } catch (err) {
      console.error("Error fetching recipes", err);
      setIsLoadingMore(false);
    }
  }

  const fetchRecipeDetails = async (recipe: any) => {
    try {
      setIsLoadingDetails(true);
      const res = await fetch(
        `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`
      );
      const data = await res.json();

      setSelectedRecipe({
        ...recipe,
        ingredients: data.extendedIngredients || [],
        instructions: data.analyzedInstructions?.[0]?.steps || [],
      });
    } catch (err) {
      console.error("Failed to fetch full recipe", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCuisineToggle = (id: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleFinishCooking = () => {
    if (!selectedRecipe) return;
    let newXP = userXP + selectedRecipe.xp;
    let newLevel = userLevel;
    let nextLevelXP = 400 * (2 ** newLevel - 1) - newXP;

    if (nextLevelXP <= 0) {
      newLevel++;
      nextLevelXP = 400 * (2 ** newLevel - 1);
    }

    setUserXP(newXP);
    setUserLevel(newLevel);
    setXpToNextLevel(nextLevelXP);
    setUserProfileLocal({ xp: newXP, level: newLevel, xpToNextLevel: nextLevelXP });

    addToCookedRecipes(selectedRecipe); // 
    // Increment recipe count in localStorage for cross-page use
    incrementRecipeCount(); 
    const countKey = 'recipesCompletedCount';
    let completedCount = parseInt(localStorage.getItem(countKey) || '0', 10);
    completedCount += 1;
    localStorage.setItem(countKey, completedCount.toString());
    window.dispatchEvent(new Event('recipesCompletedCountUpdated'));

    const uniqueCuisinesKey = 'uniqueCuisinesCooked';
    let uniqueCuisines: string[] = [];
    try {
      uniqueCuisines = JSON.parse(localStorage.getItem(uniqueCuisinesKey) || '[]');
    } catch { uniqueCuisines = []; }
    const recipeCuisine = selectedRecipe.cuisine;
    if (recipeCuisine && !uniqueCuisines.includes(recipeCuisine)) {
      uniqueCuisines.push(recipeCuisine);
      localStorage.setItem(uniqueCuisinesKey, JSON.stringify(uniqueCuisines));
      // Store the count for Dashboard.tsx
      localStorage.setItem('uniqueCuisinesCookedCount', uniqueCuisines.length.toString());
      window.dispatchEvent(new Event('uniqueCuisinesCookedUpdated'));
    }

    // --- Unlock 'First Flame' achievement in localStorage if recipeCount >= 1 ---
    if (getRecipeCount() >= 1) {
      const achievementsRaw = localStorage.getItem('achievements');
      let achievements = [];
      try {
        achievements = achievementsRaw ? JSON.parse(achievementsRaw) : [];
      } catch { }
      if (Array.isArray(achievements) && achievements.length > 0) {
        achievements[0].unlocked = true;
        achievements[0].progress = 100;
        localStorage.setItem('achievements', JSON.stringify(achievements));
        window.dispatchEvent(new Event('achievementsUpdated'));
      }
    }

    alert(
      `Congrats! You earned +${selectedRecipe.xp} XP! Your total XP is now ${newXP}.`
    );
    setSelectedRecipe(null);
  };

  // Filter locally for unlocked only
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesLock = !showUnlockedOnly || !recipe.isLocked;
    return matchesLock;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-orange-100 text-orange-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canLoadMore =
    totalResults !== null && filteredRecipes.length < totalResults;

  const handleLoadMore = () => {
    if (isLoadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRecipesBySearch(searchQuery, selectedCuisines, nextPage);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 p-8">
        {!selectedRecipe ? (
          <React.Fragment>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Recipe Library</h1>
              <p className="text-muted-foreground">
                Discover, cook, and master delicious recipes from around the world
              </p>
              <p className="mt-1 text-sm text-primary font-semibold">
                Your XP: {userXP} | Level: {userLevel}
              </p>
            </div>

            <div className="flex gap-8">
              <div className="w-80 space-y-6">
                <Card className="bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-50 border-2 border-pink-300 shadow-card hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Search Recipes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoComplete="off"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-50 border-2 border-pink-300 shadow-card hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Cuisine Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {cuisineTypes.map((c) => (
                      <div
                        key={c.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={c.id}
                            checked={selectedCuisines.includes(c.id)}
                            onCheckedChange={() => handleCuisineToggle(c.id)}
                          />
                          <label htmlFor={c.id} className="text-sm font-medium">
                            {c.label}
                          </label>
                        </div>
                        <Badge variant="outline" className="text-xs">

                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-50 border-2 border-pink-300 shadow-card hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="unlocked-only"
                        checked={showUnlockedOnly}
                        onCheckedChange={(v) => setShowUnlockedOnly(v === true)}
                      />
                      <label
                        htmlFor="unlocked-only"
                        className="text-sm font-medium"
                      >
                        Unlocked only
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Showing {filteredRecipes.length} recipes
                    </span>
                    {typeof totalResults === "number" && (
                      <span className="ml-3 text-xs bg-accent px-2 py-1 rounded">
                        Total: {totalResults}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      onClick={() => setViewMode("grid")}
                      size="sm"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      onClick={() => setViewMode("list")}
                      size="sm"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 xl:grid-cols-3 gap-8"
                      : "space-y-6"
                  }
                >
                  {filteredRecipes.map((recipe) => (
                    <Card
                      key={recipe.id}
                      className={`shadow-card group transition-all duration-300 bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-50 border-2 border-pink-300 ${recipe.isLocked
                        ? "opacity-75"
                        : "hover:-translate-y-1 scale-[1.03]"
                        }`}
                    >
                      <div className="relative">
                        <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                          />
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
                          <Badge className={getDifficultyColor(recipe.difficulty)}>
                            {recipe.difficulty}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex gap-1 items-center">
                            <Clock className="w-4 h-4" />
                            {recipe.time}
                          </div>
                          <div className="flex gap-1 items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {recipe.rating}
                          </div>
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
                {canLoadMore && (
                  <div className="mt-6 text-center">
                    <Button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      variant="outline"
                    >
                      {isLoadingMore ? "Loading..." : "Load More Recipes"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </React.Fragment>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Button
              variant="outline"
              className="mb-4"
              onClick={() => setSelectedRecipe(null)}
            >
              <X className="w-4 h-4 mr-2" />
              Back to recipes
            </Button>

            <h2 className="text-3xl font-bold mb-4">{selectedRecipe.title}</h2>

            <div className="mb-6">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="w-full max-h-96 object-cover rounded-lg"
              />
            </div>

            <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
            <ul className="list-disc list-inside mb-6">
              {selectedRecipe.ingredients?.map((ing: any) => (
                <li key={ing.id || ing.name}>{ing.original}</li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold mb-2">Instructions</h3>
            <ol className="list-decimal list-inside mb-6">
              {selectedRecipe.instructions?.map((step: any, idx: number) => (
                <li key={idx} className="mb-2">
                  {step.step}
                </li>
              ))}
            </ol>

            <Button
              className="mb-8"
              variant="default"
              onClick={handleFinishCooking}
              disabled={isLoadingDetails}
            >
              {isLoadingDetails ? "Loading..." : "Finish Cooking"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
