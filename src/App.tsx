import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import AppHome from "./pages/AppHome.tsx";
import Guide from "./pages/Guide.tsx";
import QuranExplorer from "./pages/QuranExplorer.tsx";
import QuranAdmin from "./pages/QuranAdmin.tsx";
import Auth from "./pages/Auth.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Intent from "./pages/Intent.tsx";
import Domain from "./pages/Domain.tsx";
import Ayat from "./pages/Ayat.tsx";
import AyahDetail from "./pages/AyahDetail.tsx";
import Reflection from "./pages/Reflection.tsx";
import Progress from "./pages/Progress.tsx";
import NotFound from "./pages/NotFound.tsx";
import QrRedirect from "./pages/QrRedirect.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/app" element={<ProtectedRoute><AppHome /></ProtectedRoute>} />
            <Route path="/intent" element={<ProtectedRoute><Intent /></ProtectedRoute>} />
            <Route path="/domain" element={<ProtectedRoute><Domain /></ProtectedRoute>} />
            <Route path="/ayat" element={<ProtectedRoute><Ayat /></ProtectedRoute>} />
            <Route path="/ayah/:id" element={<ProtectedRoute><AyahDetail /></ProtectedRoute>} />
            <Route path="/reflection" element={<ProtectedRoute><Reflection /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
            <Route path="/guide" element={<ProtectedRoute><Guide /></ProtectedRoute>} />
            <Route path="/quran" element={<QuranExplorer />} />
            <Route path="/quran/admin" element={<ProtectedRoute><QuranAdmin /></ProtectedRoute>} />
            <Route path="/qr" element={<QrRedirect />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
