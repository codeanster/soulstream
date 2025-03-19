/**
 * theme.js
 * --------
 * The visual language of our memory palace.
 * Colors, spaces, and rhythms that define our emotional landscape.
 */

export const theme = {
  colors: {
    // Primary palette
    primary: '#8a2be2', // Cosmic purple
    secondary: '#4a69bd', // Dreamy blue
    accent: '#ff6b81', // Soft pink
    
    // UI backgrounds
    background: '#1a1a2e', // Deep space blue
    backgroundLight: '#f0f0f7', // Soft light mode
    card: '#16213e', // Slightly lighter than background
    cardHover: '#1f2b49', // Hover state for cards
    
    // Text colors
    text: '#e6e6e6', // Off-white for dark mode
    textLight: '#1a1a2e', // Dark blue for light mode
    textSecondary: '#a0a0bd', // Muted text
    
    // Emotion indicators
    joy: '#ffcc5c', // Warm yellow
    sadness: '#4a69bd', // Blue
    anger: '#ff6b6b', // Red
    fear: '#8c7ae6', // Purple
    love: '#ff6b81', // Pink
    peace: '#88d8b0', // Mint
    
    // Functional
    success: '#88d8b0', // Mint green
    warning: '#ffcc5c', // Amber
    error: '#ff6b6b', // Soft red
    info: '#4a69bd', // Blue
    
    // Gradients (as CSS strings)
    cosmicGradient: 'linear-gradient(135deg, #8a2be2 0%, #4a69bd 100%)',
    memoryGradient: 'linear-gradient(135deg, #ff6b81 0%, #8a2be2 100%)',
    journalGradient: 'linear-gradient(135deg, #ffcc5c 0%, #ff6b81 100%)',
  },
  
  // Spacing system (in rem)
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  // Typography
  fonts: {
    body: "'Source Sans Pro', sans-serif",
    heading: "'Playfair Display', serif",
    monospace: "'Courier New', monospace",
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem',
    xxxl: '3rem',
  },
  
  fontWeights: {
    light: 300,
    normal: 400,
    semibold: 600,
    bold: 700,
  },
  
  // Border radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    circle: '50%',
  },
  
  // Shadows for neumorphic effect
  shadows: {
    // Soft shadows for dark mode
    soft: `
      5px 5px 10px rgba(0, 0, 0, 0.3),
      -5px -5px 10px rgba(40, 40, 70, 0.2)
    `,
    // Inner shadow for pressed state
    inset: `
      inset 2px 2px 5px rgba(0, 0, 0, 0.3),
      inset -2px -2px 5px rgba(40, 40, 70, 0.2)
    `,
    // Glow effect for highlighted elements
    glow: `
      0 0 15px rgba(138, 43, 226, 0.5)
    `,
    // Light mode shadows
    softLight: `
      5px 5px 10px rgba(200, 200, 230, 0.8),
      -5px -5px 10px rgba(255, 255, 255, 1)
    `,
    insetLight: `
      inset 2px 2px 5px rgba(200, 200, 230, 0.8),
      inset -2px -2px 5px rgba(255, 255, 255, 1)
    `,
  },
  
  // Animations
  animations: {
    fast: '0.2s',
    medium: '0.4s',
    slow: '0.8s',
  },
  
  // Breakpoints for responsive design
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    laptop: '992px',
    desktop: '1200px',
  },
  
  // Z-index scale
  zIndex: {
    base: 0,
    card: 10,
    navigation: 100,
    modal: 1000,
    tooltip: 1500,
  },
};

// Derived theme for light mode
export const lightTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: theme.colors.backgroundLight,
    card: '#ffffff',
    cardHover: '#f0f0f7',
    text: theme.colors.textLight,
    textSecondary: '#6e6e9c',
  },
  shadows: {
    ...theme.shadows,
    soft: theme.shadows.softLight,
    inset: theme.shadows.insetLight,
  },
};

// Neumorphic mixins (for styled-components)
export const neumorphic = {
  // Raised effect
  raised: `
    background: ${theme.colors.card};
    box-shadow: ${theme.shadows.soft};
    border-radius: ${theme.borderRadius.lg};
  `,
  
  // Pressed effect
  pressed: `
    background: ${theme.colors.card};
    box-shadow: ${theme.shadows.inset};
    border-radius: ${theme.borderRadius.lg};
  `,
  
  // Glowing effect
  glow: `
    box-shadow: ${theme.shadows.soft}, ${theme.shadows.glow};
  `,
};
