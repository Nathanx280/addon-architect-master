import { ArrowRight, Box, Layers, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Floating elements */}
      <div className="absolute left-10 top-20 h-20 w-20 animate-float rounded bg-primary/10 blur-2xl" />
      <div className="absolute right-20 top-40 h-32 w-32 animate-float rounded bg-accent/10 blur-3xl" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-20 left-1/3 h-24 w-24 animate-float rounded bg-warning/10 blur-2xl" style={{ animationDelay: "4s" }} />
      
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm">
            <Zap className="h-4 w-4 text-warning" />
            <span className="text-muted-foreground">Visual addon builder for Minecraft Bedrock</span>
          </div>
          
          {/* Main heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Build <span className="text-gradient-grass">Minecraft</span> Addons
            <br />
            <span className="text-gradient-diamond">Visually</span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Create behavior packs, resource packs, and complete addons without writing JSON by hand. 
            Visual editor, live preview, and instant export.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="glow" size="xl" className="w-full sm:w-auto">
              Start Building
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="stone" size="xl" className="w-full sm:w-auto">
              View Examples
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">100%</div>
              <div className="mt-1 text-sm text-muted-foreground">No-Code</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent md:text-4xl">Instant</div>
              <div className="mt-1 text-sm text-muted-foreground">Export</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning md:text-4xl">Free</div>
              <div className="mt-1 text-sm text-muted-foreground">Forever</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
