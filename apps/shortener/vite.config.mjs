/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, '../../env', '');
  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/shortener',
    define: {
      // this is supposed to make the env vars available to the react app
      'process.env.API_PROTOCOL': JSON.stringify(env.API_PROTOCOL),
      'process.env.API_HOST': JSON.stringify(env.API_HOST),
      'process.env.API_PORT': JSON.stringify(env.API_PORT),
      'process.env.API_VERSION': JSON.stringify(env.API_VERSION),
    },
    server: {
      port: 4200,
      host: 'localhost',
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    plugins: [
      tsconfigPaths(),
      react(),
      nxViteTsPaths(),
      viteStaticCopy({
        targets: [
          {
            src: './locales',
            dest: './',
          },
        ],
      }),
    ],

    build: {
      outDir: '../../dist/apps/shortener',
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },

    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/shortener',
        provider: 'v8',
      },
    },
  };
});
