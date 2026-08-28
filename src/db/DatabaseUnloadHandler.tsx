import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Web-only: expo-sqlite's web backend (OPFS sync access handles) only allows
 * one open connection to a database file at a time, browser-wide. If a page
 * is closed/reloaded without an explicit close, that handle can stay locked,
 * and every future load fails with "Access Handles cannot be created if
 * there is another open Access Handle" - even in a fresh tab. `closeSync`
 * (not the async version) is used here because it goes over expo-sqlite's
 * synchronous worker channel, which is far more likely to actually complete
 * before the page is torn down on `pagehide`.
 */
export function DatabaseUnloadHandler() {
  const db = useSQLiteContext();

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handlePageHide = () => {
      try {
        db.closeSync();
      } catch {
        // Best-effort: the page is unloading either way.
      }
    };

    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, [db]);

  return null;
}
