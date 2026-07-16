import React, { useState } from 'react';
import { Globe, Search, Check } from 'lucide-react';
import { useOverlay } from '@/contexts/OverlayContext';
import { useApp } from '@/contexts/AppContext';
import { LANGUAGE_META } from '@/i18n';
import { cn } from '@/utils/cn';

export const LanguageSwitcher: React.FC = () => {
  const { isOpen, toggle, containerRef } = useOverlay('language');
  const { language, setLanguage, toast } = useApp();
  const [search, setSearch] = useState('');

  const currentLang = LANGUAGE_META.find(l => l.code === language) || LANGUAGE_META[0];

  const filtered = LANGUAGE_META.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.native.toLowerCase().includes(search.toLowerCase())
  );

  const suggested = filtered.filter(l => l.suggested);
  const others = filtered.filter(l => !l.suggested);

  const handleSelect = (code: string) => {
    setLanguage(code);
    toggle();
    const meta = LANGUAGE_META.find(l => l.code === code);
    toast({ type: 'info', title: `Language changed to ${meta?.name}`, message: 'UI text has been updated.' });
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={toggle}
        className={cn(
          'h-[36px] px-2.5 rounded-[8px] flex items-center gap-1.5 transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]',
          isOpen ? 'bg-[#F1F5F9] text-[#0F172A]' : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
        )}
        aria-expanded={isOpen}
      >
        <Globe className="w-[15px] h-[15px]" strokeWidth={2.5} />
        <span className="text-[12px] font-medium hidden sm:inline-block">{currentLang.name}</span>
      </button>

      {isOpen && (
        <div
          className="absolute top-[44px] right-0 w-[240px] bg-white border border-[#E2E8F0] rounded-[16px] shadow-[0_12px_32px_rgba(11,14,20,0.16)] flex flex-col z-[150] animate-in fade-in zoom-in-95 duration-150 origin-top-right overflow-hidden"
          role="menu"
        >
          <div className="p-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2 h-8 px-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all">
              <Search className="w-3.5 h-3.5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search languages..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none text-[12px] text-[#0F172A] focus:outline-none placeholder:text-[#94A3B8]"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto p-1.5 flex flex-col gap-1">
            {suggested.length > 0 && (
              <>
                <div className="px-2 py-1 mt-1">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Suggested</span>
                </div>
                {suggested.map(lang => (
                  <LangOption key={lang.code} lang={lang} selected={language} onSelect={() => handleSelect(lang.code)} />
                ))}
                {others.length > 0 && <div className="h-px bg-[#E2E8F0] mx-2 my-1" />}
              </>
            )}

            {others.length > 0 && (
              <>
                <div className="px-2 py-1 mt-1">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">All Languages</span>
                </div>
                {others.map(lang => (
                  <LangOption key={lang.code} lang={lang} selected={language} onSelect={() => handleSelect(lang.code)} />
                ))}
              </>
            )}

            {filtered.length === 0 && (
              <div className="px-3 py-6 text-center text-[12px] text-[#64748B]">
                No languages found matching "{search}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const LangOption = ({ lang, selected, onSelect }: { lang: typeof LANGUAGE_META[0]; selected: string; onSelect: () => void }) => {
  const isSelected = selected === lang.code;
  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex items-center justify-between w-full px-2 py-1.5 rounded-[8px] text-[13px] transition-colors outline-none',
        isSelected ? 'bg-[#F1F5F9] text-[#0F172A]' : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] focus-visible:bg-[#F8FAFC]'
      )}
      role="menuitem"
    >
      <div className="flex flex-col items-start">
        <span className="font-medium">{lang.native}</span>
        <span className="text-[11px] text-[#64748B]">{lang.name}</span>
      </div>
      {isSelected && <Check className="w-4 h-4 text-[#2563EB]" />}
    </button>
  );
};
