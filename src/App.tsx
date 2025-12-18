import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WellnessProvider } from "@/contexts/WellnessContext";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ExercisePage from "./pages/dashboard/ExercisePage";
import MedicinesPage from "./pages/dashboard/MedicinesPage";
import AppointmentsPage from "./pages/dashboard/AppointmentsPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import AIAnalysisPage from "./pages/dashboard/AIAnalysisPage";
import GraphsPage from "./pages/dashboard/GraphsPage";
import InsightsPage from "./pages/dashboard/InsightsPage";
import DietPage from "./pages/dashboard/DietPage";
import ProductsPage from "./pages/dashboard/ProductsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WellnessProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="exercise" element={<ExercisePage />} />
              <Route path="diet" element={<DietPage />} />
              <Route path="medicines" element={<MedicinesPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="ai-analysis" element={<AIAnalysisPage />} />
              <Route path="graphs" element={<GraphsPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="insights" element={<InsightsPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WellnessProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
