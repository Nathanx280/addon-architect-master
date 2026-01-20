import { Box, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-primary">
            <Box className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Addon Architect</h1>
            <p className="text-xs text-muted-foreground">Minecraft Bedrock Builder</p>
          </div>
        </div>
        
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#builder" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Builder
          </a>
          <a href="#docs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Docs
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="grass" size="sm" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
