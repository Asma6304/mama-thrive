import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowRight, ArrowLeft, Baby, Pill, Apple, Moon, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("user_profiles")
        .update({
          pregnancy_status: data.pregnancyStatus,
          pregnancy_month:
            data.pregnancyStatus === "pregnant"
              ? Number(data.pregnancyMonth)
              : null,
          baby_age:
            data.pregnancyStatus === "postnatal"
              ? data.babyAge
              : null,
          medical_conditions: data.medicalConditions,
          medicines: data.medicines,
          allergies: data.allergies,
          sleep_hours: data.sleepHours,
          diet_preference: data.dietPreference,
          activity_level: data.activityLevel,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile Complete! 🌸",
        description: "Your personalized wellness journey begins now.",
      });

      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Failed to save profile",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          data.pregnancyStatus &&
          (data.pregnancyStatus === "pregnant"
            ? data.pregnancyMonth
            : data.babyAge)
        );
      case 2:
        return true;
      case 3:
        return data.sleepHours && data.dietPreference && data.activityLevel;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light via-background to-coral-light flex items-center justify-center p-4">
      <div className="absolute top-20 right-10 w-64 h-64 bg-sage/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-coral/10 rounded-full blur-3xl" />

      <div className="w-full max-w-lg relative">
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
            {step === 1 && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Where are you in your journey? *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateData("pregnancyStatus", "pregnant")}
                      className={`p-4 rounded-xl border-2 ${
                        data.pregnancyStatus === "pregnant"
                          ? "border-coral bg-coral-light"
                          : "border-border"
                      }`}
                    >
                      <Baby className="w-6 h-6 mx-auto mb-2 text-coral" />
                      Pregnant
                    </button>
                    <button
                      type="button"
                      onClick={() => updateData("pregnancyStatus", "postnatal")}
                      className={`p-4 rounded-xl border-2 ${
                        data.pregnancyStatus === "postnatal"
                          ? "border-sage bg-sage-light"
                          : "border-border"
                      }`}
                    >
                      <Heart className="w-6 h-6 mx-auto mb-2 text-sage-dark" />
                      New Mom
                    </button>
                  </div>
                </div>

                {data.pregnancyStatus === "pregnant" && (
                  <select
                    value={data.pregnancyMonth}
                    onChange={(e) => updateData("pregnancyMonth", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border-2"
                  >
                    <option value="">Select pregnancy month</option>
                    {[1,2,3,4,5,6,7,8,9].map((m) => (
                      <option key={m} value={m}>Month {m}</option>
                    ))}
                  </select>
                )}

                {data.pregnancyStatus === "postnatal" && (
                  <select
                    value={data.babyAge}
                    onChange={(e) => updateData("babyAge", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border-2"
                  >
                    <option value="">Select baby age</option>
                    <option value="0-3">0–3 months</option>
                    <option value="3-6">3–6 months</option>
                    <option value="6-9">6–9 months</option>
                    <option value="9-12">9–12 months</option>
                    <option value="12+">12+ months</option>
                  </select>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in-up">
                <Input
                  placeholder="Medical conditions (optional)"
                  value={data.medicalConditions}
                  onChange={(e) => updateData("medicalConditions", e.target.value)}
                />
                <Input
                  placeholder="Medicines (optional)"
                  value={data.medicines}
                  onChange={(e) => updateData("medicines", e.target.value)}
                />
                <Input
                  placeholder="Allergies (optional)"
                  value={data.allergies}
                  onChange={(e) => updateData("allergies", e.target.value)}
                />
                <p className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                  💡 This information helps us provide safer, more personalized recommendations.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in-up">
                <select
                  value={data.sleepHours}
                  onChange={(e) => updateData("sleepHours", e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border-2"
                >
                  <option value="">Sleep hours</option>
                  <option value="less-4">Less than 4</option>
                  <option value="4-6">4–6</option>
                  <option value="6-8">6–8</option>
                  <option value="8+">8+</option>
                </select>

                <select
                  value={data.dietPreference}
                  onChange={(e) =>
                    updateData("dietPreference", e.target.value as any)
                  }
                  className="w-full h-11 px-4 rounded-xl border-2"
                >
                  <option value="">Diet preference</option>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-veg</option>
                  <option value="eggitarian">Eggitarian</option>
                </select>

                <select
                  value={data.activityLevel}
                  onChange={(e) =>
                    updateData("activityLevel", e.target.value as any)
                  }
                  className="w-full h-11 px-4 rounded-xl border-2"
                >
                  <option value="">Activity level</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                </select>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              )}
              <Button
                variant="hero"
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="flex-1"
              >
                {step === 3 ? "Complete Setup" : "Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
