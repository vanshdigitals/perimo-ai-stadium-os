import React from 'react';
import { FanLayout } from '@/components/layouts/FanLayout';
import { FanScreen } from '@/features/fan/shared/FanScreen';
import { useHome } from '@/features/fan/home/useHome';
import { PremiumHomeHero } from '@/features/fan/home/components/PremiumHomeHero';
import { MatchDayStatusStrip } from '@/features/fan/home/components/MatchDayStatusStrip';
import { QuickActionTile } from '@/features/fan/home/components/QuickActionTile';
import { MatchPreviewCard } from '@/features/fan/home/components/MatchPreviewCard';
import { ForYouDiscovery } from '@/features/fan/home/components/ForYouDiscovery';
import { HomeSkeleton } from '@/features/fan/home/components/HomeSkeleton';
import { AlertTriangle } from 'lucide-react';

export const FanDashboard: React.FC = () => {
  const { data: home, loading, error } = useHome();

  if (loading) {
    return (
      <FanLayout>
        <FanScreen isFluid>
          <HomeSkeleton />
        </FanScreen>
      </FanLayout>
    );
  }

  if (error) {
    return (
      <FanLayout>
        <FanScreen>
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-[#0F172A] mb-2">Experience Unavailable</h2>
            <p className="text-[#5B6472] text-sm max-w-sm">We couldn't load your Fan Experience at this time. Please check your connection and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-[#2563EB] text-white font-semibold rounded-full hover:bg-[#1D4ED8] transition-colors"
            >
              Try Again
            </button>
          </div>
        </FanScreen>
      </FanLayout>
    );
  }

  if (!home) {
    return (
      <FanLayout>
        <FanScreen>
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-[#5B6472]">
            No match data available right now. Check back closer to kickoff.
          </div>
        </FanScreen>
      </FanLayout>
    );
  }

  return (
    <FanLayout>
      <FanScreen isFluid>
        <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">

          <PremiumHomeHero home={home} />

          <MatchDayStatusStrip home={home} />

          <section>
            <h3 className="text-lg font-bold text-[#0F172A] tracking-tight mb-4">Quick Actions</h3>
            <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 lg:gap-4">
              {home.quickActions.map((action, idx) => (
                <QuickActionTile key={action.id} action={action} index={idx} />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#0F172A] tracking-tight mb-4">Match Preview</h3>
            <MatchPreviewCard />
          </section>

          <section className="pb-12">
            <ForYouDiscovery />
          </section>

        </div>
      </FanScreen>
    </FanLayout>
  );
};
