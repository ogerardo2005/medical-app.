import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ConfigMissingScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white px-8 dark:bg-black">
      <View className="max-w-sm gap-3">
        <Text className="text-center text-lg font-semibold text-black dark:text-white">
          Falta configurar Supabase
        </Text>
        <Text className="text-center text-sm text-neutral-500 dark:text-neutral-400">
          Este build no tiene cargadas{' '}
          <Text className="font-mono text-neutral-700 dark:text-neutral-300">
            EXPO_PUBLIC_SUPABASE_URL
          </Text>{' '}
          y{' '}
          <Text className="font-mono text-neutral-700 dark:text-neutral-300">
            EXPO_PUBLIC_SUPABASE_ANON_KEY
          </Text>
          . Revisá las variables de entorno del proyecto (en Vercel: Settings → Environment
          Variables → Production) y volvé a desplegar sin usar la caché de build anterior.
        </Text>
      </View>
    </SafeAreaView>
  );
}
