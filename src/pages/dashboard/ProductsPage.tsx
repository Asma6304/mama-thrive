import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Baby,
  Heart,
  ShoppingBag,
  Star,
  Shield,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  priority: "Essential" | "Recommended" | "Optional";
  priceRange: string;
}

const babyProducts: Product[] = [
  {
    id: "1",
    name: "Baby Diapers (Newborn)",
    category: "Hygiene",
    description: "Soft, breathable diapers with wetness indicator for newborns.",
    benefits: ["Prevents rashes", "12-hour protection", "Gentle on skin"],
    priority: "Essential",
    priceRange: "₹600-1200",
  },
  {
    id: "2",
    name: "Baby Wipes (Fragrance-free)",
    category: "Hygiene",
    description: "Gentle, water-based wipes safe for sensitive baby skin.",
    benefits: ["Alcohol-free", "Hypoallergenic", "Thick & soft"],
    priority: "Essential",
    priceRange: "₹200-400",
  },
  {
    id: "3",
    name: "Baby Massage Oil",
    category: "Skincare",
    description: "Coconut or almond oil for traditional Indian baby massage (malish).",
    benefits: ["Strengthens bones", "Better sleep", "Skin nourishment"],
    priority: "Essential",
    priceRange: "₹150-350",
  },
  {
    id: "4",
    name: "Cotton Swaddle Blankets",
    category: "Clothing",
    description: "Soft muslin cotton swaddles for wrapping and comfort.",
    benefits: ["Temperature regulation", "Security feeling", "Multi-use"],
    priority: "Essential",
    priceRange: "₹400-800",
  },
  {
    id: "5",
    name: "Baby Feeding Bottles",
    category: "Feeding",
    description: "Anti-colic bottles with slow-flow nipples for newborns.",
    benefits: ["Reduces gas", "Natural latch", "Easy to clean"],
    priority: "Recommended",
    priceRange: "₹300-600",
  },
  {
    id: "6",
    name: "Baby Carrier/Wrap",
    category: "Travel",
    description: "Ergonomic carrier for hands-free bonding and movement.",
    benefits: ["Parent-baby bonding", "Convenience", "Hip-healthy design"],
    priority: "Recommended",
    priceRange: "₹1500-4000",
  },
  {
    id: "7",
    name: "Baby Bath Tub",
    category: "Bathing",
    description: "Ergonomic baby bath tub with anti-slip base.",
    benefits: ["Safe bathing", "Comfortable support", "Easy to drain"],
    priority: "Recommended",
    priceRange: "₹500-1500",
  },
  {
    id: "8",
    name: "Digital Thermometer",
    category: "Health",
    description: "Quick-read thermometer for monitoring baby's temperature.",
    benefits: ["Fast results", "Accurate reading", "Fever indicator"],
    priority: "Essential",
    priceRange: "₹200-500",
  },
  {
    id: "9",
    name: "Baby Nail Clipper",
    category: "Grooming",
    description: "Small, rounded nail clipper designed for tiny baby nails.",
    benefits: ["Prevents scratches", "Safe design", "Easy to use"],
    priority: "Essential",
    priceRange: "₹100-250",
  },
  {
    id: "10",
    name: "Mosquito Net",
    category: "Protection",
    description: "Fine mesh net to protect baby from mosquitoes while sleeping.",
    benefits: ["Chemical-free protection", "Better sleep", "Essential in India"],
    priority: "Essential",
    priceRange: "₹300-800",
  },
];

const motherProducts: Product[] = [
  {
    id: "1",
    name: "Nursing Bras",
    category: "Clothing",
    description: "Comfortable, easy-access bras for breastfeeding mothers.",
    benefits: ["Easy nursing access", "Comfort", "Good support"],
    priority: "Essential",
    priceRange: "₹400-1000",
  },
  {
    id: "2",
    name: "Nursing Pads",
    category: "Nursing",
    description: "Disposable or reusable pads to prevent milk leakage.",
    benefits: ["Prevents stains", "Comfortable", "Discreet"],
    priority: "Essential",
    priceRange: "₹200-500",
  },
  {
    id: "3",
    name: "Nipple Cream",
    category: "Nursing",
    description: "Lanolin-based cream to soothe and heal sore nipples.",
    benefits: ["Heals cracks", "Safe for baby", "Natural ingredients"],
    priority: "Recommended",
    priceRange: "₹300-600",
  },
  {
    id: "4",
    name: "Maternity Pillow",
    category: "Comfort",
    description: "Full-body support pillow for comfortable sleep during pregnancy.",
    benefits: ["Back support", "Better sleep", "Multiple positions"],
    priority: "Recommended",
    priceRange: "₹1000-3000",
  },
  {
    id: "5",
    name: "Breast Pump (Manual/Electric)",
    category: "Nursing",
    description: "For expressing and storing breast milk.",
    benefits: ["Flexibility", "Milk storage", "Working mom essential"],
    priority: "Recommended",
    priceRange: "₹1500-8000",
  },
  {
    id: "6",
    name: "Postpartum Belt",
    category: "Recovery",
    description: "Abdominal support belt for postnatal recovery.",
    benefits: ["Core support", "Posture correction", "Comfort"],
    priority: "Recommended",
    priceRange: "₹500-1500",
  },
  {
    id: "7",
    name: "Stretch Mark Cream",
    category: "Skincare",
    description: "Moisturizing cream to prevent and reduce stretch marks.",
    benefits: ["Skin elasticity", "Hydration", "Natural ingredients"],
    priority: "Optional",
    priceRange: "₹300-800",
  },
  {
    id: "8",
    name: "Prenatal Vitamins",
    category: "Health",
    description: "Complete vitamin and mineral supplements for pregnancy.",
    benefits: ["Folic acid", "Iron & calcium", "Baby development"],
    priority: "Essential",
    priceRange: "₹200-500/month",
  },
  {
    id: "9",
    name: "Hot Water Bottle",
    category: "Comfort",
    description: "Traditional comfort for back pain and postpartum cramps.",
    benefits: ["Pain relief", "Warmth", "Drug-free relief"],
    priority: "Recommended",
    priceRange: "₹200-400",
  },
  {
    id: "10",
    name: "Comfortable Slippers",
    category: "Comfort",
    description: "Soft, supportive slippers for swollen feet during pregnancy.",
    benefits: ["Comfort", "Slip-resistant", "Easy to wear"],
    priority: "Recommended",
    priceRange: "₹300-700",
  },
];

const ProductsPage = () => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Essential":
        return "bg-coral-light text-coral-dark border-coral";
      case "Recommended":
        return "bg-sage-light text-sage-dark border-sage";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card variant="elevated" className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          <Badge variant="outline" className={getPriorityColor(product.priority)}>
            {product.priority}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
        
        <div className="space-y-1 mb-3">
          {product.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <Star className="w-3 h-3 text-coral" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm font-medium text-coral">{product.priceRange}</span>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <ExternalLink className="w-4 h-4 mr-1" />
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Product Recommendations
        </h1>
        <p className="text-muted-foreground">
          Essential items for baby and mother care 🛍️
        </p>
      </div>

      {/* Priority Legend */}
      <Card className="mb-6 bg-muted/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium">Priority Guide:</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getPriorityColor("Essential")}>Essential</Badge>
              <span className="text-xs text-muted-foreground">Must-have items</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getPriorityColor("Recommended")}>Recommended</Badge>
              <span className="text-xs text-muted-foreground">Very useful</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getPriorityColor("Optional")}>Optional</Badge>
              <span className="text-xs text-muted-foreground">Nice to have</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="baby" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="baby" className="py-3">
            <Baby className="w-4 h-4 mr-2" />
            Baby Care Products
          </TabsTrigger>
          <TabsTrigger value="mother" className="py-3">
            <Heart className="w-4 h-4 mr-2" />
            Mother Care Products
          </TabsTrigger>
        </TabsList>

        {/* Baby Products */}
        <TabsContent value="baby" className="space-y-6">
          <Card className="bg-gradient-to-br from-sage-light to-lavender-light border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center">
                  <Baby className="w-6 h-6 text-sage" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Baby Care Essentials</h3>
                  <p className="text-sm text-muted-foreground">
                    Quality products to keep your little one comfortable, safe, and happy. 
                    Focus on essentials first, then add as needed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {babyProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        {/* Mother Products */}
        <TabsContent value="mother" className="space-y-6">
          <Card className="bg-gradient-to-br from-coral-light to-lavender-light border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-coral" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Mother Care Essentials</h3>
                  <p className="text-sm text-muted-foreground">
                    Taking care of yourself is just as important as taking care of baby. 
                    These products will help you through pregnancy and recovery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {motherProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <Card className="mt-8 bg-lavender-light border-0">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-accent mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">⚠️ Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
                These product recommendations are for awareness and general guidance only. 
                We do not endorse any specific brands. Always check product reviews, consult 
                with your doctor for medical products, and ensure products are suitable for 
                your specific needs. Prices are approximate and may vary.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shopping Tips */}
      <Card className="mt-4 bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-3">💡 Smart Shopping Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <ShoppingBag className="w-4 h-4 mt-0.5 text-coral" />
              Don't buy everything at once - baby's needs change quickly
            </li>
            <li className="flex items-start gap-2">
              <ShoppingBag className="w-4 h-4 mt-0.5 text-coral" />
              Ask family and friends for hand-me-downs - babies outgrow things fast
            </li>
            <li className="flex items-start gap-2">
              <ShoppingBag className="w-4 h-4 mt-0.5 text-coral" />
              Look for combo packs and sales during festivals for better deals
            </li>
            <li className="flex items-start gap-2">
              <ShoppingBag className="w-4 h-4 mt-0.5 text-coral" />
              Read reviews and check for certifications before buying
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;
