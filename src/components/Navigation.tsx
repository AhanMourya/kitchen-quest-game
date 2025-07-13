
// Navigation sidebar for the app. Shows logo, XP/level progress, and navigation links.
import { useState, useEffect } from "react";
// import { auth, getUserProfile } from "@/firebase"; fire base old, useless rn
import { Link, useLocation } from "react-router-dom"; 
import { Home, BookOpen, TrendingUp, Users, Camera, User, Settings, ChefHat } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


// nav items
const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Recipes", href: "/recipes", icon: BookOpen },
  { name: "Gallery", href: "/gallery", icon: Camera },
  { name: "Cuisine Mastery", href: "/level", icon: TrendingUp },
];

// Nav main side bar thing
export function Navigation() {
  const location = useLocation(); // Current route location

  // --- XP helpers ---
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

  // State for user XP, level, and XP needed for next level
  const [userXP, setUserXP] = useState(() => getUserProfileLocal().xp);
  const [userLevel, setUserLevel] = useState(() => getUserProfileLocal().level);
  const [xpToNextLevel, setXpToNextLevel] = useState(() => getUserProfileLocal().xpToNextLevel);

  useEffect(() => {
    function updateFromLocalStorage() {
      const { xp, level, xpToNextLevel } = getUserProfileLocal();
      setUserXP(xp);
      setUserLevel(level);
      setXpToNextLevel(xpToNextLevel);
    }
    updateFromLocalStorage();
    window.addEventListener('storage', updateFromLocalStorage);
    window.addEventListener('userProfileUpdated', updateFromLocalStorage);
    return () => {
      window.removeEventListener('storage', updateFromLocalStorage);
      window.removeEventListener('userProfileUpdated', updateFromLocalStorage);
    };
  }, []);

  const currentXPForLevel = 0;
  const nextLevelXP = xpToNextLevel;
  const xpProgress = ((userXP) / (nextLevelXP + userXP)) * 100;

  //New Random Badge
 
  function getCompletedAchievements() {
    try {
      return JSON.parse(localStorage.getItem('completedAchievements') || '[]');
    } catch {
      return [];
    }
  }

  // All possible achievements (for icon lookup)
  const allAchievements = [
    { title: "First Flame", icon: ChefHat },
    { title: "XP Junkie", icon: TrendingUp },
    { title: "Culinary Traveler ", icon: Users },
    { title: "Dicing Daily", icon: BookOpen },
    { title: "Multi-classed Chef", icon: ChefHat },
    { title: "Level Up, Buttercup", icon: Users },
    { title: "Indian Mastery: Tandoori Titan", icon: ChefHat },
    { title: "Italian Mastery: Pasta Prodigy", icon: ChefHat },
    { title: "Chinese Mastery: Wok Warrior", icon: ChefHat },
    { title: "Japanese Mastery: Sushi Sage", icon: ChefHat },
    { title: "Mexican Mastery: Taco Tactician", icon: ChefHat },
    { title: "French Mastery: Baguette Boss", icon: ChefHat },
    { title: "American Mastery: Grill Guardian", icon: ChefHat },
    { title: "Mediterranean Mastery: Olive Oracle", icon: ChefHat },
    { title: "Korean Mastery: Kimchi Commander", icon: ChefHat },
    { title: "Thai Mastery: Spice Summoner", icon: ChefHat },
    { title: "Greek Mastery: Feta Fighter", icon: ChefHat },
    { title: "Spanish Mastery: Paella Paladin", icon: ChefHat },
  ];

  // State for rotating badge
  const [badgeIndex, setBadgeIndex] = useState(0);
  const [completed, setCompleted] = useState(getCompletedAchievements());

  // Update completed achievements on mount, when event fires, and on navigation
  useEffect(() => {
    function updateCompleted() {
      setCompleted(getCompletedAchievements());
    }
    updateCompleted();
    window.addEventListener('completedAchievementsUpdated', updateCompleted);
    window.addEventListener('storage', updateCompleted);
    return () => {
      window.removeEventListener('completedAchievementsUpdated', updateCompleted);
      window.removeEventListener('storage', updateCompleted);
    };
  }, []);
  // Also update when route changes (in case achievements are completed elsewhere)
  useEffect(() => {
    setCompleted(getCompletedAchievements());
  }, [location.pathname]);

  useEffect(() => {
    if (!completed.length) return;
    const interval = setInterval(() => {
      setBadgeIndex((prev) => (prev + 1) % completed.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [completed]);

  // Find icon for current badge
  let badgeTitle = "No Achievements Yet!";
  let BadgeIcon = ChefHat;
  if (completed.length) {
    badgeTitle = completed[badgeIndex] || completed[0];
    const found = allAchievements.find(a => a.title === badgeTitle);
    BadgeIcon = found ? found.icon : ChefHat;
  }

  // Render sidebar UI
  return (
    <nav className="bg-card border-r border-border h-screen w-64 flex flex-col shadow-card rounded-3xl mx-2 my-4">
      {/* Logo Section: App logo and name */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-hero bg-clip-text text-transparent">
              CookUp Kitchen
            </h1>
            <p className="text-xs text-muted-foreground">Turn cooking into a game</p>
          </div>
        </Link>
      </div>

      {/* XP Progress Section: Shows current level, XP, and progress bar */}
      <div className="p-4 bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Level {userLevel}</span>
          <Button variant="xp" size="sm">
            {userXP} XP
          </Button>
        </div>
        <div className="w-full bg-border rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-primary transition-all duration-1000 ease-out"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {nextLevelXP} XP to level {userLevel + 1}
        </p>
      </div>

      
      <div className="flex-1 p-4 flex flex-col">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex-1 flex items-center justify-center">
       
          <div className="flex flex-col items-center">
            <div className="relative group">
              <span className="absolute -top-2 -right-2 text-blue-300 text-2xl animate-ping select-none pointer-events-none">✨</span>
              <div
                className="flex flex-col items-center justify-center w-48 h-36 bg-gradient-to-br from-blue-500 via-blue-400 to-blue-700 border-4 border-blue-200 shadow-2xl relative animate-fade-in animate-fade-in-up animate-duration-1000 animate-ease-in-out"
                style={{
                  clipPath: 'polygon(0 18%, 10% 0, 90% 0, 100% 18%, 100% 82%, 90% 100%, 10% 100%, 0 82%)',
                  boxShadow: '0 8px 32px 0 rgba(34,139,230,0.25), 0 0 0 4px rgba(59,130,246,0.15)'
                }}
              >
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.12) 0%, transparent 70%)',
                  borderRadius: 'inherit',
                  zIndex: 0
                }} />
                <BadgeIcon className="w-10 h-10 text-white drop-shadow-lg mb-2 z-10" />
                <span className="font-bold text-white text-lg drop-shadow-lg animate-pulse text-center px-3 z-10" style={{letterSpacing: '0.5px'}}>{badgeTitle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}