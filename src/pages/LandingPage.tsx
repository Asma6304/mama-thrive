import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Shield, Bell, Calendar, FileText, Brain, Languages, Menu, X } from "lucide-react";
import { useState } from "react";
import heroImage from "@/assets/hero-mother-baby.png";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Daily Wellness Tracking",
      description: "Track mood, sleep, nutrition, and activity with simple, intuitive checklists designed for busy moms.",
      color: "coral",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Personalized Exercises",
      description: "Safe, stage-specific exercises for pregnancy and postnatal recovery, curated by experts.",
      color: "sage",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Medicine Reminders",
      description: "Never miss a dose with gentle, timely reminders for all your medications and supplements.",
      color: "lavender",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Appointment Scheduler",
      description: "Keep track of all doctor visits with integrated calendar and smart reminders.",
      color: "peach",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Medical Reports Storage",
      description: "Safely store and organize all your medical reports in one secure place.",
      color: "sage",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Report Analysis",
      description: "Get simple, easy-to-understand explanations of your medical reports powered by AI.",
      color: "coral",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      quote: "Finally, an app that understands Indian motherhood! The dadi-nani advice mixed with modern medicine was driving me crazy. This app gave me clarity.",
      avatar: "P",
    },
    {
      name: "Fatima Khan",
      location: "Hyderabad",
      quote: "As a first-time mom, I was overwhelmed. The daily checklist keeps me on track without feeling like a burden. Love the calm design!",
      avatar: "F",
    },
    {
      name: "Lakshmi Nair",
      location: "Chennai",
      quote: "The AI report analysis is a game-changer. I finally understand what my blood reports mean without panicking.",
      avatar: "L",
    },
  ];

  const whyIndianMoms = [
    {
      title: "Caught Between Generations",
      description: "Your dadi says one thing, Google says another, and your doctor says something else entirely. We bring trusted, verified guidance that respects tradition while embracing modern healthcare.",
    },
    {
      title: "Sleep-Deprived & Overwhelmed",
      description: "Night feeds, crying babies, and no one to help at 3 AM. Our app is your gentle companion, offering support and guidance whenever you need it.",
    },
    {
      title: "No Time for Self-Care",
      description: "Indian moms always put family first. We help you remember that a healthy mom means a healthy baby. Simple, quick wellness tracking that fits your busy life.",
    },
    {
      title: "Medical Anxiety",
      description: "Confusing medical reports and scary terminology. Our AI explains everything in simple language, so you can focus on what matters - your family.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-sage flex items-center justify-center">
                <Heart className="w-5 h-5 text-background" fill="currentColor" />
              </div>
              <span className="font-display text-xl font-semibold text-foreground">
                Mom & Me
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How it Works
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="sm">Sign Up</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50 animate-fade-in-up">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How it Works
                </a>
                <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                  Testimonials
                </a>
                <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
                <div className="flex gap-3 pt-4 border-t border-border/50">
                  <Link to="/auth" className="flex-1">
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/auth?mode=signup" className="flex-1">
                    <Button variant="hero" className="w-full">Sign Up</Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-coral/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-sage/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-light rounded-full text-sage-dark text-sm font-medium mb-6 animate-fade-in-up">
                <Sparkles className="w-4 h-4" />
                Your Wellness Journey Starts Here
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in-up delay-100">
                Wellness for{" "}
                <span className="text-gradient">Every Mom</span>,{" "}
                <span className="text-gradient">Every Baby</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-200">
                A gentle, supportive companion for Indian mothers - from pregnancy through 
                postnatal care. Track wellness, get personalized guidance, and never feel alone 
                in your motherhood journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
                <Link to="/auth?mode=signup">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    Start Your Wellness Journey
                  </Button>
                </Link>
                <Link to="/auth?mode=signup&type=pregnant">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    For Pregnant Moms
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start animate-fade-in-up delay-400">
                <div className="flex -space-x-3">
                  {["P", "F", "L", "A"].map((letter, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-sage flex items-center justify-center text-background font-semibold text-sm border-2 border-background"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">10,000+</span> happy moms
                </p>
              </div>
            </div>

            <div className="relative animate-fade-in-up delay-200">
              <div className="relative rounded-3xl overflow-hidden shadow-glow">
                <img
                  src={heroImage}
                  alt="Mother and baby wellness"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
              
              {/* Floating cards */}
              <div className="absolute -left-4 top-1/4 bg-card p-4 rounded-2xl shadow-medium animate-float hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center">
                    <Shield className="w-5 h-5 text-sage-dark" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Safe & Trusted</p>
                    <p className="text-xs text-muted-foreground">Expert-verified content</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-4 bottom-1/4 bg-card p-4 rounded-2xl shadow-medium animate-float-slow hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-coral-light flex items-center justify-center">
                    <Heart className="w-5 h-5 text-coral-dark" fill="currentColor" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Made for You</p>
                    <p className="text-xs text-muted-foreground">Personalized care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Indian Moms Section */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Indian Moms Need This
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We understand the unique challenges of Indian motherhood - the cultural expectations, 
              the family advice, and the overwhelming information overload.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {whyIndianMoms.map((item, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete wellness toolkit designed specifically for the journey of motherhood.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl transition-all duration-300 hover:shadow-medium animate-fade-in-up ${
                  feature.color === "coral" ? "bg-coral-light" :
                  feature.color === "sage" ? "bg-sage-light" :
                  feature.color === "lavender" ? "bg-lavender-light" :
                  "bg-peach/30"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  feature.color === "coral" ? "bg-coral text-background" :
                  feature.color === "sage" ? "bg-sage-dark text-background" :
                  feature.color === "lavender" ? "bg-accent text-accent-foreground" :
                  "bg-gold text-background"
                }`}>
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-br from-sage-light to-lavender-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting started is simple - just three easy steps to begin your wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Profile",
                description: "Sign up and tell us about yourself - your pregnancy stage, health conditions, and lifestyle preferences.",
              },
              {
                step: "2",
                title: "Get Personalized Plan",
                description: "Based on your profile, we create a customized wellness plan with daily checklists and recommendations.",
              },
              {
                step: "3",
                title: "Track & Thrive",
                description: "Use the daily tracker, get insights, and watch yourself grow stronger and healthier every day.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-coral to-sage text-background font-display text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-medium">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Moms Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real stories from real moms who found their wellness companion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coral to-sage flex items-center justify-center text-background font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-coral-light to-sage-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of Indian moms who are taking control of their wellness. 
            Your healthier, happier self is just one click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="xl">
                Start Free Today
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="xl">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-muted-foreground mb-8">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Languages className="w-5 h-5" />
              <span>Available in English. Hindi, Telugu, Tamil coming soon!</span>
            </div>
            <div className="mt-6">
              <a href="mailto:hello@momandme.wellness" className="text-coral hover:text-coral-dark transition-colors font-semibold">
                hello@momandme.wellness
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center">
                <Heart className="w-4 h-4 text-background" fill="currentColor" />
              </div>
              <span className="font-display font-semibold">Mom & Me Wellness</span>
            </div>
            <p className="text-sm text-background/70">
              © 2024 Mom & Me Wellness. Made with 💕 for Indian moms.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
