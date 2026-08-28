import { StyleSheet, View } from 'react-native';

import { useGuardMode } from './GuardModeContext';

/**
 * Full-screen red-tint filter, rendered above everything else. This is the
 * same technique real red-light night-mode tools use (a translucent screen
 * filter) rather than re-theming every component: it guarantees uniform
 * coverage across every current and future screen with no per-component
 * upkeep. `pointerEvents="none"` keeps it purely visual - touches pass
 * straight through to the app underneath.
 */
export function GuardModeOverlay() {
  const { guardMode } = useGuardMode();

  if (!guardMode) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, styles.darkScrim]} />
      <View style={[StyleSheet.absoluteFill, styles.redTint]} />
    </View>
  );
}

const styles = StyleSheet.create({
  darkScrim: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  redTint: {
    backgroundColor: 'rgba(255, 40, 40, 0.32)',
  },
});
