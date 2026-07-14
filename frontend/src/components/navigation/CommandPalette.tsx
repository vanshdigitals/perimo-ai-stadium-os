import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, MapPin, AlertTriangle, Bot, Command, ArrowRight, type LucideIcon } from 'lucide-react';
import { useOverlay } from '@/contexts/OverlayContext';
import { cn } from '@/utils/cn';

interface PaletteItem {
  id: string;
  icon: LucideIcon;
  label: string;
  desc?: string;
  color?: string;
}

const GROUPS: { id: string; label: string; items: PaletteItem[] }[] = [
  {
    id: 'recent',
    label: 'Recent Searches',
    items: [
      { id: 'r1', icon: Search, label: 'Gate C Congestion', desc: 'Incident' },
      { id: 'r2', icon: Search, label: 'Santiago Bernabéu', desc: 'Stadium' },
    ]
  },
  {
    id: 'stadiums',
    label: 'Stadiums',
    items: [
      { id: 's1', icon: MapPin, label: 'Santiago Bernabéu', desc: 'Madrid, Spain • Active' },
      { id: 's2', icon: MapPin, label: 'Camp Nou', desc: 'Barcelona, Spain • Upcoming' },
    ]
  },
  {
    id: 'incidents',
    label: 'Active Incidents',
    items: [
      { id: 'i1', icon: AlertTriangle, label: 'Medical Emergency', desc: 'Sec B Row 18 • Critical', color: 'text-[#E5342B]' },
      { id: 'i2', icon: AlertTriangle, label: 'Parking Zone P2 Full', desc: 'Redirecting traffic • Medium', color: 'text-[#F59E0B]' },
    ]
  },
  {
    id: 'commands',
    label: 'AI Commands',
    items: [
      { id: 'c1', icon: Bot, label: 'Generate Situation Report', desc: 'Summarizes all active alerts and crowd flows' },
      { id: 'c2', icon: Command, label: 'Deploy Medical Team', desc: 'Quick action macro' },
    ]
  }
];

export const CommandPalette: React.FC = () => {
  const { isOpen, toggle, close, containerRef } = useOverlay('command-palette');
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggle]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Flatten items for keyboard navigation
  const filteredGroups = GROUPS.map(g => ({
    ...g,
    items: g.items.filter(i => 
      i.label.toLowerCase().includes(query.toLowerCase()) || 
      i.desc?.toLowerCase().includes(query.toLowerCase())
    )
  })).filter(g => g.items.length > 0);

  const flatItems = filteredGroups.flatMap(g => g.items);

  // Keyboard navigation within the palette
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % flatItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatItems.length) % flatItems.length);
      } else if (e.key === 'Enter' && flatItems.length > 0) {
        e.preventDefault();
        close();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatItems, selectedIndex, close]);


  // Focus trap logic
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [isOpen, flatItems]);

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <>
      {/* Trigger Area (Fills the old SearchBar space) */}
      <div className="flex-1 max-w-[640px] mx-auto hidden md:block">
        <button 
          onClick={toggle}
          className="w-full flex items-center justify-between h-[40px] px-3 rounded-[8px] bg-[#F1F5F9] border border-transparent hover:bg-[#E2E8F0]/60 transition-colors text-[#64748B] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-[16px] h-[16px] shrink-0" strokeWidth={2.5} />
            <span className="text-[13px] font-medium">Search stadiums, incidents, users, AI...</span>
          </div>
          <kbd className="font-sans text-[10px] font-semibold text-[#64748B] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] rounded-[4px] px-1.5 py-0.5 shrink-0 flex items-center gap-1">
            <span className="text-[12px]">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Mobile Search Icon */}
      <div className="flex-1 md:hidden"></div>
      <button 
        onClick={toggle}
        className="md:hidden w-[36px] h-[36px] rounded-[8px] flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors shrink-0"
      >
        <Search className="w-[18px] h-[18px]" strokeWidth={2} />
      </button>

      {/* Overlay Modal (Rendered outside normal DOM hierarchy via Portal) */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 animate-in fade-in duration-200">
          <div 
            className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-md" 
            aria-hidden="true"
            onClick={close}
          />
          
          <div 
            ref={containerRef}
            className="relative w-full max-w-[640px] bg-white rounded-[16px] shadow-[0_24px_48px_rgba(15,23,42,0.2)] border border-[#E2E8F0] overflow-hidden flex flex-col animate-in slide-in-from-top-[5%] zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
          >
            {/* Input Area */}
            <div className="flex items-center gap-3 px-4 h-[56px] border-b border-[#E2E8F0]">
              <Search className="w-[18px] h-[18px] text-[#2563EB]" strokeWidth={2.5} />
              <input 
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-[15px] font-medium text-[#0F172A] h-full focus:outline-none placeholder:text-[#94A3B8]"
              />
              <kbd className="hidden sm:inline-block font-sans text-[10px] font-semibold text-[#94A3B8] bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px] px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            {/* Results Area */}
            <div className="flex flex-col max-h-[400px] overflow-y-auto scrollbar-none p-2">
              {flatItems.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <Search className="w-8 h-8 text-[#E2E8F0] mb-3" />
                  <p className="text-[13px] font-medium text-[#64748B]">No results found for "{query}"</p>
                  <p className="text-[12px] text-[#94A3B8] mt-1">Try searching for a stadium or incident.</p>
                </div>
              ) : (
                filteredGroups.map((group, groupIdx) => (
                  <div key={group.id} className={cn("mb-2", groupIdx > 0 && "pt-2 border-t border-[#E2E8F0]/60")}>
                    <div className="px-3 mb-1.5 mt-1">
                      <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{group.label}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {group.items.map((item) => {
                        const globalIndex = flatItems.findIndex(i => i.id === item.id);
                        const isSelected = selectedIndex === globalIndex;
                        const Icon = item.icon;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={close}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={cn(
                              "flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-[10px] transition-colors outline-none",
                              isSelected ? "bg-[#F1F5F9]" : "hover:bg-[#F1F5F9]"
                            )}
                            role="option"
                            aria-selected={isSelected}
                          >
                            <div className={cn("flex items-center justify-center w-7 h-7 rounded-[8px] bg-white border border-[#E2E8F0] shadow-sm shrink-0", isSelected && "border-[#CBD5E1]")}>
                              <Icon className={cn("w-3.5 h-3.5", item.color || "text-[#64748B]")} />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className={cn("text-[13px] font-medium truncate", isSelected ? "text-[#0F172A]" : "text-[#334155]")}>{item.label}</span>
                              {item.desc && <span className="text-[11px] text-[#64748B] truncate">{item.desc}</span>}
                            </div>
                            {isSelected && <ArrowRight className="w-4 h-4 text-[#2563EB] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Footer */}
            <div className="h-[36px] bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center px-4 gap-4">
              <div className="flex items-center gap-1.5">
                <kbd className="font-sans text-[10px] font-semibold text-[#94A3B8] bg-white border border-[#E2E8F0] rounded-[4px] px-1 py-0.5 shadow-sm">↵</kbd>
                <span className="text-[10px] font-medium text-[#64748B]">to select</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="font-sans text-[10px] font-semibold text-[#94A3B8] bg-white border border-[#E2E8F0] rounded-[4px] px-1 py-0.5 shadow-sm">↓</kbd>
                <kbd className="font-sans text-[10px] font-semibold text-[#94A3B8] bg-white border border-[#E2E8F0] rounded-[4px] px-1 py-0.5 shadow-sm">↑</kbd>
                <span className="text-[10px] font-medium text-[#64748B]">to navigate</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

