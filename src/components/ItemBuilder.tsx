import { useState } from "react";
import { X, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CraftingIngredient {
  slot: number;
  item: string;
}

export interface Item {
  id: string;
  identifier: string;
  displayName: string;
  category: string;
  maxStackSize: number;
  damage: number;
  durability: number;
  isFood: boolean;
  foodRestoration: number;
  craftingRecipe: CraftingIngredient[];
  textureUrl?: string;
  description: string;
}

interface ItemBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: Item) => void;
  editItem?: Item | null;
}

const CATEGORIES = [
  "equipment",
  "items",
  "construction",
  "nature",
  "tools",
  "weapons",
];

const COMMON_INGREDIENTS = [
  "minecraft:iron_ingot",
  "minecraft:gold_ingot",
  "minecraft:diamond",
  "minecraft:stick",
  "minecraft:string",
  "minecraft:leather",
  "minecraft:cobblestone",
  "minecraft:wood",
  "minecraft:coal",
  "minecraft:redstone",
];

const ItemBuilder = ({ open, onOpenChange, onSave, editItem }: ItemBuilderProps) => {
  const [identifier, setIdentifier] = useState(editItem?.identifier || "");
  const [displayName, setDisplayName] = useState(editItem?.displayName || "");
  const [category, setCategory] = useState(editItem?.category || "items");
  const [maxStackSize, setMaxStackSize] = useState(editItem?.maxStackSize || 64);
  const [damage, setDamage] = useState(editItem?.damage || 0);
  const [durability, setDurability] = useState(editItem?.durability || 0);
  const [isFood, setIsFood] = useState(editItem?.isFood || false);
  const [foodRestoration, setFoodRestoration] = useState(editItem?.foodRestoration || 0);
  const [craftingRecipe, setCraftingRecipe] = useState<CraftingIngredient[]>(
    editItem?.craftingRecipe || []
  );
  const [textureUrl, setTextureUrl] = useState(editItem?.textureUrl || "");
  const [description, setDescription] = useState(editItem?.description || "");

  const handleSave = () => {
    const item: Item = {
      id: editItem?.id || crypto.randomUUID(),
      identifier: identifier || "custom_item",
      displayName: displayName || "Custom Item",
      category,
      maxStackSize,
      damage,
      durability,
      isFood,
      foodRestoration: isFood ? foodRestoration : 0,
      craftingRecipe,
      textureUrl,
      description,
    };
    onSave(item);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setIdentifier("");
    setDisplayName("");
    setCategory("items");
    setMaxStackSize(64);
    setDamage(0);
    setDurability(0);
    setIsFood(false);
    setFoodRestoration(0);
    setCraftingRecipe([]);
    setTextureUrl("");
    setDescription("");
  };

  const updateCraftingSlot = (slot: number, item: string) => {
    setCraftingRecipe((prev) => {
      const existing = prev.find((i) => i.slot === slot);
      if (item === "") {
        return prev.filter((i) => i.slot !== slot);
      }
      if (existing) {
        return prev.map((i) => (i.slot === slot ? { slot, item } : i));
      }
      return [...prev, { slot, item }];
    });
  };

  const getCraftingSlotValue = (slot: number) => {
    return craftingRecipe.find((i) => i.slot === slot)?.item || "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {editItem ? "Edit Item" : "Create New Item"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="itemIdentifier">Item Identifier</Label>
              <Input
                id="itemIdentifier"
                placeholder="my_addon:custom_item"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemDisplayName">Display Name</Label>
              <Input
                id="itemDisplayName"
                placeholder="Custom Item"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-input"
              />
            </div>
          </div>

          {/* Category & Stack */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-input">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStack">Max Stack Size</Label>
              <Input
                id="maxStack"
                type="number"
                min={1}
                max={64}
                value={maxStackSize}
                onChange={(e) => setMaxStackSize(Number(e.target.value))}
                className="bg-input"
              />
            </div>
          </div>

          {/* Combat Stats */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="itemDamage">Damage</Label>
              <Input
                id="itemDamage"
                type="number"
                min={0}
                max={100}
                value={damage}
                onChange={(e) => setDamage(Number(e.target.value))}
                className="bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemDurability">Durability</Label>
              <Input
                id="itemDurability"
                type="number"
                min={0}
                max={10000}
                value={durability}
                onChange={(e) => setDurability(Number(e.target.value))}
                className="bg-input"
              />
              <p className="text-xs text-muted-foreground">0 = unbreakable</p>
            </div>
          </div>

          {/* Food Properties */}
          <div className="space-y-4 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isFood">Is Food Item</Label>
                <p className="text-sm text-muted-foreground">
                  Enable if this item can be consumed
                </p>
              </div>
              <Switch
                id="isFood"
                checked={isFood}
                onCheckedChange={setIsFood}
              />
            </div>
            {isFood && (
              <div className="space-y-2">
                <Label htmlFor="foodRestoration">Food Restoration</Label>
                <Input
                  id="foodRestoration"
                  type="number"
                  min={0}
                  max={20}
                  value={foodRestoration}
                  onChange={(e) => setFoodRestoration(Number(e.target.value))}
                  className="bg-input"
                />
              </div>
            )}
          </div>

          {/* Crafting Recipe */}
          <div className="space-y-4">
            <Label>Crafting Recipe (3x3 Grid)</Label>
            <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-secondary/50 p-4">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
                <Select
                  key={slot}
                  value={getCraftingSlotValue(slot)}
                  onValueChange={(value) => updateCraftingSlot(slot, value)}
                >
                  <SelectTrigger className="h-12 bg-input text-xs">
                    <SelectValue placeholder="Empty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Empty</SelectItem>
                    {COMMON_INGREDIENTS.map((item) => (
                      <SelectItem key={item} value={item} className="text-xs">
                        {item.replace("minecraft:", "")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          </div>

          {/* Texture Upload */}
          <div className="space-y-2">
            <Label>Texture (Optional)</Label>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded border border-dashed border-border bg-secondary">
                {textureUrl ? (
                  <img
                    src={textureUrl}
                    alt="Item texture"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Image className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <Input
                placeholder="Enter texture URL or base64"
                value={textureUrl}
                onChange={(e) => setTextureUrl(e.target.value)}
                className="flex-1 bg-input"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="itemDesc">Description</Label>
            <Textarea
              id="itemDesc"
              placeholder="Describe your item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] bg-input"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="diamond" onClick={handleSave}>
            {editItem ? "Update Item" : "Create Item"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemBuilder;
