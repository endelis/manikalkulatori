import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: {
          bg: 'var(--color-panel-bg)',
          surface: 'var(--color-panel-surface)',
          border: 'var(--color-panel-border)',
          text: 'var(--color-panel-text)',
          muted: 'var(--color-panel-muted)',
        },
        accent: {
          auto: 'var(--color-accent-auto)',
          finanses: 'var(--color-accent-finanses)',
          majoklis: 'var(--color-accent-majoklis)',
          veseliba: 'var(--color-accent-veseliba)',
          sports: 'var(--color-accent-sports)',
        },
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
