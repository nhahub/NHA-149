/**
 * Theme Configuration File
 *
 * This file contains the main theme variables for easy customization.
 * Simply change the values here to update the entire project's appearance.
 */

export const themeConfig = {
  // Primary Colors - Ocean/Cyan Theme
  colors: {
    primary: {
      name: "Ocean Blue",
      description: "Main brand color - modern cyan/teal",
      palette: {
        50: "#ecfeff",
        100: "#cffafe",
        200: "#a5f3fc",
        300: "#67e8f9",
        400: "#22d3ee",
        500: "#06b6d4", // Main primary
        600: "#0891b2",
        700: "#0e7490",
        800: "#155e75",
        900: "#164e63",
        950: "#083344",
      },
    },

    secondary: {
      name: "Deep Navy",
      description: "Professional dark tones for contrast",
      palette: {
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
        950: "#020617",
      },
    },

    accent: {
      name: "Coral Orange",
      description: "Energetic accent color for highlights",
      palette: {
        50: "#fef7ee",
        100: "#feecdc",
        200: "#fcd9bd",
        300: "#fdba8c",
        400: "#ff8a4c",
        500: "#ff5722", // Main accent
        600: "#ea580c",
        700: "#c2410c",
        800: "#9a3412",
        900: "#7c2d12",
        950: "#431407",
      },
    },
  },

  // Alternative Color Schemes
  // You can switch to these by updating the CSS variables in index.css

  alternativeSchemes: {
    // Modern Purple Scheme
    purple: {
      primary: "#8b5cf6", // violet-500
      secondary: "#64748b", // slate-500
      accent: "#f59e0b", // amber-500
    },

    // Professional Blue Scheme
    professional: {
      primary: "#3b82f6", // blue-500
      secondary: "#374151", // gray-700
      accent: "#10b981", // emerald-500
    },

    // Creative Pink Scheme
    creative: {
      primary: "#ec4899", // pink-500
      secondary: "#6b7280", // gray-500
      accent: "#8b5cf6", // violet-500
    },

    // Nature Green Scheme
    nature: {
      primary: "#059669", // emerald-600
      secondary: "#374151", // gray-700
      accent: "#f59e0b", // amber-500
    },

    // Sunset Scheme
    sunset: {
      primary: "#f97316", // orange-500
      secondary: "#1f2937", // gray-800
      accent: "#ec4899", // pink-500
    },
  },

  // Typography Settings
  typography: {
    fontFamily: {
      sans: "Inter, system-ui, sans-serif",
      arabic: "Cairo, system-ui, sans-serif",
    },

    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
  },

  // Spacing & Layout
  spacing: {
    section: "5rem", // 80px
    container: "1200px",
    borderRadius: {
      sm: "0.375rem",
      base: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
    },
  },

  // Animation & Effects
  animations: {
    transition: {
      fast: "150ms ease-in-out",
      base: "250ms ease-in-out",
      slow: "350ms ease-in-out",
    },

    effects: {
      glass: "backdrop-blur(20px)",
      shadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        base: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
      },
    },
  },
};

/**
 * How to Change Theme Colors:
 *
 * 1. Choose from Alternative Schemes:
 *    - Copy values from alternativeSchemes to colors section above
 *    - Or update CSS variables in src/index.css
 *
 * 2. Create Custom Colors:
 *    - Use tools like https://uicolors.app or https://coolors.co
 *    - Generate a 10-step palette (50-950)
 *    - Update the palette object above
 *
 * 3. Update CSS Variables:
 *    - Modify :root variables in src/index.css
 *    - Follow the pattern: --color-primary-[number]: #hexcode
 *
 * Example CSS Variable Update:
 * :root {
 *   --color-primary-500: #your-new-color;
 *   --color-accent-500: #your-accent-color;
 * }
 */

export default themeConfig;
