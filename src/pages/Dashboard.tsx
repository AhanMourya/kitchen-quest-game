import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { XPProgressBar } from "@/components/XPProgressBar";
import { Navigation } from "@/components/Navigation";
import {
  Star,
  Trophy,
  BookOpen,
  Camera,
  Users,
  Clock,
  ChefHat,
  Flame,
  Target,
  X,
} from "lucide-react";

// Your new Spoonacular API key
const API_KEY = "d111b78fa08b4cabae59c113e4e86432";

// LocalStorage keys
const STORAGE_KEY = "dailyMissionRecipe";
const STORAGE_TIME_KEY = "dailyMissionTimestamp";

// Helper to check if stored mission is still valid (<24 hours)
function isMissionFresh(timestamp: number | null) {
  if (!timestamp) return false;
  const now = Date.now();
  return now - timestamp < 24 * 60 * 60 * 1000; // 24 hours in ms
}

// MOCK: Replace with your real backend fetch to get user's XP, level, etc.
async function fetchUserXP(): Promise<{
  xp: number;
  level: number;
  xpToNextLevel: number;
}> {
  // For now, return static example data
  return {
    xp: 100,
    level: 1,
    xpToNextLevel: 400,
  };
}

// MOCK: Replace with your real backend call to update XP
async function updateUserXP(newXP: number): Promise<void> {
  console.log("Updating XP on backend to:", newXP);
}

export default function Dashboard() {
  // User XP state
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [xpToNextLevel, setXpToNextLevel] = useState(400);

  // Loading state for API fetches
  const [isLoading, setIsLoading] = useState(false);

  // Daily mission recipe data (the random recipe)
  const [dailyMission, setDailyMission] = useState<null | any>(null);

  // Whether quest started (show detailed recipe)
  const [questStarted, setQuestStarted] = useState(false);
  // Detailed recipe info once started
  const [detailedRecipe, setDetailedRecipe] = useState<null | any>(null);

  // Quick stats - keeping static for now, you can replace with real data
  const quickStats = [
    { label: "Recipes Completed", value: 1, icon: BookOpen },
    { label: "Classes Mastered", value: 1, icon: Trophy },
    { label: "Badges Earned", value: 1, icon: Star },
    { label: "Community Votes", value: 1, icon: Users },
  ];

  // Empty recent achievements for a new user
  const recentAchievements: {
    name: string;
    description: string;
    icon: React.FC<any>;
  }[] = [];

  // On mount: fetch user XP and daily mission (or load from localStorage)
  useEffect(() => {
    fetchUserXP().then(({ xp, level, xpToNextLevel }) => {
      setUserXP(xp);
      setUserLevel(level);
      setXpToNextLevel(xpToNextLevel);
    });

    loadOrFetchDailyMission();
  }, []);

  async function loadOrFetchDailyMission() {
    setIsLoading(true);
    try {
      // Try to load mission and timestamp from localStorage
      const storedMissionString = localStorage.getItem(STORAGE_KEY);
      const storedTimestampString = localStorage.getItem(STORAGE_TIME_KEY);
      const storedTimestamp = storedTimestampString
        ? parseInt(storedTimestampString)
        : null;

      if (storedMissionString && isMissionFresh(storedTimestamp)) {
        // Use stored mission
        setDailyMission(JSON.parse(storedMissionString));
      } else {
        // Fetch new mission
        const mission = await fetchRandomDailyMission();
        // Store mission and timestamp in localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mission));
        localStorage.setItem(STORAGE_TIME_KEY, Date.now().toString());
        setDailyMission(mission);
      }
    } catch (error) {
      console.error("Error loading daily mission:", error);
      setDailyMission(null);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch a random recipe for daily mission from Spoonacular API
  async function fetchRandomDailyMission() {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=1&tags=main course`
    );
    if (!res.ok) throw new Error("Failed to fetch recipe");
    const data = await res.json();
    const recipe = data.recipes[0];

    // Build mission object similar to before
    const mission = {
      id: recipe.id,
      title: recipe.title,
      description: recipe.summary
        ? recipe.summary.replace(/<[^>]+>/g, "").slice(0, 120) + "..."
        : "",
      xpReward: Math.floor((recipe.readyInMinutes || 30) * 3), // XP based on time
      timeEstimate: recipe.readyInMinutes
        ? `${recipe.readyInMinutes} min`
        : "Unknown",
      difficulty:
        recipe.readyInMinutes < 25
          ? "Easy"
          : recipe.readyInMinutes < 45
            ? "Medium"
            : recipe.readyInMinutes < 90
              ? "Hard"
              : "Advanced",
      cuisineType: recipe.cuisines?.[0] || "Global",
    };

    return mission;
  }

  // When user clicks "Start Quest" fetch detailed recipe info (ingredients + instructions)
  async function startQuest() {
    if (!dailyMission) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/${dailyMission.id}/information?apiKey=${API_KEY}&includeNutrition=false`
      );
      if (!res.ok) throw new Error("Failed to fetch recipe details");
      const data = await res.json();

      setDetailedRecipe({
        ...dailyMission,
        ingredients: data.extendedIngredients || [],
        instructions: data.analyzedInstructions?.[0]?.steps || [],
      });

      setQuestStarted(true);
    } catch (error) {
      console.error(error);
      alert("Failed to load recipe details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // User finishes cooking, awards XP, resets view
  async function finishCooking() {
    if (!dailyMission) return;
    const newXP = userXP + dailyMission.xpReward;
    setUserXP(newXP);

    // Persist XP update (mock)
    await updateUserXP(newXP);

    alert(
      `Congrats! You earned +${dailyMission.xpReward} XP! Your total XP is now ${newXP}.`
    );
    setQuestStarted(false);
    setDetailedRecipe(null);
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />

      <main className="flex-1 p-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, Chef Hunter!</h1>
              <p className="text-muted-foreground mt-1">
                Ready to cook up some XP today?
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Culinary Adventurer
              </Badge>
            </div>
          </div>
        </div>

        {/* XP Progress Section */}
        <Card className="mb-8 bg-gradient-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Level Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <XPProgressBar currentXP={userXP} level={userLevel} />
            <p className="mt-2 text-center text-muted-foreground">
              {userXP} XP <br />
              {xpToNextLevel} XP to level {userLevel + 1}
            </p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Mission - either summary card or detailed recipe if quest started */}
            {isLoading && <p>Loading daily mission...</p>}

            {!isLoading && dailyMission && !questStarted && (
              <Card className="shadow-card hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Daily Recipe Mission
                    </CardTitle>
                    <Badge variant="gaming" className="bg-gradient-accent">
                      +{dailyMission.xpReward} XP
                    </Badge>
                  </div>
                  <CardDescription>
                    Complete today's challenge to earn bonus XP
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {dailyMission.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {dailyMission.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="outline">{dailyMission.cuisineType}</Badge>
                    <Badge variant="outline">{dailyMission.difficulty}</Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {dailyMission.timeEstimate}
                    </div>
                  </div>

                  <Button variant="hero" className="w-full" onClick={startQuest}>
                    Start Quest
                    <ChefHat className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {!isLoading && questStarted && detailedRecipe && (
              <Card className="shadow-card">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>{detailedRecipe.title}</CardTitle>
                  <Button variant="outline" onClick={() => setQuestStarted(false)}>
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                  <ul className="list-disc pl-5 mb-6">
                    {detailedRecipe.ingredients.map((ing: any) => (
                      <li key={ing.id}>{ing.original}</li>
                    ))}
                  </ul>

                  <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                  <ol className="list-decimal pl-5 space-y-2 mb-6">
                    {detailedRecipe.instructions.length > 0 ? (
                      detailedRecipe.instructions.map((step: any, idx: number) => (
                        <li key={idx}>{step.step}</li>
                      ))
                    ) : (
                      <li>No instructions available.</li>
                    )}
                  </ol>

                  <Button variant="hero" className="w-full" onClick={finishCooking}>
                    Finish Cooking (+{dailyMission.xpReward} XP)
                  </Button>
                </CardContent>
              </Card>
            )}

            {!isLoading && !dailyMission && (
              <p className="text-center text-muted-foreground">
                Failed to load daily mission. Try refreshing.
              </p>
            )}

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={index}
                    className="text-center shadow-card hover:shadow-glow transition-all duration-300"
                  >
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Achievements (empty for new user) */}
            {recentAchievements.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-accent" />
                    Recent Achievements
                  </CardTitle>
                  <CardDescription>Your latest cooking victories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAchievements.map((achievement, index) => {
                      const Icon = achievement.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                        >
                          <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-accent-foreground" />
                          </div>
                          <div>
                            <div className="font-semibold">{achievement.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {achievement.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Recipes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Dish
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Join Challenge
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Leaderboard
                </Button>
              </CardContent>
            </Card>

            {/* Current Quests */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Active Quests</CardTitle>
                <CardDescription>Recipes in progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-border">
                    <div className="font-medium text-sm">Pasta Carbonara</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Italian • 30 min
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      Step 3 of 4
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border">
                    <div className="font-medium text-sm">Miso Soup</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Japanese • 15 min
                    </div>
                    <Progress value={25} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      Step 1 of 3
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
