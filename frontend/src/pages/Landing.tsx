import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingHeader } from '@/features/landing/components/LandingHeader';
import { LandingHero } from '@/features/landing/components/LandingHero';
import {
  WhyPerimo, PlatformOverview, AICapabilities, HowItWorks, SecuritySection, StatsBand, FAQSection, FinalCTA,
} from '@/features/landing/components/LandingSections';
import { LandingFooter } from '@/features/landing/components/LandingFooter';
import { ThemeToggle } from '@/features/role-selection/components/ThemeToggle';
import { usePageTheme } from '@/features/role-selection/hooks/usePageTheme';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = usePageTheme();

  const getStarted = () => navigate('/get-started');
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={isDark ? 'min-h-screen bg-[#0A0E14]' : 'min-h-screen bg-white'}>
      <LandingHeader isDark={isDark} themeToggle={<ThemeToggle isDark={isDark} onToggle={toggle} />} onGetStarted={getStarted} onNavigate={scrollTo} />
      <main>
        <LandingHero isDark={isDark} onGetStarted={getStarted} onExplore={() => scrollTo('platform')} />
        <WhyPerimo isDark={isDark} />
        <PlatformOverview isDark={isDark} />
        <AICapabilities isDark={isDark} />
        <HowItWorks isDark={isDark} />
        <SecuritySection isDark={isDark} />
        <StatsBand isDark={isDark} />
        <FAQSection isDark={isDark} />
        <FinalCTA isDark={isDark} onGetStarted={getStarted} />
      </main>
      <LandingFooter isDark={isDark} />
    </div>
  );
};
