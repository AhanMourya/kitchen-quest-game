import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Target
} from "lucide-react";

const dailyMission = {
  title: "Spicy Thai Green Curry",
  description: "Master the art of Thai cuisine with this medium-difficulty curry",
  xpReward: 150,
  timeEstimate: "45 min",
  difficulty: "Medium",
  cuisineType: "Thai"
};

const recentAchievements = [
  { name: "First Flame", description: "Completed your first recipe", icon: Flame },
  { name: "Spice Master", description: "Cooked 5 spicy dishes", icon: ChefHat },
  { name: "Quick Cook", description: "Finished recipe under time limit", icon: Clock },
];

const quickStats = [
  { label: "Recipes Completed", value: 23, icon: BookOpen },
  { label: "Classes Mastered", value: 3, icon: Trophy },
  { label: "Badges Earned", value: 12, icon: Star },
  { label: "Community Votes", value: 45, icon: Users },
];

export default function Dashboard() {
  const userXP = 1250;
  const userLevel = 8;
  
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
                
                <Button variant="hero" className="w-full">
                  Start Quest
                  <ChefHat className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
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

            {/* Recent Achievements */}
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
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                        <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <div>
                          <div className="font-semibold">{achievement.name}</div>
                          <div className="text-sm text-muted-foreground">{achievement.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
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