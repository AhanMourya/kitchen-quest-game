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
import { incrementRecipeCount, getRecipeCount } from "@/lib/utils";

// Your Spoonacular API key
const API_KEY = "de958240a28b451d9e1cce53745bcbff";

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

// --- Daily Mission Completion Tracking ---
function getTodayKey() {
  const today = new Date();
  return `dailyMissionCompleted_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function isDailyMissionCompletedToday() {
  return localStorage.getItem(getTodayKey()) === 'true';
}

function setDailyMissionCompletedToday() {
  localStorage.setItem(getTodayKey(), 'true');
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
  // Daily mission completion state
  const [missionCompleted, setMissionCompleted] = useState(isDailyMissionCompletedToday());
  const [achievements, setAchievements] = useState([
    // --- UNLOCKED (COMPLETED) ACHIEVEMENTS FOR SCROLL DEMO ---
    {
      id: 1,
      title: "First Flame",
      description: "Complete your first recipe",
      icon: Flame,
      unlocked: false,
      progress: 0,
      xp: 20,
    },
    {
      id: 2,
      title: "XP Junkie",
      description: "Reach 1000 XP",
      icon: ChefHat,
      unlocked: false,
      progress: 0,
      xp: 50,
    },
    {
      id: 3,
      title: "Culinary Traveler ",
      description: "Cook recipes from 5 different cuisines",
      icon: Trophy,
      unlocked: false,
      progress: 0,
      xp: 50,
    },
    {
      id: 4,
      title: "Dicing Daily",
      description: "Cook 5 Daily Recipe Missions",
      icon: Star,
      unlocked: false,
      progress: 0,
      xp: 100,
    },
    {
      id: 5,
      title: "Multi-classed Chef",
      description: "	Master 3 different cuisine classes",
      icon: ChefHat,
      unlocked: false,
      progress: 0,
      xp: 50,
    },
    // ...existing code...
    {
      id: 7,
      title: "Level Up, Buttercup",
      description: "Reach Level 5",
      icon: Users,
      unlocked: false,
      progress: 0,
      xp: 500,
    },
    {
      id: 8,
      title: "Indian Mastery: Tandoori Titan",
      description: "Complete Meal Tree + Boss Battle",
      icon: Trophy,
      unlocked: false,
      progress: 0,
      xp: 300,
    },

    {
      id: 9,
      title: "Italian Mastery: Pasta Prodigy",
      description: "Complete Meal Tree + Boss Battle",
      icon: Star,
      unlocked: false,
      xp: 300,
      progress: 0,
    },
    {
      id: 10,
      title: "Chinese Mastery: Wok Warrior",
      description: "Complete Meal Tree + Boss Battle",
      icon: Star,
      unlocked: false,
      xp: 300,
      progress: 0,
    },
    {
      id: 11,
      title: "Japanese Mastery: Sushi Sage",
      description: "Complete Meal Tree + Boss Battle",
      icon: Star,
      unlocked: false,
      xp: 300,
      progress: 0,
    },
    {
      id: 12,
      title: "Mexican Mastery: Taco Tactician",
      description: "Complete Meal Tree + Boss Battle",
      icon: Star,
      unlocked: false,
      xp: 300,
      progress: 0,
    },
    {
      id: 13,
      title: "French Mastery: Baguette Boss",
      description: "Complete Meal Tree + Boss Battle",
      icon: Star,
      unlocked: false,
      xp: 300,
      progress: 0,
    },
    {
      id: 14,
      title: "American Mastery: Grill Guardian",
      description: "Complete Meal Tree + Boss Battle",
      icon: Star,
      unlocked: false,
      xp: 300,
      progress: 0,
    },
    {
      id: 15,
      title: "Mediterranean Mastery: Olive Oracle",
      description: "Complete Meal Tree + Boss Battle",
      icon: Star,
      unlocked: false,
      xp: 300,
      progress: 0,
    },
    {
      id: 16,
      title: "Korean Mastery: Kimchi Commander",
      description: "Complete Meal Tree + Boss Battle",
      icon: Star,
      unlocked: false,
      xp: 300,
      progress: 0,
    },
    {
      id: 17,
      title: "Thai Mastery: Spice Summoner",
      description: "Complete Meal Tree + Boss Battle",
      icon: Star,
      unlocked: false,
      xp: 300,
      progress: 0,
    },
    {
      id: 18,
      title: "Greek Mastery: Feta Fighter",
      description: "Complete Meal Tree + Boss Battle",
      icon: Star,
      unlocked: false,
      xp: 300,
      progress: 0,
    },
  ]);
  // Listen for storage changes (in case another tab updates)
  useEffect(() => {
    const handler = () => setMissionCompleted(isDailyMissionCompletedToday());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
  // Recipe count state (from localStorage key set by Recipes page)
  const getRecipesCompletedCount = () => parseInt(localStorage.getItem('recipesCompletedCount') || '0', 10);
  const [recipeCount, setRecipeCount] = useState(getRecipesCompletedCount());

  // Unique cuisines mastered = bosses defeated
  const getDefeatedBossesCount = () => {
    try {
      return JSON.parse(localStorage.getItem('defeatedBosses') || '[]').length;
    } catch {
      return 0;
    }
  };
  const [cuisinesMasteredCount, setCuisinesMasteredCount] = useState(getDefeatedBossesCount());

  // Track daily missions completed in localStorage
  const getDailyMissionsCompleted = () => parseInt(localStorage.getItem('dailyMissionsCompleted') || '0', 10);
  const [dailyMissionsCompleted, setDailyMissionsCompleted] = useState(getDailyMissionsCompleted());

  // Listen for recipesCompletedCountUpdated and defeatedBossesUpdated events to update state
  useEffect(() => {
    const recipeHandler = () => setRecipeCount(getRecipesCompletedCount());
    const bossesHandler = () => setCuisinesMasteredCount(getDefeatedBossesCount());
    window.addEventListener("recipesCompletedCountUpdated", recipeHandler);
    window.addEventListener("defeatedBossesUpdated", bossesHandler);
    return () => {
      window.removeEventListener("recipesCompletedCountUpdated", recipeHandler);
      window.removeEventListener("defeatedBossesUpdated", bossesHandler);
    };
  }, []);
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
  // --- Achievements List ---
  // Add new achievements here! Each object is a new achievement.
  // id must be unique. You can set unlocked, xp, progress, and icon.
  // Example/test achievements added below:
  // --- Achievements List ---
  // Add new achievements here! Each object is a new achievement.
  // id must be unique. You can set unlocked, xp, progress, and icon.
  // Example/test achievements added below:



  // --- LOGIC: Unlock achievements when user finishes a recipe or meets criteria ---
  // 1. Unlock 'First Flame' when any recipe is finished.
  // 2. Unlock 'XP Junkie' when userXP >= 1000.
  // 3. Unlock 'Dicing Daily' when 5 daily missions are completed (tracked in localStorage).
  // 4. Unlock 'Culinary Traveler' when 5 unique cuisines cooked.

  // React to recipeCount changes for achievements
  useEffect(() => {
    if (recipeCount >= 1) {
      unlockAchievement("First Flame");
    }
  }, [recipeCount]);

  // Always unlock XP Junkie if userXP >= 1000
  useEffect(() => {
    if (userXP >= 1000) {
      unlockAchievement("XP Junkie");
    }
  }, [userXP]);

  // Unlock 'Culinary Traveler' when 5 cuisines mastered (bosses defeated)
  useEffect(() => {
    if (cuisinesMasteredCount >= 5) {
      unlockAchievement("Culinary Traveler ");
    }
  }, [cuisinesMasteredCount]);

  // Always unlock 'Dicing Daily' if 5 or more daily missions completed
  useEffect(() => {
    if (dailyMissionsCompleted >= 5) {
      unlockAchievement("Dicing Daily");
    }
  }, [dailyMissionsCompleted]);

  // Always unlock 'Level Up, Buttercup' if userLevel >= 5
  useEffect(() => {
    if (userLevel >= 5) {
      unlockAchievement("Level Up, Buttercup");
    }
  }, [userLevel]);

  // Helper: Unlock achievement by title
  function unlockAchievement(title: string) {
    setAchievements(prev =>
      prev.map(a =>
        a.title === title && !a.unlocked ? { ...a, unlocked: true, progress: 100 } : a
      )
    );
    // Persist completed achievement
    const completed = getCompletedAchievements();
    if (!completed.includes(title)) {
      completed.push(title);
      setCompletedAchievements(completed);
    }
  }
  // Track daily missions completed in localStorage
  function incrementDailyMissionsCompleted() {
    const key = 'dailyMissionsCompleted';
    let count = parseInt(localStorage.getItem(key) || '0', 10);
    count += 1;
    localStorage.setItem(key, count.toString());
    setDailyMissionsCompleted(count);
    window.dispatchEvent(new Event('dailyMissionsCompletedUpdated'));
    return count;
  }

  // Achievements UI show state
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  // Split achievements into incomplete and completed
  const incompleteAchievements = achievements.filter((a) => !a.unlocked);
  const completedAchievements = achievements.filter((a) => a.unlocked);
  const achievementsToShow = showAllAchievements
    ? incompleteAchievements
    : incompleteAchievements.slice(0, 5);

  // Quick stats (dynamic)
  const quickStats = [
    { label: "Recipes Completed", value: recipeCount, icon: BookOpen },
    { label: "Cuisines Mastered", value: cuisinesMasteredCount, icon: Trophy },
    { label: "Daily Missions Completed", value: dailyMissionsCompleted, icon: Target },
    { label: "Achievements Completed", value: completedAchievements.length, icon: Star },
  ];

  // Level roadmap data
  const levels = [
    { level: 1, title: "Prep Cook", xpRequired: 0 },
    { level: 2, title: "Knife Rookie", xpRequired: 400 },
    { level: 3, title: "Spice Trainee", xpRequired: 1200 },
    { level: 4, title: "Flavor Architect", xpRequired: 2800 },
    { level: 5, title: "Culinary Boss", xpRequired: 6000 },
  ].map((lvl) => ({
    ...lvl,
    current: lvl.level === userLevel,
  }));
  const currentLevel = levels.find((lvl) => lvl.level === userLevel);

  // On mount: load daily mission from localStorage or fetch new one
  useEffect(() => {
    loadOrFetchDailyMission();
  }, []);

  // On mount: ensure First Flame is unlocked if recipeCount >= 1
  useEffect(() => {
    if (getRecipesCompletedCount() >= 1) {
      unlockAchievement("First Flame");
    }
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
    let newXpToNextLevel = xpToNextLevel;
    // Example level-up logic: double XP needed per level (can customize)
    if (newXpToNextLevel <= 0) {
      newLevel += 1;
      newXpToNextLevel = xpNeededForLevel(newLevel + 1) - newXP;
    }
    setUserXP(newXP);
    setUserLevel(newLevel);
    setXpToNextLevel(newXpToNextLevel);
    setUserProfileLocal({ xp: newXP, level: newLevel, xpToNextLevel: newXpToNextLevel });

    incrementRecipeCount(); // ✅ Increment recipe count on daily mission completion

    // --- NEW: Also increment unique cuisines if daily mission cuisine is new ---
    const uniqueCuisinesKey = 'uniqueCuisinesCooked';
    let uniqueCuisines = [];
    try {
      uniqueCuisines = JSON.parse(localStorage.getItem(uniqueCuisinesKey) || '[]');
    } catch { uniqueCuisines = []; }
    const recipeCuisine = dailyMission.cuisineType;
    if (recipeCuisine && !uniqueCuisines.includes(recipeCuisine)) {
      uniqueCuisines.push(recipeCuisine);
      localStorage.setItem(uniqueCuisinesKey, JSON.stringify(uniqueCuisines));
      // Store the count for Dashboard.tsx
      localStorage.setItem('uniqueCuisinesCookedCount', uniqueCuisines.length.toString());
      window.dispatchEvent(new Event('uniqueCuisinesCookedUpdated'));
    }

    // --- ACHIEVEMENT LOGIC ---
    setTimeout(() => {
      if (getRecipeCount() >= 1) {
        unlockAchievement("First Flame");
      }
      // 2. Unlock 'XP Junkie' if XP >= 1000
      if (newXP >= 1000) {
        unlockAchievement('XP Junkie');
      }
      // 3. Unlock 'Dicing Daily' if 5 daily missions completed
      const dailyMissionsCompleted = incrementDailyMissionsCompleted();
      if (dailyMissionsCompleted >= 5) {
        unlockAchievement('Dicing Daily');
      }
    }, 0);
    // --- END ACHIEVEMENT LOGIC ---

    // Save the cooked daily mission recipe to localStorage for gallery use
    const cookedKey = 'cookedDailyMissionRecipes';
    let cookedRecipes = [];
    try {
      cookedRecipes = JSON.parse(localStorage.getItem(cookedKey) || '[]');
    } catch { cookedRecipes = []; }
    // Store minimal info: id, title, date cooked, and optionally image if available
    cookedRecipes.push({
      id: dailyMission.id,
      title: dailyMission.title,
      date: new Date().toISOString(),
      image: dailyMission.image || null
    });
    localStorage.setItem(cookedKey, JSON.stringify(cookedRecipes));

    alert(`Congrats! You earned +${dailyMission.xpReward} XP! Your total XP is now ${newXP}.`);

    setDailyMissionCompletedToday();
    setMissionCompleted(true);
    setQuestStarted(false);
    setDetailedRecipe(null);
  }

  // Helper for XP needed for level (simple exponential curve)
  function xpNeededForLevel(level: number) {
    if (level <= 1) return 0;
    return 100 * (2 ** (level + 1)); // example: level 2 needs 400, level 3 800, etc.
  }

  // Helper: get/set completed achievements in localStorage
  function getCompletedAchievements() {
    try {
      return JSON.parse(localStorage.getItem('completedAchievements') || '[]');
    } catch {
      return [];
    }
  }
  function setCompletedAchievements(titles) {
    localStorage.setItem('completedAchievements', JSON.stringify(titles));
  }

  // On mount: load completed achievements from localStorage and mark as completed
  useEffect(() => {
    const completed = getCompletedAchievements();
    if (completed.length > 0) {
      setAchievements(prev => prev.map(a => completed.includes(a.title) ? { ...a, unlocked: true, progress: 100 } : a));
    }
  }, []);

  // Helper: get defeated bosses from localStorage
  function getDefeatedBosses() {
    try {
      return JSON.parse(localStorage.getItem('defeatedBosses') || '[]');
    } catch {
      return [];
    }
  }

  // Map boss names to achievement titles
  const bossToAchievement = {
    "The Spice Maharaja": "Indian Mastery: Tandoori Titan",
    "Nonna Supreme": "Italian Mastery: Pasta Prodigy",
    "The Dim Sum Dragon": "Chinese Mastery: Wok Warrior",
    "The Shogun Chef": "Japanese Mastery: Sushi Sage",
    "El Gran Sabio": "Mexican Mastery: Taco Tactician",
    "Le Grand Pâtissier": "French Mastery: Baguette Boss",
    "The Yankee Legend": "American Mastery: Grill Guardian",
    "The Aegean Master": "Mediterranean Mastery: Olive Oracle",
    "The Seoul Sizzler": "Korean Mastery: Kimchi Commander",
    "The Sweet Sage": "Thai Mastery: Spice Summoner",
    "The Olympian Chef": "Greek Mastery: Feta Fighter",
  };

  // Award cuisine mastery achievements when bosses are defeated
  useEffect(() => {
    function checkBossAchievements() {
      const defeated = getDefeatedBosses();
      // Grant cuisine mastery achievements for each boss
      Object.entries(bossToAchievement).forEach(([boss, achievement]) => {
        if (defeated.includes(boss)) {
          unlockAchievement(achievement);
        }
      });
      // Grant Multi-classed Chef if 3 or more unique bosses defeated
      if (defeated.length >= 3) {
        unlockAchievement("Multi-classed Chef");
      }
    }
    checkBossAchievements();
    window.addEventListener('defeatedBossesUpdated', checkBossAchievements);
    return () => window.removeEventListener('defeatedBossesUpdated', checkBossAchievements);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-yellow-50">
      <Navigation />

      <main className="flex-1 p-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-yellow-900 drop-shadow-lg animate-in fade-in zoom-in-90">Welcome back, Chef Hunter!</h1>
              <p className="text-lg text-yellow-800 font-semibold mt-1 animate-in fade-in slide-in-from-left-8">Ready to cook up some XP today?</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-yellow-100 text-yellow-900 border-yellow-300 shadow-md">
                Culinary Adventurer
              </Badge>
            </div>
          </div>
        </div>

        {/* XP Progress Section */}
        <Card className="mb-8 bg-gradient-to-r from-pink-100 via-yellow-50 to-orange-100 border-2 border-pink-200 shadow-xl animate-in fade-in zoom-in-90">
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

            </p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Mission */}
            {isLoading && <p>Loading daily mission...</p>}

            {!isLoading && dailyMission && !questStarted && (
              <div className="relative">
                <Card className={`shadow-card hover:shadow-glow transition-all duration-300 bg-gradient-to-br from-pink-100 via-yellow-50 to-orange-100 border-2 border-pink-200 ${missionCompleted ? 'pointer-events-none opacity-80' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Daily Recipe Mission
                      </CardTitle>
                      <Badge variant="gaming" className="bg-gradient-to-r from-pink-400 via-yellow-300 to-orange-400 text-white shadow-lg border-none">
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

                    <Button
                      variant="hero"
                      className="w-full"
                      onClick={startQuest}
                      disabled={missionCompleted}
                    >
                      {missionCompleted ? 'Completed' : 'Start Quest'}
                      <ChefHat className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
                {missionCompleted && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-lg z-10">
                    <div className="flex flex-col items-center">
                      <svg className="w-20 h-20 text-green-400 mb-2 animate-bounce" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                        <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-2xl font-bold text-green-300 drop-shadow-lg">Mission Complete!</span>
                      <span className="text-sm text-white/80 mt-1">Come back tomorrow for a new quest.</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quest Details when started */}
            {questStarted && detailedRecipe && (
              <Card className="shadow-card hover:shadow-glow transition-all duration-300 bg-gradient-to-br from-orange-100 via-pink-100 to-yellow-50 border-2 border-orange-200">
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

            {/* Achievements (scrollable, auto-generated subsections) */}
            <Card className="shadow-card bg-gradient-to-r from-pink-100 via-yellow-50 to-orange-100 border-2 border-pink-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {achievementsToShow.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <section
                        key={achievement.id}
                        className={`relative p-4 rounded-xl border-4 transition-all mb-4 shadow-md ${achievement.unlocked
                          ? "bg-gradient-to-r from-yellow-50 via-pink-50 to-orange-50 border-pink-200 animate-in fade-in zoom-in-90"
                          : "bg-muted/60 border-border/60"
                          }`}
                      >
                        {/* Decorative sparkle for unlocked */}
                        {achievement.unlocked && (
                          <span className="absolute -top-2 -right-2 text-yellow-400 text-2xl animate-bounce select-none">✨</span>
                        )}
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 ${achievement.unlocked
                              ? "bg-gradient-to-br from-pink-400 via-yellow-400 to-orange-400 text-white border-pink-400 shadow-lg"
                              : "bg-muted text-muted-foreground border-border"
                              }`}
                          >
                            <Icon className="w-7 h-7" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-bold text-lg ${achievement.unlocked ? "text-yellow-800 drop-shadow" : ""}`}>{achievement.title}</h4>
                              {achievement.unlocked && (
                                <Badge variant="secondary" className="text-xs animate-pulse border border-pink-400 bg-pink-100 text-pink-900">
                                  +{achievement.xp} XP
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground italic">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      </section>
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

            {/* Quick Stats (centered) */}
            <div className="flex justify-center">
              <div className="grid md:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={index}
                      className="text-center shadow-card hover:shadow-glow transition-all duration-300 bg-gradient-to-br from-pink-100 via-yellow-50 to-orange-100 border-2 border-pink-200"
                    >
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-gradient-to-tr from-pink-400 via-yellow-400 to-orange-400 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-extrabold text-pink-700 mb-1 drop-shadow">
                          {stat.value}
                        </div>
                        <div className="text-sm text-pink-900 font-semibold">{stat.label}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Roadmap */}
            <Card className="shadow-card bg-gradient-to-r from-pink-100 via-yellow-50 to-orange-100 border-2 border-pink-200">
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

            {/* Completed Quests (shows unlocked achievements with special design) */}
            <Card className="shadow-card bg-gradient-to-r from-yellow-50 via-primary/10 to-secondary/10 border-2 border-yellow-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Completed Quests
                </CardTitle>
                <CardDescription>All your completed achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {completedAchievements.length === 0 && (
                    <div className="text-muted-foreground text-center py-4">No completed achievements yet.</div>
                  )}
                  {completedAchievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={achievement.id}
                        className="p-4 rounded-lg border-2 bg-gradient-to-r from-pink-100 via-yellow-50 to-orange-100 border-pink-500 transition-all flex items-start gap-3"
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-pink-400 via-yellow-400 to-orange-400 text-white">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              +{achievement.xp} XP
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}