
// Dashboard page: Shows user stats, XP/level, daily mission, and quick actions

// --- Quick Stats ---
// Defined after imports for proper scope
const quickStats = [
  { label: "Recipes Completed", value: 1, icon: BookOpen },
  { label: "Classes Mastered", value: 1, icon: Trophy },
  { label: "Badges Earned", value: 1, icon: Star },
  { label: "Community Votes", value: 1, icon: Users },
];
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { XPProgressBar } from "@/components/XPProgressBar";
import { Navigation } from "@/components/Navigation";
// import { auth, getUserProfile, updateUserXPLevel } from "../firebase"; // Firebase helpers (REMOVED)
import { Star, Trophy, BookOpen, Camera, Users, Clock, ChefHat, Flame, Target } from "lucide-react"; // Icons



// --- XP/Level Local Storage helpers ---
// All user XP/level data is stored in localStorage under the key 'userProfile'.
// The structure is: { xp: number, level: number, xpToNextLevel: number }
function getUserProfileLocal(): { xp: number; level: number; xpToNextLevel: number } {
  const data = localStorage.getItem('userProfile');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return {
        xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
        level: typeof parsed.level === 'number' ? parsed.level : 1,
        xpToNextLevel: typeof parsed.xpToNextLevel === 'number' ? parsed.xpToNextLevel : 400,
      };
    } catch {
      // fallback to default if corrupted
    }
  }
  return { xp: 0, level: 1, xpToNextLevel: 400 };
}

function setUserProfileLocal(profile: { xp: number; level: number; xpToNextLevel: number }) {
  localStorage.setItem('userProfile', JSON.stringify(profile));
}


// Example daily mission for the user
const dailyMission = {
  title: "Spicy Thai Green Curry",
  description: "Master the art of Thai cuisine with this medium-difficulty curry",
  xpReward: 150,
  timeEstimate: "45 min",
  difficulty: "Medium",
  cuisineType: "Thai"
};


export default function Dashboard() {
  // State for user stats: XP, level, and XP needed for next level
  // All values are loaded from and saved to localStorage
  const [userXP, setUserXP] = useState(() => getUserProfileLocal().xp);
  const [userLevel, setUserLevel] = useState(() => getUserProfileLocal().level);
  const [xpToNextLevel, setXpToNextLevel] = useState(() => getUserProfileLocal().xpToNextLevel);

  // On mount, load user XP/level from localStorage
  useEffect(() => {
    const { xp, level, xpToNextLevel } = getUserProfileLocal();
    setUserXP(xp);
    setUserLevel(level);
    setXpToNextLevel(xpToNextLevel);
  }, []);


  // Level roadmap data for the Level Roadmap card (used in both main and sidebar)
  const levels = [
    { level: 1, title: "Prep Cook	", xpRequired: 0 },
    { level: 2, title: "Knife Rookie", xpRequired: 400 },
    { level: 3, title: "Spice Trainee", xpRequired: 1200 },
    { level: 4, title: "Flavor Architect", xpRequired: 2800 },
    { level: 5, title: "Culinary Boss", xpRequired: 2400 },
  ].map(lvl => ({
    ...lvl,
    current: lvl.level === userLevel
  }));

  // Find the current level object
  const currentLevel = levels.find(lvl => lvl.level === userLevel);


  // --- Achievements Data (edit this array to add new achievements) ---
  // You can add new achievements here. To update their status, use logic below or from other data sources.
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
    // Add more achievements here as needed
  ];

  // --- Logic for showing incomplete achievements with Load More ---
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  // Filter for incomplete (not unlocked) achievements
  const incompleteAchievements = allAchievements.filter(a => !a.unlocked);
  const achievementsToShow = showAllAchievements ? incompleteAchievements : incompleteAchievements.slice(0, 5);

  // Handler for completing the daily mission — adds XP, handles level up, and updates localStorage
  const handleCompleteMission = () => {
    let newXP = userXP + dailyMission.xpReward;
    let newLevel = userLevel;
    let newXpToNextLevel = 400 * (2 ** newLevel - 1) - newXP;

    if (newXpToNextLevel <= 0) {
      newLevel += 1;
      newXpToNextLevel = 400 * (2 ** newLevel - 1); // Increase next level XP requirement
    }
    setUserXP(newXP);
    setUserLevel(newLevel);
    setXpToNextLevel(newXpToNextLevel);
    // Save XP, level, and next level XP to localStorage for persistence
    setUserProfileLocal({ xp: newXP, level: newLevel, xpToNextLevel: newXpToNextLevel });
    alert(`Congrats! You earned +${dailyMission.xpReward} XP! Your total XP is now ${newXP}.`);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />

      <main className="flex-1 p-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, Chef Hunter!</h1>
              <p className="text-muted-foreground mt-1">Ready to cook up some XP today?</p>
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
               
               Current XP: {userXP}
            </p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Mission */}
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
                <CardDescription>Complete today's challenge to earn bonus XP</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{dailyMission.title}</h3>
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

                <Button variant="hero" className="w-full" onClick={handleCompleteMission}>
                  Start Quest
                  <ChefHat className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>




            {/* Achievements (incomplete, with Load More) */}
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
                        className={`p-4 rounded-lg border transition-all ${
                          achievement.unlocked
                            ? "bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30"
                            : "bg-muted/50 border-border/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              achievement.unlocked
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
                            {/* Progress bar for semi-completed achievements */}
                            {!achievement.unlocked && achievement.progress !== undefined && (
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
                  {/* Load More button if there are more than 5 incomplete achievements */}
                  {incompleteAchievements.length > 5 && !showAllAchievements && (
                    <div className="flex justify-center pt-2">
                      <Button variant="outline" size="sm" onClick={() => setShowAllAchievements(true)}>
                        Load More
                      </Button>
                    </div>
                  )}
                </div>
                {/* Placeholder: Add logic here to update achievement status from other data sources */}
                {/* Example: fetch progress from recipes, XP, etc. and update allAchievements array */}
              </CardContent>
            </Card>

            {/* Quick Stats (moved below Achievements) */}
            <div className="grid md:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="text-center shadow-card hover:shadow-glow transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>


          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Roadmap in Sidebar */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Level Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {levels.map((level, index) => (
                    <div
                      key={level.level}
                      className={`p-4 rounded-lg border transition-all ${
                        level.current
                          ? "bg-primary/10 border-primary/30"
                          : level.level < (currentLevel?.level || 1)
                          ? "bg-secondary/10 border-secondary/30"
                          : "bg-muted/50 border-border/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            level.current
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
                            {level.level === 1 ? "Starting level" : `${level.xpRequired} XP required`}
                          </div>
                        </div>
                        {level.current && (
                          <Badge variant="default">Current</Badge>
                        )}
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
                    <div className="text-xs text-muted-foreground mb-2">Italian • 30 min</div>
                    <Progress value={75} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">Step 3 of 4</div>
                  </div>

                  <div className="p-3 rounded-lg border border-border">
                    <div className="font-medium text-sm">Miso Soup</div>
                    <div className="text-xs text-muted-foreground mb-2">Japanese • 15 min</div>
                    <Progress value={25} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">Step 1 of 3</div>
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
