export const themeColors = {
  'midnight-blue': { primary: '#1a1a2e', secondary: '#16213e', accent: '#0f3460', text: '#e0e0e0' },
  'rose-gold': { primary: '#f8e8e8', secondary: '#f2d7d7', accent: '#c9a0a0', text: '#2d2d2d' },
  'forest-green': { primary: '#1a2e1a', secondary: '#162616', accent: '#2d5a2d', text: '#e0f0e0' },
  'sunset-orange': { primary: '#2e1a0e', secondary: '#3d2410', accent: '#c45e0a', text: '#f5e6d8' },
  'royal-purple': { primary: '#1a0e2e', secondary: '#160c26', accent: '#5a0ab4', text: '#e8d8f5' },
  'minimal-white': { primary: '#ffffff', secondary: '#f5f5f5', accent: '#333333', text: '#111111' },
};

export const themeFonts = {
  'modern-sans': "'Inter', sans-serif",
  'elegant-serif': "'Playfair Display', serif",
  'mono-tech': "'JetBrains Mono', monospace",
};

export type ThemeKey = keyof typeof themeColors;
export type FontKey = keyof typeof themeFonts;
