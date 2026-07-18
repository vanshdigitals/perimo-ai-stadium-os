import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';

interface ComingSoonProps {
  isDark: boolean;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ isDark }) => {
  const modules = [
    "Medical Operations",
    "Broadcast Operations",
    "Maintenance",
    "Police Coordination",
    "Fire Response"
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <h4 className={cn("text-[12px] font-bold uppercase tracking-widest", isDark ? "text-[#6B7688]" : "text-[#94A3B8]")}>
        Future Modules
      </h4>
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-[600px]">
        {modules.map((mod, i) => (
          <Badge key={i} variant="outline" label={mod} isDark={isDark} />
        ))}
      </div>
    </div>
  );
};
