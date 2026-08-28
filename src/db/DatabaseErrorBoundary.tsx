import { Component, type PropsWithChildren, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface State {
  error: Error | null;
}

/**
 * Without this, a failed SQLite init (e.g. a locked OPFS handle left over
 * from a previous session on web) throws during render with no error
 * boundary above it, so React unmounts the whole tree - a blank white
 * screen with no indication anything went wrong. This shows something
 * actionable instead.
 */
export class DatabaseErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  handleRetry = () => {
    this.setState({ error: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <View className="flex-1 items-center justify-center gap-3 bg-white px-8 dark:bg-black">
          <Text className="text-center text-lg font-semibold text-black dark:text-white">
            No se pudo abrir la base de datos
          </Text>
          <Text className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            Esto puede pasar si quedó una sesión anterior sin cerrar bien. Probá recargar; si
            sigue fallando, abrí las herramientas de desarrollo del navegador → Application →
            Storage → &quot;Clear site data&quot;, y volvé a cargar la página.
          </Text>
          <Pressable
            onPress={this.handleRetry}
            className="mt-2 rounded-xl bg-primary px-4 py-2 active:opacity-80">
            <Text className="text-base font-semibold text-white">Reintentar</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
