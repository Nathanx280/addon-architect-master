import { useState } from "react";
import { Box, Palette, Layers, Package, FileJson, Settings, Download, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AddonTypeCard from "./AddonTypeCard";

type AddonType = "behavior" | "resource" | "complete";

const AddonBuilder = () => {
  const [addonType, setAddonType] = useState<AddonType>("complete");
  const [packName, setPackName] = useState("");
  const [packDescription, setPackDescription] = useState("");
  
  return (
    <section id="builder" className="py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Build Your Addon</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Choose your pack type and configure it step by step. No coding required.
          </p>
        </div>
        
        {/* Addon Type Selection */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <AddonTypeCard
            title="Behavior Pack"
            description="Game mechanics, entities, items, recipes"
            icon={Box}
            color="grass"
            selected={addonType === "behavior"}
            onClick={() => setAddonType("behavior")}
          />
          <AddonTypeCard
            title="Resource Pack"
            description="Textures, models, sounds, animations"
            icon={Palette}
            color="diamond"
            selected={addonType === "resource"}
            onClick={() => setAddonType("resource")}
          />
          <AddonTypeCard
            title="Complete Addon"
            description="Both packs bundled together"
            icon={Layers}
            color="gold"
            selected={addonType === "complete"}
            onClick={() => setAddonType("complete")}
          />
        </div>

        {/* Builder Interface */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-border bg-card">
              <Tabs defaultValue="manifest" className="w-full">
                <div className="border-b border-border px-4">
                  <TabsList className="h-14 w-full justify-start gap-2 bg-transparent">
                    <TabsTrigger value="manifest" className="gap-2 data-[state=active]:bg-secondary">
                      <FileJson className="h-4 w-4" />
                      Manifest
                    </TabsTrigger>
                    <TabsTrigger value="entities" className="gap-2 data-[state=active]:bg-secondary">
                      <Box className="h-4 w-4" />
                      Entities
                    </TabsTrigger>
                    <TabsTrigger value="items" className="gap-2 data-[state=active]:bg-secondary">
                      <Package className="h-4 w-4" />
                      Items
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-secondary">
                      <Settings className="h-4 w-4" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="p-6">
                  <TabsContent value="manifest" className="mt-0 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="packName">Pack Name</Label>
                        <Input
                          id="packName"
                          placeholder="My Awesome Addon"
                          value={packName}
                          onChange={(e) => setPackName(e.target.value)}
                          className="bg-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="packVersion">Version</Label>
                        <Input
                          id="packVersion"
                          placeholder="1.0.0"
                          defaultValue="1.0.0"
                          className="bg-input"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="packDesc">Description</Label>
                      <Textarea
                        id="packDesc"
                        placeholder="Describe your addon..."
                        value={packDescription}
                        onChange={(e) => setPackDescription(e.target.value)}
                        className="min-h-[100px] bg-input"
                      />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="minEngine">Min Engine Version</Label>
                        <Input
                          id="minEngine"
                          placeholder="1.20.0"
                          defaultValue="1.20.0"
                          className="bg-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input
                          id="author"
                          placeholder="Your name"
                          className="bg-input"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="entities" className="mt-0">
                    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border">
                      <Box className="mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="mb-2 font-medium">No entities yet</p>
                      <p className="mb-4 text-sm text-muted-foreground">Add custom entities to your addon</p>
                      <Button variant="grass" size="sm">Add Entity</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="items" className="mt-0">
                    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border">
                      <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="mb-2 font-medium">No items yet</p>
                      <p className="mb-4 text-sm text-muted-foreground">Add custom items to your addon</p>
                      <Button variant="diamond" size="sm">Add Item</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="mt-0">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div>
                          <p className="font-medium">Generate UUIDs</p>
                          <p className="text-sm text-muted-foreground">Automatically generate unique identifiers</p>
                        </div>
                        <div className="h-6 w-11 rounded-full bg-primary" />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div>
                          <p className="font-medium">Include Dependencies</p>
                          <p className="text-sm text-muted-foreground">Link behavior and resource packs</p>
                        </div>
                        <div className="h-6 w-11 rounded-full bg-primary" />
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
          
          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border border-border bg-card">
              <div className="border-b border-border p-4">
                <h3 className="font-semibold">Preview</h3>
              </div>
              <div className="p-4">
                <div className="mb-4 rounded-lg bg-muted p-4 font-mono text-xs">
                  <pre className="overflow-x-auto text-muted-foreground">
{`{
  "format_version": 2,
  "header": {
    "name": "${packName || "My Addon"}",
    "description": "${packDescription || "..."}",
    "uuid": "...",
    "version": [1, 0, 0],
    "min_engine_version": [1, 20, 0]
  }
}`}
                  </pre>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button variant="stone" className="w-full gap-2">
                    <Eye className="h-4 w-4" />
                    Live Preview
                  </Button>
                  <Button variant="grass" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Export .mcaddon
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddonBuilder;
