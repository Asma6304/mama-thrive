import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Apple,
  Baby,
  Leaf,
  Clock,
  Star,
  Heart,
  Utensils,
  Salad,
} from "lucide-react";
import { useWellness } from "@/contexts/WellnessContext";

interface DietItem {
  id: string;
  name: string;
  nameHindi?: string;
  benefits: string[];
  timing: string;
  category: string;
  isVegetarian: boolean;
}

const pregnancyDiet: DietItem[] = [
  {
    id: "1",
    name: "Paneer & Spinach",
    nameHindi: "पालक पनीर",
    benefits: ["High protein", "Iron-rich", "Calcium for baby bones"],
    timing: "Lunch or Dinner",
    category: "Main Course",
    isVegetarian: true,
  },
  {
    id: "2",
    name: "Dal with Ghee",
    nameHindi: "घी वाली दाल",
    benefits: ["Protein boost", "Easy digestion", "Traditional nourishment"],
    timing: "Lunch & Dinner",
    category: "Main Course",
    isVegetarian: true,
  },
  {
    id: "3",
    name: "Dry Fruits & Nuts Mix",
    nameHindi: "मेवा मिश्रण",
    benefits: ["Omega-3 fatty acids", "Brain development", "Energy boost"],
    timing: "Morning snack",
    category: "Snacks",
    isVegetarian: true,
  },
  {
    id: "4",
    name: "Banana & Milk Shake",
    nameHindi: "केले का शेक",
    benefits: ["Potassium", "Reduces leg cramps", "Energy"],
    timing: "Evening",
    category: "Beverages",
    isVegetarian: true,
  },
  {
    id: "5",
    name: "Moong Dal Khichdi",
    nameHindi: "मूंग दाल खिचड़ी",
    benefits: ["Light & nutritious", "Easy to digest", "Complete protein"],
    timing: "Lunch or Dinner",
    category: "Main Course",
    isVegetarian: true,
  },
  {
    id: "6",
    name: "Coconut Water",
    nameHindi: "नारियल पानी",
    benefits: ["Natural hydration", "Electrolytes", "Reduces acidity"],
    timing: "Anytime",
    category: "Beverages",
    isVegetarian: true,
  },
  {
    id: "7",
    name: "Ragi Porridge",
    nameHindi: "रागी का दलिया",
    benefits: ["High calcium", "Iron-rich", "Good for bones"],
    timing: "Breakfast",
    category: "Breakfast",
    isVegetarian: true,
  },
  {
    id: "8",
    name: "Fish Curry (if non-veg)",
    nameHindi: "मछली करी",
    benefits: ["Omega-3 for baby brain", "Lean protein", "DHA"],
    timing: "Lunch",
    category: "Main Course",
    isVegetarian: false,
  },
];

const postnatalDiet: DietItem[] = [
  {
    id: "1",
    name: "Ajwain Water",
    nameHindi: "अजवाइन का पानी",
    benefits: ["Aids digestion", "Reduces bloating", "Increases milk"],
    timing: "Morning, empty stomach",
    category: "Beverages",
    isVegetarian: true,
  },
  {
    id: "2",
    name: "Gond Ke Ladoo",
    nameHindi: "गोंद के लड्डू",
    benefits: ["Body warmth", "Strength recovery", "Traditional postpartum food"],
    timing: "Morning snack",
    category: "Traditional",
    isVegetarian: true,
  },
  {
    id: "3",
    name: "Methi (Fenugreek) Paratha",
    nameHindi: "मेथी का पराठा",
    benefits: ["Increases breast milk", "Iron-rich", "Joint health"],
    timing: "Breakfast or Lunch",
    category: "Main Course",
    isVegetarian: true,
  },
  {
    id: "4",
    name: "Dry Ginger Coffee",
    nameHindi: "सोंठ की चाय",
    benefits: ["Body warmth", "Aids digestion", "Reduces body pain"],
    timing: "Morning & Evening",
    category: "Beverages",
    isVegetarian: true,
  },
  {
    id: "5",
    name: "Panjiri",
    nameHindi: "पंजीरी",
    benefits: ["Energy boost", "Calcium-rich", "Traditional recovery food"],
    timing: "Anytime",
    category: "Traditional",
    isVegetarian: true,
  },
  {
    id: "6",
    name: "Jeera Rice with Dal",
    nameHindi: "जीरा चावल और दाल",
    benefits: ["Light & nutritious", "Easy digestion", "Balanced meal"],
    timing: "Lunch",
    category: "Main Course",
    isVegetarian: true,
  },
  {
    id: "7",
    name: "Warm Milk with Turmeric",
    nameHindi: "हल्दी वाला दूध",
    benefits: ["Healing properties", "Better sleep", "Anti-inflammatory"],
    timing: "Before bed",
    category: "Beverages",
    isVegetarian: true,
  },
  {
    id: "8",
    name: "Chicken Soup",
    nameHindi: "चिकन सूप",
    benefits: ["Protein for recovery", "Hydration", "Immune boost"],
    timing: "Lunch or Dinner",
    category: "Main Course",
    isVegetarian: false,
  },
];

const babyFoodStages = [
  {
    age: "6 months",
    title: "First Foods",
    foods: [
      { name: "Rice Cereal", nameHindi: "चावल का दलिया", tip: "Start with thin consistency" },
      { name: "Mashed Banana", nameHindi: "मसला केला", tip: "Rich in potassium" },
      { name: "Apple Puree", nameHindi: "सेब की प्यूरी", tip: "Boil and mash well" },
      { name: "Moong Dal Water", nameHindi: "मूंग दाल का पानी", tip: "Light protein start" },
    ],
  },
  {
    age: "7-8 months",
    title: "Expanding Tastes",
    foods: [
      { name: "Suji Kheer", nameHindi: "सूजी की खीर", tip: "Easy to digest" },
      { name: "Carrot Puree", nameHindi: "गाजर की प्यूरी", tip: "Beta-carotene rich" },
      { name: "Khichdi", nameHindi: "खिचड़ी", tip: "Complete nutrition" },
      { name: "Curd Rice", nameHindi: "दही चावल", tip: "Good for digestion" },
    ],
  },
  {
    age: "9-11 months",
    title: "Finger Foods Begin",
    foods: [
      { name: "Idli", nameHindi: "इडली", tip: "Soft and easy to hold" },
      { name: "Roti pieces", nameHindi: "रोटी के टुकड़े", tip: "Soft chapati strips" },
      { name: "Egg Yolk", nameHindi: "अंडे की जर्दी", tip: "After 9 months (if non-veg)" },
      { name: "Vegetable Upma", nameHindi: "सब्जी उपमा", tip: "Mixed nutrition" },
    ],
  },
  {
    age: "12+ months",
    title: "Family Foods",
    foods: [
      { name: "Soft Paratha", nameHindi: "नरम पराठा", tip: "With ghee" },
      { name: "Dal Rice", nameHindi: "दाल चावल", tip: "Regular family meal" },
      { name: "Fruit Chaat", nameHindi: "फ्रूट चाट", tip: "Mixed fruits" },
      { name: "Paneer Curry", nameHindi: "पनीर की सब्जी", tip: "Mashed for easy eating" },
    ],
  },
];

const DietPage = () => {
  const { pregnancyStage } = useWellness();
  const [activeTab, setActiveTab] = useState("pregnancy");

  const DietCard = ({ item }: { item: DietItem }) => (
    <Card variant="elevated" className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-foreground">{item.name}</h3>
            {item.nameHindi && (
              <p className="text-sm text-muted-foreground">{item.nameHindi}</p>
            )}
          </div>
          <Badge variant={item.isVegetarian ? "secondary" : "outline"} className={item.isVegetarian ? "bg-sage-light text-sage-dark" : ""}>
            {item.isVegetarian ? <Leaf className="w-3 h-3 mr-1" /> : null}
            {item.isVegetarian ? "Veg" : "Non-Veg"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <Clock className="w-4 h-4" />
          {item.timing}
        </div>
        
        <div className="space-y-1">
          {item.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <Star className="w-3 h-3 text-coral" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Diet & Nutrition
        </h1>
        <p className="text-muted-foreground">
          Traditional Indian foods for healthy pregnancy and recovery 🥗
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="pregnancy" className="py-3">
            <Apple className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Pregnancy Diet</span>
            <span className="sm:hidden">Pregnancy</span>
          </TabsTrigger>
          <TabsTrigger value="postnatal" className="py-3">
            <Heart className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Postnatal Recovery</span>
            <span className="sm:hidden">Postnatal</span>
          </TabsTrigger>
          <TabsTrigger value="baby" className="py-3">
            <Baby className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Baby Food Stages</span>
            <span className="sm:hidden">Baby</span>
          </TabsTrigger>
        </TabsList>

        {/* Pregnancy Diet */}
        <TabsContent value="pregnancy" className="space-y-6">
          <Card className="bg-gradient-to-br from-coral-light to-sage-light border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center">
                  <Salad className="w-6 h-6 text-sage" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Pregnancy Nutrition Tips</h3>
                  <p className="text-sm text-muted-foreground">
                    During {pregnancyStage}, focus on iron-rich foods, calcium, and protein. 
                    Eat small, frequent meals to avoid acidity. Stay hydrated!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {pregnancyDiet.map((item) => (
              <DietCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        {/* Postnatal Diet */}
        <TabsContent value="postnatal" className="space-y-6">
          <Card className="bg-gradient-to-br from-lavender-light to-coral-light border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-coral" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Postnatal Recovery Foods</h3>
                  <p className="text-sm text-muted-foreground">
                    Traditional Indian postpartum foods help in recovery, increase breast milk, 
                    and provide warmth to the body. Listen to your dadi-nani's wisdom!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {postnatalDiet.map((item) => (
              <DietCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        {/* Baby Food */}
        <TabsContent value="baby" className="space-y-6">
          <Card className="bg-gradient-to-br from-sage-light to-lavender-light border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center">
                  <Baby className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Baby Food Introduction Guide</h3>
                  <p className="text-sm text-muted-foreground">
                    Start solids at 6 months. Introduce one food at a time and wait 3 days 
                    before trying new foods to check for allergies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {babyFoodStages.map((stage) => (
            <Card key={stage.age} variant="elevated">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline" className="text-coral border-coral">
                    {stage.age}
                  </Badge>
                  {stage.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {stage.foods.map((food, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-muted rounded-xl"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Utensils className="w-4 h-4 text-coral" />
                        <span className="font-medium">{food.name}</span>
                      </div>
                      {food.nameHindi && (
                        <p className="text-sm text-muted-foreground mb-1">{food.nameHindi}</p>
                      )}
                      <p className="text-xs text-muted-foreground">💡 {food.tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <Card className="mt-8 bg-lavender-light border-0">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-2">⚠️ Important Note</h3>
          <p className="text-sm text-muted-foreground">
            These diet recommendations are general guidelines based on traditional Indian 
            practices. Always consult your doctor or nutritionist for personalized advice, 
            especially if you have any medical conditions or allergies.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DietPage;
