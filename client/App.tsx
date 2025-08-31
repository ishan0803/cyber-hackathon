import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Overview from "./pages/Overview";
import Graph from "./pages/Graph";
import Heatmap from "./pages/Heatmap";
import TopK from "./pages/TopK";
import Alerts from "./pages/Alerts";
import Audit from "./pages/Audit";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Campaigns from "./pages/Campaigns";
import Classifier from "./pages/Classifier";
import Normalizer from "./pages/Normalizer";
import Login from "./pages/Login";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const queryClient = new QueryClient();

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return element;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={<ProtectedRoute element={<Overview />} />}
            />
            <Route
              path="/graph"
              element={<ProtectedRoute element={<Graph />} />}
            />
            <Route
              path="/heatmap"
              element={<ProtectedRoute element={<Heatmap />} />}
            />
            <Route
              path="/topk"
              element={<ProtectedRoute element={<TopK />} />}
            />
            <Route
              path="/alerts"
              element={<ProtectedRoute element={<Alerts />} />}
            />
            <Route
              path="/audit"
              element={<ProtectedRoute element={<Audit />} />}
            />
            <Route
              path="/campaigns"
              element={<ProtectedRoute element={<Campaigns />} />}
            />
            <Route
              path="/classifier"
              element={<ProtectedRoute element={<Classifier />} />}
            />
            <Route
              path="/normalizer"
              element={<ProtectedRoute element={<Normalizer />} />}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute element={<Settings />} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

if (!document.documentElement.classList.contains("dark")) {
  document.documentElement.classList.add("dark");
}
createRoot(document.getElementById("root")!).render(<App />);
