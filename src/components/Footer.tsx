import { Box, Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary">
              <Box className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold">Addon Architect</h3>
              <p className="text-sm text-muted-foreground">Build Minecraft addons visually</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Documentation
            </a>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Examples
            </a>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Support
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>Not affiliated with Mojang or Microsoft. Minecraft is a trademark of Mojang AB.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
