
import { useState, useRef } from "react";
// Boss avatars (simple emoji for demo, can be replaced with images)
const bossAvatars: Record<string, string> = {
  "The Olympian Chef": "🧑‍🍳",
  "Nonna Supreme": "👵",
  "The Dim Sum Dragon": "🐉",
  "The Spice Maharaja": "🕌",
  "El Gran Sabio": "🧙‍♂️",
  "The Shogun Chef": "🥷",
  "Le Grand Pâtissier": "🧁",
  "The Yankee Legend": "🦅",
  "The Aegean Master": "🌊",
  "The Seoul Sizzler": "🔥",
  "The Sweet Sage": "🍯",
};
// Confetti animation (CSS only, simple)
function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center animate-fade-out" style={{animationDuration: '1.5s'}}>
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 1.5 + 1}rem`,
            color: `hsl(${Math.random() * 360},90%,60%)`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        >
          🎉
        </div>
      ))}
    </div>
  );
}
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { X } from "lucide-react";
// Helper to persist and load meal completion state
function getCuisineProgress() {
  const data = localStorage.getItem("cuisineProgress");
  return data ? JSON.parse(data) : {};
}
function setCuisineProgress(progress: any) {
  localStorage.setItem("cuisineProgress", JSON.stringify(progress));
}

const cuisines = [
  {
    name: "Spanish",
    color: "bg-orange-200",
    meals: [
      "Gazpacho",
      "Patatas Bravas",
      "Tortilla Española",
      "Paella",
      { name: "Churros", boss: true, bossName: "El Matador Dulce" },
    ],
  },
  {
    name: "Greek",
    color: "bg-cyan-100",
    meals: [  
      "Greek Salad",
      "Souvlaki",
      "Spanakopita",
      "Moussaka",
      { name: "Baklava", boss: true, bossName: "The Olympian Chef" },
    ],
  },
  {
    name: "Italian",
    color: "bg-red-100",
    meals: [
      "Italian Tuna Pasta",
      "Broccolini Quinoa Pilaf",
      "Salmon Quinoa Risotto",
      "Roma Tomato Bruschetta",
      { name: "Tiramisu", boss: true, bossName: "Nonna Supreme" },
    ],
  },
  {
    name: "Chinese",
    color: "bg-yellow-100",
    meals: [
      "Kung Pao Chicken",
      "Sweet and Sour Pork",
      "Mapo Tofu",
      "Peking Duck",
      { name: "Dumplings", boss: true, bossName: "The Dim Sum Dragon" },
    ],
  },
  {
    name: "Indian",
    color: "bg-orange-100",
    meals: [
      "Butter Chicken",
      "Palak Paneer",
      "Biryani",
      "Chole Bhature",
      { name: "Dosa", boss: true, bossName: "The Spice Maharaja" },
    ],
  },
  {
    name: "Mexican",
    color: "bg-green-100",
    meals: [
      "Tacos",
      "Enchiladas",
      "Guacamole",
      "Chiles en Nogada",
      { name: "Mole Poblano", boss: true, bossName: "El Gran Sabio" },
    ],
  },
  {
    name: "Japanese",
    color: "bg-blue-100",
    meals: [
      "Sushi",
      "Ramen",
      "Okonomiyaki",
      "Tempura",
      { name: "Katsu Curry", boss: true, bossName: "The Shogun Chef" },
    ],
  },
  {
    name: "French",
    color: "bg-pink-100",
    meals: [
      "Coq au Vin",
      "Bouillabaisse",
      "Ratatouille",
      "Quiche Lorraine",
      { name: "Crème Brûlée", boss: true, bossName: "Le Grand Pâtissier" },
    ],
  },
  {
    name: "American",
    color: "bg-purple-100",
    meals: [
      "Burger",
      "Buffalo Wings",
      "Mac and Cheese",
      "Clam Chowder",
      { name: "Apple Pie", boss: true, bossName: "The Yankee Legend" },
    ],
  },
  {
    name: "Mediterranean",
    color: "bg-teal-100",
    meals: [
      "Greek Salad",
      "Falafel",
      "Shakshuka",
      "Moussaka",
      { name: "Baklava", boss: true, bossName: "The Aegean Master" },
    ],
  },
  {
    name: "Korean",
    color: "bg-fuchsia-100",
    meals: [
      "Bibimbap",
      "Kimchi Jjigae",
      "Bulgogi",
      "Japchae",
      { name: "Tteokbokki", boss: true, bossName: "The Seoul Sizzler" },
    ],
  },
  {
    name: "Thai",
    color: "bg-lime-100",
    meals: [
      "Pad Thai",
      "Green Curry",
      "Tom Yum Soup",
      "Som Tum",
      { name: "Mango Sticky Rice", boss: true, bossName: "The Sweet Sage" },
    ],
  },
];


export default function CuisineMastery() {
  const [selectedCuisine, setSelectedCuisine] = useState<null | typeof cuisines[0]>(null);
  const [progress, setProgress] = useState(() => getCuisineProgress());
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handler for checking a meal as completed
  function handleCheckMeal(cuisineName: string, mealIdx: number) {
    setProgress((prev: any) => {
      const updated = { ...prev };
      if (!updated[cuisineName]) updated[cuisineName] = [false, false, false, false, false];
      updated[cuisineName][mealIdx] = !updated[cuisineName][mealIdx];
      setCuisineProgress(updated);

      // If boss just got checked, show confetti
      const cuisine = cuisines.find(c => c.name === cuisineName);
      if (cuisine) {
        const bossIdx = cuisine.meals.findIndex(m => typeof m === "object" && m.boss);
        if (bossIdx === mealIdx && updated[cuisineName][mealIdx]) {
          setShowConfetti(true);
          if (confettiTimeout.current) clearTimeout(confettiTimeout.current);
          confettiTimeout.current = setTimeout(() => setShowConfetti(false), 1500);
        }
      }
      return updated;
    });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cuisine Mastery</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cuisines.map((cuisine, idx) => {
            // Find boss meal index
            const bossIdx = cuisine.meals.findIndex(m => typeof m === "object" && m.boss);
            const bossDone = bossIdx !== -1 && progress[cuisine.name]?.[bossIdx];
            // Level badge if completed
            const badgeEmoji = bossDone ? "🏅" : "";
            return (
              <div key={cuisine.name} className="relative group">
                <Card
                  className={`shadow-card bg-gradient-to-br from-pink-100 via-yellow-50 to-orange-100 border-2 border-pink-200 cursor-pointer hover:scale-[1.07] hover:shadow-2xl transition-transform duration-300 ease-out overflow-hidden ${bossDone ? "opacity-60 grayscale relative" : ""}`}
                  onClick={() => {
                    if (!bossDone) {
                      setSelectedCuisine(cuisine);
                    }
                  }}
                  style={{ pointerEvents: bossDone ? "none" : undefined }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className={`text-xl font-semibold ${bossDone ? "line-through text-muted-foreground" : ""}`}>{cuisine.name}</span>
                      <Badge variant="secondary">5 Meals</Badge>
                      {badgeEmoji && <span className="ml-2 text-2xl animate-bounce" title="Cuisine Mastered!">{badgeEmoji}</span>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {cuisine.meals.map((meal, idx2) => {
                        const mealName = typeof meal === "object" && meal !== null ? meal.name : String(meal);
                        const isBoss = typeof meal === "object" && meal.boss;
                        const bossName = isBoss && meal.bossName;
                        return (
                          <li key={mealName + "-" + idx2} className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isBoss ? "bg-yellow-400" : "bg-primary"} inline-block`} />
                            <span className={`text-base ${bossDone ? "line-through text-muted-foreground" : ""}`}>{mealName}</span>
                            {/* Boss avatar */}
                            {isBoss && bossName && (
                              <span className="ml-2 text-xl" title={bossName}>{bossAvatars[bossName] || "👑"}</span>
                            )}
                            {isBoss && bossDone && (
                              <span className="ml-2 px-2 py-1 bg-green-300 text-green-900 rounded text-xs font-bold border border-green-500 shadow animate-bounce">Defeated!</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                  {/* Fun overlay for defeated */}
                  {bossDone && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                      <div className="rotate-[-20deg] text-4xl font-extrabold text-green-700/80 drop-shadow-lg tracking-widest select-none animate-in fade-in zoom-in-95">
                        <span className="bg-green-200/80 px-6 py-2 rounded-xl border-4 border-green-400 shadow-xl">DEFEATED!</span>
                      </div>
                      <div className="mt-4 text-lg text-green-900 font-bold italic animate-pulse">You mastered this cuisine!</div>
                      <svg width="120" height="120" className="absolute -top-4 -right-4 opacity-40" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" stroke="#22c55e" strokeWidth="8" fill="none" strokeDasharray="12 12" /></svg>
                    </div>
                  )}
                  {/* Fun border effect */}
                  <div className={`absolute inset-0 pointer-events-none rounded-xl border-4 border-dashed border-transparent group-hover:border-primary/40 transition-all duration-300 ${bossDone ? "border-green-400 animate-pulse" : ""}`}></div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Modal/Popup for cuisine tree */}
        {selectedCuisine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-card rounded-xl shadow-2xl p-8 max-w-lg w-full relative animate-in fade-in zoom-in-90 animate-duration-500 animate-ease-out">
              <button
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedCuisine(null)}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                {selectedCuisine.name} Mastery Tree
                <Badge variant="secondary">5 Meals</Badge>
              </h2>
              <p className="mb-6 text-muted-foreground">Progress through these meals from easiest to hardest. Check off as you master each one!</p>
              <div className="flex flex-col items-center w-full">
                {/* Boss health bar (progress bar) */}
                {(() => {
                  const bossIdx = selectedCuisine.meals.findIndex(m => typeof m === "object" && m.boss);
                  if (bossIdx === -1) return null;
                  const completed = progress[selectedCuisine.name]?.slice(0, bossIdx).filter(Boolean).length || 0;
                  const total = bossIdx;
                  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
                  const bossMeal = selectedCuisine.meals[bossIdx];
                  const bossName = typeof bossMeal === "object" && bossMeal.bossName;
                  return (
                    <div className="w-full mb-6 flex flex-col items-center">
                      <div className="flex items-center gap-3 mb-1">
                        {/* Boss avatar */}
                        {bossName && <span className="text-3xl" title={bossName}>{bossAvatars[bossName] || "👑"}</span>}
                        <span className="font-bold text-lg text-yellow-900">{bossName ? bossName : "Boss"}</span>
                        <span className="ml-2 px-2 py-1 bg-yellow-300 text-yellow-900 rounded text-xs font-bold border border-yellow-500 shadow">BOSS</span>
                      </div>
                      <div className="w-full bg-yellow-100 rounded-full h-5 border-2 border-yellow-400 shadow-inner relative flex items-center">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-5 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                        <span className="absolute left-1/2 -translate-x-1/2 text-xs font-bold text-yellow-900 drop-shadow">
                          {percent}%
                        </span>
                      </div>
                      <span className="text-xs text-yellow-700 mt-1">Defeat the boss by mastering all previous meals!</span>
                    </div>
                  );
                })()}
                {/* Tree visualization: vertical with connecting lines */}
                <div className="flex flex-col items-center w-full">
                  {selectedCuisine.meals.map((meal, i) => {
                    // Support both string and object for meal
                    const isObj = typeof meal === "object" && meal !== null;
                    const mealName: string = isObj ? meal.name : String(meal);
                    const isBoss = isObj && meal.boss;
                    const bossName = isObj && meal.bossName;
                    // Boss meal: only enable checkbox if all previous are checked
                    // Only apply bossDisabled to the boss meal
                    const bossIdx = selectedCuisine.meals.findIndex(m => typeof m === "object" && m.boss);
                    // Always lock boss if any of the first four are unchecked, even on modal open
                    const bossDisabled = isBoss && bossIdx === i && (
                      !progress[selectedCuisine.name] || progress[selectedCuisine.name].slice(0, i).some((v: boolean) => !v)
                    );
                    return (
                      <div key={mealName + "-" + i} className="flex flex-col items-center w-full relative">
                        <div className={`flex items-center gap-3 w-full ${isBoss ? "bg-gradient-to-r from-yellow-200 via-yellow-100 to-transparent rounded-lg border-2 border-yellow-400 shadow-lg py-2 px-3 relative" : ""}`}>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={progress[selectedCuisine.name]?.[i] || false}
                              onChange={() => handleCheckMeal(selectedCuisine.name, i)}
                              tabIndex={isBoss && bossDisabled ? -1 : 0}
                              aria-disabled={isBoss && bossDisabled ? true : undefined}
                              className={`accent-primary w-5 h-5 rounded border border-primary/40 shadow ${isBoss ? "ring-2 ring-yellow-400" : ""}`}
                            />
                            {/* Overlay for locked boss: semi-transparent, blocks pointer events, matches Dashboard style */}
                            {isBoss && bossIdx === i && bossDisabled && (
                              <div
                                className="absolute inset-0 z-30 pointer-events-auto flex items-center justify-center"
                                style={{ background: "rgba(120,120,120,0.35)", borderRadius: '0.25rem' }}
                                tabIndex={-1}
                                aria-hidden="true"
                              >
                                <span className="sr-only">Locked</span>
                              </div>
                            )}
                          </div>
                          <span className={`text-lg font-medium ${progress[selectedCuisine.name]?.[i] ? "line-through text-primary" : ""} ${isBoss ? "text-yellow-900 font-extrabold tracking-wide drop-shadow" : ""}`}>
                            {mealName}
                          </span>
                          {/* Boss avatar */}
                          {isBoss && bossName && (
                            <span className="ml-2 text-2xl" title={bossName}>{bossAvatars[bossName] || "👑"}</span>
                          )}
                          {isBoss && (
                            <span className="ml-2 px-2 py-1 bg-yellow-300 text-yellow-900 rounded text-xs font-bold animate-pulse border border-yellow-500 shadow">BOSS</span>
                          )}
                        </div>
                        {isBoss && bossName && (
                          <div className="text-xs text-yellow-700 font-semibold italic mb-2 mt-1">Defeat <span className="font-bold">{bossName}</span> to master this cuisine!</div>
                        )}
                        {i < selectedCuisine.meals.length - 1 && (
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-1 bg-gradient-to-b from-primary/60 to-secondary/30 my-1 rounded-full relative">
                              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-primary rounded-full shadow" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Confetti animation on boss defeat */}
            {showConfetti && <Confetti />}
          </div>
        )}
      </main>
    </div>
  );
}
