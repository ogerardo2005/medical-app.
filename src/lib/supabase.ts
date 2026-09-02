import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * False when EXPO_PUBLIC_SUPABASE_URL/ANON_KEY weren't baked into this
 * build - e.g. a hosting provider's env vars weren't set (or a redeploy
 * reused a cached build from before they were set) when `expo export` ran.
 * The root layout renders ConfigMissingScreen instead of the app when this
 * is false, so `supabase` below is only ever actually used once it's true -
 * that's deliberately a hard architectural guarantee, not a per-call check,
 * so a misconfiguration fails with one clear on-screen message instead of a
 * blank screen with a swallowed exception somewhere in the tree.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : (null as unknown as SupabaseClient);
