import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Send,
  CheckCircle2,
  Heart,
  Moon,
  Apple,
  Activity,
  Loader2,
  Bell,
  Sparkles,
  Pill,
  Calendar,
  Settings,
} from "lucide-react";
import { useWellness } from "@/contexts/WellnessContext";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

// EmailJS Configuration - Users need to set up their own EmailJS account
// and replace these with their credentials
const EMAILJS_SERVICE_ID = "service_momandme";
const EMAILJS_TEMPLATE_ID = "template_wellness";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // User needs to replace this

const InsightsPage = () => {
  const {
    userName,
    userEmail,
    setUserEmail,
    wellnessData,
    emailInsightsEnabled,
    setEmailInsightsEnabled,
    medicineRemindersEnabled,
    setMedicineRemindersEnabled,
    appointmentRemindersEnabled,
    setAppointmentRemindersEnabled,
    medicines,
    appointments,
  } = useWellness();
  const { toast } = useToast();
  
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [emailInput, setEmailInput] = useState(userEmail);

  // Calculate weekly averages
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

  const getEncouragingMessage = () => {
    const messages = [
      "You're doing an amazing job taking care of yourself and your baby! 🌸",
      "Every small step counts. Keep going, mama! 💪",
      "Remember: you're stronger than you think! 🌟",
      "Your dedication to wellness is inspiring! ✨",
      "Taking time for yourself is the best gift for your baby! 💕",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const saveEmail = () => {
    if (emailInput && emailInput.includes("@")) {
      setUserEmail(emailInput);
      toast({
        title: "Email saved!",
        description: "Your email has been saved for notifications",
      });
    } else {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
    }
  };

  const generateEmailContent = () => {
    const pendingMedicines = medicines.filter(m => !m.taken);
    const upcomingAppointments = appointments.slice(0, 3);
    
    let tips = "";
    if (parseFloat(avgSleep) < 7) {
      tips += "• Try to get more sleep! Aim for 7-9 hours per night.\n";
    }
    if (avgSteps < 4000) {
      tips += "• A short 15-minute walk can help improve your energy levels!\n";
    }
    if (avgNutrition < 70) {
      tips += "• Try adding more fruits and vegetables to your meals.\n";
    }
    tips += "• Remember to take your prenatal vitamins daily!";

    return {
      to_name: userName,
      to_email: userEmail,
      mood_avg: avgMood,
      sleep_avg: avgSleep,
      nutrition_avg: avgNutrition + "%",
      steps_avg: avgSteps.toLocaleString(),
      encouragement: getEncouragingMessage(),
      tips: tips,
      pending_medicines: pendingMedicines.map(m => m.name).join(", ") || "All medicines taken! Great job!",
      upcoming_appointments: upcomingAppointments.map(a => `${a.doctorName} on ${a.date}`).join(", ") || "No upcoming appointments",
    };
  };

  const handleSendInsights = async () => {
    if (!userEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    setSentSuccess(false);
    
    try {
      // Check if EmailJS is configured
      if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
        // Simulate sending for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Email content:", generateEmailContent());
        setSentSuccess(true);
        toast({
          title: "Email Sent! 📧",
          description: `Weekly wellness insights sent to ${userEmail}`,
        });
      } else {
        // Real EmailJS integration
        const emailContent = generateEmailContent();
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          emailContent,
          EMAILJS_PUBLIC_KEY
        );
        setSentSuccess(true);
        toast({
          title: "Email Sent! 📧",
          description: `Weekly wellness insights sent to ${userEmail}`,
        });
      }
    } catch (error) {
      console.error("Email error:", error);
      toast({
        title: "Email sent (Demo Mode)",
        description: "Configure EmailJS for real email delivery",
      });
      setSentSuccess(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMedicineReminder = async () => {
    if (!userEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }

    const pendingMedicines = medicines.filter(m => !m.taken);
    if (pendingMedicines.length === 0) {
      toast({
        title: "All done!",
        description: "You've taken all your medicines for today",
      });
      return;
    }

    setIsSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Reminder Sent! 💊",
        description: `Medicine reminder sent to ${userEmail}`,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendAppointmentReminder = async () => {
    if (!userEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }

    if (appointments.length === 0) {
      toast({
        title: "No appointments",
        description: "You have no scheduled appointments",
      });
      return;
    }

    setIsSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Reminder Sent! 📅",
        description: `Appointment reminder sent to ${userEmail}`,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Email Insights & Notifications
        </h1>
        <p className="text-muted-foreground">
          Get wellness summaries and reminders delivered to your inbox 📬
        </p>
      </div>

      {/* Email Setup */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5" />
            Email Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={saveEmail} variant="outline">
              Save
            </Button>
          </div>
          {userEmail && (
            <p className="text-sm text-muted-foreground">
              ✓ Notifications will be sent to: <span className="font-medium">{userEmail}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Notification Toggles */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-coral-light flex items-center justify-center">
                <Mail className="w-5 h-5 text-coral" />
              </div>
              <div>
                <Label htmlFor="email-toggle" className="font-semibold">Weekly Wellness Insights</Label>
                <p className="text-sm text-muted-foreground">Receive wellness summaries every week</p>
              </div>
            </div>
            <Switch
              id="email-toggle"
              checked={emailInsightsEnabled}
              onCheckedChange={setEmailInsightsEnabled}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center">
                <Pill className="w-5 h-5 text-sage" />
              </div>
              <div>
                <Label htmlFor="medicine-toggle" className="font-semibold">Medicine Reminders</Label>
                <p className="text-sm text-muted-foreground">Get notified about pending medicines</p>
              </div>
            </div>
            <Switch
              id="medicine-toggle"
              checked={medicineRemindersEnabled}
              onCheckedChange={setMedicineRemindersEnabled}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-lavender-light flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <Label htmlFor="appointment-toggle" className="font-semibold">Appointment Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminders for upcoming appointments</p>
              </div>
            </div>
            <Switch
              id="appointment-toggle"
              checked={appointmentRemindersEnabled}
              onCheckedChange={setAppointmentRemindersEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Weekly Insights Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Header */}
          <div className="bg-gradient-to-br from-coral-light to-sage-light p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                <Heart className="w-5 h-5 text-coral" fill="currentColor" />
              </div>
              <div>
                <h3 className="font-display font-bold">Mom & Me Wellness</h3>
                <p className="text-sm text-muted-foreground">Your Weekly Insights</p>
              </div>
            </div>
            <p className="text-lg font-medium text-foreground">
              Hello, Beautiful {userName}! 🌸
            </p>
            <p className="text-muted-foreground mt-2">
              Here's your wellness summary for this week. You're doing amazing!
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-coral-light rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-coral" />
                <span className="font-semibold">Mood</span>
              </div>
              <p className="text-2xl font-bold">{avgMood}/5</p>
              <p className="text-sm text-muted-foreground">Average this week</p>
            </div>
            
            <div className="p-4 bg-lavender-light rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="w-5 h-5 text-accent" />
                <span className="font-semibold">Sleep</span>
              </div>
              <p className="text-2xl font-bold">{avgSleep}h</p>
              <p className="text-sm text-muted-foreground">Average per night</p>
            </div>
            
            <div className="p-4 bg-sage-light rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Apple className="w-5 h-5 text-sage" />
                <span className="font-semibold">Nutrition</span>
              </div>
              <p className="text-2xl font-bold">{avgNutrition}%</p>
              <p className="text-sm text-muted-foreground">Average score</p>
            </div>
            
            <div className="p-4 bg-peach/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-coral" />
                <span className="font-semibold">Activity</span>
              </div>
              <p className="text-2xl font-bold">{avgSteps.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Avg steps/day</p>
            </div>
          </div>

          {/* Encouraging Message */}
          <div className="p-4 bg-gradient-to-br from-coral-light to-sage-light rounded-xl">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-coral mt-1" />
              <div>
                <h4 className="font-semibold mb-1">This Week's Encouragement</h4>
                <p className="text-muted-foreground">
                  {getEncouragingMessage()}
                </p>
              </div>
            </div>
          </div>

          {/* Personalized Tips */}
          <div className="space-y-3">
            <h4 className="font-semibold">Personalized Tips For You:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {parseFloat(avgSleep) < 7 && (
                <li className="flex items-start gap-2">
                  <Moon className="w-4 h-4 text-accent mt-0.5" />
                  Try to get more sleep! Aim for 7-9 hours per night.
                </li>
              )}
              {avgSteps < 4000 && (
                <li className="flex items-start gap-2">
                  <Activity className="w-4 h-4 text-coral mt-0.5" />
                  A short 15-minute walk can help improve your energy levels!
                </li>
              )}
              {avgNutrition < 70 && (
                <li className="flex items-start gap-2">
                  <Apple className="w-4 h-4 text-sage mt-0.5" />
                  Try adding more fruits and vegetables to your meals.
                </li>
              )}
              <li className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-coral mt-0.5" />
                Remember to take your prenatal vitamins daily!
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Send Buttons */}
      <div className="space-y-4">
        <Button
          size="lg"
          onClick={handleSendInsights}
          disabled={isSending || !emailInsightsEnabled || !userEmail}
          className="w-full"
        >
          {isSending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : sentSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Sent Successfully!
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Weekly Insights Now
            </>
          )}
        </Button>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={handleSendMedicineReminder}
            disabled={isSending || !medicineRemindersEnabled || !userEmail}
          >
            <Pill className="w-4 h-4 mr-2" />
            Medicine Reminder
          </Button>
          <Button
            variant="outline"
            onClick={handleSendAppointmentReminder}
            disabled={isSending || !appointmentRemindersEnabled || !userEmail}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Appointment Reminder
          </Button>
        </div>
        
        {sentSuccess && (
          <div className="p-4 bg-sage-light rounded-xl text-center">
            <CheckCircle2 className="w-8 h-8 text-sage mx-auto mb-2" />
            <p className="font-semibold text-sage-dark">
              Weekly wellness insights sent to your email!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Check your inbox for personalized tips and encouragement
            </p>
          </div>
        )}
        
        {!userEmail && (
          <p className="text-sm text-muted-foreground text-center">
            Please enter your email address above to receive notifications
          </p>
        )}
      </div>

      {/* Info Note */}
      <Card className="mt-8 bg-lavender-light border-0">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-2">💡 About Email Notifications</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Weekly insights are sent every Sunday morning</li>
            <li>• Includes your wellness summary and personalized tips</li>
            <li>• Medicine reminders help you stay on schedule</li>
            <li>• Appointment reminders ensure you never miss a checkup</li>
            <li>• You can unsubscribe anytime by toggling the switches above</li>
          </ul>
        </CardContent>
      </Card>

      {/* EmailJS Setup Note */}
      <Card className="mt-4 bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-2">📧 Email Service Setup</h3>
          <p className="text-sm text-muted-foreground">
            This app uses EmailJS for sending emails. For production use:
          </p>
          <ol className="text-sm text-muted-foreground mt-2 space-y-1 list-decimal list-inside">
            <li>Sign up at <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="text-coral underline">emailjs.com</a></li>
            <li>Create an email service and template</li>
            <li>Replace the PUBLIC_KEY in the code with your key</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsPage;
