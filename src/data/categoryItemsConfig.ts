export const categoryIdNameMap = {
  1: "Abandoned Site",
  2: "Alchemy Supplies",
  3: "Armorer",
  4: "Armorer's Table",
  5: "Bandit Camp",
  6: "Barber",
  7: "Blacksmith",
  8: "Brothel",
  9: "Book",
  10: "Fist Fight",
  11: "Chest",
  12: "Contract",
  13: "Entrance",
  14: "Grindstone",
  15: "Guarded Treasure",
  16: "Gwent Player",
  17: "Gwent Card",
  18: "Hanse Base ",
  19: "Harbor",
  20: "Hearts of Stone Quest",
  21: "Herbalist",
  22: "Hidden Treasure",
  23: "Horse Race",
  24: "Innkeep",
  25: "Vineyard Infestation",
  26: "Knight in Distress",
  27: "Leibioda Monument",
  29: "Main Quest",
  30: "Miscellaneous",
  31: "Monster Den",
  32: "Monster Nest",
  33: "Mutagen",
  34: "Notice Board",
  35: "Person in Distress",
  36: "Place of Power",
  37: "Point of Interest",
  38: "Portal",
  39: "Quest Item",
  40: "Relic Item",
  42: "Secondary Quest",
  43: "Shopkeeper",
  44: "Signpost",
  45: "Smuggler's Cache",
  46: "Spoils of War",
  47: "Stash",
  48: "Untracked Quest",
  49: "Vintner's Contract",
  50: "Witcher Gear",
  53: "Armor",
  54: "Armor Shop",
  55: "Bargainer Statue",
  56: "Bow",
  57: "Building",
  58: "Cave",
  59: "Cave Entrance",
  60: "Chasm",
  61: "Cooking Pot",
  62: "Crystal Refinery",
  63: "Device Dispenser",
  64: "Dragon Tear",
  65: "Dye Shop ",
  66: "Enemy Camp",
  67: "Great Fairy",
  68: "Frox",
  69: "General Store",
  70: "Gleeok",
  71: "Goddess Statue",
  72: "Hestu",
  73: "Hudson Sign",
  74: "Inn",
  75: "Jewelry Shop",
  76: "Key Item",
  77: "Light Root",
  78: "Lynel",
  79: "Main Quest",
  80: "Memory",
  81: "Traveling Merchant",
  82: "Mini-Game",
  83: "NPC",
  84: "Old Map",
  85: "Paraglider Fabric",
  86: "Point of Interest",
  87: "Quest Objective",
  88: "Sage's Will",
  89: "Korok Seed",
  90: "Settlement",
  91: "Shrine",
  92: "Shrine Quest",
  93: "Side Adventure",
  94: "Side Quest",
  95: "Stable",
  96: "Talus",
  97: "Tech Lab",
  98: "Temple",
  99: "Skyview Tower",
  100: "Well",
  101: "Yiga Schematic",
  102: "Zonai Relief",
  103: "Schema Stone",
  104: "Mighty Thistle",
  105: "Fleet-Lotus Seeds",
  106: "Fairy",
  107: "Bomb Flower",
  108: "Razor Claw Crab",
  109: "Silentshroom",
  110: "Weapon",
  111: "Apple",
  112: "Golden Apple",
  113: "Dazzle Fruit",
  114: "Shock Fruit",
  116: "Splash Fruit",
  117: "Ice Fruit",
  118: "Fire Fruit",
  119: "Mighty Bananas",
  120: "Voltfruit",
  121: "Hydromelon",
  122: "Spicy Pepper",
  123: "Hylian Tomato",
  124: "Hylian Shroom",
  125: "Skyshroom",
  126: "Satori Tree",
};

export const categoryItemsConfig = [
  {
    gameSlug: "totk",
    categoryGroups: [
      {
        name: "locations",
        groupId: 1,
        members: [57, 58, 60, 67, 71, 77, 86, 90, 91, 99, 97, 98],
      },
      {
        name: "services",
        groupId: 2,
        members: [54, 55, 62, 63, 65, 69, 72, 74, 75, 82, 81, 95],
      },
      {
        name: "collectibles",
        groupId: 3,
        members: [64, 76, 89, 84, 88, 85, 103, 101, 102],
      },
      {
        name: "loot",
        groupId: 4,
        members: [53, 56, 110],
      },
      {
        name: "quest",
        groupId: 5,
        members: [92, 93, 94, 87, 80, 79],
      },
      {
        name: "enemies",
        groupId: 6,
        members: [68, 66, 70, 78, 96],
      },
      {
        name: "other",
        groupId: 7,
        members: [59, 73, 83, 100, 61, 126],
      },
      {
        name: "fruits",
        members: [111, 112],
      },
      {
        name: "materials",
        groupId: 8,
        members: [104, 105, 106, 107, 109],
      },
      {
        name: "creatures",
        groupId: 9,
        members: [108],
      },
    ],
  },
  {
    gameSlug: "witcher3",
    categoryGroups: [
      {
        name: "locations",
        
        groupId: 1,
        members: [5
          // ["abandoned", "Abandoned Site"],
          // ["banditcamp", "Bandit Camp"],
          // ["contract", "Contract"],
          // ["entrance", "Entrance"],
          // ["guarded", "Guarded Treasure"],
          // ["hansebase", "Hanse Base"],
          // ["harbor", "Harbor"],
          // ["kid", "Knight in Distress"],
          // ["lebioda", "Lebioda Monument"],
          // ["magiclamp", "Magic Lamp"],
          // ["monsterden", "Monster Den"],
          // ["monsternest", "Monster Nest"],
          // ["notice", "Notice Board"],
          // ["pid", "Person in Distress"],
          // ["portal", "Portal"],
          // ["pop", "Place of Power"],
          // ["poi", "Point of Interest"],
          // ["signpost", "Signpost"],
          // ["smugglers", "Smuggler's Cache"],
          // ["spoils", "Spoils of War"],
          // ["stash", "Stash"],
          // ["vintnerscontract", "Vintner's Contract"],
          // ["infestation", "Vineyard Infestation"],
        ],
      },
      {
        name: "services",
        
        groupId: 2,
        members: [4
          // ["alchemy", "Alchemy Supplies"],
          // ["armourer", "Armorer"],
          // ["armourerstable", "Armorer's Table"],
          // ["barber", "Barber"],
          // ["blacksmith", "Blacksmith"],
          // ["brothel", "Brothel"],
          // ["grindstone", "Grindstone"],
          // ["gwent", "Gwent Player"],
          // ["herbalist", "Herbalist"],
          // ["innkeep", "Innkeep"],
          // ["runewright", "Runewright"],
          // ["shopkeeper", "Shopkeeper"],
        ],
      },
      {
        name: "quests",
        
        groupId: 3,
        members: [3
          // ["bwquest", "Blood and Wine Quest"],
          // ["fistfight", "Fist Fight"],
          // ["hsquest", "Hearts of Stone Quest"],
          // ["hidden", "Hidden Treasure"],
          // ["horserace", "Horse Race"],
          // ["mainquest", "Main Quest"],
          // ["secondaryquest", "Secondary Quest"],
          // ["untrackedquest", "Untracked Quest"],
        ],
      },
      {
        name: "items",
        
        groupId: 4,
        members: [2
          // ["book", "Book"],
          // ["chest", "Chest"],
          // ["gwentcard", "Gwent Card"],
          // ["mutagen", "Mutagen"],
          // ["questitem", "Quest Item"],
          // ["relic", "Relic Item"],
          // ["witchergear", "Witcher Gear"],
        ],
      },
      {
        name: "other",
        
        groupId: 5,
        members: [1
          // ["miscellaneous", "Miscellaneous"],
          // ["npc", "NPC"],
        ],
      },
    ],
  },
];
