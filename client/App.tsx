import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/graph" element={<Placeholder title="Graph Explorer" description="Interactive force-directed graph with filters, node inspector, and worker-based layout. Ask to materialize this page to proceed." />} />
            <Route path="/heatmap" element={<Placeholder title="India Heatmap" description="Choropleth with drill-down, time scrubber, and tooltips. Ask to materialize this page to proceed." />} />
            <Route path="/topk" element={<Placeholder title="Top-K Panels" description="Accounts, Hashtags, and Posts tables with search, sort, pagination, and export. Ask to materialize this page to proceed." />} />
            <Route path="/alerts" element={<Placeholder title="Alerts" description="Configurable thresholds and alert details. Ask to materialize this page to proceed." />} />
            <Route path="/audit" element={<Placeholder title="Audit & Blockchain" description="Ledger visualization and verification. Ask to materialize this page to proceed." />} />
            <Route path="/settings" element={<Placeholder title="Settings" description="Preferences, legal & ethics, data retention, API sources. Ask to materialize this page to proceed." />} />
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
