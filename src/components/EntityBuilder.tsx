import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export interface Entity {
  id: string;
  identifier: string;
  displayName: string;
  health: number;
  attackDamage: number;
  movementSpeed: number;
  spawnBiomes: string[];
  behavior: string;
  description: string;
}

interface EntityBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entity: Entity) => void;
  editEntity?: Entity | null;
}

const BIOMES = [
  "plains",
  "desert",
  "forest",
  "taiga",
  "swamp",
  "jungle",
  "mountains",
  "ocean",
  "nether",
  "end",
];

const BEHAVIORS = [
  "passive",
  "neutral",
  "hostile",
  "tameable",
  "rideable",
];

const EntityBuilder = ({ open, onOpenChange, onSave, editEntity }: EntityBuilderProps) => {
  const [identifier, setIdentifier] = useState(editEntity?.identifier || "");
  const [displayName, setDisplayName] = useState(editEntity?.displayName || "");
  const [health, setHealth] = useState(editEntity?.health || 20);
  const [attackDamage, setAttackDamage] = useState(editEntity?.attackDamage || 4);
  const [movementSpeed, setMovementSpeed] = useState(editEntity?.movementSpeed || 0.25);
  const [spawnBiomes, setSpawnBiomes] = useState<string[]>(editEntity?.spawnBiomes || []);
  const [behavior, setBehavior] = useState(editEntity?.behavior || "passive");
  const [description, setDescription] = useState(editEntity?.description || "");

  const handleSave = () => {
    const entity: Entity = {
      id: editEntity?.id || crypto.randomUUID(),
      identifier: identifier || "custom_entity",
      displayName: displayName || "Custom Entity",
      health,
      attackDamage,
      movementSpeed,
      spawnBiomes,
      behavior,
      description,
    };
    onSave(entity);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setIdentifier("");
    setDisplayName("");
    setHealth(20);
    setAttackDamage(4);
    setMovementSpeed(0.25);
    setSpawnBiomes([]);
    setBehavior("passive");
    setDescription("");
  };

  const toggleBiome = (biome: string) => {
    setSpawnBiomes((prev) =>
      prev.includes(biome)
        ? prev.filter((b) => b !== biome)
        : [...prev, biome]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editEntity ? "Edit Entity" : "Create New Entity"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="identifier">Entity Identifier</Label>
              <Input
                id="identifier"
                placeholder="my_addon:custom_mob"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="bg-input"
              />
              <p className="text-xs text-muted-foreground">
                Format: namespace:entity_name
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="Custom Mob"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-input"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <h4 className="font-medium">Stats</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="health">Health</Label>
                <Input
                  id="health"
                  type="number"
                  min={1}
                  max={1024}
                  value={health}
                  onChange={(e) => setHealth(Number(e.target.value))}
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attackDamage">Attack Damage</Label>
                <Input
                  id="attackDamage"
                  type="number"
                  min={0}
                  max={100}
                  value={attackDamage}
                  onChange={(e) => setAttackDamage(Number(e.target.value))}
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="movementSpeed">Movement Speed</Label>
                <Input
                  id="movementSpeed"
                  type="number"
                  min={0}
                  max={2}
                  step={0.01}
                  value={movementSpeed}
                  onChange={(e) => setMovementSpeed(Number(e.target.value))}
                  className="bg-input"
                />
              </div>
            </div>
          </div>

          {/* Behavior */}
          <div className="space-y-2">
            <Label>Behavior Type</Label>
            <Select value={behavior} onValueChange={setBehavior}>
              <SelectTrigger className="bg-input">
                <SelectValue placeholder="Select behavior" />
              </SelectTrigger>
              <SelectContent>
                {BEHAVIORS.map((b) => (
                  <SelectItem key={b} value={b} className="capitalize">
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Spawn Biomes */}
          <div className="space-y-2">
            <Label>Spawn Biomes</Label>
            <div className="flex flex-wrap gap-2">
              {BIOMES.map((biome) => (
                <button
                  key={biome}
                  type="button"
                  onClick={() => toggleBiome(biome)}
                  className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                    spawnBiomes.includes(biome)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {biome}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="entityDesc">Description</Label>
            <Textarea
              id="entityDesc"
              placeholder="Describe your entity..."
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
          <Button variant="grass" onClick={handleSave}>
            {editEntity ? "Update Entity" : "Create Entity"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EntityBuilder;
