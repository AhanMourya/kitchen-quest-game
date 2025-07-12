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

// Your Spoonacular API key
const API_KEY = "156c29b45ee54086a2fd6139787cdb88";

// LocalStorage keys
const STORAGE_MISSION_KEY = "dailyMissionRecipe";
const STORAGE_TIMESTAMP_KEY = "dailyMissionTimestamp";
const STORAGE_PROFILE_KEY = "userProfile";

// Helper to check if stored mission is still valid (<1 hour freshness)
function isMissionFresh(timestamp: number | null) {
  if (!timestamp) return false;
  const now = Date.now();
  return now - timestamp < 60 * 60 * 1000; // 1 hour in ms
}

// Load user XP/level/profile from localStorage
function getUserProfileLocal() {
  const data = localStorage.getItem(STORAGE_PROFILE_KEY);
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
      // fallback defaults
    }
  }
  return { xp: 0, level: 1, xpToNextLevel: 400 };
}

// Save user XP/level/profile to localStorage
function setUserProfileLocal(profile: {
  xp: number;
  level: number;
  xpToNextLevel: number;
}) {
  localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
}

export default function Dashboard() {
  // User XP and level state, initialized from localStorage
  const [userXP, setUserXP] = useState(() => getUserProfileLocal().xp);
  const [userLevel, setUserLevel] = useState(() => getUserProfileLocal().level);
  const [xpToNextLevel, setXpToNextLevel] = useState(
    () => getUserProfileLocal().xpToNextLevel
  );

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Daily mission and detailed recipe state
  const [dailyMission, setDailyMission] = useState<null | any>(null);
  const [questStarted, setQuestStarted] = useState(false);
  const [detailedRecipe, setDetailedRecipe] = useState<null | any>(null);

  // Achievements data
  const allAchievements = [
    {
      id: 1,
      title: "First Flame",
      description: "Complete your first recipe",
      icon: Flame,
      unlocked: true,
      xp: 100,
    },
    {
      id: 2,
      title: "Kitchen Novice",
      description: "Reach Level 1",
      icon: ChefHat,
      unlocked: true,
      xp: 0,
    },
    {
      id: 3,
      title: "Breakfast Champion",
      description: "Master 3 breakfast recipes",
      icon: Star,
      unlocked: false,
      xp: 300,
      progress: 33,
    },
    {
      id: 4,
      title: "Spice Master",
      description: "Cook 5 spicy dishes",
      icon: Target,
      unlocked: false,
      xp: 500,
      progress: 0,
    },
    {
      id: 5,
      title: "Kitchen Crown",
      description: "Reach Level 5",
      icon: Trophy,
      unlocked: false,
      xp: 1000,
      progress: 20,
    },
  ];

  // Achievements UI show state
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const incompleteAchievements = allAchievements.filter((a) => !a.unlocked);
  const achievementsToShow = showAllAchievements
    ? incompleteAchievements
    : incompleteAchievements.slice(0, 5);

  // Quick stats (static, can be dynamic)
  const quickStats = [
    { label: "Recipes Completed", value: 1, icon: BookOpen },
    { label: "Classes Mastered", value: 1, icon: Trophy },
    { label: "Badges Earned", value: 1, icon: Star },
    { label: "Community Votes", value: 1, icon: Users },
  ];

  // Level roadmap data
  const levels = [
    { level: 1, title: "Prep Cook", xpRequired: 0 },
    { level: 2, title: "Knife Rookie", xpRequired: 400 },
    { level: 3, title: "Spice Trainee", xpRequired: 1200 },
    { level: 4, title: "Flavor Architect", xpRequired: 2800 },
    { level: 5, title: "Culinary Boss", xpRequired: 2400 },
  ].map((lvl) => ({
    ...lvl,
    current: lvl.level === userLevel,
  }));
  const currentLevel = levels.find((lvl) => lvl.level === userLevel);

  // On mount: load daily mission from localStorage or fetch new one
  useEffect(() => {
    loadOrFetchDailyMission();
  }, []);

  // Fetch or load daily mission with 1-hour refresh logic
  async function loadOrFetchDailyMission() {
    setIsLoading(true);
    try {
      const storedMissionString = localStorage.getItem(STORAGE_MISSION_KEY);
      const storedTimestampString = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
      const storedTimestamp = storedTimestampString
        ? parseInt(storedTimestampString)
        : null;

      if (storedMissionString && isMissionFresh(storedTimestamp)) {
        setDailyMission(JSON.parse(storedMissionString));
      } else {
        const mission = await fetchRandomDailyMission();
        localStorage.setItem(STORAGE_MISSION_KEY, JSON.stringify(mission));
        localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
        setDailyMission(mission);
      }
    } catch (error) {
      console.error("Failed to load daily mission:", error);
      setDailyMission(null);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch random recipe for daily mission from Spoonacular
  async function fetchRandomDailyMission() {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=1&tags=main course`
    );
    if (!res.ok) throw new Error("Failed to fetch recipe");
    const data = await res.json();
    const recipe = data.recipes[0];

    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.summary
        ? recipe.summary.replace(/<[^>]+>/g, "").slice(0, 120) + "..."
        : "",
      xpReward: Math.floor((recipe.readyInMinutes || 30) * 3),
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
  }

  // When user starts quest: fetch detailed recipe info
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

  // Finish cooking: add XP, check level up, update localStorage
  function finishCooking() {
    if (!dailyMission) return;

    let newXP = userXP + dailyMission.xpReward;
    let newLevel = userLevel;
    // Example level-up logic: double XP needed per level (can customize)
    while (newXP >= xpNeededForLevel(newLevel + 1)) {
      newLevel += 1;
    }
    const newXpToNextLevel = xpNeededForLevel(newLevel + 1) - newXP;

    setUserXP(newXP);
    setUserLevel(newLevel);
    setXpToNextLevel(newXpToNextLevel);
    setUserProfileLocal({ xp: newXP, level: newLevel, xpToNextLevel: newXpToNextLevel });

    alert(`Congrats! You earned +${dailyMission.xpReward} XP! Your total XP is now ${newXP}.`);

    setQuestStarted(false);
    setDetailedRecipe(null);
  }

  // Helper for XP needed for level (simple exponential curve)
  function xpNeededForLevel(level: number) {
    if (level <= 1) return 0;
    return 400 * (2 ** (level - 2)); // example: level 2 needs 400, level 3 800, etc.
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
              Current XP: {userXP} <br />
              XP to next level: {xpToNextLevel > 0 ? xpToNextLevel : 0}
            </p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Mission */}
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
                    <p className="text-muted-foreground">{dailyMission.description}</p>
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

            {/* Quest Details when started */}
            {questStarted && detailedRecipe && (
              <Card className="shadow-card hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{detailedRecipe.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setQuestStarted(false);
                        setDetailedRecipe(null);
                      }}
                      aria-label="Close"
                    >
                      <X />
                    </Button>
                  </div>
                  <CardDescription>
                    {detailedRecipe.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-1">Ingredients:</h4>
                  <ul className="list-disc list-inside mb-4 max-h-48 overflow-auto">
                    {detailedRecipe.ingredients.map((ing: any) => (
                      <li key={ing.id}>
                        {ing.original}
                      </li>
                    ))}
                  </ul>

                  <h4 className="font-semibold mb-1">Instructions:</h4>
                  <ol className="list-decimal list-inside max-h-64 overflow-auto space-y-2">
                    {detailedRecipe.instructions.map((step: any) => (
                      <li key={step.number}>{step.step}</li>
                    ))}
                  </ol>

                  <Button
                    variant="hero"
                    className="mt-6 w-full"
                    onClick={finishCooking}
                  >
                    Finish Cooking & Earn XP
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Achievements */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievementsToShow.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border transition-all ${achievement.unlocked
                            ? "bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30"
                            : "bg-muted/50 border-border/50"
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${achievement.unlocked
                                ? "bg-gradient-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                              }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{achievement.title}</h4>
                              {achievement.unlocked && (
                                <Badge variant="secondary" className="text-xs">
                                  +{achievement.xp} XP
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                            {!achievement.unlocked &&
                              achievement.progress !== undefined && (
                                <div className="space-y-1">
                                  <Progress value={achievement.progress} className="h-2" />
                                  <div className="text-xs text-muted-foreground">
                                    {achievement.progress}% complete
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {incompleteAchievements.length > 5 && !showAllAchievements && (
                    <div className="flex justify-center pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAllAchievements(true)}
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Roadmap */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Level Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {levels.map((level) => (
                    <div
                      key={level.level}
                      className={`p-4 rounded-lg border transition-all ${level.current
                          ? "bg-primary/10 border-primary/30"
                          : level.level < (currentLevel?.level || 1)
                            ? "bg-secondary/10 border-secondary/30"
                            : "bg-muted/50 border-border/50"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${level.current
                              ? "bg-gradient-primary text-primary-foreground"
                              : level.level < (currentLevel?.level || 1)
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {level.level}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{level.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {level.level === 1
                              ? "Starting level"
                              : `${level.xpRequired} XP required`}
                          </div>
                        </div>
                        {level.current && <Badge variant="default">Current</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
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