#!/usr/bin/env node

/**
 * Injects PWA meta tags, the manifest link, and the service worker
 * registration script into dist/index.html after `expo export`.
 *
 * Why a postbuild script instead of src/app/+html.tsx: this project uses
 * `web.output: "single"` in app.json (a plain SPA shell, no per-route static
 * pre-rendering) because expo-sqlite's web implementation touches `Worker`/
 * `window`, which don't exist in the Node.js SSR pass that `output: "static"`
 * would otherwise run. Expo Router's `+html.tsx` root-HTML customization only
 * applies to that static-rendering pipeline, so with `output: "single"` it's
 * silently ignored - confirmed by a clean rebuild that showed no effect.
 * Patching the exported HTML directly sidesteps that without reintroducing
 * the SSR crash.
 */

const fs = require('node:fs');
const path = require('node:path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error(`inject-pwa-meta: ${indexPath} not found - did "expo export" run first?`);
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

const headInjection = `
    <meta name="description" content="Notas clínicas, estudio con repetición espaciada, calculadoras y vademécum offline-first para estudiantes de medicina." />
    <meta name="theme-color" content="#3E5C76" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Medical App" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/icon.png" />
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js').catch(function () {});
        });
      }
    </script>
  </head>`;

if (html.includes('rel="manifest"')) {
  console.log('inject-pwa-meta: manifest link already present, skipping (already injected).');
} else {
  html = html.replace('</head>', headInjection).replace('<html lang="en">', '<html lang="es">');
  fs.writeFileSync(indexPath, html);
  console.log('inject-pwa-meta: PWA meta tags, manifest link, and service worker registration injected.');
}
