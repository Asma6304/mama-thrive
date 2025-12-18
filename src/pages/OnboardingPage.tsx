import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowRight, ArrowLeft, Baby, User, Pill, Apple, Moon, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Step = 1 | 2 | 3;

interface OnboardingData {
  pregnancyStatus: "pregnant" | "postnatal" | "";
  pregnancyMonth: string;
  babyAge: string;
  medicalConditions: string;
  medicines: string;
  allergies: string;
  sleepHours: string;
  dietPreference: "veg" | "non-veg" | "eggitarian" | "";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "";
}

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<OnboardingData>({
    pregnancyStatus: "",
    pregnancyMonth: "",
    babyAge: "",
    medicalConditions: "",
    medicines: "",
    allergies: "",
    sleepHours: "",
    dietPreference: "",
    activityLevel: "",
  });

  const updateData = (field: keyof OnboardingData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as Step);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    // Simulate saving data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Profile Complete! 🌸",
      description: "Your personalized wellness journey begins now.",
    });
    
    navigate("/dashboard");
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return data.pregnancyStatus && (data.pregnancyStatus === "pregnant" ? data.pregnancyMonth : data.babyAge);
      case 2:
        return true; // Medical info is optional
      case 3:
        return data.sleepHours && data.dietPreference && data.activityLevel;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light via-background to-coral-light flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-sage/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-coral/10 rounded-full blur-3xl" />

      <div className="w-full max-w-lg relative">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? "w-12 bg-coral"
                  : s < step
                  ? "w-8 bg-sage"
                  : "w-8 bg-muted"
              }`}
            />
          ))}
        </div>

        <Card variant="elevated" className="animate-scale-in">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-coral to-sage flex items-center justify-center mx-auto mb-4 shadow-medium">
              {step === 1 ? (
                <Baby className="w-7 h-7 text-background" />
              ) : step === 2 ? (
                <Pill className="w-7 h-7 text-background" />
              ) : (
                <Activity className="w-7 h-7 text-background" />
              )}
            </div>
            <CardTitle className="text-xl">
              {step === 1 && "Tell Us About Your Journey"}
              {step === 2 && "Medical Information"}
              {step === 3 && "Your Lifestyle"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Help us personalize your wellness experience"}
              {step === 2 && "Optional but helps us serve you better"}
              {step === 3 && "Almost done! Just a few more details"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Pregnancy/Postnatal Status */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Where are you in your journey? *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateData("pregnancyStatus", "pregnant")}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        data.pregnancyStatus === "pregnant"
                          ? "border-coral bg-coral-light"
                          : "border-border hover:border-coral/50"
                      }`}
                    >
                      <Baby className="w-6 h-6 mx-auto mb-2 text-coral" />
                      <p className="font-medium text-sm">Pregnant</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateData("pregnancyStatus", "postnatal")}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        data.pregnancyStatus === "postnatal"
                          ? "border-sage bg-sage-light"
                          : "border-border hover:border-sage/50"
                      }`}
                    >
                      <Heart className="w-6 h-6 mx-auto mb-2 text-sage-dark" fill="currentColor" />
                      <p className="font-medium text-sm">New Mom</p>
                    </button>
                  </div>
                </div>

                {data.pregnancyStatus === "pregnant" && (
                  <div className="space-y-2 animate-fade-in-up">
                    <label className="text-sm font-medium text-foreground">
                      Pregnancy Month *
                    </label>
                    <select
                      value={data.pregnancyMonth}
                      onChange={(e) => updateData("pregnancyMonth", e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border-2 border-input bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select month</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((month) => (
                        <option key={month} value={month}>
                          Month {month}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {data.pregnancyStatus === "postnatal" && (
                  <div className="space-y-2 animate-fade-in-up">
                    <label className="text-sm font-medium text-foreground">
                      Baby's Age *
                    </label>
                    <select
                      value={data.babyAge}
                      onChange={(e) => updateData("babyAge", e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border-2 border-input bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select age</option>
                      <option value="0-3">0-3 months</option>
                      <option value="3-6">3-6 months</option>
                      <option value="6-9">6-9 months</option>
                      <option value="9-12">9-12 months</option>
                      <option value="12+">12+ months</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Medical Information */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Any medical conditions? (Optional)
                  </label>
                  <Input
                    placeholder="e.g., Gestational diabetes, thyroid"
                    value={data.medicalConditions}
                    onChange={(e) => updateData("medicalConditions", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Current medications (Optional)
                  </label>
                  <Input
                    placeholder="e.g., Iron supplements, folic acid"
                    value={data.medicines}
                    onChange={(e) => updateData("medicines", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Any allergies? (Optional)
                  </label>
                  <Input
                    placeholder="e.g., Peanuts, shellfish"
                    value={data.allergies}
                    onChange={(e) => updateData("allergies", e.target.value)}
                  />
                </div>

                <p className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                  💡 This information helps us provide safer, more personalized recommendations. 
                  You can always update this later in your profile.
                </p>
              </div>
            )}

            {/* Step 3: Lifestyle */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Moon className="w-4 h-4 text-lavender" />
                    Average sleep hours *
                  </label>
                  <select
                    value={data.sleepHours}
                    onChange={(e) => updateData("sleepHours", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border-2 border-input bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select hours</option>
                    <option value="less-4">Less than 4 hours</option>
                    <option value="4-6">4-6 hours</option>
                    <option value="6-8">6-8 hours</option>
                    <option value="8+">8+ hours</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Apple className="w-4 h-4 text-sage-dark" />
                    Diet preference *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "veg", label: "Vegetarian" },
                      { value: "non-veg", label: "Non-Veg" },
                      { value: "eggitarian", label: "Eggitarian" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateData("dietPreference", option.value as OnboardingData["dietPreference"])}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                          data.dietPreference === option.value
                            ? "border-sage bg-sage-light text-sage-dark"
                            : "border-border hover:border-sage/50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-coral" />
                    Activity level *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "sedentary", label: "Sedentary", desc: "Little to no exercise" },
                      { value: "light", label: "Light", desc: "Light walks" },
                      { value: "moderate", label: "Moderate", desc: "Regular exercise" },
                      { value: "active", label: "Active", desc: "Daily workouts" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateData("activityLevel", option.value as OnboardingData["activityLevel"])}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                          data.activityLevel === option.value
                            ? "border-coral bg-coral-light"
                            : "border-border hover:border-coral/50"
                        }`}
                      >
                        <p className="font-medium text-sm">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                variant="hero"
                onClick={handleNext}
                className="flex-1"
                disabled={!isStepValid() || isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : step === 3 ? (
                  "Complete Setup"
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
