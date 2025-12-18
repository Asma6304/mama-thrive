import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Heart,
  Moon,
  Apple,
  Activity,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useWellness } from "@/contexts/WellnessContext";
import { useToast } from "@/hooks/use-toast";

const GraphsPage = () => {
  const { wellnessData, logMood, logSleep, logNutrition, logActivity } = useWellness();
  const { toast } = useToast();
  
  const [logType, setLogType] = useState<"mood" | "sleep" | "nutrition" | "activity" | null>(null);
  const [tempValue, setTempValue] = useState(50);

  const moodEmojis = ["😢", "😕", "😐", "🙂", "😊"];

  const handleLog = () => {
    switch (logType) {
      case "mood":
        const moodIdx = Math.min(4, Math.floor(tempValue / 20));
        logMood(moodIdx + 1, moodEmojis[moodIdx]);
        toast({ title: "Mood logged!", description: `You're feeling ${moodEmojis[moodIdx]}` });
        break;
      case "sleep":
        logSleep(Math.round(tempValue / 10 * 10) / 10);
        toast({ title: "Sleep logged!", description: `${Math.round(tempValue / 10 * 10) / 10} hours recorded` });
        break;
      case "nutrition":
        logNutrition(tempValue);
        toast({ title: "Nutrition logged!", description: `Score: ${tempValue}/100` });
        break;
      case "activity":
        const steps = Math.round(tempValue * 100);
        logActivity(steps);
        toast({ title: "Activity logged!", description: `${steps.toLocaleString()} steps recorded` });
        break;
    }
    setLogType(null);
    setTempValue(50);
  };

  // Transform data for charts
  const moodChartData = wellnessData.mood.map(d => ({
    date: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
    value: d.value,
    emoji: d.emoji,
  }));

  const sleepChartData = wellnessData.sleep.map(d => ({
    date: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
    hours: d.hours,
  }));

  const nutritionChartData = wellnessData.nutrition.map(d => ({
    date: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
    score: d.score,
  }));

  const activityChartData = wellnessData.activity.map(d => ({
    date: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
    steps: d.steps,
  }));

  const avgMood = wellnessData.mood.length > 0
    ? (wellnessData.mood.reduce((sum, m) => sum + m.value, 0) / wellnessData.mood.length).toFixed(1)
    : "0";
  const avgSleep = wellnessData.sleep.length > 0
    ? (wellnessData.sleep.reduce((sum, s) => sum + s.hours, 0) / wellnessData.sleep.length).toFixed(1)
    : "0";
  const avgNutrition = wellnessData.nutrition.length > 0
    ? Math.round(wellnessData.nutrition.reduce((sum, n) => sum + n.score, 0) / wellnessData.nutrition.length)
    : 0;
  const avgSteps = wellnessData.activity.length > 0
    ? Math.round(wellnessData.activity.reduce((sum, a) => sum + a.steps, 0) / wellnessData.activity.length)
    : 0;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Wellness Tracking
        </h1>
        <p className="text-muted-foreground">
          Track your mood, sleep, nutrition, and activity over time 📊
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card variant="coral" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Avg Mood</p>
              <p className="font-semibold text-lg">{avgMood}/5</p>
            </div>
            <Heart className="w-8 h-8 text-coral" />
          </div>
        </Card>
        <Card variant="lavender" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Avg Sleep</p>
              <p className="font-semibold text-lg">{avgSleep}h</p>
            </div>
            <Moon className="w-8 h-8 text-accent" />
          </div>
        </Card>
        <Card variant="sage" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Nutrition</p>
              <p className="font-semibold text-lg">{avgNutrition}%</p>
            </div>
            <Apple className="w-8 h-8 text-sage" />
          </div>
        </Card>
        <Card className="p-4 bg-peach/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Avg Steps</p>
              <p className="font-semibold text-lg">{avgSteps.toLocaleString()}</p>
            </div>
            <Activity className="w-8 h-8 text-coral" />
          </div>
        </Card>
      </div>

      {/* Log Buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Dialog open={logType !== null} onOpenChange={(open) => !open && setLogType(null)}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => { setLogType("mood"); setTempValue(60); }}>
              <Heart className="w-4 h-4 mr-2" />
              Log Mood
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => { setLogType("sleep"); setTempValue(70); }}>
              <Moon className="w-4 h-4 mr-2" />
              Log Sleep
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => { setLogType("nutrition"); setTempValue(75); }}>
              <Apple className="w-4 h-4 mr-2" />
              Log Nutrition
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => { setLogType("activity"); setTempValue(30); }}>
              <Activity className="w-4 h-4 mr-2" />
              Log Activity
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {logType === "mood" && "How are you feeling?"}
                {logType === "sleep" && "How many hours did you sleep?"}
                {logType === "nutrition" && "Rate your nutrition today"}
                {logType === "activity" && "How many steps today?"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {logType === "mood" && (
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {moodEmojis[Math.min(4, Math.floor(tempValue / 20))]}
                  </div>
                  <Slider
                    value={[tempValue]}
                    onValueChange={(v) => setTempValue(v[0])}
                    max={100}
                    step={1}
                    className="mb-4"
                  />
                  <p className="text-sm text-muted-foreground">
                    Slide to select your mood
                  </p>
                </div>
              )}
              {logType === "sleep" && (
                <div className="text-center">
                  <div className="text-4xl font-bold mb-4">
                    {(tempValue / 10).toFixed(1)} hours
                  </div>
                  <Slider
                    value={[tempValue]}
                    onValueChange={(v) => setTempValue(v[0])}
                    max={120}
                    step={5}
                    className="mb-4"
                  />
                  <p className="text-sm text-muted-foreground">
                    Recommended: 7-9 hours
                  </p>
                </div>
              )}
              {logType === "nutrition" && (
                <div className="text-center">
                  <div className="text-4xl font-bold mb-4">
                    {tempValue}%
                  </div>
                  <Slider
                    value={[tempValue]}
                    onValueChange={(v) => setTempValue(v[0])}
                    max={100}
                    step={5}
                    className="mb-4"
                  />
                  <p className="text-sm text-muted-foreground">
                    Rate how well you ate today
                  </p>
                </div>
              )}
              {logType === "activity" && (
                <div className="text-center">
                  <div className="text-4xl font-bold mb-4">
                    {(tempValue * 100).toLocaleString()} steps
                  </div>
                  <Slider
                    value={[tempValue]}
                    onValueChange={(v) => setTempValue(v[0])}
                    max={100}
                    step={1}
                    className="mb-4"
                  />
                  <p className="text-sm text-muted-foreground">
                    Goal: 5,000+ steps daily
                  </p>
                </div>
              )}
              <Button onClick={handleLog} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mood Chart */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-coral" />
              Mood Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis domain={[0, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--coral))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--coral))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Chart */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Moon className="w-5 h-5 text-accent" />
              Sleep Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis domain={[0, 12]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Bar
                    dataKey="hours"
                    fill="hsl(var(--accent))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Chart */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Apple className="w-5 h-5 text-sage" />
              Nutrition Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={nutritionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--sage))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--sage))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity Chart */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-coral" />
              Daily Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Bar
                    dataKey="steps"
                    fill="hsl(var(--coral))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="mt-8 bg-gradient-to-br from-coral-light to-sage-light border-0">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-coral" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-1">
                Weekly Summary
              </h3>
              <p className="text-muted-foreground text-sm">
                Your average sleep this week is {avgSleep} hours. Try to get at least 7 hours for 
                optimal health during pregnancy. Your mood has been mostly positive - keep up the great work! 🌟
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraphsPage;
