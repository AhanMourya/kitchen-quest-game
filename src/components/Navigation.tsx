import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, TrendingUp, Users, Camera, User, Settings, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Recipes", href: "/recipes", icon: BookOpen },
  { name: "Level", href: "/level", icon: TrendingUp },
  { name: "Community", href: "/community", icon: Users },
  { name: "Gallery", href: "/gallery", icon: Camera },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Navigation() {
  const location = useLocation();
  const [userXP] = useState(100);
  const [userLevel] = useState(1);
  
  const currentXPForLevel = 0;
  const nextLevelXP = 500;
  const xpProgress = ((userXP - currentXPForLevel) / (nextLevelXP - currentXPForLevel)) * 100;

  return (
    <nav className="bg-card border-r border-border h-screen w-64 flex flex-col shadow-card">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-hero bg-clip-text text-transparent">
              LevelUp Kitchen
            </h1>
            <p className="text-xs text-muted-foreground">Turn cooking into a game</p>
          </div>
        </Link>
      </div>

      {/* XP Progress Section */}
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
          {nextLevelXP - userXP} XP to level {userLevel + 1}
        </p>
      </div>

      {/* Navigation Items */}
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

      {/* Footer */}
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