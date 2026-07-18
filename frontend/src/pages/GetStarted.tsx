import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/layouts/Header";
import { ThemeToggle } from "@/features/role-selection/components/ThemeToggle";
import { usePageTheme } from "@/features/role-selection/hooks/usePageTheme";
import { FanHeroSection } from "@/features/role-selection/components/FanHeroSection";
import { OpsCard } from "@/features/role-selection/components/OpsCard";
import { AdminCard } from "@/features/role-selection/components/AdminCard";
import { ComingSoon } from "@/features/role-selection/components/ComingSoon";
import { ContinueJourney } from "@/features/role-selection/components/ContinueJourney";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { Users, Shield } from "lucide-react";
import { motion } from "framer-motion";

export const GetStarted: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggle } = usePageTheme();

  // Smooth scroll to section based on hash with header offset
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        // Use timeout to ensure layout is painted, especially on page load
        setTimeout(() => {
          const headerOffset = 96; // 72px header + 24px breathing room
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition +
            window.scrollY -
            (id === "fan" ? 72 : headerOffset);

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }, 50);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.hash]);

  return (
    <div
      className={
        isDark ? "min-h-screen bg-[#0A0E14]" : "min-h-screen bg-[#FAFAFA]"
      }
    >
      <Header
        theme={isDark ? "dark" : "light"}
        themeToggle={<ThemeToggle isDark={isDark} onToggle={toggle} />}
      />

      <main>
        {/* 1. Full-Width Flagship Product: Fan Experience */}
        <FanHeroSection
          isDark={isDark}
          onClick={() => navigate("/auth/fan/login")}
        />

        <section className="py-6 sm:py-8 relative z-10">
          <div className="max-w-[1340px] mx-auto px-4 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                id="volunteer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full flex"
              >
                <OpsCard
                  isDark={isDark}
                  title="Volunteer Ops"
                  description="Task coordination, shift management, and incident reporting for ground staff."
                  icon={Users}
                  badge="Workforce"
                  onClick={() => navigate("/auth/volunteer/login")}
                  themeColor="#8B5CF6"
                />
              </motion.div>

              <motion.div
                id="staff"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full flex"
              >
                <OpsCard
                  isDark={isDark}
                  title="Staff Operations"
                  description="Live crowd monitoring, gate control, and emergency response management."
                  icon={Shield}
                  badge="Security"
                  onClick={() => navigate("/auth/staff/login")}
                  themeColor="#2563EB"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-6 sm:py-8 relative z-10">
          <div className="max-w-[1340px] mx-auto px-4 sm:px-8 lg:px-10">
            <motion.div
              id="command-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full flex"
            >
              <AdminCard onClick={() => navigate("/auth/admin/login")} />
            </motion.div>
          </div>
        </section>

        <section className="py-6 sm:py-12 relative z-10">
          <div className="max-w-[1340px] mx-auto px-4 sm:px-8 lg:px-10">
            <motion.div
              id="future-modules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ComingSoon isDark={isDark} />
            </motion.div>
          </div>
        </section>

        {/* 6. Continue Journey CTA */}
        <ContinueJourney
          isDark={isDark}
          onExplore={() => navigate("/auth/fan/login")}
          onLearnMore={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
      </main>

      {/* 7. Premium Enterprise Footer */}
      <LandingFooter isDark={isDark} />
    </div>
  );
};
