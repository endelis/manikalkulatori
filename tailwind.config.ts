import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: {
          bg: 'var(--color-panel-bg)',
          surface: 'var(--color-panel-surface)',
          'surface-2': 'var(--color-panel-surface-2)',
          border: 'var(--color-panel-border)',
          'border-strong': 'var(--color-panel-border-strong)',
          text: 'var(--color-panel-text)',
          muted: 'var(--color-panel-muted)',
          faint: 'var(--color-panel-faint)',
        },
        accent: {
          auto: 'var(--color-accent-auto)',
          finanses: 'var(--color-accent-finanses)',
          majoklis: 'var(--color-accent-majoklis)',
          veseliba: 'var(--color-accent-veseliba)',
          sports: 'var(--color-accent-sports)',
        },
        warn: 'var(--color-warn)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
