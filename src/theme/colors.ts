import { useColorScheme } from 'react-native';

/**
 * Plain hex mirror of the primary/medical scales in tailwind.config.js, for
 * places that need an actual color value instead of a className - Ionicons'
 * `color` prop, native Switch/Tabs colors, etc. Keep the two in sync.
 */
export const palette = {
  primary50: '#F2F6F8',
  primary100: '#E2EAEF',
  primary200: '#C4D5DF',
  primary400: '#7292A8',
  primary600: '#3E5C76',
  primary800: '#28404F',
  primary900: '#1D2F3A',
  medical500: '#2E8B57',
  medical700: '#1F5D3E',
  neutral400: '#94A3B8',
  neutral500: '#64748B',
  neutral600: '#475569',
  danger500: '#EF4444',
  danger600: '#DC2626',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export interface ThemeIconColors {
  /** Primary brand tint - active icons, links, headers. */
  accent: string;
  /** Muted icon/placeholder tone - search icons, placeholder text. */
  muted: string;
  /** Inactive tab bar icon tone. */
  inactive: string;
}

const lightIconColors: ThemeIconColors = {
  accent: palette.primary600,
  muted: palette.neutral400,
  inactive: palette.neutral500,
};

const darkIconColors: ThemeIconColors = {
  accent: palette.primary400,
  muted: palette.neutral500,
  inactive: palette.neutral400,
};

/** Resolves icon/placeholder colors for the current OS-driven color scheme. */
export function useThemeIconColors(): ThemeIconColors {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkIconColors : lightIconColors;
}
