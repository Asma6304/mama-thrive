import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  Activity,
  Pill,
  Calendar,
  FileText,
  Brain,
  LogOut,
  Menu,
  X,
  Mail,
  BarChart3,
  Apple,
  ShoppingBag,
} from "lucide-react";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    { icon: <Heart className="w-5 h-5" />, label: "Dashboard", path: "/dashboard" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Wellness Graphs", path: "/dashboard/graphs" },
    { icon: <Activity className="w-5 h-5" />, label: "Exercise", path: "/dashboard/exercise" },
    { icon: <Apple className="w-5 h-5" />, label: "Diet & Nutrition", path: "/dashboard/diet" },
    { icon: <Pill className="w-5 h-5" />, label: "Medicines", path: "/dashboard/medicines" },
    { icon: <Calendar className="w-5 h-5" />, label: "Appointments", path: "/dashboard/appointments" },
    { icon: <FileText className="w-5 h-5" />, label: "Medical Reports", path: "/dashboard/reports" },
    { icon: <Brain className="w-5 h-5" />, label: "AI Analysis", path: "/dashboard/ai-analysis" },
    { icon: <ShoppingBag className="w-5 h-5" />, label: "Products", path: "/dashboard/products" },
    { icon: <Mail className="w-5 h-5" />, label: "Email Insights", path: "/dashboard/insights" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-4 h-16">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral to-sage flex items-center justify-center">
              <Heart className="w-4 h-4 text-background" fill="currentColor" />
            </div>
            <span className="font-display font-semibold">Mom & Me</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-sage flex items-center justify-center text-background font-semibold text-sm">
            A
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/50 z-50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-card border-r border-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-sage flex items-center justify-center">
                <Heart className="w-5 h-5 text-background" fill="currentColor" />
              </div>
              <span className="font-display text-lg font-semibold">Mom & Me</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive(item.path)
                    ? "bg-coral-light text-coral-dark font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-20 lg:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
