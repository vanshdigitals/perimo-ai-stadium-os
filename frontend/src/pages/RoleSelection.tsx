import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layouts/Header';
import { HeroSection } from '@/features/role-selection/components/HeroSection';
import { OperationsSection } from '@/features/role-selection/components/OperationsSection';
import { TrustFooter } from '@/features/role-selection/components/TrustFooter';
import { ThemeToggle } from '@/features/role-selection/components/ThemeToggle';
import { usePageTheme } from '@/features/role-selection/hooks/usePageTheme';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = usePageTheme();
  const operationsRef = useRef<HTMLElement>(null);

  const scrollToOperations = () => {
    operationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen">
      <Header theme={isDark ? 'dark' : 'light'} themeToggle={<ThemeToggle isDark={isDark} onToggle={toggle} />} />
      <main>
        <HeroSection
          isDark={isDark}
          onStart={() => navigate('/auth/fan/login')}
          onLearnMore={scrollToOperations}
        />
        <OperationsSection ref={operationsRef} isDark={isDark} onSelect={(path) => navigate(path)} />
        <TrustFooter isDark={isDark} />
      </main>
    </div>
  );
};
