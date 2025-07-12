import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Crown, Flame, Target, ChefHat } from "lucide-react";

const achievements = [
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
    icon: Crown,
    unlocked: false,
    xp: 1000,
    progress: 20,
  },
];

const levels = [
  { level: 1, title: "Kitchen Newbie", xpRequired: 0, xpNext: 500, current: true },
  { level: 2, title: "Aspiring Cook", xpRequired: 500, xpNext: 1200, current: false },
  { level: 3, title: "Home Chef", xpRequired: 1200, xpNext: 2000, current: false },
  { level: 4, title: "Culinary Artist", xpRequired: 2000, xpNext: 3000, current: false },
  { level: 5, title: "Kitchen Master", xpRequired: 3000, xpNext: 4500, current: false },
];

export default function Level() {
  const currentXP = 100;
  const currentLevel = levels.find(l => l.current);
  const progressToNext = currentLevel ? ((currentXP - currentLevel.xpRequired) / (currentLevel.xpNext - currentLevel.xpRequired)) * 100 : 0;

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Level Progression
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your culinary journey and unlock new achievements
            </p>
          </div>

          {/* Current Level Status */}
          <Card className="shadow-glow border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold">Level {currentLevel?.level}</div>
                  <div className="text-muted-foreground">{currentLevel?.title}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>XP Progress</span>
                  <span>{currentXP} / {currentLevel?.xpNext} XP</span>
                </div>
                <Progress value={progressToNext} className="h-3" />
                <div className="text-center text-sm text-muted-foreground">
                  {(currentLevel?.xpNext || 0) - currentXP} XP to next level
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
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
                  {achievements.map((achievement) => {
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
                </div>
              </CardContent>
            </Card>

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
          </div>
        </div>
      </div>
    </div>
  );
}