import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Star, Users, Trophy, ChefHat, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-cooking.jpg";

const features = [
  {
    icon: ChefHat,
    title: "Pick a Cuisine Class",
    description: "Master Italian, Indian, Mexican, Japanese, and more cooking styles",
  },
  {
    icon: Star,
    title: "Earn XP by Cooking",
    description: "Complete recipes to gain experience points and level up your skills",
  },
  {
    icon: Trophy,
    title: "Unlock Recipes",
    description: "Progress through levels to discover new challenges and dishes",
  },
  {
    icon: Users,
    title: "Share Creations",
    description: "Show off your culinary masterpieces to the community",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              CookUp Kitchen
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/">
              <Button variant="hero">Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold leading-tight">
                Turn your{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  kitchen
                </span>{" "}
                into a game
              </h2>
              <p className="text-xl text-muted-foreground max-w-lg">
                Level up your cooking skills with gamified recipes, earn XP for every dish, 
                and become the ultimate kitchen champion.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="hero" size="lg" className="text-lg px-8">
                  Start Your Adventure
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              {/*}
              <Button variant="outline" size="lg" className="text-lg">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button> 
              */}
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5K+</div>
                <div className="text-sm text-muted-foreground">Recipes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">10+</div>
                <div className="text-sm text-muted-foreground">Acheviements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">∞</div>
                <div className="text-sm text-muted-foreground">Fun</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary/20 rounded-3xl blur-3xl" />
            <img
              src={heroImage}
              alt="Cooking adventure"
              className="relative rounded-3xl shadow-glow w-full h-auto animate-float"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">How It Works</h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience cooking like never before with our RPG-inspired learning platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="text-center p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-pink-100 via-yellow-50 to-orange-100 border-2 border-pink-200"
              >
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h4 className="text-lg font-semibold">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>


      {/* Developer Navigation - Temporary */}
      <section className="bg-muted/50 py-8 border-t border-dashed border-muted-foreground/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Developer Navigation (Temporary)
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <Link to="/recipes">
                <Button variant="outline" size="sm">Recipes</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="sm">Signup</Button>
              </Link>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear ALL localStorage data? This cannot be undone.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                Clear Local Storage
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold bg-gradient-hero bg-clip-text text-transparent">
                CookUp Kitchen
              </span>
            </div>
          </div>
           <p className="text-center text-muted-foreground mt-4">
          </p> 
        </div>
      </footer>
    </div>
  );
}