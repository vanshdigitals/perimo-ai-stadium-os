import React, { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';

type OverlayId = 'role-switcher' | 'command-palette' | 'notifications' | 'quick-actions' | 'language' | 'profile' | null;

interface OverlayContextType {
  activeOverlay: OverlayId;
  setActiveOverlay: (id: OverlayId) => void;
  closeOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const OverlayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeOverlay, setActiveOverlay] = useState<OverlayId>(null);

  const closeOverlay = () => setActiveOverlay(null);

  // Global Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeOverlay();
      }
    };
    if (activeOverlay) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeOverlay]);

  return (
    <OverlayContext.Provider value={{ activeOverlay, setActiveOverlay, closeOverlay }}>
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlayContext = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlayContext must be used within an OverlayProvider');
  }
  return context;
};

// Helper hook for individual overlay components
export const useOverlay = (id: OverlayId) => {
  const { activeOverlay, setActiveOverlay, closeOverlay } = useOverlayContext();
  const isOpen = activeOverlay === id;
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (isOpen) {
      closeOverlay();
    } else {
      setActiveOverlay(id);
    }
  };

  const open = () => setActiveOverlay(id);
  const close = () => {
    if (isOpen) closeOverlay();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If click is outside the container, close it
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeOverlay();
      }
    };

    if (isOpen) {
      // Use mousedown instead of click to prevent issues with text selection dragging outside
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeOverlay]);

  return {
    isOpen,
    toggle,
    open,
    close,
    containerRef
  };
};
