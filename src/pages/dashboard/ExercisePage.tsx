import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Play, Clock, Flame, Star, ExternalLink, Video, AlertTriangle } from "lucide-react";
import { useWellness } from "@/contexts/WellnessContext";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: string;
  name: string;
  duration: string;
  calories: string;
  difficulty: "Easy" | "Medium";
  description: string;
  benefits: string[];
  completed: boolean;
  trimester: string[];
  videoUrl: string;
  videoTitle: string;
  safetyNotes: string[];
}

const pregnancyExercises: Exercise[] = [
  {
    id: "1",
    name: "Prenatal Yoga",
    duration: "20 mins",
    calories: "80 cal",
    difficulty: "Easy",
    description: "Gentle yoga poses designed for pregnancy. Focus on breathing, relaxation, and maintaining flexibility.",
    benefits: ["Reduces stress & anxiety", "Improves flexibility", "Better sleep quality", "Prepares body for labor"],
    completed: false,
    trimester: ["First", "Second", "Third"],
    videoUrl: "https://youtu.be/-3bvlFKeLRE?si=tFLsfJEh62_aEH6P",
    videoTitle: "Prenatal Yoga for All Trimesters",
    safetyNotes: ["Avoid deep twists", "Don't lie flat on back after 20 weeks", "Use props for support"],
  },
  {
    id: "2",
    name: "Gentle Walking",
    duration: "15-30 mins",
    calories: "60-120 cal",
    difficulty: "Easy",
    description: "Light walking at a comfortable pace. The safest and most recommended exercise throughout pregnancy.",
    benefits: ["Boosts energy levels", "Improves circulation", "Low impact on joints", "Reduces swelling"],
    completed: false,
    trimester: ["First", "Second", "Third"],
    videoUrl: "https://youtu.be/gtjEhdhJ7Bc?si=HJ_-A6Nq075qEnxD",
    videoTitle: "Pregnancy Walking Tips",
    safetyNotes: ["Wear comfortable shoes", "Stay hydrated", "Walk on flat surfaces", "Stop if you feel dizzy"],
  },
  {
    id: "3",
    name: "Pelvic Floor Exercises (Kegels)",
    duration: "10 mins",
    calories: "20 cal",
    difficulty: "Easy",
    description: "Strengthen pelvic floor muscles for easier delivery and faster recovery. Can be done anywhere, anytime!",
    benefits: ["Prepares for delivery", "Prevents incontinence", "Faster postpartum recovery", "Supports growing uterus"],
    completed: false,
    trimester: ["First", "Second", "Third"],
    videoUrl: "https://youtu.be/rlHwhBj7pv4?si=tcmDjjf1LKZxMHx3",
    videoTitle: "Kegel Exercises for Pregnancy",
    safetyNotes: ["Don't hold breath", "Empty bladder before exercising", "Start slow and build up"],
  },
  {
    id: "4",
    name: "Prenatal Stretching",
    duration: "15 mins",
    calories: "40 cal",
    difficulty: "Easy",
    description: "Gentle upper and lower body stretches to relieve tension, improve posture, and reduce pregnancy aches.",
    benefits: ["Relieves back tension", "Better posture", "Reduces body aches", "Increases flexibility"],
    completed: false,
    trimester: ["First", "Second", "Third"],
    videoUrl: "https://youtu.be/BpkYg2EclBA?si=KT-4Oxmak2LYahBR",
    videoTitle: "Full Body Pregnancy Stretch",
    safetyNotes: ["Don't bounce while stretching", "Breathe through stretches", "Never stretch to pain"],
  },
  {
    id: "5",
    name: "Swimming/Water Aerobics",
    duration: "30 mins",
    calories: "150 cal",
    difficulty: "Medium",
    description: "Low-impact full body workout. Water supports your belly weight and keeps you cool.",
    benefits: ["Full body workout", "No joint stress", "Cooling effect", "Reduces swelling"],
    completed: false,
    trimester: ["Second", "Third"],
    videoUrl: "https://youtu.be/8RSb8nq8Skg?si=LVcp8VjCl9Wt9ETT",
    videoTitle: "Swimming During Pregnancy Guide",
    safetyNotes: ["Avoid diving", "Watch for slippery surfaces", "Stay in shallow areas", "Avoid hot tubs"],
  },
  {
    id: "6",
    name: "Prenatal Pilates",
    duration: "25 mins",
    calories: "100 cal",
    difficulty: "Medium",
    description: "Core-strengthening exercises modified for pregnancy. Helps with posture and prepares for labor.",
    benefits: ["Core strength", "Better balance", "Labor preparation", "Improves posture"],
    completed: false,
    trimester: ["First", "Second"],
    videoUrl: "https://youtu.be/26NPMmROB2Q?si=noblofCAEd8hfcFB",
    videoTitle: "Safe Prenatal Pilates Workout",
    safetyNotes: ["Modify for your trimester", "Avoid exercises lying flat", "Use modifications shown"],
  },
  {
    id: "7",
    name: "Squats (Pregnancy Safe)",
    duration: "10 mins",
    calories: "60 cal",
    difficulty: "Medium",
    description: "Modified squats to strengthen legs and prepare for labor. Use a chair for support if needed.",
    benefits: ["Strengthens legs", "Opens pelvis", "Prepares for labor", "Builds endurance"],
    completed: false,
    trimester: ["First", "Second", "Third"],
    videoUrl: "https://youtu.be/UMHwi7TXqDA?si=sOy0QlY7mIsDO8ej",
    videoTitle: "Pregnancy Safe Squats Tutorial",
    safetyNotes: ["Hold onto support if needed", "Don't go too deep", "Keep knees over toes"],
  },
  {
    id: "8",
    name: "Breathing Exercises",
    duration: "10 mins",
    calories: "10 cal",
    difficulty: "Easy",
    description: "Deep breathing and relaxation techniques to reduce stress and prepare for labor breathing.",
    benefits: ["Reduces anxiety", "Better oxygen flow to baby", "Labor preparation", "Improves sleep"],
    completed: false,
    trimester: ["First", "Second", "Third"],
    videoUrl: "https://youtu.be/7Ep5mKuRmAA?si=Jq9Sr-tEx77YsA4N",
    videoTitle: "Pregnancy Breathing Techniques",
    safetyNotes: ["Find comfortable position", "Don't hyperventilate", "Practice regularly"],
  },
];

const postnatalExercises: Exercise[] = [
  {
    id: "p1",
    name: "Gentle Postnatal Yoga",
    duration: "20 mins",
    calories: "70 cal",
    difficulty: "Easy",
    description: "Gentle yoga designed for new mothers. Helps restore strength and promotes relaxation.",
    benefits: ["Gentle recovery", "Stress relief", "Reconnects with body", "Can include baby"],
    completed: false,
    trimester: [],
    videoUrl: "https://youtu.be/ERAvgQyYlc4?si=a4vFoUOXS6nNiRcR",
    videoTitle: "Postnatal Yoga for New Moms",
    safetyNotes: ["Start 6-8 weeks postpartum", "Get doctor's clearance first", "Listen to your body"],
  },
  {
    id: "p2",
    name: "Postnatal Pelvic Floor Recovery",
    duration: "10 mins",
    calories: "15 cal",
    difficulty: "Easy",
    description: "Essential exercises to heal and strengthen pelvic floor after delivery.",
    benefits: ["Heals pelvic floor", "Prevents incontinence", "Core reconnection", "Essential recovery"],
    completed: false,
    trimester: [],
    videoUrl: "https://youtu.be/-hSZqmuN41E?si=DDO-gw-uSQn8he7k",
    videoTitle: "Pelvic Floor Recovery After Birth",
    safetyNotes: ["Can start within days of birth", "Go gentle", "Consistency is key"],
  },
  {
    id: "p3",
    name: "Baby & Me Exercises",
    duration: "15 mins",
    calories: "50 cal",
    difficulty: "Easy",
    description: "Fun exercises you can do with your baby! Bond while getting fit together.",
    benefits: ["Bonding time", "No childcare needed", "Fun for both", "Builds strength"],
    completed: false,
    trimester: [],
    videoUrl: "https://youtu.be/IPDmGhbXGYY?si=t4PPbt-GpQCaRaC3",
    videoTitle: "Workout With Your Baby",
    safetyNotes: ["Support baby's head", "Make sure baby is fed", "Stop if baby is fussy"],
  },
  {
    id: "p4",
    name: "Diastasis Recti Safe Exercises",
    duration: "15 mins",
    calories: "40 cal",
    difficulty: "Easy",
    description: "Safe core exercises that help heal abdominal separation (diastasis recti) after pregnancy.",
    benefits: ["Heals ab separation", "Core recovery", "Back pain relief", "Flat tummy journey"],
    completed: false,
    trimester: [],
    videoUrl: "https://youtu.be/u4z7sBiGFA8?si=jjsUucsF20ms3bwj",
    videoTitle: "Diastasis Recti Safe Workout",
    safetyNotes: ["Check for separation first", "Avoid crunches", "Focus on breathing"],
  },
];

const ExercisePage = () => {
  const { pregnancyStage, addChecklistItem } = useWellness();
  const { toast } = useToast();
  const isPostnatal = pregnancyStage.toLowerCase().includes("postnatal");
  
  const [exercises, setExercises] = useState<Exercise[]>(
    isPostnatal ? postnatalExercises : pregnancyExercises
  );

  const toggleExercise = (id: string) => {
    setExercises(prev =>
      prev.map(ex => {
        if (ex.id === id) {
          const newCompleted = !ex.completed;
          if (newCompleted) {
            addChecklistItem({
              label: `Completed ${ex.name}`,
              completed: true,
              category: "exercise"
            });
            toast({
              title: "Great job! 🎉",
              description: `You completed ${ex.name}. Keep up the good work!`,
            });
          }
          return { ...ex, completed: newCompleted };
        }
        return ex;
      })
    );
  };

  const openVideo = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const completedCount = exercises.filter(ex => ex.completed).length;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Exercise Recommendations
        </h1>
        <p className="text-muted-foreground">
          Safe exercises for your {pregnancyStage}. Always listen to your body! 🧘‍♀️
        </p>
      </div>

      {/* Progress Summary */}
      <Card className="mb-8 bg-gradient-to-br from-coral-light to-sage-light border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Progress</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {completedCount} of {exercises.length} completed
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-background/80 flex items-center justify-center">
              <Flame className="w-8 h-8 text-coral" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {exercises.map((exercise) => (
          <Card
            key={exercise.id}
            variant="elevated"
            className={`transition-all duration-300 ${
              exercise.completed ? "ring-2 ring-sage" : ""
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {exercise.name}
                    {exercise.completed && (
                      <CheckCircle2 className="w-5 h-5 text-sage" />
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {exercise.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      {exercise.calories}
                    </span>
                    <Badge variant="outline" className={`text-xs ${
                      exercise.difficulty === "Easy"
                        ? "bg-sage-light text-sage-dark border-sage"
                        : "bg-coral-light text-coral-dark border-coral"
                    }`}>
                      {exercise.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {exercise.description}
              </p>
              
              {/* Benefits */}
              <div className="flex flex-wrap gap-2">
                {exercise.benefits.map((benefit, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full"
                  >
                    <Star className="w-3 h-3 text-coral" />
                    {benefit}
                  </span>
                ))}
              </div>

              {/* Safety Notes */}
              <div className="p-3 bg-lavender-light rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Safety Notes</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {exercise.safetyNotes.map((note, idx) => (
                    <li key={idx}>• {note}</li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openVideo(exercise.videoUrl)}
                  className="flex-1"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Watch Video
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
                <Button
                  variant={exercise.completed ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleExercise(exercise.id)}
                  className="flex-1"
                >
                  {exercise.completed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Done
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Complete
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Safety Tips Card */}
      <Card className="mt-8 bg-lavender-light border-0">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-3">💡 General Safety Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• <strong>Always warm up</strong> before exercising and cool down after</li>
            <li>• <strong>Stay hydrated</strong> - drink water before, during, and after exercise</li>
            <li>• <strong>Stop immediately</strong> if you feel dizzy, short of breath, or have any pain</li>
            <li>• <strong>Consult your doctor</strong> before starting any new exercise routine</li>
            <li>• <strong>Avoid lying flat on your back</strong> after the first trimester</li>
            <li>• <strong>Wear comfortable, breathable clothing</strong> and supportive shoes</li>
            <li>• <strong>Exercise in a cool environment</strong> to avoid overheating</li>
          </ul>
        </CardContent>
      </Card>

      {/* When to Stop */}
      <Card className="mt-4 bg-coral-light/50 border-0">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-3">🚨 Stop Exercising & Contact Doctor If:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Vaginal bleeding or fluid leakage</li>
            <li>• Dizziness or feeling faint</li>
            <li>• Chest pain or rapid heartbeat</li>
            <li>• Severe headache</li>
            <li>• Calf pain or swelling</li>
            <li>• Contractions or abdominal pain</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExercisePage;
