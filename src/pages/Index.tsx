import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SocialProofSection from "@/components/SocialProofSection";
import AboutSection from "@/components/AboutSection";
import FeaturesSection from "@/components/FeaturesSection";
import VisionSection from "@/components/VisionSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <SocialProofSection />
      <AboutSection />
      <FeaturesSection />
      <VisionSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
