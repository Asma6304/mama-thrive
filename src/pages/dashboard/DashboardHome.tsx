import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  Moon,
  Apple,
  Activity,
  CheckCircle2,
  Pill,
  Calendar,
  Brain,
  ChevronRight,
  Sparkles,
  Bell,
  Leaf,
} from "lucide-react";
import { useWellness, AnalysisReminder } from "@/contexts/WellnessContext";
import { supabase } from "@/lib/supabase";
import babyIllustration from "@/assets/baby-illustration.png";

const DashboardHome = () => {
  const {
    userName: contextUserName,
    checklist,
    toggleChecklistItem,
    wellnessData,
    analysisReminders,
    toggleReminderComplete,
  } = useWellness();

  // ✅ ONLY override name
  const [userName, setUserName] = useState(contextUserName);

  useEffect(() => {
    const loadName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("user_profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      if (data?.name) {
        setUserName(data.name);
      }
    };

    loadName();
  }, []);

  const completedCount = checklist.filter(item => item.completed).length;
  const progressPercentage = (completedCount / checklist.length) * 100;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const latestMood = wellnessData.mood[wellnessData.mood.length - 1];
  const latestSleep = wellnessData.sleep[wellnessData.sleep.length - 1];
  const latestActivity = wellnessData.activity[wellnessData.activity.length - 1];

  const quickStats = [
    { label: "Mood", value: latestMood?.emoji || "😊", color: "coral" },
    { label: "Sleep", value: `${latestSleep?.hours || 0} hrs`, color: "lavender" },
    { label: "Tasks Done", value: `${completedCount}/${checklist.length}`, color: "sage" },
    { label: "Steps", value: (latestActivity?.steps || 0).toLocaleString(), color: "peach" },
  ];

  const iconMap: Record<string, React.ReactNode> = {
    health: <Heart className="w-4 h-4" />,
    baby: <Heart className="w-4 h-4" />,
    self: <Sparkles className="w-4 h-4" />,
    exercise: <Activity className="w-4 h-4" />,
  };

  const getReminderIcon = (type: AnalysisReminder["type"]) => {
    switch (type) {
      case "followup": return Calendar;
      case "medicine": return Pill;
      case "lifestyle": return Leaf;
      default: return Bell;
    }
  };

  const pendingReminders = analysisReminders.filter(r => !r.completed).slice(0, 3);

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Welcome Section */}
      <section className="mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 bg-gradient-to-br from-coral-light to-sage-light p-6 rounded-3xl">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
              {greeting()}, {userName}! 🌸
            </h1>
            <p className="text-muted-foreground">
              You're doing amazing! Let's make today count.
            </p>
          </div>
          <div className="relative">
            <img
              src={babyIllustration}
              alt="Baby illustration"
              className="w-32 h-32 object-contain animate-float"
            />
          </div>
        </div>
      </section>

      {/* 🔥 EVERYTHING BELOW IS 100% YOUR ORIGINAL UI 🔥 */}

      {/* Quick Stats */}
      <section className="mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card
              key={index}
              variant={stat.color === "coral" ? "coral" : stat.color === "sage" ? "sage" : stat.color === "lavender" ? "lavender" : "default"}
              className="p-4"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {stat.label}
              </p>
              <p className="font-semibold text-lg text-foreground">
                {stat.value}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Daily Checklist */}
      <section className="mb-8">
        <Card variant="elevated">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Today's Checklist</CardTitle>
              <span className="text-sm font-medium text-coral">
                {completedCount}/{checklist.length} done
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-3">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                  item.completed ? "bg-sage-light" : "bg-muted hover:bg-muted/80"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  item.completed ? "bg-sage-dark text-background" : "border-2 border-muted-foreground"
                }`}>
                  {item.completed && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div className="flex items-center gap-2">
                  {iconMap[item.category]}
                  <span className={item.completed ? "line-through opacity-70" : ""}>
                    {item.label}
                  </span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Report Reminders */}
      {pendingReminders.length > 0 && (
        <section className="mb-8">
          <Card className="bg-gradient-to-br from-lavender-light to-background border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-lavender-dark" />
                  <CardTitle className="text-lg">From Your Reports</CardTitle>
                </div>
                <Link to="/dashboard/ai-analysis" className="text-sm text-coral hover:underline">
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingReminders.map((reminder) => {
                const Icon = getReminderIcon(reminder.type);
                return (
                  <button
                    key={reminder.id}
                    onClick={() => toggleReminderComplete(reminder.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-background hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      reminder.type === "followup" ? "bg-lavender-light text-lavender-dark" :
                      reminder.type === "medicine" ? "bg-coral-light text-coral-dark" :
                      "bg-sage-light text-sage-dark"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{reminder.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{reminder.description}</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground flex-shrink-0" />
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Quick Actions */}
      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: <Activity className="w-6 h-6" />, label: "Log Exercise", color: "coral", path: "/dashboard/exercise" },
            { icon: <Moon className="w-6 h-6" />, label: "Track Sleep", color: "lavender", path: "/dashboard/graphs" },
            { icon: <Apple className="w-6 h-6" />, label: "Log Meal", color: "sage", path: "/dashboard/graphs" },
            { icon: <Pill className="w-6 h-6" />, label: "Add Medicine", color: "peach", path: "/dashboard/medicines" },
            { icon: <Calendar className="w-6 h-6" />, label: "Book Appointment", color: "coral", path: "/dashboard/appointments" },
            { icon: <Brain className="w-6 h-6" />, label: "AI Analysis", color: "sage", path: "/dashboard/ai-analysis" },
          ].map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                action.color === "coral"
                  ? "bg-coral-light text-coral-dark"
                  : action.color === "sage"
                  ? "bg-sage-light text-sage-dark"
                  : action.color === "lavender"
                  ? "bg-lavender-light text-accent-foreground"
                  : "bg-peach/30 text-foreground"
              }`}
            >
              {action.icon}
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Insights Card */}
      <section className="mt-8">
        <Link to="/dashboard/insights">
          <Card className="bg-gradient-to-br from-coral-light to-sage-light border-0 hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-coral" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    Daily Insight
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    You've been consistent with your water intake this week!
                    Keep it up - staying hydrated helps both you and baby. 💧
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>
    </div>
  );
};

export default DashboardHome;
