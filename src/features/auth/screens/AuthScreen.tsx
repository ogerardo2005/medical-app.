import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';
import { palette, useThemeIconColors } from '@/theme/colors';

type Mode = 'signIn' | 'signUp';

export function AuthScreen() {
  const colors = useThemeIconColors();
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError('Completá email y contraseña.');
      return;
    }

    setError(null);
    setInfoMessage(null);
    setIsSubmitting(true);
    try {
      if (mode === 'signIn') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (signUpError) throw signUpError;
        setInfoMessage(
          'Cuenta creada. Si tu proyecto de Supabase pide confirmación por email, revisá tu bandeja de entrada antes de entrar.'
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo salió mal, probá de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((current) => (current === 'signIn' ? 'signUp' : 'signIn'));
    setError(null);
    setInfoMessage(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <KeyboardAvoidingView
        className="flex-1 items-center justify-center px-6"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="w-full max-w-sm gap-4">
          <View className="mb-2 items-center gap-1">
            <Text className="text-2xl font-bold text-black dark:text-white">Medical App</Text>
            <Text className="text-sm text-neutral-500 dark:text-neutral-400">
              {mode === 'signIn' ? 'Iniciá sesión para continuar' : 'Creá tu cuenta'}
            </Text>
          </View>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            className="rounded-xl border border-neutral-300 px-3 py-3 text-base text-black dark:border-neutral-700 dark:text-white"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            placeholderTextColor={colors.muted}
            secureTextEntry
            className="rounded-xl border border-neutral-300 px-3 py-3 text-base text-black dark:border-neutral-700 dark:text-white"
          />

          {error ? <Text className="text-center text-sm text-red-600">{error}</Text> : null}
          {infoMessage ? (
            <Text className="text-center text-sm text-medical-700 dark:text-medical-400">
              {infoMessage}
            </Text>
          ) : null}

          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            className="items-center rounded-xl bg-primary py-3 active:opacity-80 disabled:opacity-60">
            {isSubmitting ? (
              <ActivityIndicator color={palette.white} />
            ) : (
              <Text className="text-base font-semibold text-white">
                {mode === 'signIn' ? 'Entrar' : 'Crear cuenta'}
              </Text>
            )}
          </Pressable>

          <Pressable onPress={toggleMode} hitSlop={8}>
            <Text className="text-center text-sm text-primary">
              {mode === 'signIn' ? '¿No tenés cuenta? Creá una' : '¿Ya tenés cuenta? Iniciá sesión'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
