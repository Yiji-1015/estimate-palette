import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import RfpAnalysis from "./pages/RfpAnalysis.tsx";
import Estimation from "./pages/Estimation.tsx";
import NotFound from "./pages/NotFound.tsx";
import Review from "./pages/Review.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* 기준자료 관리 (독립) */}
          <Route path="/" element={<Navigate to="/reference" replace />} />
          <Route path="/reference" element={<Index />} />

          {/* 프로젝트별 단계 */}
          <Route path="/projects/:projectId/rfp-analysis" element={<RfpAnalysis />} />
          <Route path="/projects/:projectId/estimation" element={<Estimation />} />
          <Route path="/projects/:projectId/review" element={<Review />} />

          {/* 하위 호환: 기존 경로 리다이렉트 */}
          <Route path="/rfp-analysis" element={<Navigate to="/reference" replace />} />
          <Route path="/estimation" element={<Navigate to="/reference" replace />} />
          <Route path="/review" element={<Navigate to="/reference" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
