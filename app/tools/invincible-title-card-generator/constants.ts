// Character presets from the original project
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
}
