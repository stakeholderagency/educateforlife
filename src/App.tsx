import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import CommunityOverview from "./pages/CommunityOverview";
import Members from "./pages/Members";
import MemberProfile from "./pages/MemberProfile";
import LegacyMemberProfile from "./pages/LegacyMemberProfile";
import Memorandum from "./pages/Memorandum";
import Timeline from "./pages/Timeline";
import Library from "./pages/Library";
import Chat from "./pages/Chat";
import Skills from "./pages/Skills";
import SkillDetail from "./pages/SkillDetail";
import NotFound from "./pages/NotFound";

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/memorandum" element={<Memorandum />} />
            <Route path="/library" element={<Library />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:slug" element={<Chat />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/skills/:slug" element={<SkillDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile/setup" element={<ProfileSetup />} />
            <Route path="/members" element={<CommunityOverview />} />
            <Route path="/members/directory" element={<Members />} />
            <Route path="/members/legacy/:id" element={<LegacyMemberProfile />} />
            <Route path="/members/:userId" element={<MemberProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
