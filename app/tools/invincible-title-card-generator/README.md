# Invincible Title Card Generator - Modular Structure

This directory contains a refactored version of the Invincible Title Card Generator, broken down into smaller, maintainable modules.

## File Structure

```
app/tools/invincible-title-card-generator/
├── page.tsx                    # Main component (orchestrates everything)
├── constants.ts                # Character presets, background colors, etc.
├── types.ts                    # TypeScript interfaces
├── utils.ts                    # Utility functions (download, copy, etc.)
├── hooks.tsx                   # Custom React hooks for state management
├── components/
│   ├── index.ts               # Component exports
│   ├── Header.tsx             # Navigation, title, main action buttons
│   ├── PreviewArea.tsx        # Title card preview and export controls
│   ├── SettingsPanel.tsx      # Customization tabs and settings
│   └── ContentSections.tsx    # Features, FAQ, and content sections
└── README.md                  # This file
```

## Module Breakdown

### 1. `constants.ts`

- **Purpose**: Centralized data and configuration
- **Contains**: Character presets, background gradients, text color options, default state
- **Benefits**: Easy to modify presets, no magic numbers/strings scattered in code

### 2. `types.ts`

- **Purpose**: TypeScript type definitions
- **Contains**: TitleCardState interface, preset interfaces, tab types
- **Benefits**: Type safety, better IDE support, clear data contracts

### 3. `utils.ts`

- **Purpose**: Pure utility functions
- **Contains**: Download functionality, settings copy, randomization, reset logic
- **Benefits**: Reusable functions, easier testing, separation of concerns

### 4. `hooks.tsx`

- **Purpose**: React state management
- **Contains**: `useTitleCardState` custom hook
- **Benefits**: Centralized state logic, cleaner main component, reusable state

### 5. `components/`

#### `Header.tsx`

- **Purpose**: Page header and main navigation
- **Features**: Breadcrumbs, title, primary action buttons
- **Props**: Action handlers, state flags

#### `PreviewArea.tsx`

- **Purpose**: Title card preview and export controls
- **Features**: Live preview, download buttons, favorites management
- **Props**: Canvas ref, state, various handlers

#### `SettingsPanel.tsx`

- **Purpose**: Customization interface
- **Features**: Tabbed settings, presets, color pickers, text controls
- **Props**: State management, preset handlers

#### `ContentSections.tsx`

- **Purpose**: Marketing and informational content
- **Features**: Features showcase, how-to guide, FAQ section
- **Props**: None (pure presentation)

### 6. `page.tsx`

- **Purpose**: Main orchestrating component
- **Responsibilities**:
  - Combines all modules
  - Manages canvas ref
  - Provides handler functions
  - Renders layout structure
- **Benefits**: Clean, focused, easy to understand

## Benefits of This Structure

1. **Maintainability**: Each file has a single responsibility
2. **Reusability**: Components and utilities can be reused
3. **Testability**: Smaller modules are easier to unit test
4. **Readability**: Easier to find and modify specific functionality
5. **Collaboration**: Multiple developers can work on different modules
6. **Performance**: Potential for better tree-shaking and code splitting

## Usage

The refactored structure maintains the same functionality as the original monolithic file but with better organization. Import and use the main component as before:

```tsx
import InvincibleTitleCardGenerator from "./page"
```

## Development Notes

- Components use memory design patterns for consistent styling
- All text uses English for accessibility
- TypeScript strict mode compatible
- Responsive design maintained across all components
