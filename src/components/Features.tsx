import { Code2, Layers, Zap, Download, Eye, Shield } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "No JSON Required",
    description: "Visual interface generates all the complex JSON for you. Focus on creating, not syntax.",
  },
  {
    icon: Layers,
    title: "Complete Packs",
    description: "Build behavior packs, resource packs, or complete addons with both bundled together.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "See your manifest and configurations update in real-time as you build.",
  },
  {
    icon: Download,
    title: "Instant Export",
    description: "Export ready-to-use .mcaddon files that work directly in Minecraft Bedrock.",
  },
  {
    icon: Zap,
    title: "Templates",
    description: "Start from pre-built templates for common addon types and customization needs.",
  },
  {
    icon: Shield,
    title: "Validation",
    description: "Built-in validation ensures your addon follows Bedrock Edition specifications.",
  },
];

const Features = () => {
  return (
    <section id="features" className="border-y border-border bg-card/50 py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Everything You Need
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Professional addon development tools in a simple visual interface
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
