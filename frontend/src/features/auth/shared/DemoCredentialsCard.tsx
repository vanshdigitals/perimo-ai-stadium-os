import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface DemoCredentialsCardProps {
  role: string;
  email: string;
  password: string;
}

export const DemoCredentialsCard: React.FC<DemoCredentialsCardProps> = ({ role, email, password }) => {
  const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
  const [isReady, setIsReady] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  if (!isDemo) return null;

  const handleAutoFill = async () => {
    if (isAnimating || isReady) return;

    setIsAnimating(true);
    const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
    const passInput = document.querySelector('input[name="password"]') as HTMLInputElement;

    if (!emailInput || !passInput) {
      setIsAnimating(false);
      return;
    }

    const typeText = async (element: HTMLInputElement, text: string) => {
      element.focus();
      element.value = '';
      for (let i = 0; i < text.length; i++) {
        element.value += text[i];
        element.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise(r => setTimeout(r, 15 + Math.random() * 25));
      }
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };

    await typeText(emailInput, email);
    await new Promise(r => setTimeout(r, 100));
    await typeText(passInput, password);
    passInput.blur();
    
    setIsAnimating(false);
    setIsReady(true);
  };

  return (
    <div className="flex flex-col justify-center h-full max-w-[400px] mx-auto w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-text text-[15px]">Demo Mode: {role}</h3>
        <span className="text-[12px] font-medium text-text-muted">Designed for judges and evaluators.</span>
      </div>
      <p className="text-[14px] text-text-muted mb-4">
        Preconfigured account for evaluation:
      </p>
      
      <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-[14px] mb-6 bg-white p-4 rounded-xl border border-surface-border font-mono shadow-sm">
        <span className="text-text-muted select-none">Email:</span>
        <span className="text-text font-medium">{email}</span>
        <span className="text-text-muted select-none">Password:</span>
        <span className="text-text font-medium">{password}</span>
      </div>

      <Button 
        type="button" 
        variant="outline" 
        fullWidth 
        onClick={handleAutoFill}
        disabled={isAnimating || isReady}
        className="h-11 text-[14px]"
      >
        {isReady ? '✓ Credentials Ready' : 'Auto Fill Credentials'}
      </Button>
    </div>
  );
};
