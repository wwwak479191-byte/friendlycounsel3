import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { SiteConfig } from './types';
import { DEFAULT_CONFIG, buildWhatsAppUrl, getWhatsAppUnlockInfo } from './utils/config';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PlansSection } from './components/PlansSection';
import { WhyChooseMe } from './components/WhyChooseMe';
import { HowItWorks } from './components/HowItWorks';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PolicyModals } from './components/PolicyModals';
import { AdminPanel } from './components/AdminPanel';
import { PaymentModal } from './components/PaymentModal';
import { HostingInstructionsModal } from './components/HostingInstructionsModal';
import { ConnectChannelModal } from './components/ConnectChannelModal';

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('wellness_site_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          !parsed.heroHeadline ||
          parsed.heroHeadline === "You Don't Have to Go Through It Alone." ||
          parsed.heroHeadline === "You Don’t Have to Go Through It Alone." ||
          parsed.heroHeadline === "Connect with me for your emotional support and guidance"
        ) {
          parsed.heroHeadline = DEFAULT_CONFIG.heroHeadline;
          parsed.heroSubheadline = DEFAULT_CONFIG.heroSubheadline;
        }
        if (!parsed.thirtyDayPrice) {
          parsed.thirtyDayPrice = DEFAULT_CONFIG.thirtyDayPrice;
        }
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch {
      // Ignore error and fallback to default
    }
    return DEFAULT_CONFIG;
  });

  const [policyModal, setPolicyModal] = useState<'privacy' | 'disclaimer' | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [hostingGuideOpen, setHostingGuideOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<{
    id: string;
    name: string;
    duration: string;
    durationLabel: string;
    amount: string;
  } | null>(null);

  // Universal Connect & WhatsApp Lock Channel Modal state
  const [channelModalOpen, setChannelModalOpen] = useState(false);
  const [channelIntent, setChannelIntent] = useState<{
    prefilledText?: string;
    contextTitle?: string;
  } | null>(null);

  const [isWhatsAppUnlocked, setIsWhatsAppUnlocked] = useState(() => {
    return getWhatsAppUnlockInfo().unlocked;
  });

  useEffect(() => {
    try {
      localStorage.setItem('wellness_site_config', JSON.stringify(config));
    } catch {
      // Ignore storage errors
    }
  }, [config]);

  const handleOpenConnect = (intent?: { prefilledText?: string; contextTitle?: string }) => {
    // Keep unlock status synced with latest storage state
    setIsWhatsAppUnlocked(getWhatsAppUnlockInfo().unlocked);
    setChannelIntent(intent || null);
    setChannelModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D3A30] flex flex-col font-sans selection:bg-[#D5E3D8] selection:text-[#1F2E22]">
      {/* Top Navigation */}
      <Navbar
        config={config}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenConnect={handleOpenConnect}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          config={config}
          onOpenConnect={handleOpenConnect}
        />

        {/* Interactive Plans & Duration Configurator */}
        <PlansSection
          config={config}
          onSelectPlanForPayment={(planData) => setSelectedPlanForPayment(planData)}
          onOpenConnect={handleOpenConnect}
        />

        {/* Why I Am Here For You (Why Choose Me) */}
        <WhyChooseMe
          config={config}
          onOpenConnect={handleOpenConnect}
        />

        {/* How It Works (3 Steps) */}
        <HowItWorks
          config={config}
          onOpenConnect={handleOpenConnect}
        />

        {/* About Me */}
        <AboutSection
          config={config}
          onOpenConnect={handleOpenConnect}
        />

        {/* Contact Section ("Let's Talk 💚") */}
        <ContactSection
          config={config}
          onOpenConnect={handleOpenConnect}
        />
      </main>

      {/* Dark Sage Green Footer */}
      <Footer
        config={config}
        onOpenPrivacy={() => setPolicyModal('privacy')}
        onOpenDisclaimer={() => setPolicyModal('disclaimer')}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenConnect={handleOpenConnect}
      />

      {/* Modals */}
      <PolicyModals
        config={config}
        isOpen={policyModal !== null}
        type={policyModal}
        onClose={() => setPolicyModal(null)}
      />

      {/* Universal Channel Selection & WhatsApp Lock Modal */}
      <ConnectChannelModal
        config={config}
        isOpen={channelModalOpen}
        onClose={() => setChannelModalOpen(false)}
        prefilledText={channelIntent?.prefilledText}
        contextTitle={channelIntent?.contextTitle}
        isUnlocked={isWhatsAppUnlocked}
        onUnlockSuccess={() => setIsWhatsAppUnlocked(true)}
        onOpenPaymentForUnlock={(unlockPlan) => setSelectedPlanForPayment(unlockPlan)}
        onOpenPlans={() => {
          document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* JazzCash & Payment Checkout Modal */}
      <PaymentModal
        config={config}
        isOpen={selectedPlanForPayment !== null}
        onClose={() => setSelectedPlanForPayment(null)}
        selectedPlan={selectedPlanForPayment}
        onPaymentSubmitted={() => {
          setIsWhatsAppUnlocked(true);
        }}
      />

      {/* Full Admin Management Panel */}
      <AdminPanel
        config={config}
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onSave={(newCfg) => setConfig(newCfg)}
        onOpenHostingGuide={() => {
          setAdminOpen(false);
          setHostingGuideOpen(true);
        }}
      />

      <HostingInstructionsModal
        isOpen={hostingGuideOpen}
        onClose={() => setHostingGuideOpen(false)}
      />

      {/* Mobile Floating WhatsApp Quick Action (Thumb-friendly for Pakistani Instagram audience) */}
      <div className="fixed bottom-4 right-4 z-30 sm:hidden">
        <button
          type="button"
          onClick={() => handleOpenConnect({ contextTitle: 'Mobile Quick Connect' })}
          className="flex items-center gap-2 px-4 py-3 bg-[#2D4532] text-white text-xs font-semibold rounded-full shadow-lg active:scale-95 transition-all border border-[#527357] cursor-pointer"
          aria-label="Direct Message Option"
        >
          <MessageCircle className="w-4 h-4 text-[#9FE2AB]" />
          <span>Send Private Message</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#4EDB6A] animate-pulse"></span>
        </button>
      </div>
    </div>
  );
}
