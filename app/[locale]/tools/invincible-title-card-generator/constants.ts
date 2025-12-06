// Character presets from the original project
export const getCharacterPresets = (t: any) => [
  {
    name: t("presets.invincible.name"),
    background: "#169ee7",
    color: "#eaed00",
    text: t("presets.invincible.name"),
    description: t("presets.invincible.description"),
  },
  {
    name: t("presets.invinciboy.name"),
    background: "#169ee7",
    color: "#000000",
    text: t("presets.invinciboy.name"),
    description: t("presets.invinciboy.description"),
  },
  {
    name: t("presets.atom_eve.name"),
    background: "#eb607a",
    color: "#f3cad2",
    text: t("presets.atom_eve.name"),
    description: t("presets.atom_eve.description"),
  },
  {
    name: t("presets.omni_man.name"),
    background: "#e1ebed",
    color: "#ca4230",
    text: t("presets.omni_man.name"),
    description: t("presets.omni_man.description"),
  },
  {
    name: t("presets.allen_the_alien.name"),
    background: "#3936ed",
    color: "#2bffe1",
    text: t("presets.allen_the_alien.name"),
    description: t("presets.allen_the_alien.description"),
  },
  {
    name: t("presets.immortal.name"),
    background: "#3c3d53",
    color: "#e8c856",
    text: t("presets.immortal.name"),
    description: t("presets.immortal.description"),
  },
  {
    name: t("presets.oliver.name"),
    background: "#9a004f",
    color: "#95b38e",
    text: t("presets.oliver.name"),
    description: t("presets.oliver.description"),
  },
]

// Static character presets for utils (fallback)
export const characterPresets = [
  {
    name: "Invincible",
    background: "#169ee7",
    color: "#eaed00",
    text: "Invincible",
    description: "The main character",
  },
  {
    name: "Invinciboy",
    background: "#169ee7",
    color: "#000000",
    text: "Invinciboy",
    description: "Young Mark Grayson",
  },
  {
    name: "Atom Eve",
    background: "#eb607a",
    color: "#f3cad2",
    text: "Atom Eve",
    description: "Samantha Eve Wilkins",
  },
  {
    name: "Omni-Man",
    background: "#e1ebed",
    color: "#ca4230",
    text: "Omni-Man",
    description: "Nolan Grayson",
  },
  {
    name: "Allen the Alien",
    background: "#3936ed",
    color: "#2bffe1",
    text: "Allen the Alien",
    description: "Coalition of Planets",
  },
  {
    name: "Immortal",
    background: "#3c3d53",
    color: "#e8c856",
    text: "Immortal",
    description: "Abraham Lincoln",
  },
  {
    name: "Oliver",
    background: "#9a004f",
    color: "#95b38e",
    text: "Oliver",
    description: "Mark's half-brother",
  },
]

// Background color presets with gradients
export const getBackgroundPresets = (t: any) => [
  { name: t("backgrounds.classic_blue"), value: "#169ee7", type: "solid" },
  {
    name: t("backgrounds.hero_gradient"),
    value: "linear-gradient(135deg, #169ee7, #1e40af)",
    type: "gradient",
  },
  {
    name: t("backgrounds.villain_red"),
    value: "linear-gradient(135deg, #dc2626, #991b1b)",
    type: "gradient",
  },
  {
    name: t("backgrounds.atom_pink"),
    value: "linear-gradient(135deg, #eb607a, #be185d)",
    type: "gradient",
  },
  {
    name: t("backgrounds.space_black"),
    value: "linear-gradient(135deg, #1f2937, #000000)",
    type: "gradient",
  },
  {
    name: t("backgrounds.cosmic_purple"),
    value: "linear-gradient(135deg, #7c3aed, #3730a3)",
    type: "gradient",
  },
  {
    name: t("backgrounds.sunset_orange"),
    value: "linear-gradient(135deg, #ea580c, #dc2626)",
    type: "gradient",
  },
  {
    name: t("backgrounds.forest_green"),
    value: "linear-gradient(135deg, #059669, #047857)",
    type: "gradient",
  },
]

// Static background presets for utils (fallback)
export const backgroundPresets = [
  { name: "Classic Blue", value: "#169ee7", type: "solid" },
  { name: "Hero Gradient", value: "linear-gradient(135deg, #169ee7, #1e40af)", type: "gradient" },
  { name: "Villain Red", value: "linear-gradient(135deg, #dc2626, #991b1b)", type: "gradient" },
  { name: "Atom Pink", value: "linear-gradient(135deg, #eb607a, #be185d)", type: "gradient" },
  { name: "Space Black", value: "linear-gradient(135deg, #1f2937, #000000)", type: "gradient" },
  { name: "Cosmic Purple", value: "linear-gradient(135deg, #7c3aed, #3730a3)", type: "gradient" },
  { name: "Sunset Orange", value: "linear-gradient(135deg, #ea580c, #dc2626)", type: "gradient" },
  { name: "Forest Green", value: "linear-gradient(135deg, #059669, #047857)", type: "gradient" },
]

// Text color presets
export const getTextColorPresets = (t: any) => [
  { name: t("text_colors.invincible_yellow"), value: "#eaed00" },
  { name: t("text_colors.hero_blue"), value: "#169ee7" },
  { name: t("text_colors.danger_red"), value: "#dc2626" },
  { name: t("text_colors.royal_purple"), value: "#7c3aed" },
  { name: t("text_colors.pure_black"), value: "#000000" },
  { name: t("text_colors.pure_white"), value: "#ffffff" },
  { name: t("text_colors.bright_orange"), value: "#ea580c" },
  { name: t("text_colors.steel_gray"), value: "#6b7280" },
  { name: t("text_colors.atom_pink"), value: "#f3cad2" },
  { name: t("text_colors.alien_cyan"), value: "#2bffe1" },
]

// Static text color presets for utils (fallback)
export const textColorPresets = [
  { name: "Invincible Yellow", value: "#eaed00" },
  { name: "Hero Blue", value: "#169ee7" },
  { name: "Danger Red", value: "#dc2626" },
  { name: "Royal Purple", value: "#7c3aed" },
  { name: "Pure Black", value: "#000000" },
  { name: "Pure White", value: "#ffffff" },
  { name: "Bright Orange", value: "#ea580c" },
  { name: "Steel Gray", value: "#6b7280" },
  { name: "Atom Pink", value: "#f3cad2" },
  { name: "Alien Cyan", value: "#2bffe1" },
]

// Default state configuration
export const getDefaultState = (t: any) => ({
  text: t("default_state.text"),
  color: "#eaed00",
  showCredits: true,
  showWatermark: true,
  background: "linear-gradient(135deg, #169ee7, #1e40af)",
  fontSize: 28,
  outline: 2,
  subtitleOffset: 5,
  outlineColor: "#000000",
  generating: false,
  smallSubtitle: t("default_state.small_subtitle"),
  subtitle: t("default_state.subtitle"),
  effects: [],
})

// Effect presets
export const getEffectPresets = (t: any) => [
  {
    id: "blood-splatter-1",
    name: t("effects.blood_splatter_1"),
    image: "/static/images/invincible-title-card-generator/effects/blood-splatter-1.png",
    description: t("effects.blood_splatter_1_description"),
    category: "blood" as const,
  },
  {
    id: "blood-splatter-2",
    name: t("effects.blood_splatter_2"),
    image: "/static/images/invincible-title-card-generator/effects/blood-splatter-2.png",
    description: t("effects.blood_splatter_2_description"),
    category: "blood" as const,
  },
  {
    id: "scratch-1",
    name: t("effects.scratch_1"),
    image: "/static/images/invincible-title-card-generator/effects/scratch-1.png",
    description: t("effects.scratch_1_description"),
    category: "scratch" as const,
  },
  {
    id: "scratch-2",
    name: t("effects.scratch_2"),
    image: "/static/images/invincible-title-card-generator/effects/scratch-2.png",
    description: t("effects.scratch_2_description"),
    category: "scratch" as const,
  },
  {
    id: "mark-1",
    name: t("effects.mark_1"),
    image: "/static/images/invincible-title-card-generator/effects/mark-1.png",
    description: t("effects.mark_1_description"),
    category: "mark" as const,
  },
  {
    id: "damage-1",
    name: t("effects.damage_1"),
    image: "/static/images/invincible-title-card-generator/effects/damage-1.png",
    description: t("effects.damage_1_description"),
    category: "damage" as const,
  },
]

// Static effect presets for utils (fallback)
export const effectPresets = [
  {
    id: "blood-splatter-1",
    name: "Blood Splatter 1",
    image: "/static/images/invincible-title-card-generator/effects/blood-splatter-1.png",
    description: "Classic blood splatter effect",
    category: "blood" as const,
  },
  {
    id: "blood-splatter-2",
    name: "Blood Splatter 2",
    image: "/static/images/invincible-title-card-generator/effects/blood-splatter-2.png",
    description: "Heavy blood splatter effect",
    category: "blood" as const,
  },
  {
    id: "scratch-1",
    name: "Scratch 1",
    image: "/static/images/invincible-title-card-generator/effects/scratch-1.png",
    description: "Sharp scratch marks",
    category: "scratch" as const,
  },
  {
    id: "scratch-2",
    name: "Scratch 2",
    image: "/static/images/invincible-title-card-generator/effects/scratch-2.png",
    description: "Deep scratch marks",
    category: "scratch" as const,
  },
  {
    id: "mark-1",
    name: "Mark 1",
    image: "/static/images/invincible-title-card-generator/effects/mark-1.png",
    description: "Battle mark overlay",
    category: "mark" as const,
  },
  {
    id: "damage-1",
    name: "Damage 1",
    image: "/static/images/invincible-title-card-generator/effects/damage-1.png",
    description: "Damage texture overlay",
    category: "damage" as const,
  },
]

// Static default state for utils (fallback)
export const DEFAULT_STATE = {
  text: "Invincible",
  color: "#eaed00",
  showCredits: true,
  showWatermark: true,
  background: "linear-gradient(135deg, #169ee7, #1e40af)",
  fontSize: 28,
  outline: 2,
  subtitleOffset: 5,
  outlineColor: "#000000",
  generating: false,
  smallSubtitle: "BASED ON THE COMIC BOOK BY",
  subtitle: "Robert Kirkman, Cory Walker, & Ryan Ottley",
  effects: [],
}
