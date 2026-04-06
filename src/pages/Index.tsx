import { useAuth } from '@/lib/auth-context';
import AuthScreen from '@/components/AuthScreen';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AnalysisTool from '@/components/AnalysisTool';
import DoctorBooking from '@/components/DoctorBooking';
import ChatBot from '@/components/ChatBot';
import Footer from '@/components/Footer';

export default function Index() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AnalysisTool />
      <DoctorBooking />
      <Footer />
      <ChatBot />
    </div>
  );
}
