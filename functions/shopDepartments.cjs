const DEPARTMENTS = [
  {id: "firearms", label: "Firearms"},
  {id: "ammunition", label: "Ammunition"},
  {id: "optics", label: "Optics"},
  {id: "reloading", label: "Reloading"},
  {id: "gun-parts", label: "Gun Parts"},
  {id: "shooting", label: "Shooting"},
  {id: "outdoors", label: "Outdoors"},
  {id: "hunting", label: "Hunting"},
  {id: "knives-tools", label: "Knives & Tools"},
  {id: "clothing-footwear", label: "Clothing & Footwear"},
  {id: "airguns", label: "Airguns"},
  {id: "archery", label: "Archery"},
  {id: "suppressors", label: "Suppressors"},
  {id: "cases-safes-storage", label: "Cases, Safes & Storage"},
];

const FINDER_TABS = [
  {id: "firearms", label: "Firearms", departments: ["firearms"]},
  {id: "ammunition", label: "Ammunition", departments: ["ammunition"]},
  {id: "optics", label: "Optics", departments: ["optics"]},
  {
    id: "accessories",
    label: "Accessories",
    departments: [
      "gun-parts", "shooting", "outdoors", "hunting", "knives-tools",
      "clothing-footwear", "airguns", "archery", "suppressors",
      "cases-safes-storage", "reloading",
    ],
  },
];

const EXACT_PARENT = {
  // Firearms — actual guns only
  "Firearms": "firearms",
  "Handguns": "firearms",
  "Rifles": "firearms",
  "Shotguns": "firearms",
  "Short Barreled Rifles": "firearms",
  "Lowers": "firearms",
  "Uppers": "firearms",
  "Black Powder Rifles": "firearms",
  "Black Powder Pistols": "firearms",
  "Black Powder Cannons": "firearms",
  "Black Powder Rifle Kits": "firearms",
  "Flintlock": "firearms",
  "Inline": "firearms",
  "CA Compliant": "firearms",

  // Ammunition
  "Ammunition": "ammunition",
  "Handgun Ammunition": "ammunition",
  "Rifle Ammunition": "ammunition",
  "Rimfire Ammunition": "ammunition",
  "Shotgun Ammunition": "ammunition",
  "Shotshell Storage": "ammunition",

  // Reloading
  "Reloading": "reloading",
  "Reloading Kits": "reloading",
  "Brass": "reloading",
  "Pistol Brass": "reloading",
  "Rifle Brass": "reloading",
  "Pistol Bullets": "reloading",
  "Rifle Bullets": "reloading",
  "Pistol Dies": "reloading",
  "Rifle Dies": "reloading",
  "Pistol Powder": "reloading",
  "Rifle Powder": "reloading",
  "Shotshell Powder": "reloading",
  "Pistol Primers": "reloading",
  "Rifle Primers": "reloading",
  "Shotshell Primers": "reloading",
  "Percussion Caps & Primers": "reloading",
  "Percussion Cap": "reloading",
  "Tumblers & Media": "reloading",
  "Case Prep Tools": "reloading",
  "Case Lubes": "reloading",
  "Dies": "reloading",
  "Presses": "reloading",
  "Single Stage Presses": "reloading",
  "Progressive Presses": "reloading",
  "Turret Presses": "reloading",
  "Press Parts & Accessories": "reloading",
  "Powder Measures": "reloading",
  "Powder Measures Dispensers & Scales": "reloading",
  "Die Parts Shell Holders & Accessories": "reloading",
  "Shell Holders": "reloading",
  "Shell Holders & Plates": "reloading",
  "Calipers & Micrometers": "reloading",
  "Headspace Gauges": "reloading",
  "Bullet Pullers": "reloading",
  "Bullet Casting": "reloading",
  "Primer Accessories & Fuses": "reloading",
  "Components": "reloading",
  "Benches & Stands": "reloading",

  // Muzzleloader — reloading
  "Muzzleloader Bullets & Sabots": "reloading",
  "Muzzleloader Cappers & Speed Loaders": "reloading",
  "Muzzleloader Cleaning & Accessories": "reloading",
  "Muzzleloader Ramrods": "reloading",
  "Black Powder Substitutes": "reloading",
  "Black Powder Substitutes & Accessories": "reloading",
  "Breech & Wrenches": "reloading",

  // Optics
  "Optics": "optics",
  "Rifle Scopes": "optics",
  "Handgun Sights": "optics",
  "Rifle Sights": "optics",
  "Shotgun Sights": "optics",
  "Shotgun Scopes": "optics",
  "Pistol Scopes": "optics",
  "Rimfire Scopes": "optics",
  "Muzzleloader Scopes": "optics",
  "Red Dot Sights": "optics",
  "Reflex": "optics",
  "Magnifier": "optics",
  "Laser Sights": "optics",
  "Boresighters": "optics",
  "Binoculars": "optics",
  "Rangefinders": "optics",
  "Rangefinding Binoculars": "optics",
  "Spotting Scopes": "optics",
  "Monoculars": "optics",
  "Night Vision Monoculars": "optics",
  "Night Vision Binoculars": "optics",
  "Night Vision Goggles": "optics",
  "Night Vision Rifle Scopes": "optics",
  "Night Vision Accessories": "optics",
  "Thermal Rifle Scopes": "optics",
  "Thermal Binoculars": "optics",
  "Thermal Monoculars": "optics",
  "Thermal Imaging Cameras": "optics",
  "Thermal Accessories": "optics",
  "Thermal Imaging": "optics",
  "Scope Bases & Mounts": "optics",
  "Scope Rings": "optics",
  "Scope Covers & Sunshades": "optics",
  "Scope Accessories": "optics",
  "Red Dot Sight Mounts & Adapters": "optics",
  "Picatinny-Style Universal Mounts": "optics",
  "Bases & Mounts by Gun Make & Model": "optics",
  "Air Rifle Scopes": "optics",
  "Centerfire Scopes": "optics",
  "Fiber Optic Sights": "optics",
  "Night Sights": "optics",
  "Suppressor Height Sights": "optics",
  "Tripods": "optics",
  "Spotting Scope Tripods & Mounting": "optics",
  "Monopods": "optics",

  // Gun Parts
  "Gun Parts": "gun-parts",
  "Gun Parts & Tools": "gun-parts",
  "Parts": "gun-parts",
  "Rifle Parts": "gun-parts",
  "Handguards": "gun-parts",
  "Grips": "gun-parts",
  "Triggers": "gun-parts",
  "Barrels": "gun-parts",
  "Bolt Carriers": "gun-parts",
  "Buffer Tubes": "gun-parts",
  "Charging Handles": "gun-parts",
  "Gas Blocks": "gun-parts",
  "Muzzle Devices": "gun-parts",
  "Chokes": "gun-parts",
  "Slides": "gun-parts",
  "Magazine Accessories": "gun-parts",
  "Magazine Catches": "gun-parts",
  "Magazine Extensions": "gun-parts",
  "Magazine Releases": "gun-parts",
  "Magazine Speedloaders": "gun-parts",
  "Magazine Tubes": "gun-parts",
  "Magazine Storage": "gun-parts",
  "Handgun Magazines": "gun-parts",
  "Rifle Magazines": "gun-parts",
  "Shotgun Magazines": "gun-parts",
  "Chassis & Stocks": "gun-parts",
  "Stock": "gun-parts",
  "Recoil Pads": "gun-parts",
  "Caliber Conversions": "gun-parts",
  "Bipods": "gun-parts",
  "Lanyards": "gun-parts",
  "Slings": "gun-parts",
  "Sling Accessories": "gun-parts",
  "Slings & Swivels": "gun-parts",
  "Swivels": "gun-parts",
  "Adapters & Rails": "gun-parts",

  // Suppressors
  "Suppressors": "suppressors",
  "Suppressors Accessories": "suppressors",
  "Suppressors and Parts": "suppressors",
  "Suppressor Cleaners": "suppressors",

  // Cases Safes & Storage
  "Cases Safes & Storage": "cases-safes-storage",
  "Gun Safes & Cabinets": "cases-safes-storage",
  "Rifle Cases": "cases-safes-storage",
  "Handgun Cases": "cases-safes-storage",
  "Shotgun Cases": "cases-safes-storage",
  "Bow Cases": "cases-safes-storage",
  "Range Bags": "cases-safes-storage",
  "Safe Accessories": "cases-safes-storage",
  "Ammo Boxes": "cases-safes-storage",
  "Ammo Cans & Dry Box": "cases-safes-storage",
  "Ammo & Bullet Storage": "cases-safes-storage",
  "Rifle Storage": "cases-safes-storage",
  "Shotshell Storage": "cases-safes-storage",
  "Storage": "cases-safes-storage",
  "Storage & Organization Accessories": "cases-safes-storage",
  "Magazine Storage": "cases-safes-storage",

  // Clothing & Footwear
  "Apparel": "clothing-footwear",
  "Boots & Shoes": "clothing-footwear",
  "Jackets Coats & Parkas": "clothing-footwear",
  "Pants": "clothing-footwear",
  "Hunting Pants": "clothing-footwear",
  "Shirts": "clothing-footwear",
  "Short Sleeve Shirts": "clothing-footwear",
  "Long Sleeve Shirts": "clothing-footwear",
  "Hoodies & Sweatshirts": "clothing-footwear",
  "Bibs & Coveralls": "clothing-footwear",
  "Rain Gear": "clothing-footwear",
  "Gloves": "clothing-footwear",
  "Socks": "clothing-footwear",
  "Caps Hats & Beanies": "clothing-footwear",
  "Hats": "clothing-footwear",
  "Waders & Wading Boots": "clothing-footwear",
  "Facemasks Balaclavas & Neck Gaiters": "clothing-footwear",

  // Airguns
  "Airguns": "airguns",
  "Air Rifles": "airguns",
  "Air Pistols": "airguns",
  "Airgun Rifles": "airguns",
  "Air Gun Accessories": "airguns",
  "Air Gun Pellets & BBs": "airguns",
  "Airsoft Guns": "airguns",
  "Pellets & BBs": "airguns",

  // Archery
  "Archery Accessories": "archery",
  "Archery Scopes": "archery",
  "Archery Sights": "archery",
  "Arrows": "archery",
  "Arrow Rests": "archery",
  "Arrow Components": "archery",
  "Arrow Building & Repair": "archery",
  "Bowfishing": "archery",
  "Bowfishing Accessories": "archery",
  "Compound Bows": "archery",
  "Traditional Bows": "archery",
  "Youth Bows": "archery",
  "Crossbows": "archery",
  "Crossbow Accessories": "archery",
  "Crossbow Targets": "archery",
  "Broadheads Field & Specialty Points": "archery",
  "Releases & Accessories": "archery",
  "Stabilizers & Dampers": "archery",
  "Tabs Slings Guards & Gloves": "archery",
  "Quivers Belts & Carriers": "archery",

  // Hunting
  "Hunting": "hunting",
  "Hunting Accessories": "hunting",
  "Duck Decoys": "hunting",
  "Goose Decoys": "hunting",
  "Turkey Decoys": "hunting",
  "Predator Decoys": "hunting",
  "Big Game Decoys": "hunting",
  "Dove Decoys": "hunting",
  "Duck Calls": "hunting",
  "Goose Calls": "hunting",
  "Turkey Calls": "hunting",
  "Elk Calls": "hunting",
  "Deer Calls": "hunting",
  "Box Calls": "hunting",
  "Mouth Calls": "hunting",
  "Slate & Glass Calls": "hunting",
  "Electronic Game Calls": "hunting",
  "Locator Calls": "hunting",
  "Upland Calls": "hunting",
  "Predator Calls": "hunting",
  "Hang On Treestands": "hunting",
  "Climbing Treestands": "hunting",
  "Ladder Treestands": "hunting",
  "Tower Stands": "hunting",
  "Tree Saddles": "hunting",
  "Treestand Accessories": "hunting",
  "Treestand Safety Harnesses": "hunting",
  "Climbing Sticks": "hunting",
  "Ground Blinds": "hunting",
  "Waterfowl Blinds": "hunting",
  "Blind Accessories": "hunting",
  "Blind Bags": "hunting",
  "Blind Chairs": "hunting",
  "Dog Blinds": "hunting",
  "Feeders": "hunting",
  "Cellular Trail Cameras": "hunting",
  "Non Cellular Trail Cameras": "hunting",
  "Trail Camera Accessories": "hunting",
  "Scent Attractants": "hunting",
  "Scent Control Kits": "hunting",
  "Game Processing": "hunting",
  "Turkey Vests": "hunting",
  "Upland Vests": "hunting",
  "Hunting Packs": "hunting",
  "Hunting Safety": "hunting",
  "Hunting Eyewear": "hunting",
  "Dog Training": "hunting",
  "Electronic Collars": "hunting",
  "Collars & Leashes": "hunting",
  "Food Plots": "hunting",
  "Decoy Accessories": "hunting",
  "Decoy Bags": "hunting",

  // Outdoors
  "Outdoors": "outdoors",
  "Backpacks": "outdoors",
  "Backpacking": "outdoors",
  "Sleeping Bags": "outdoors",
  "Sleeping Pads": "outdoors",
  "Hammocks": "outdoors",
  "Campground": "outdoors",
  "Stoves & Grills": "outdoors",
  "Cookware": "outdoors",
  "Utensils": "outdoors",
  "Food": "outdoors",
  "Water Bottles": "outdoors",
  "Water Treatment": "outdoors",
  "First Aid": "outdoors",
  "First Aid Kits": "outdoors",
  "Emergency & Survival": "outdoors",
  "Insect Repellants": "outdoors",
  "Bear Safety Gear": "outdoors",
  "Compasses": "outdoors",
  "Chairs": "outdoors",
  "Tables": "outdoors",
  "Firepits & Heating": "outdoors",
  "Lanterns": "outdoors",
  "Headlamps": "outdoors",
  "Flashlights": "outdoors",
  "Batteries": "outdoors",
  "PFDs": "outdoors",
  "Waders & Wading Boots": "outdoors",
  "Dry Bags": "outdoors",
  "Camp Tools": "outdoors",

  // Knives & Tools
  "Knives": "knives-tools",
  "Knives & Edged Tools": "knives-tools",
  "Axes Hatchets & Machetes": "knives-tools",
  "Multi-Tools": "knives-tools",
  "Multi-Tools & Tool Kits": "knives-tools",
  "Sharpeners & Maintenance": "knives-tools",

  // Shooting
  "Shooting": "shooting",
  "Paper Targets": "shooting",
  "Steel Targets": "shooting",
  "Reactive Targets": "shooting",
  "3D Targets": "shooting",
  "Bag Targets": "shooting",
  "Targets": "shooting",
  "Target Stands & Accessories": "shooting",
  "Clay Target Throwers": "shooting",
  "Shooting Rests": "shooting",
  "Shooting Sticks": "shooting",
  "Shooting Glasses": "shooting",
  "Safety Glasses": "shooting",
  "Ear Muffs": "shooting",
  "Ear Plugs": "shooting",
  "Ear & Eye Combo Kits": "shooting",
  "Chronographs & Shot Timers": "shooting",
  "Snap Caps & Dummy Rounds": "shooting",
  "Dummy Rounds": "shooting",
  "Shooting Vests": "shooting",
  "Shooting Patches & Wads": "shooting",
  "Gun Holsters": "shooting",
  "Gun & Magazine Combo Holsters": "shooting",
  "Holster Accessories": "shooting",
  "Holster & Duty Belts": "shooting",
  "Magazine Holsters": "shooting",
  "Magazine Pouches": "shooting",
  "Accessory Holsters": "shooting",
  "Pouches": "shooting",
  "Cartridge Holders": "shooting",
  "Speedloaders & Accessories": "shooting",
  "Brass Catchers": "shooting",
  "Range Bags": "shooting",
  "Range Accessories": "shooting",
  "Range Gear": "shooting",
  "Cleaning Brushes Mops and Swabs": "shooting",
  "Gun Cleaning Kits": "shooting",
  "Gun Cleaning Rods": "shooting",
  "Gun Cleaning Accessories": "shooting",
  "Gun Cleaning Mats": "shooting",
  "Gun Cleaning Jags Patch Holders & Patches": "shooting",
  "Gun Cleaning Tools": "shooting",
  "Gun Oils & Gun Cleaning Solvents": "shooting",
  "Pull Through Bore Cleaners": "shooting",
  "Cloths & Wipes": "shooting",
  "Gun Bluing": "shooting",
  "Paint Stain Polish & Finish": "shooting",
  "Ultrasonic Cleaners & Dryers": "shooting",
  "Ultrasonic Gun Cleaners": "shooting",
  "Gun Vises": "shooting",
  "Vices & Cradles": "shooting",
  "Gun Bore Guides": "shooting",
  "Gun Locks": "shooting",
  "Gunsmithing Tools": "shooting",
  "Alignment Leveling & Other Tools": "shooting",
  "Screwdrivers & Torque Wrenches": "shooting",
  "Punches": "shooting",
  "Tools": "shooting",
  "Weapon Lights": "shooting",
  "Rifle Lights": "shooting",
  "Handgun Lights": "shooting",
  "Shotgun Lights": "shooting",
  "Flashlights & Accessories": "shooting",
  "Tactical Gear": "shooting",
  "Personal Defense & Security": "shooting",
  "Belts": "shooting",
  "Vests": "shooting",
  "Bags & Packs": "shooting",
  "Bags & Duffels": "shooting",
  "Waist Packs": "shooting",
  "Packs & Bags": "shooting",
  "Backpacks": "shooting",
};

const decodeHtml = (text) =>
  (text || "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"");

const getDepartmentId = (parent, sub) => {
  const parentClean = decodeHtml(parent).trim();
  const subClean = decodeHtml(sub).trim();
  const hay = `${parentClean} ${subClean}`.toLowerCase();

  if (EXACT_PARENT[parentClean]) {
    return EXACT_PARENT[parentClean];
  }

  if (/suppressor|silencer/.test(hay)) return "suppressors";
  if (/handgun ammunition|rifle ammunition|rimfire ammunition|shotgun ammunition|shotshell/.test(hay)) {
    return "ammunition";
  }
  if (/bullet|brass\b|primer|powder|reload|case prep|press|die\b|dies\b|tumblers|media|shell holder|headspace|bullet cast/.test(hay)) {
    return "reloading";
  }
  if (/airgun|air gun|air rifle|air pistol|airsoft|pellet|bb\b/.test(hay)) {
    return "airguns";
  }
  if (/archery|arrow|bowfishing|crossbow|broadhead|compound bow|traditional bow/.test(hay)) {
    return "archery";
  }
  if (/scope|sight|binocular|rangefinder|spotting|boresight|red dot|reflex|magnifier|thermal|night vision/.test(hay)) {
    return "optics";
  }
  if (/handgun$|handguns$|pistol$|pistols$|revolver$|revolvers$|rifle$|rifles$|shotgun$|shotguns$/.test(hay)) {
    return "firearms";
  }
  if (parentClean === "Firearms" || parentClean === "CA Compliant") {
    return "firearms";
  }
  if (/gun part|barrel|bolt carrier|buffer|grip|stock|handguard|chassis|receiver|magazine|slide|upper|lower|trigger|muzzle device|choke/.test(hay)) {
    return "gun-parts";
  }
  if (/gun safe|rifle case|handgun case|shotgun case|bow case|ammo box|ammo can|safe accessory/.test(hay)) {
    return "cases-safes-storage";
  }
  if (/clothing|footwear|boot|jacket|pant|shirt|hat|beanie|vest|glove|bib|coverall|wader|sock/.test(hay)) {
    return "clothing-footwear";
  }
  if (/knife|knives|axe|hatchet|machete|multi.tool/.test(hay)) {
    return "knives-tools";
  }
  if (/hunting|decoy|blind|treestand|game call|trail cam|feeder|scent/.test(hay)) {
    return "hunting";
  }
  if (/outdoor|camping|hammock|survival|first aid|water treatment/.test(hay)) {
    return "outdoors";
  }
  if (/target|cleaning|holster|ear|eye pro|chronograph|rest|sling|patch|wad|range bag/.test(hay)) {
    return "shooting";
  }

  return "shooting";
};

const getDepartmentLabel = (id) =>
  DEPARTMENTS.find((d) => d.id === id)?.label || id;

module.exports = {
  DEPARTMENTS,
  FINDER_TABS,
  decodeHtml,
  getDepartmentId,
  getDepartmentLabel,
};