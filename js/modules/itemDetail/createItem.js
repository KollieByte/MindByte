export function createItem(name) {
  return {
    id: crypto.randomUUID(),
    type: "item",
    name,
    images: {
      obverse: null,
      reverse: null,
      rounded: false
    },
    coin: {
      origin: {},
      period: {},
      type: {},
      nominal: {},
      material: {},
      mint: {},
      condition: {},
      rarity: {},
      context: {},
      design: {},
      acquisition: {},
      value: {},
      storage: {},
      special: {}
    }
  };
}
