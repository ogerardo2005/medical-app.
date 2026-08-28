import { Redirect } from 'expo-router';

/**
 * The (tabs) group has no screen of its own at "/" - its first tab lives at
 * "/notes" - so the bare root URL has nothing to match on web. This redirects
 * it to the default tab. Native is unaffected (it always opens on the first
 * tab regardless of URL).
 */
export default function Index() {
  return <Redirect href="/notes" />;
}
