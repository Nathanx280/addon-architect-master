import { useState, useEffect } from "react";
import { Sun, Moon, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "dark" | "light";
type AccentColor = "grass" | "diamond" | "gold" | "redstone" | "amethyst";

const ACCENT_COLORS: Record<AccentColor, { primary: string; name: string }> = {
  grass: { primary: "115 52% 52%", name: "Grass Green" },
  diamond: { primary: "174 75% 58%", name: "Diamond Blue" },
  gold: { primary: "43 96% 56%", name: "Gold" },
  redstone: { primary: "0 72% 51%", name: "Redstone" },
  amethyst: { primary: "270 60% 60%", name: "Amethyst" },
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [accent, setAccent] = useState<AccentColor>("grass");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedAccent = localStorage.getItem("accent") as AccentColor | null;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedAccent) setAccent(savedAccent);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme
    if (theme === "light") {
      root.style.setProperty("--background", "40 30% 96%");
      root.style.setProperty("--foreground", "220 20% 15%");
      root.style.setProperty("--card", "40 25% 92%");
      root.style.setProperty("--card-foreground", "220 20% 15%");
      root.style.setProperty("--popover", "40 25% 94%");
      root.style.setProperty("--popover-foreground", "220 20% 15%");
      root.style.setProperty("--secondary", "40 20% 88%");
      root.style.setProperty("--secondary-foreground", "220 15% 25%");
      root.style.setProperty("--muted", "40 15% 85%");
      root.style.setProperty("--muted-foreground", "220 10% 45%");
      root.style.setProperty("--border", "40 15% 80%");
      root.style.setProperty("--input", "40 20% 90%");
    } else {
      root.style.setProperty("--background", "220 20% 8%");
      root.style.setProperty("--foreground", "180 10% 92%");
      root.style.setProperty("--card", "220 18% 12%");
      root.style.setProperty("--card-foreground", "180 10% 92%");
      root.style.setProperty("--popover", "220 20% 10%");
      root.style.setProperty("--popover-foreground", "180 10% 92%");
      root.style.setProperty("--secondary", "220 15% 18%");
      root.style.setProperty("--secondary-foreground", "180 10% 85%");
      root.style.setProperty("--muted", "220 12% 15%");
      root.style.setProperty("--muted-foreground", "220 10% 55%");
      root.style.setProperty("--border", "220 15% 20%");
      root.style.setProperty("--input", "220 15% 16%");
    }

    // Apply accent color
    const accentConfig = ACCENT_COLORS[accent];
    root.style.setProperty("--primary", accentConfig.primary);
    root.style.setProperty("--ring", accentConfig.primary);

    // Update gradients based on accent
    const hue = parseInt(accentConfig.primary.split(" ")[0]);
    root.style.setProperty(
      "--gradient-grass",
      `linear-gradient(135deg, hsl(${accentConfig.primary}) 0%, hsl(${hue} 45% 40%) 100%)`
    );

    localStorage.setItem("theme", theme);
    localStorage.setItem("accent", accent);
  }, [theme, accent]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-9 w-9"
      >
        {theme === "dark" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Palette className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Accent Color</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {Object.entries(ACCENT_COLORS).map(([key, value]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setAccent(key as AccentColor)}
              className="flex items-center gap-2"
            >
              <div
                className="h-4 w-4 rounded-full"
                style={{ background: `hsl(${value.primary})` }}
              />
              <span>{value.name}</span>
              {accent === key && (
                <span className="ml-auto text-xs text-muted-foreground">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThemeToggle;
