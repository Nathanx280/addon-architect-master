import { useState } from "react";
import { Sword, Shield, Zap, Cookie, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Entity } from "./EntityBuilder";
import type { Item } from "./ItemBuilder";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "weapons" | "mobs" | "items" | "mechanics";
  color: "grass" | "diamond" | "gold";
  entities: Entity[];
  items: Item[];
  packName: string;
  packDescription: string;
}

const TEMPLATES: Template[] = [
  {
    id: "custom-sword",
    name: "Custom Sword Pack",
    description: "A powerful custom sword with special abilities",
    icon: <Sword className="h-6 w-6" />,
    category: "weapons",
    color: "diamond",
    entities: [],
    items: [
      {
        id: "template-sword-1",
        identifier: "my_addon:super_sword",
        displayName: "Super Sword",
        category: "weapons",
        maxStackSize: 1,
        damage: 15,
        durability: 2000,
        isFood: false,
        foodRestoration: 0,
        craftingRecipe: [
          { slot: 1, item: "minecraft:diamond" },
          { slot: 4, item: "minecraft:diamond" },
          { slot: 7, item: "minecraft:stick" },
        ],
        description: "A powerful sword forged from pure diamonds",
      },
    ],
    packName: "Super Sword Pack",
    packDescription: "Adds a powerful custom sword to your game",
  },
  {
    id: "custom-mob",
    name: "Custom Mob Pack",
    description: "A friendly custom creature that roams the world",
    icon: <Crown className="h-6 w-6" />,
    category: "mobs",
    color: "grass",
    entities: [
      {
        id: "template-entity-1",
        identifier: "my_addon:friendly_golem",
        displayName: "Friendly Golem",
        health: 100,
        attackDamage: 8,
        movementSpeed: 0.2,
        spawnBiomes: ["plains", "forest"],
        behavior: "passive",
        description: "A friendly stone golem that protects villages",
      },
    ],
    items: [],
    packName: "Friendly Golem Pack",
    packDescription: "Adds a friendly golem creature to your world",
  },
  {
    id: "power-armor",
    name: "Power Armor Set",
    description: "Complete armor set with enhanced protection",
    icon: <Shield className="h-6 w-6" />,
    category: "items",
    color: "gold",
    entities: [],
    items: [
      {
        id: "template-helmet",
        identifier: "my_addon:power_helmet",
        displayName: "Power Helmet",
        category: "equipment",
        maxStackSize: 1,
        damage: 0,
        durability: 500,
        isFood: false,
        foodRestoration: 0,
        craftingRecipe: [
          { slot: 0, item: "minecraft:diamond" },
          { slot: 1, item: "minecraft:diamond" },
          { slot: 2, item: "minecraft:diamond" },
          { slot: 3, item: "minecraft:diamond" },
          { slot: 5, item: "minecraft:diamond" },
        ],
        description: "Advanced helmet with enhanced protection",
      },
      {
        id: "template-chestplate",
        identifier: "my_addon:power_chestplate",
        displayName: "Power Chestplate",
        category: "equipment",
        maxStackSize: 1,
        damage: 0,
        durability: 800,
        isFood: false,
        foodRestoration: 0,
        craftingRecipe: [
          { slot: 0, item: "minecraft:diamond" },
          { slot: 2, item: "minecraft:diamond" },
          { slot: 3, item: "minecraft:diamond" },
          { slot: 4, item: "minecraft:diamond" },
          { slot: 5, item: "minecraft:diamond" },
          { slot: 6, item: "minecraft:diamond" },
          { slot: 7, item: "minecraft:diamond" },
          { slot: 8, item: "minecraft:diamond" },
        ],
        description: "Advanced chestplate with maximum protection",
      },
    ],
    packName: "Power Armor Pack",
    packDescription: "Adds a complete set of power armor to your game",
  },
  {
    id: "magic-food",
    name: "Magic Food Pack",
    description: "Special food items with unique effects",
    icon: <Cookie className="h-6 w-6" />,
    category: "items",
    color: "grass",
    entities: [],
    items: [
      {
        id: "template-food-1",
        identifier: "my_addon:golden_apple_plus",
        displayName: "Enhanced Golden Apple",
        category: "items",
        maxStackSize: 16,
        damage: 0,
        durability: 0,
        isFood: true,
        foodRestoration: 10,
        craftingRecipe: [
          { slot: 0, item: "minecraft:gold_ingot" },
          { slot: 1, item: "minecraft:gold_ingot" },
          { slot: 2, item: "minecraft:gold_ingot" },
          { slot: 3, item: "minecraft:gold_ingot" },
          { slot: 4, item: "minecraft:diamond" },
          { slot: 5, item: "minecraft:gold_ingot" },
          { slot: 6, item: "minecraft:gold_ingot" },
          { slot: 7, item: "minecraft:gold_ingot" },
          { slot: 8, item: "minecraft:gold_ingot" },
        ],
        description: "A magical apple that grants powerful effects",
      },
    ],
    packName: "Magic Food Pack",
    packDescription: "Adds magical food items with special abilities",
  },
  {
    id: "hostile-boss",
    name: "Boss Mob Pack",
    description: "A challenging boss mob with high stats",
    icon: <Zap className="h-6 w-6" />,
    category: "mobs",
    color: "diamond",
    entities: [
      {
        id: "template-boss-1",
        identifier: "my_addon:shadow_lord",
        displayName: "Shadow Lord",
        health: 500,
        attackDamage: 20,
        movementSpeed: 0.35,
        spawnBiomes: ["nether", "end"],
        behavior: "hostile",
        description: "A fearsome boss that guards treasure",
      },
    ],
    items: [
      {
        id: "template-boss-drop",
        identifier: "my_addon:shadow_essence",
        displayName: "Shadow Essence",
        category: "items",
        maxStackSize: 64,
        damage: 0,
        durability: 0,
        isFood: false,
        foodRestoration: 0,
        craftingRecipe: [],
        description: "Rare essence dropped by the Shadow Lord",
      },
    ],
    packName: "Shadow Lord Boss Pack",
    packDescription: "Adds a challenging boss mob and its unique drops",
  },
  {
    id: "starter-kit",
    name: "Starter Kit",
    description: "Basic tools and items for beginners",
    icon: <Sparkles className="h-6 w-6" />,
    category: "mechanics",
    color: "gold",
    entities: [],
    items: [
      {
        id: "template-starter-sword",
        identifier: "my_addon:starter_sword",
        displayName: "Starter Sword",
        category: "weapons",
        maxStackSize: 1,
        damage: 6,
        durability: 100,
        isFood: false,
        foodRestoration: 0,
        craftingRecipe: [
          { slot: 1, item: "minecraft:iron_ingot" },
          { slot: 4, item: "minecraft:iron_ingot" },
          { slot: 7, item: "minecraft:stick" },
        ],
        description: "A basic sword for new adventurers",
      },
      {
        id: "template-starter-pickaxe",
        identifier: "my_addon:starter_pickaxe",
        displayName: "Starter Pickaxe",
        category: "tools",
        maxStackSize: 1,
        damage: 2,
        durability: 150,
        isFood: false,
        foodRestoration: 0,
        craftingRecipe: [
          { slot: 0, item: "minecraft:iron_ingot" },
          { slot: 1, item: "minecraft:iron_ingot" },
          { slot: 2, item: "minecraft:iron_ingot" },
          { slot: 4, item: "minecraft:stick" },
          { slot: 7, item: "minecraft:stick" },
        ],
        description: "A reliable pickaxe for mining",
      },
    ],
    packName: "Starter Kit Pack",
    packDescription: "Essential tools and items for new players",
  },
];

interface TemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (template: Template) => void;
}

const TemplateGallery = ({ open, onOpenChange, onApply }: TemplateGalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTemplates =
    selectedCategory === "all"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCategory);

  const getColorClasses = (color: string) => {
    switch (color) {
      case "grass":
        return "border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10";
      case "diamond":
        return "border-accent/30 hover:border-accent bg-accent/5 hover:bg-accent/10";
      case "gold":
        return "border-warning/30 hover:border-warning bg-warning/5 hover:bg-warning/10";
      default:
        return "border-border hover:border-muted-foreground";
    }
  };

  const getIconColorClasses = (color: string) => {
    switch (color) {
      case "grass":
        return "text-primary";
      case "diamond":
        return "text-accent";
      case "gold":
        return "text-warning";
      default:
        return "text-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Template Gallery</DialogTitle>
          <DialogDescription>
            Choose a pre-built template to get started quickly
          </DialogDescription>
        </DialogHeader>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 py-4">
          {["all", "weapons", "mobs", "items", "mechanics"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`group cursor-pointer rounded-lg border-2 p-4 transition-all ${getColorClasses(
                template.color
              )}`}
              onClick={() => {
                onApply(template);
                onOpenChange(false);
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg bg-card ${getIconColorClasses(
                    template.color
                  )}`}
                >
                  {template.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                  <div className="mt-2 flex gap-2">
                    {template.entities.length > 0 && (
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs">
                        {template.entities.length} entity
                        {template.entities.length > 1 ? "ies" : ""}
                      </span>
                    )}
                    {template.items.length > 0 && (
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs">
                        {template.items.length} item
                        {template.items.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateGallery;
export type { Template };
