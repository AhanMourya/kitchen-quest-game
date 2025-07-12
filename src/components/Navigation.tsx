
// Navigation sidebar for the app. Shows logo, XP/level progress, and navigation links.
import { useState, useEffect } from "react";
// import { auth, getUserProfile } from "@/firebase"; // Firebase helpers for user data (REMOVED)
import { Link, useLocation } from "react-router-dom"; // Routing
import { Home, BookOpen, TrendingUp, Users, Camera, User, Settings, ChefHat } from "lucide-react"; // Icons
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


// List of navigation items for the sidebar
const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Recipes", href: "/recipes", icon: BookOpen },
  { name: "Level", href: "/level", icon: TrendingUp },
  { name: "Gallery", href: "/gallery", icon: Camera },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];
// Example: { name: "Community", href: "/community", icon: Users },

// Navigation sidebar component
export function Navigation() {
  const location = useLocation(); // Current route location

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

  // State for user XP, level, and XP needed for next level
  const [userXP, setUserXP] = useState(() => getUserProfileLocal().xp);
  const [userLevel, setUserLevel] = useState(() => getUserProfileLocal().level);
  const [xpToNextLevel, setXpToNextLevel] = useState(() => getUserProfileLocal().xpToNextLevel);

  // On mount, load user XP/level from localStorage and listen for changes
  useEffect(() => {
    function updateFromLocalStorage() {
      const { xp, level, xpToNextLevel } = getUserProfileLocal();
      setUserXP(xp);
      setUserLevel(level);
      setXpToNextLevel(xpToNextLevel);
    }
    updateFromLocalStorage();
    // Listen for localStorage changes (from other tabs/windows)
    window.addEventListener('storage', updateFromLocalStorage);
    // Listen for custom event for same-tab updates
    window.addEventListener('userProfileUpdated', updateFromLocalStorage);
    return () => {
      window.removeEventListener('storage', updateFromLocalStorage);
      window.removeEventListener('userProfileUpdated', updateFromLocalStorage);
    };
  }, []);

  // Calculate XP progress bar percentage
  const currentXPForLevel = 0;
  const nextLevelXP = xpToNextLevel;
  const xpProgress = ((userXP) / (nextLevelXP)) * 100;

  // Render sidebar UI
  return (
    <nav className="bg-card border-r border-border h-screen w-64 flex flex-col shadow-card">
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

      {/* Navigation Items: List of sidebar links */}
      <div className="flex-1 p-4">
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
      </div>

      {/* Footer: User info or branding */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-secondary-foreground">CR</span>
          </div>
          <div>
            <p className="text-sm font-medium">CookieRookie</p>
            <p className="text-xs text-muted-foreground">Kitchen Newbie</p>
          </div>
        </div>
      </div>
    </nav>
  );
}