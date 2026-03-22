
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { SimulationProvider } from "./context/SimulationContext.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { EmergencyOverlay } from "./components/EmergencyOverlay.jsx";
import { useSidebar } from "./hooks/useSidebar.js";
import { Sidebar, MobileMenuButton } from "./components/Sidebar.jsx";
import { Footer } from "./components/Footer.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Factories from "./pages/Factories.jsx";
import Analytics from "./pages/Analytics.jsx";
import Alarms from "./pages/Alarms.jsx";
import Settings from "./pages/Settings.jsx";

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <p className="text-slate-400 text-6xl font-bold mb-4">404</p>
        <p className="text-white text-xl font-semibold">Sayfa Bulunamadı</p>
        <p className="text-slate-400 text-sm mt-2">Bu sayfa mevcut değil.</p>
      </div>
    </div>
  );
}

function Layout() {
  const { collapsed, toggle, mobileOpen, toggleMobile, closeMobile } = useSidebar();

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        toggle={toggle}
        mobileOpen={mobileOpen}
        closeMobile={closeMobile}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
          <MobileMenuButton onClick={toggleMobile} />
          <div className="flex items-center gap-2 text-xs text-slate-500 ml-auto">
            <span className="hidden sm:inline">21 Mart 2026 · 12:00</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs">Canlı</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/factories" component={Factories} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/alarms" component={Alarms} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </main>

        <Footer />
      </div>

      <EmergencyOverlay />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SimulationProvider>
        <SettingsProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Layout />
          </WouterRouter>
          <Toaster
            theme="dark"
            richColors
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1e293b",
                border: "1px solid #334155",
                color: "#f1f5f9",
              },
            }}
          />
        </SettingsProvider>
      </SimulationProvider>
    </QueryClientProvider>
  );
}

export default App;
