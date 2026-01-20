import { useState } from "react";
import { Box, Palette, Layers, Package, FileJson, Settings, Download, Eye, Trash2, Edit2, Library } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import AddonTypeCard from "./AddonTypeCard";
import EntityBuilder, { Entity } from "./EntityBuilder";
import ItemBuilder, { Item } from "./ItemBuilder";
import TemplateGallery, { Template } from "./TemplateGallery";
import { exportAddon } from "@/lib/exportAddon";

type AddonType = "behavior" | "resource" | "complete";

const AddonBuilder = () => {
  const { toast } = useToast();
  const [addonType, setAddonType] = useState<AddonType>("complete");
  const [packName, setPackName] = useState("");
  const [packDescription, setPackDescription] = useState("");
  const [packVersion, setPackVersion] = useState("1.0.0");
  const [minEngineVersion, setMinEngineVersion] = useState("1.20.0");
  const [author, setAuthor] = useState("");
  
  // Entities & Items
  const [entities, setEntities] = useState<Entity[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  
  // Dialog states
  const [entityDialogOpen, setEntityDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  
  // Settings
  const [autoGenerateUUIDs, setAutoGenerateUUIDs] = useState(true);
  const [includeDependencies, setIncludeDependencies] = useState(true);

  const handleSaveEntity = (entity: Entity) => {
    setEntities((prev) => {
      const existing = prev.find((e) => e.id === entity.id);
      if (existing) {
        return prev.map((e) => (e.id === entity.id ? entity : e));
      }
      return [...prev, entity];
    });
    setEditingEntity(null);
    toast({
      title: "Entity saved",
      description: `${entity.displayName} has been added to your addon.`,
    });
  };

  const handleSaveItem = (item: Item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? item : i));
      }
      return [...prev, item];
    });
    setEditingItem(null);
    toast({
      title: "Item saved",
      description: `${item.displayName} has been added to your addon.`,
    });
  };

  const handleDeleteEntity = (id: string) => {
    setEntities((prev) => prev.filter((e) => e.id !== id));
    toast({
      title: "Entity removed",
      description: "The entity has been removed from your addon.",
    });
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast({
      title: "Item removed",
      description: "The item has been removed from your addon.",
    });
  };

  const handleApplyTemplate = (template: Template) => {
    setPackName(template.packName);
    setPackDescription(template.packDescription);
    setEntities(template.entities);
    setItems(template.items);
    toast({
      title: "Template applied",
      description: `${template.name} template has been loaded.`,
    });
  };

  const handleExport = async () => {
    if (!packName) {
      toast({
        title: "Missing pack name",
        description: "Please enter a name for your addon pack.",
        variant: "destructive",
      });
      return;
    }

    try {
      await exportAddon(
        {
          packName,
          packDescription,
          packVersion,
          minEngineVersion,
          author,
          addonType,
        },
        entities,
        items
      );
      toast({
        title: "Export successful!",
        description: "Your .mcaddon file has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your addon.",
        variant: "destructive",
      });
    }
  };

  const generatePreviewJSON = () => {
    return JSON.stringify(
      {
        format_version: 2,
        header: {
          name: packName || "My Addon",
          description: packDescription || "...",
          uuid: "...",
          version: packVersion.split(".").map(Number),
          min_engine_version: minEngineVersion.split(".").map(Number),
        },
        modules: [
          {
            type: addonType === "resource" ? "resources" : "data",
            uuid: "...",
            version: packVersion.split(".").map(Number),
          },
        ],
        metadata: {
          authors: [author || "Anonymous"],
        },
      },
      null,
      2
    );
  };

  return (
    <section id="builder" className="py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Build Your Addon</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Choose your pack type and configure it step by step. No coding required.
          </p>
        </div>
        
        {/* Template Button */}
        <div className="mb-8 flex justify-center">
          <Button
            variant="gold"
            size="lg"
            className="gap-2"
            onClick={() => setTemplateDialogOpen(true)}
          >
            <Library className="h-5 w-5" />
            Browse Templates
          </Button>
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
                      {entities.length > 0 && (
                        <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          {entities.length}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="items" className="gap-2 data-[state=active]:bg-secondary">
                      <Package className="h-4 w-4" />
                      Items
                      {items.length > 0 && (
                        <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                          {items.length}
                        </span>
                      )}
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
                          value={packVersion}
                          onChange={(e) => setPackVersion(e.target.value)}
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
                          value={minEngineVersion}
                          onChange={(e) => setMinEngineVersion(e.target.value)}
                          className="bg-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input
                          id="author"
                          placeholder="Your name"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          className="bg-input"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="entities" className="mt-0">
                    {entities.length === 0 ? (
                      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border">
                        <Box className="mb-4 h-12 w-12 text-muted-foreground" />
                        <p className="mb-2 font-medium">No entities yet</p>
                        <p className="mb-4 text-sm text-muted-foreground">Add custom entities to your addon</p>
                        <Button variant="grass" size="sm" onClick={() => setEntityDialogOpen(true)}>
                          Add Entity
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-end">
                          <Button variant="grass" size="sm" onClick={() => setEntityDialogOpen(true)}>
                            Add Entity
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          {entities.map((entity) => (
                            <div
                              key={entity.id}
                              className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
                            >
                              <div>
                                <p className="font-medium">{entity.displayName}</p>
                                <p className="text-sm text-muted-foreground">{entity.identifier}</p>
                                <div className="mt-2 flex gap-2">
                                  <span className="rounded bg-primary/20 px-2 py-0.5 text-xs text-primary">
                                    HP: {entity.health}
                                  </span>
                                  <span className="rounded bg-destructive/20 px-2 py-0.5 text-xs text-destructive">
                                    DMG: {entity.attackDamage}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingEntity(entity);
                                    setEntityDialogOpen(true);
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteEntity(entity.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="items" className="mt-0">
                    {items.length === 0 ? (
                      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border">
                        <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                        <p className="mb-2 font-medium">No items yet</p>
                        <p className="mb-4 text-sm text-muted-foreground">Add custom items to your addon</p>
                        <Button variant="diamond" size="sm" onClick={() => setItemDialogOpen(true)}>
                          Add Item
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-end">
                          <Button variant="diamond" size="sm" onClick={() => setItemDialogOpen(true)}>
                            Add Item
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
                            >
                              <div>
                                <p className="font-medium">{item.displayName}</p>
                                <p className="text-sm text-muted-foreground">{item.identifier}</p>
                                <div className="mt-2 flex gap-2">
                                  <span className="rounded bg-accent/20 px-2 py-0.5 text-xs text-accent">
                                    {item.category}
                                  </span>
                                  {item.damage > 0 && (
                                    <span className="rounded bg-destructive/20 px-2 py-0.5 text-xs text-destructive">
                                      DMG: {item.damage}
                                    </span>
                                  )}
                                  {item.isFood && (
                                    <span className="rounded bg-warning/20 px-2 py-0.5 text-xs text-warning">
                                      Food
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingItem(item);
                                    setItemDialogOpen(true);
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="settings" className="mt-0">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div>
                          <p className="font-medium">Generate UUIDs</p>
                          <p className="text-sm text-muted-foreground">Automatically generate unique identifiers</p>
                        </div>
                        <Switch
                          checked={autoGenerateUUIDs}
                          onCheckedChange={setAutoGenerateUUIDs}
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div>
                          <p className="font-medium">Include Dependencies</p>
                          <p className="text-sm text-muted-foreground">Link behavior and resource packs</p>
                        </div>
                        <Switch
                          checked={includeDependencies}
                          onCheckedChange={setIncludeDependencies}
                        />
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
                    {generatePreviewJSON()}
                  </pre>
                </div>
                
                {/* Summary */}
                <div className="mb-4 space-y-2 rounded-lg border border-border p-3">
                  <p className="text-sm font-medium">Pack Summary</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Entities:</span>
                    <span>{entities.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items:</span>
                    <span>{items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">{addonType}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button variant="stone" className="w-full gap-2">
                    <Eye className="h-4 w-4" />
                    Live Preview
                  </Button>
                  <Button variant="grass" className="w-full gap-2" onClick={handleExport}>
                    <Download className="h-4 w-4" />
                    Export .mcaddon
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <EntityBuilder
        open={entityDialogOpen}
        onOpenChange={(open) => {
          setEntityDialogOpen(open);
          if (!open) setEditingEntity(null);
        }}
        onSave={handleSaveEntity}
        editEntity={editingEntity}
      />
      
      <ItemBuilder
        open={itemDialogOpen}
        onOpenChange={(open) => {
          setItemDialogOpen(open);
          if (!open) setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editItem={editingItem}
      />
      
      <TemplateGallery
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        onApply={handleApplyTemplate}
      />
    </section>
  );
};

export default AddonBuilder;
