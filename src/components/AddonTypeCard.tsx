import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AddonTypeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "grass" | "diamond" | "gold";
  selected?: boolean;
  onClick?: () => void;
}

const colorStyles = {
  grass: {
    border: "border-primary/50 hover:border-primary",
    icon: "bg-primary/20 text-primary",
    glow: "group-hover:glow-primary",
  },
  diamond: {
    border: "border-accent/50 hover:border-accent",
    icon: "bg-accent/20 text-accent",
    glow: "group-hover:glow-accent",
  },
  gold: {
    border: "border-warning/50 hover:border-warning",
    icon: "bg-warning/20 text-warning",
    glow: "group-hover:glow-gold",
  },
};

const AddonTypeCard = ({ title, description, icon: Icon, color, selected, onClick }: AddonTypeCardProps) => {
  const styles = colorStyles[color];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center rounded-lg border-2 bg-card p-6 text-center transition-all duration-300",
        styles.border,
        selected && "ring-2 ring-offset-2 ring-offset-background",
        selected && color === "grass" && "ring-primary",
        selected && color === "diamond" && "ring-accent",
        selected && color === "gold" && "ring-warning"
      )}
    >
      <div className={cn("mb-4 rounded-lg p-4 transition-all duration-300", styles.icon, styles.glow)}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </button>
  );
};

export default AddonTypeCard;
