import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { Entity } from "@/components/EntityBuilder";
import type { Item } from "@/components/ItemBuilder";

interface ManifestConfig {
  packName: string;
  packDescription: string;
  packVersion: string;
  minEngineVersion: string;
  author: string;
  addonType: "behavior" | "resource" | "complete";
}

const generateUUID = () => crypto.randomUUID();

const createBehaviorManifest = (config: ManifestConfig) => {
  const uuid = generateUUID();
  const moduleUuid = generateUUID();
  const version = config.packVersion.split(".").map(Number);
  const minEngine = config.minEngineVersion.split(".").map(Number);

  return {
    format_version: 2,
    header: {
      name: config.packName,
      description: config.packDescription,
      uuid: uuid,
      version: version,
      min_engine_version: minEngine,
    },
    modules: [
      {
        type: "data",
        uuid: moduleUuid,
        version: version,
      },
    ],
    metadata: {
      authors: [config.author],
      generated_with: {
        addon_architect: ["1.0.0"],
      },
    },
  };
};

const createResourceManifest = (config: ManifestConfig, behaviorUuid?: string) => {
  const uuid = generateUUID();
  const moduleUuid = generateUUID();
  const version = config.packVersion.split(".").map(Number);
  const minEngine = config.minEngineVersion.split(".").map(Number);

  const manifest: any = {
    format_version: 2,
    header: {
      name: `${config.packName} Resources`,
      description: config.packDescription,
      uuid: uuid,
      version: version,
      min_engine_version: minEngine,
    },
    modules: [
      {
        type: "resources",
        uuid: moduleUuid,
        version: version,
      },
    ],
    metadata: {
      authors: [config.author],
      generated_with: {
        addon_architect: ["1.0.0"],
      },
    },
  };

  if (behaviorUuid) {
    manifest.dependencies = [
      {
        uuid: behaviorUuid,
        version: version,
      },
    ];
  }

  return { manifest, uuid };
};

const createEntityBehavior = (entity: Entity) => {
  const behavior: any = {
    format_version: "1.20.0",
    "minecraft:entity": {
      description: {
        identifier: entity.identifier,
        is_spawnable: true,
        is_summonable: true,
        is_experimental: false,
      },
      component_groups: {},
      components: {
        "minecraft:health": {
          value: entity.health,
          max: entity.health,
        },
        "minecraft:movement": {
          value: entity.movementSpeed,
        },
        "minecraft:collision_box": {
          width: 0.6,
          height: 1.8,
        },
        "minecraft:physics": {},
        "minecraft:pushable": {
          is_pushable: true,
          is_pushable_by_piston: true,
        },
      },
      events: {},
    },
  };

  if (entity.behavior === "hostile" || entity.attackDamage > 0) {
    behavior["minecraft:entity"].components["minecraft:attack"] = {
      damage: entity.attackDamage,
    };
  }

  if (entity.behavior === "hostile") {
    behavior["minecraft:entity"].components["minecraft:behavior.nearest_attackable_target"] = {
      priority: 2,
      entity_types: [
        {
          filters: { test: "is_family", subject: "other", value: "player" },
          max_dist: 16,
        },
      ],
    };
  }

  return behavior;
};

const createItemBehavior = (item: Item) => {
  const behavior: any = {
    format_version: "1.20.0",
    "minecraft:item": {
      description: {
        identifier: item.identifier,
        category: item.category,
      },
      components: {
        "minecraft:max_stack_size": item.maxStackSize,
      },
    },
  };

  if (item.damage > 0) {
    behavior["minecraft:item"].components["minecraft:damage"] = item.damage;
  }

  if (item.durability > 0) {
    behavior["minecraft:item"].components["minecraft:durability"] = {
      max_durability: item.durability,
    };
  }

  if (item.isFood && item.foodRestoration > 0) {
    behavior["minecraft:item"].components["minecraft:food"] = {
      nutrition: item.foodRestoration,
      saturation_modifier: "normal",
      can_always_eat: false,
    };
  }

  return behavior;
};

const createCraftingRecipe = (item: Item) => {
  if (item.craftingRecipe.length === 0) return null;

  const pattern = ["   ", "   ", "   "];
  const key: Record<string, { item: string }> = {};
  const keyMap: Record<string, string> = {};
  let keyIndex = 0;
  const keyChars = "ABCDEFGHI";

  item.craftingRecipe.forEach((ingredient) => {
    const row = Math.floor(ingredient.slot / 3);
    const col = ingredient.slot % 3;

    if (!keyMap[ingredient.item]) {
      keyMap[ingredient.item] = keyChars[keyIndex];
      key[keyChars[keyIndex]] = { item: ingredient.item };
      keyIndex++;
    }

    const patternRow = pattern[row].split("");
    patternRow[col] = keyMap[ingredient.item];
    pattern[row] = patternRow.join("");
  });

  return {
    format_version: "1.20.0",
    "minecraft:recipe_shaped": {
      description: {
        identifier: `${item.identifier}_recipe`,
      },
      tags: ["crafting_table"],
      pattern: pattern,
      key: key,
      result: {
        item: item.identifier,
        count: 1,
      },
    },
  };
};

export const exportAddon = async (
  config: ManifestConfig,
  entities: Entity[],
  items: Item[]
) => {
  const zip = new JSZip();
  const packName = config.packName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

  if (config.addonType === "behavior" || config.addonType === "complete") {
    const bp = zip.folder(`${packName}_BP`);
    if (!bp) throw new Error("Failed to create behavior pack folder");

    // Manifest
    const bpManifest = createBehaviorManifest(config);
    bp.file("manifest.json", JSON.stringify(bpManifest, null, 2));

    // Pack icon placeholder
    bp.file("pack_icon.png", ""); // Would need actual image data

    // Entities
    if (entities.length > 0) {
      const entitiesFolder = bp.folder("entities");
      entities.forEach((entity) => {
        const entityName = entity.identifier.split(":")[1] || "custom_entity";
        entitiesFolder?.file(
          `${entityName}.json`,
          JSON.stringify(createEntityBehavior(entity), null, 2)
        );
      });
    }

    // Items
    if (items.length > 0) {
      const itemsFolder = bp.folder("items");
      const recipesFolder = bp.folder("recipes");

      items.forEach((item) => {
        const itemName = item.identifier.split(":")[1] || "custom_item";
        itemsFolder?.file(
          `${itemName}.json`,
          JSON.stringify(createItemBehavior(item), null, 2)
        );

        const recipe = createCraftingRecipe(item);
        if (recipe) {
          recipesFolder?.file(
            `${itemName}_recipe.json`,
            JSON.stringify(recipe, null, 2)
          );
        }
      });
    }
  }

  if (config.addonType === "resource" || config.addonType === "complete") {
    const rp = zip.folder(`${packName}_RP`);
    if (!rp) throw new Error("Failed to create resource pack folder");

    // Manifest
    const { manifest: rpManifest } = createResourceManifest(config);
    rp.file("manifest.json", JSON.stringify(rpManifest, null, 2));

    // Pack icon placeholder
    rp.file("pack_icon.png", "");

    // Textures folder structure
    const textures = rp.folder("textures");
    textures?.folder("entity");
    textures?.folder("items");

    // Entity textures and render controllers would go here
    if (entities.length > 0) {
      const entityFolder = rp.folder("entity");
      entities.forEach((entity) => {
        const entityName = entity.identifier.split(":")[1] || "custom_entity";
        const clientEntity = {
          format_version: "1.10.0",
          "minecraft:client_entity": {
            description: {
              identifier: entity.identifier,
              materials: { default: "entity_alphatest" },
              textures: {
                default: `textures/entity/${entityName}`,
              },
              geometry: { default: "geometry.humanoid" },
              render_controllers: ["controller.render.default"],
              spawn_egg: {
                base_color: "#4A7C59",
                overlay_color: "#8B4513",
              },
            },
          },
        };
        entityFolder?.file(
          `${entityName}.entity.json`,
          JSON.stringify(clientEntity, null, 2)
        );
      });
    }

    // Item textures definition
    if (items.length > 0) {
      const itemTextureDefinition: Record<string, { textures: string }> = {};
      items.forEach((item) => {
        const itemName = item.identifier.split(":")[1] || "custom_item";
        itemTextureDefinition[itemName] = {
          textures: `textures/items/${itemName}`,
        };
      });

      textures?.file(
        "item_texture.json",
        JSON.stringify(
          {
            resource_pack_name: config.packName,
            texture_name: "atlas.items",
            texture_data: itemTextureDefinition,
          },
          null,
          2
        )
      );
    }
  }

  // Generate and download
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${packName}.mcaddon`);
};
