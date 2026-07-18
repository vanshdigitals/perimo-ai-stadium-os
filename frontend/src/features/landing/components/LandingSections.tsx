import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { PILLARS, ECOSYSTEM, CAPABILITIES, STEPS, SECURITY, STATS, FAQS } from '../data';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Scroll-triggered reveal (respects reduced motion). */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Eyebrow: React.FC<{ children: React.ReactNode; isDark: boolean }> = ({ children, isDark }) => (
  <span className={cn('text-[13px] font-semibold uppercase tracking-[0.14em]', isDark ? 'text-[#7CA6FF]' : 'text-[#2563EB]')}>{children}</span>
);

const Heading: React.FC<{ children: React.ReactNode; isDark: boolean }> = ({ children, isDark }) => (
  <h2 className={cn('mt-3 font-display text-[clamp(28px,4vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em]', isDark ? 'text-white' : 'text-[#0B0F19]')}>{children}</h2>
);

const Sub: React.FC<{ children: React.ReactNode; isDark: boolean }> = ({ children, isDark }) => (
  <p className={cn('mt-4 text-[16.5px] leading-[1.7]', isDark ? 'text-[#9AA3B2]' : 'text-[#5B6472]')}>{children}</p>
);

const wrap = 'mx-auto max-w-[1340px] px-5 sm:px-8 lg:px-10';

// ── Why PERIMO ────────────────────────────────────────────────────────────────
export const WhyPerimo: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <section className={cn('py-16 sm:py-24', isDark ? 'bg-[#0A0E14]' : 'bg-white')}>
    <div className={wrap}>
      <Reveal className="mx-auto max-w-[720px] text-center">
        <Eyebrow isDark={isDark}>Why PERIMO</Eyebrow>
        <Heading isDark={isDark}>Operations you can trust, at stadium scale</Heading>
        <Sub isDark={isDark}>One connected platform that turns a stadium's live data into clear, safe, actionable intelligence for everyone inside it.</Sub>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <div className={cn('h-full rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1', isDark ? 'border-[#1C2230] bg-[#111622] hover:border-[#2A3346]' : 'border-[#E8ECF1] bg-white hover:border-[#CBD5E1] hover:shadow-[0_16px_40px_-16px_rgba(15,23,42,0.16)]')}>
              <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl', isDark ? 'bg-[#2563EB]/15 text-[#7CA6FF]' : 'bg-[#2563EB]/10 text-[#2563EB]')}>
                <p.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <h3 className={cn('mt-5 text-[16px] font-semibold', isDark ? 'text-white' : 'text-[#0F172A]')}>{p.title}</h3>
              <p className={cn('mt-2 text-[14px] leading-[1.6]', isDark ? 'text-[#8A93A3]' : 'text-[#64748B]')}>{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ── Platform Overview (ecosystem) ─────────────────────────────────────────────
export const PlatformOverview: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const navigate = useNavigate();
  return (
    <section id="platform" className={cn('scroll-mt-24 py-16 sm:py-24', isDark ? 'bg-[#080B11]' : 'bg-[#F8FAFC]')}>
      <div className={wrap}>
        <Reveal className="mx-auto max-w-[720px] text-center">
          <Eyebrow isDark={isDark}>The ecosystem</Eyebrow>
          <Heading isDark={isDark}>One platform, four experiences</Heading>
          <Sub isDark={isDark}>Fans, volunteers, staff and administrators each get a purpose-built experience — all sharing the same real-time source of truth.</Sub>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ECOSYSTEM.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.06}>
              <div
                onClick={() => navigate(`/get-started#${r.hash}`)}
                className={cn('group relative h-full overflow-hidden rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]', isDark ? 'border-[#1C2230] bg-[#111622]' : 'border-[#E8ECF1] bg-white hover:shadow-[0_16px_40px_-16px_rgba(15,23,42,0.16)]')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/get-started#${r.hash}`)}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${r.accent}1a`, color: r.accent }}>
                  <r.icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <h3 className={cn('mt-5 text-[17px] font-semibold', isDark ? 'text-white' : 'text-[#0F172A]')}>{r.name}</h3>
                <p className={cn('mt-2 text-[14px] leading-[1.6]', isDark ? 'text-[#8A93A3]' : 'text-[#64748B]')}>{r.blurb}</p>
                <div className="mt-5 h-1 w-10 rounded-full transition-all duration-300 group-hover:w-16" style={{ backgroundColor: r.accent }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── AI Capabilities ───────────────────────────────────────────────────────────
export const AICapabilities: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <section id="ai" className={cn('scroll-mt-24 py-16 sm:py-24', isDark ? 'bg-[#0A0E14]' : 'bg-white')}>
    <div className={wrap}>
      <Reveal className="mx-auto max-w-[720px] text-center">
        <Eyebrow isDark={isDark}>AI capabilities</Eyebrow>
        <Heading isDark={isDark}>Intelligence grounded in real operations</Heading>
        <Sub isDark={isDark}>Every capability draws from verified live data. The AI recommends; it never invents and never acts on its own.</Sub>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((c, i) => (
          <Reveal key={c.title} delay={(i % 3) * 0.06}>
            <div className={cn('flex h-full gap-4 rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1', isDark ? 'border-[#1C2230] bg-[#111622] hover:border-[#2A3346]' : 'border-[#E8ECF1] bg-white hover:border-[#CBD5E1] hover:shadow-[0_16px_40px_-16px_rgba(15,23,42,0.14)]')}>
              <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', isDark ? 'bg-[#6B4EFF]/15 text-[#A78BFF]' : 'bg-[#6B4EFF]/10 text-[#6B4EFF]')}>
                <c.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <h3 className={cn('text-[15.5px] font-semibold', isDark ? 'text-white' : 'text-[#0F172A]')}>{c.title}</h3>
                <p className={cn('mt-1.5 text-[13.5px] leading-[1.6]', isDark ? 'text-[#8A93A3]' : 'text-[#64748B]')}>{c.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ── How It Works ──────────────────────────────────────────────────────────────
export const HowItWorks: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <section className={cn('py-16 sm:py-24', isDark ? 'bg-[#080B11]' : 'bg-[#F8FAFC]')}>
    <div className={wrap}>
      <Reveal className="mx-auto max-w-[720px] text-center">
        <Eyebrow isDark={isDark}>How it works</Eyebrow>
        <Heading isDark={isDark}>From venue to intelligence in three steps</Heading>
      </Reveal>

      <div className="relative mt-14 grid gap-6 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.1}>
            <div className={cn('h-full rounded-2xl border p-7', isDark ? 'border-[#1C2230] bg-[#111622]' : 'border-[#E8ECF1] bg-white')}>
              <span className="font-display text-[15px] font-bold tracking-wide" style={{ color: isDark ? '#7CA6FF' : '#2563EB' }}>{s.n}</span>
              <h3 className={cn('mt-3 text-[19px] font-semibold', isDark ? 'text-white' : 'text-[#0F172A]')}>{s.title}</h3>
              <p className={cn('mt-2.5 text-[14.5px] leading-[1.65]', isDark ? 'text-[#8A93A3]' : 'text-[#64748B]')}>{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ── Security ──────────────────────────────────────────────────────────────────
export const SecuritySection: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <section id="security" className={cn('scroll-mt-24 py-16 sm:py-24', isDark ? 'bg-[#0A0E14]' : 'bg-white')}>
    <div className={wrap}>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <Eyebrow isDark={isDark}>Security & trust</Eyebrow>
          <Heading isDark={isDark}>Enterprise-grade by default</Heading>
          <Sub isDark={isDark}>PERIMO is engineered for the reliability and scrutiny that global tournament operations demand — secure, observable and transparent about its AI.</Sub>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {SECURITY.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className={cn('h-full rounded-2xl border p-5', isDark ? 'border-[#1C2230] bg-[#111622]' : 'border-[#E8ECF1] bg-[#FCFDFE]')}>
                <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', isDark ? 'bg-[#16A34A]/15 text-[#4ADE80]' : 'bg-[#16A34A]/10 text-[#16A34A]')}>
                  <s.icon className="h-[18px] w-[18px]" strokeWidth={2} />
                </span>
                <h3 className={cn('mt-4 text-[15px] font-semibold', isDark ? 'text-white' : 'text-[#0F172A]')}>{s.title}</h3>
                <p className={cn('mt-1.5 text-[13.5px] leading-[1.6]', isDark ? 'text-[#8A93A3]' : 'text-[#64748B]')}>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ── Stats band ────────────────────────────────────────────────────────────────
export const StatsBand: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <section className={cn('py-12 sm:py-16', isDark ? 'bg-[#080B11]' : 'bg-[#0B0F19]')}>
    <div className={wrap}>
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <div className="font-display text-[clamp(30px,5vw,46px)] font-bold tracking-[-0.02em] text-white">{s.value}</div>
            <div className="mt-2 text-[13.5px] font-medium text-[#9AA3B2]">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ── FAQ ───────────────────────────────────────────────────────────────────────
export const FAQSection: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className={cn('scroll-mt-24 pt-16 pb-8 sm:pt-24 sm:pb-12', isDark ? 'bg-[#0A0E14]' : 'bg-white')}>
      <div className="mx-auto max-w-[820px] px-5 sm:px-8">
        <Reveal className="text-center">
          <Eyebrow isDark={isDark}>FAQ</Eyebrow>
          <Heading isDark={isDark}>Answers, up front</Heading>
        </Reveal>

        <div className="mt-12 flex flex-col gap-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div className={cn('overflow-hidden rounded-2xl border transition-colors', isDark ? 'border-[#1C2230] bg-[#111622]' : 'border-[#E8ECF1] bg-white')}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className={cn('flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]')}
                  >
                    <span className={cn('text-[15.5px] font-semibold', isDark ? 'text-white' : 'text-[#0F172A]')}>{f.q}</span>
                    <ChevronDown className={cn('h-5 w-5 shrink-0 transition-transform duration-300', isOpen && 'rotate-180', isDark ? 'text-[#8A93A3]' : 'text-[#94A3B8]')} />
                  </button>
                  <motion.div initial={false} animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
                    <p className={cn('px-5 pb-5 text-[14.5px] leading-[1.7]', isDark ? 'text-[#8A93A3]' : 'text-[#64748B]')}>{f.a}</p>
                  </motion.div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ── Final CTA ─────────────────────────────────────────────────────────────────
export const FinalCTA: React.FC<{ isDark: boolean; onGetStarted: () => void }> = ({ isDark, onGetStarted }) => {
  const reduce = useReducedMotion();
  return (
    <section className={cn('px-5 pt-8 pb-16 sm:pt-12 sm:pb-24', isDark ? 'bg-[#0A0E14]' : 'bg-white')}>
      <Reveal className="mx-auto max-w-[1080px]">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#6B4EFF] px-6 py-16 text-center sm:px-12">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <h2 className="mx-auto max-w-[640px] font-display text-[clamp(28px,4.5vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
              Run your stadium like it's 2026
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-[16.5px] leading-[1.6] text-white/85">
              Bring fans, volunteers, staff and command into one intelligent operating picture.
            </p>
            <motion.button
              onClick={onGetStarted}
              whileHover={reduce ? undefined : { y: -2, scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="group mx-auto mt-8 flex h-[54px] items-center justify-center gap-2 rounded-xl bg-white px-8 text-[15.5px] font-semibold text-[#1D4ED8] shadow-[0_12px_32px_rgba(0,0,0,0.18)] outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2563EB]"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
            </motion.button>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-medium text-white/80">
              {['No card required', 'Instant fan access', 'Accessible by design'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5" strokeWidth={3} /> {t}</span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
