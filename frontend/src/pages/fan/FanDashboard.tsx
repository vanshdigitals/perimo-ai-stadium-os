import React, { useState, useEffect } from 'react'
import { FanLayout } from '@/components/layouts/FanLayout'
import {
  Sparkles, Navigation, Ticket, ShieldAlert, ChevronRight,
  Clock, MapPin, Star, Heart, Send, Flame, CloudSun, Train, Shield
} from 'lucide-react'
import { cn } from '@/utils/cn'

// ── Countdown hook ──────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now())
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return { h, m, s }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(t)
  }, [])
  return time
}

const KICKOFF = new Date(Date.now() + 4500000) // ~1h 15m from now

// ── Dummy data ───────────────────────────────────────────────────────────────
const FOOD_ITEMS = [
  {
    name: 'Smash Burger',
    subtitle: 'Double patty · Special sauce',
    image: '/assets/ai-gen/food_burger_isolated.png',
    rating: 4.9,
    wait: '5 min',
    price: '$14',
    tag: 'AI Pick',
    tagColor: 'bg-[#2563EB] text-white',
    bg: 'from-[#FFF7ED] to-[#FEF3C7]',
  },
  {
    name: 'Loaded Nachos',
    subtitle: 'Jalapeño · Cheese · Salsa',
    image: '/assets/ai-gen/food_nachos_isolated.png',
    rating: 4.7,
    wait: 'No wait',
    price: '$11',
    tag: 'Popular',
    tagColor: 'bg-[#DC2626] text-white',
    bg: 'from-[#FFF7ED] to-[#FEE2E2]',
  },
  {
    name: 'Gourmet Hotdog',
    subtitle: 'Brioche bun · Caramelised onion',
    image: '/assets/ai-gen/food_hotdog_isolated.png',
    rating: 4.5,
    wait: '2 min',
    price: '$9',
    tag: 'Near Gate',
    tagColor: 'bg-[#059669] text-white',
    bg: 'from-[#F0FDF4] to-[#D1FAE5]',
  },
]

const MERCH_ITEMS = [
  {
    name: 'Official Jersey',
    subtitle: 'Argentina 2026 Home',
    image: '/assets/ai-gen/merch_jersey_floating.png',
    price: '$120',
    tag: 'Bestseller',
    bg: '#E0F2FE',
  },
  {
    name: 'Match Ball',
    subtitle: 'FIFA Official 2026',
    image: '/assets/ai-gen/merch_ball_floating.png',
    price: '$160',
    tag: 'Limited',
    bg: '#F0FDF4',
  },
  {
    name: 'Fan Cap',
    subtitle: 'World Cup Snapback',
    image: '/assets/ai-gen/merch_cap_floating.png',
    price: '$45',
    tag: 'New',
    bg: '#FEF9C3',
  },
]

const LIVE_STATUS = [
  { icon: Flame, label: 'Crowd', value: 'Moderate', color: 'text-orange-400' },
  { icon: Shield, label: 'Security', value: 'Normal', color: 'text-green-400' },
  { icon: CloudSun, label: 'Weather', value: '72°F', color: 'text-sky-400' },
  { icon: Train, label: 'Transit', value: 'On Time', color: 'text-emerald-400' },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const CountdownUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-white/10 backdrop-blur rounded-xl px-3 py-2 min-w-[52px] text-center border border-white/10">
      <span className="font-display font-bold text-2xl md:text-3xl tabular-nums leading-none">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mt-1">{label}</span>
  </div>
)

const FoodCardPremium: React.FC<(typeof FOOD_ITEMS)[0]> = ({ name, subtitle, image, rating, wait, price, tag, tagColor, bg }) => (
  <div className={cn('relative flex-shrink-0 w-[240px] rounded-3xl overflow-hidden bg-gradient-to-b', bg)}>
    {/* Tag */}
    <span className={cn('absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full z-10', tagColor)}>
      {tag}
    </span>
    <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/60 backdrop-blur flex items-center justify-center z-10">
      <Heart className="w-3.5 h-3.5 text-[#374151]" />
    </button>
    {/* Food image on clean gradient bg */}
    <div className="h-[180px] flex items-end justify-center pt-6 px-6">
      <img src={image} alt={name} className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.15)]" />
    </div>
    {/* Info */}
    <div className="p-4 bg-white/40 backdrop-blur-sm border-t border-white/20">
      <h4 className="font-bold text-[#0F172A] text-[15px] leading-tight">{name}</h4>
      <p className="text-[12px] text-[#64748B] mt-0.5">{subtitle}</p>
      <div className="flex items-center gap-3 mt-3">
        <div className="flex items-center gap-1 text-[12px] font-semibold text-[#0F172A]">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          {rating}
        </div>
        <div className="flex items-center gap-1 text-[12px] text-[#64748B]">
          <Clock className="w-3 h-3" /> {wait}
        </div>
        <div className="ml-auto font-bold text-[#0F172A]">{price}</div>
      </div>
      <button className="mt-3 w-full h-9 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-[13px] font-bold transition-colors">
        Order Pickup
      </button>
    </div>
  </div>
)

const MerchCardPremium: React.FC<(typeof MERCH_ITEMS)[0]> = ({ name, subtitle, image, price, tag, bg }) => (
  <div className="relative flex-shrink-0 w-[180px] rounded-3xl overflow-hidden border border-white/[0.06] bg-[#15151e]">
    {tag && (
      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white/10 text-white/80 z-10">
        {tag}
      </span>
    )}
    <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur flex items-center justify-center z-10">
      <Heart className="w-3.5 h-3.5 text-white/60" />
    </button>
    {/* Floating product on colored bg */}
    <div className="h-[180px] flex items-center justify-center p-6" style={{ background: bg }}>
      <img
        src={image}
        alt={name}
        className="w-full h-full object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform duration-500"
      />
    </div>
    {/* Info */}
    <div className="p-4">
      <h4 className="font-bold text-white text-[13px] leading-tight">{name}</h4>
      <p className="text-[11px] text-white/40 mt-0.5">{subtitle}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="font-bold text-[#60A5FA] text-[15px]">{price}</span>
        <button className="h-8 px-3 bg-white/10 hover:bg-white/20 rounded-xl text-white/80 text-[12px] font-bold transition-colors">
          Add
        </button>
      </div>
    </div>
  </div>
)

// ── Main Dashboard ────────────────────────────────────────────────────────────
export const FanDashboard: React.FC = () => {
  const { h, m, s } = useCountdown(KICKOFF)
  const [aiQuery, setAiQuery] = useState('')

  return (
    <FanLayout>
      <div className="text-white">

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="relative w-full overflow-hidden" style={{ minHeight: 'min(600px, 90vh)' }}>
          {/* Stadium background */}
          <img
            src="/assets/ai-gen/hero_stadium_night.png"
            alt="Stadium"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Gradient overlays – bottom-heavy for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/50 to-transparent h-32" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-end h-full p-5 md:p-8 lg:p-12 pt-16 md:pt-24" style={{ minHeight: 'min(600px, 90vh)' }}>

            {/* Badge */}
            <div className="flex items-center gap-2 mb-5">
              <span className="flex items-center gap-1.5 bg-[#2563EB]/90 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                Live Match Day
              </span>
              <span className="bg-white/10 backdrop-blur text-white/70 text-[11px] font-medium px-3 py-1.5 rounded-full">
                Quarter Final · Group A
              </span>
            </div>

            {/* Teams */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className="w-14 h-14 md:w-18 md:h-18 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center font-display font-black text-2xl mb-1">
                  🇦🇷
                </div>
                <span className="text-xs font-bold text-white/70">Argentina</span>
              </div>
              <div className="flex-1 text-center">
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">vs</p>
                <p className="text-white/50 text-xs">MetLife Stadium, NY</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 md:w-18 md:h-18 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center font-display font-black text-2xl mb-1">
                  🇫🇷
                </div>
                <span className="text-xs font-bold text-white/70">France</span>
              </div>
            </div>

            {/* Countdown */}
            <div className="mb-6">
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Kickoff in</p>
              <div className="flex items-center gap-3">
                <CountdownUnit value={h} label="Hrs" />
                <span className="text-white/30 font-bold text-2xl mb-4">:</span>
                <CountdownUnit value={m} label="Min" />
                <span className="text-white/30 font-bold text-2xl mb-4">:</span>
                <CountdownUnit value={s} label="Sec" />
              </div>
            </div>

            {/* Ticket strip */}
            <div className="flex items-center gap-3 mb-5 overflow-x-auto hide-scrollbar">
              {[
                { label: 'Gate', value: 'B4' },
                { label: 'Section', value: '112' },
                { label: 'Row', value: '8' },
                { label: 'Seat', value: '15' },
              ].map(({ label, value }) => (
                <div key={label} className="flex-shrink-0 bg-white/10 backdrop-blur border border-white/10 rounded-2xl px-4 py-2 text-center">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{label}</p>
                  <p className="font-display font-black text-xl text-white leading-tight">{value}</p>
                </div>
              ))}
            </div>

            {/* AI Recommendation card */}
            <div className="bg-[#2563EB]/20 border border-[#3B82F6]/30 backdrop-blur-md rounded-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-[#60A5FA] uppercase tracking-wider mb-0.5">AI Copilot</p>
                <p className="text-[13px] text-white leading-relaxed">
                  Gate B4 has a 12-min wait. <strong>Gate C1</strong> saves 8 minutes and is 2 mins from your seat.
                </p>
              </div>
              <button className="shrink-0 flex items-center gap-1 text-[#60A5FA] text-xs font-bold">
                Go <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* ══ LIVE STATUS BAR ═════════════════════════════════════════════ */}
        <section className="sticky top-0 z-30 bg-[#111118]/80 backdrop-blur-xl border-b border-white/[0.06] px-5 md:px-8 lg:px-12">
          <div className="flex items-center gap-6 md:gap-10 py-3 overflow-x-auto hide-scrollbar">
            {LIVE_STATUS.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-2 flex-shrink-0">
                <Icon className={cn('w-3.5 h-3.5', color)} />
                <span className="text-white/40 text-xs">{label}</span>
                <span className={cn('text-xs font-bold', color)}>{value}</span>
              </div>
            ))}
            <div className="ml-auto flex-shrink-0 flex items-center gap-1.5 text-[11px] font-bold text-white/30">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live
            </div>
          </div>
        </section>

        {/* ══ CONTENT ═════════════════════════════════════════════════════ */}
        <div className="px-5 md:px-8 lg:px-12 py-8 max-w-[1440px] mx-auto">

          {/* Desktop 2-col grid */}
          <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-10">

            {/* Left column */}
            <div className="flex flex-col gap-10">

              {/* Quick Actions */}
              <section>
                <div className="grid grid-cols-4 gap-3 md:gap-4">
                  {[
                    { icon: Navigation, label: 'Navigate', accent: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
                    { icon: Ticket, label: 'My Ticket', accent: '#A855F7', bg: 'rgba(168,85,247,0.12)' },
                    { icon: ShieldAlert, label: 'Emergency', accent: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
                    { icon: MapPin, label: 'Explore', accent: '#10B981', bg: 'rgba(16,185,129,0.12)' },
                  ].map(({ icon: Icon, label, accent, bg }) => (
                    <button
                      key={label}
                      className="flex flex-col items-center justify-center gap-2.5 rounded-2xl p-4 transition-all hover:scale-[1.03] active:scale-[0.97]"
                      style={{ background: bg, border: `1px solid ${accent}30` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: accent }} />
                      <span className="text-[11px] font-bold text-white/70">{label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Food Section */}
              <section>
                <div className="flex items-baseline justify-between mb-5">
                  <div>
                    <h2 className="font-display font-bold text-xl text-white">Recommended Food</h2>
                    <p className="text-xs text-white/40 mt-0.5">AI-curated based on your preferences</p>
                  </div>
                  <button className="text-[#60A5FA] text-sm font-bold">View all</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 md:-mx-8 md:px-8 hide-scrollbar snap-x snap-mandatory">
                  {FOOD_ITEMS.map((item) => (
                    <div key={item.name} className="snap-start flex-shrink-0">
                      <FoodCardPremium {...item} />
                    </div>
                  ))}
                </div>
              </section>

              {/* Explore Stadium */}
              <section>
                <div className="flex items-baseline justify-between mb-5">
                  <h2 className="font-display font-bold text-xl text-white">Explore Stadium</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { emoji: '🚻', label: 'Restrooms', note: 'Nearest: 40m' },
                    { emoji: '🏥', label: 'Medical', note: 'Gate C2' },
                    { emoji: '⚡', label: 'Charging', note: 'Section 110' },
                    { emoji: '🕌', label: 'Prayer Rooms', note: 'Level 2' },
                    { emoji: '👶', label: 'Family Zones', note: 'Section 118' },
                    { emoji: '💳', label: 'ATMs', note: '2 mins walk' },
                    { emoji: '🔍', label: 'Lost & Found', note: 'Main entrance' },
                    { emoji: '♿', label: 'Accessibility', note: 'All gates' },
                  ].map(({ emoji, label, note }) => (
                    <button
                      key={label}
                      className="flex items-center gap-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] rounded-2xl p-4 text-left transition-colors"
                    >
                      <span className="text-2xl">{emoji}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{label}</p>
                        <p className="text-[11px] text-white/40">{note}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

            </div>

            {/* Right column (desktop only visible) */}
            <div className="hidden lg:flex flex-col gap-8">

              {/* Merchandise */}
              <section>
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="font-display font-bold text-lg text-white">Official Store</h2>
                  <button className="text-[#60A5FA] text-sm font-bold">Shop all</button>
                </div>
                <div className="flex flex-col gap-4">
                  {MERCH_ITEMS.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-4 bg-[#15151e] border border-white/[0.06] rounded-2xl p-4 hover:border-white/10 transition-colors"
                    >
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: item.bg }}
                      >
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm">{item.name}</p>
                        <p className="text-[11px] text-white/40">{item.subtitle}</p>
                        {item.tag && (
                          <span className="text-[10px] font-bold bg-white/10 text-white/60 px-1.5 py-0.5 rounded mt-1 inline-block">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-[#60A5FA] text-base">{item.price}</p>
                        <button className="mt-1 text-[11px] font-bold text-white/50 hover:text-white transition-colors">Add</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Digital Ticket Preview */}
              <section>
                <h2 className="font-display font-bold text-lg text-white mb-4">My Ticket</h2>
                <div className="bg-gradient-to-br from-[#1E40AF] to-[#1D4ED8] rounded-3xl p-5 border border-[#3B82F6]/30">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">FIFA World Cup 2026™</p>
                      <p className="font-bold text-white text-lg mt-0.5">Quarter Final 1</p>
                    </div>
                    <span className="bg-green-500/20 text-green-300 text-[10px] font-bold px-2 py-1 rounded-full border border-green-500/30">Verified</span>
                  </div>
                  <div className="flex gap-3 mb-4">
                    {[
                      ['Gate', 'B4'],
                      ['Section', '112'],
                      ['Row', '8'],
                      ['Seat', '15'],
                    ].map(([l, v]) => (
                      <div key={l} className="text-center flex-1">
                        <p className="text-[9px] text-white/40 uppercase tracking-wider">{l}</p>
                        <p className="font-display font-bold text-lg text-white">{v}</p>
                      </div>
                    ))}
                  </div>
                  {/* Mini QR placeholder */}
                  <div className="bg-white rounded-xl p-3 flex items-center justify-center h-24">
                    <svg viewBox="0 0 80 80" className="w-full h-full opacity-80">
                      <rect x="8" y="8" width="28" height="28" fill="none" stroke="#0F172A" strokeWidth="4"/>
                      <rect x="44" y="8" width="28" height="28" fill="none" stroke="#0F172A" strokeWidth="4"/>
                      <rect x="8" y="44" width="28" height="28" fill="none" stroke="#0F172A" strokeWidth="4"/>
                      <rect x="16" y="16" width="12" height="12" fill="#0F172A"/>
                      <rect x="52" y="16" width="12" height="12" fill="#0F172A"/>
                      <rect x="16" y="52" width="12" height="12" fill="#0F172A"/>
                      <rect x="48" y="48" width="8" height="8" fill="#0F172A"/>
                      <rect x="60" y="60" width="8" height="8" fill="#0F172A"/>
                      <rect x="44" y="64" width="12" height="4" fill="#0F172A"/>
                    </svg>
                  </div>
                </div>
              </section>

            </div>
          </div>

          {/* ── Mobile Merchandise (scrollable, below food on mobile) ─── */}
          <section className="lg:hidden mt-10">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="font-display font-bold text-xl text-white">Official Store</h2>
              <button className="text-[#60A5FA] text-sm font-bold">Shop all</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 hide-scrollbar snap-x">
              {MERCH_ITEMS.map((item) => (
                <div key={item.name} className="snap-start flex-shrink-0">
                  <MerchCardPremium {...item} />
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* ══ FIXED AI COPILOT BAR ════════════════════════════════════════ */}
        <div className="fixed bottom-[68px] lg:bottom-0 left-0 lg:left-[72px] xl:left-[220px] right-0 z-40 px-4 pb-3 pt-2 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3 bg-[#1a1a26]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl px-4 py-3 shadow-2xl max-w-[800px] mx-auto">
            <Sparkles className="w-4 h-4 text-[#60A5FA] shrink-0" />
            <input
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Ask AI: Best food near me? Navigate to my seat?"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none min-w-0"
            />
            <button className="w-8 h-8 bg-[#2563EB] hover:bg-[#3B82F6] rounded-xl flex items-center justify-center transition-colors shrink-0">
              <Send className="w-3.5 h-3.5 text-white ml-0.5" />
            </button>
          </div>
        </div>

        {/* Bottom spacer for AI bar */}
        <div className="h-24 lg:h-20" />

      </div>
    </FanLayout>
  )
}
