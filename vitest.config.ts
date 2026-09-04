import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  // Test files stay plain .ts (react-dom/server + React.createElement, no jsdom), but
  // they import .tsx server components directly, so esbuild still needs to know how to
  // transform the JSX inside those imports. tsconfig.json's "preserve" is for Next's own
  // pipeline, not vitest's, and classic-mode JSX transform needs React in scope, which
  // these components correctly do not import (Next injects it). Automatic mode avoids
  // that mismatch.
  esbuild: {
    jsx: 'automatic',
  },
});
