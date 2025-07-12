import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface XPProgressBarProps {
  currentXP: number;
  level: number;
  className?: string;
  showLabels?: boolean;
  animated?: boolean;
}

export function XPProgressBar({ 
  currentXP, 
  level, 
  className, 
  showLabels = true, 
  animated = true 
}: XPProgressBarProps) {
  const [displayXP, setDisplayXP] = useState(0);
  
  // Helper to get current XP from localStorage (matches Recipes/Dashboard logic)
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

  // Use XP from localStorage if available, otherwise fallback to prop
  const localXP = getUserProfileLocal().xp;
  const currentLevelXP = localXP;
  const nextLevelXP = 400 * (2 ** level - 1);
  const xpForThisLevel = currentXP - currentLevelXP;
  const xpNeededForThisLevel = nextLevelXP - currentLevelXP;
  const progressPercentage = Math.min((currentLevelXP / nextLevelXP) * 100, 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayXP(progressPercentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayXP(progressPercentage);
    }
  }, [progressPercentage, animated]);

  return (
    <div className={cn("w-full", className)}>
      {showLabels && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-foreground">
            Level {level}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentLevelXP}/{nextLevelXP} XP
          </span>
        </div>
      )}
      
      <div className="relative">
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-border/50">
          <div 
            className="h-full bg-gradient-primary transition-all duration-2000 ease-out shadow-glow"
            style={{ 
              width: animated ? `${displayXP}%` : `${progressPercentage}%`,
              transition: animated ? 'width 2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            }}
          />
        </div>
        
        {/* Glow effect */}
        <div 
          className="absolute top-0 h-full bg-gradient-to-r from-transparent via-primary-glow/20 to-transparent rounded-full blur-sm"
          style={{ width: `${displayXP}%` }}
        />
      </div>
      
      {showLabels && (
        <p className="text-xs text-muted-foreground mt-1 text-center">
          {nextLevelXP - currentXP} XP until next level
        </p>
      )}
    </div>
  );
}