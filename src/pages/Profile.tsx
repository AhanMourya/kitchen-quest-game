import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Trophy, ChefHat, Camera, Heart, MessageCircle, Calendar, MapPin, Mail } from "lucide-react";

const userProfile = {
  username: "CookieRookie",
  email: "cookierookie@example.com",
  level: 1,
  title: "Kitchen Newbie",
  xp: 100,
  xpToNext: 500,
  joinDate: "December 2024",
  location: "San Francisco, CA",
  favoriteAuisines: ["Italian", "Japanese"],
  recipesCompleted: 1,
  dishesShared: 0,
  commentsPosted: 2,
  followers: 0,
  following: 3,
  bio: "Just started my cooking journey! Excited to learn and share delicious recipes with everyone.",
  achievements: [
    { title: "First Flame", icon: "🔥", description: "Completed first recipe" },
    { title: "Kitchen Novice", icon: "👨‍🍳", description: "Reached Level 1" },
  ],
};

const recentDishes = [
  {
    id: 1,
    title: "My First Pancakes",
    image: "/placeholder.svg",
    likes: 12,
    comments: 3,
    timeAgo: "2 days ago",
    rating: 4,
  },
];

const favoriteRecipes = [
  {
    id: 1,
    title: "Fluffy Pancakes",
    cuisine: "American",
    difficulty: "Beginner",
    completed: true,
    rating: 4,
  },
  {
    id: 2,
    title: "Classic Margherita Pizza",
    cuisine: "Italian",
    difficulty: "Intermediate",
    completed: false,
    rating: null,
  },
  {
    id: 3,
    title: "Chicken Teriyaki",
    cuisine: "Japanese",
    difficulty: "Beginner",
    completed: false,
    rating: null,
  },
];

const recentComments = [
  {
    id: 1,
    recipe: "Chocolate Chip Cookies",
    comment: "These look amazing! Can't wait to try them.",
    timeAgo: "1 day ago",
  },
  {
    id: 2,
    recipe: "Banana Bread",
    comment: "Made this yesterday and it was perfect!",
    timeAgo: "3 days ago",
  },
];

export default function Profile() {
  const progressToNext = ((userProfile.xp - 0) / (userProfile.xpToNext - 0)) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <Card className="shadow-glow border-border/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-primary text-primary-foreground">
                      CR
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold">{userProfile.username}</h1>
                    <p className="text-lg text-muted-foreground">{userProfile.title}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{userProfile.level}</div>
                      <div className="text-sm text-muted-foreground">Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">{userProfile.recipesCompleted}</div>
                      <div className="text-sm text-muted-foreground">Recipes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{userProfile.dishesShared}</div>
                      <div className="text-sm text-muted-foreground">Dishes Shared</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{userProfile.followers}</div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>XP Progress</span>
                      <span>{userProfile.xp} / {userProfile.xpToNext} XP</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all" 
                        style={{ width: `${progressToNext}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-muted-foreground">{userProfile.bio}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {userProfile.joinDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {userProfile.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {userProfile.email}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="hero">Edit Profile</Button>
                    <Button variant="outline">Share Profile</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content Tabs */}
          <Tabs defaultValue="dishes" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dishes">Dishes</TabsTrigger>
              <TabsTrigger value="recipes">Recipes</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="dishes" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentDishes.length > 0 ? (
                  recentDishes.map((dish) => (
                    <Card key={dish.id} className="shadow-card">
                      <div className="relative">
                        <img 
                          src={dish.image} 
                          alt={dish.title}
                          className="w-full h-48 object-cover rounded-t-lg bg-muted"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{dish.title}</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{dish.timeAgo}</span>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {dish.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {dish.comments}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No dishes shared yet</h3>
                    <p className="text-muted-foreground">Start cooking and share your creations!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="recipes" className="space-y-6">
              <div className="space-y-4">
                {favoriteRecipes.map((recipe) => (
                  <Card key={recipe.id} className="shadow-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{recipe.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{recipe.cuisine}</Badge>
                            <Badge variant="outline">{recipe.difficulty}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {recipe.completed ? (
                            <>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < (recipe.rating || 0) ? "text-yellow-500 fill-current" : "text-muted-foreground"}`} 
                                  />
                                ))}
                              </div>
                              <Badge variant="secondary">Completed</Badge>
                            </>
                          ) : (
                            <Badge variant="outline">Saved</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {userProfile.achievements.map((achievement, index) => (
                  <Card key={index} className="shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{achievement.icon}</div>
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Recent Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentComments.map((comment) => (
                      <div key={comment.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">{comment.recipe}</h4>
                          <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}