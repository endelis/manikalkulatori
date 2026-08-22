import type { ComponentType } from 'react';
import { ElektroautoVsBenzinaCalculator } from './ElektroautoVsBenzinaCalculator';
import { EkiiAtbalstsCalculator } from './EkiiAtbalstsCalculator';

/**
 * Props every calculator component receives from the calculator page.
 * `accentVar` comes from the category record in `lib/registry.ts` — the single
 * source of truth for category accent colours — so components never hardcode it.
 */
export interface CalculatorComponentProps {
  accentVar: string;
}

export const calculatorComponents: Record<string, ComponentType<CalculatorComponentProps>> = {
  'elektroauto-vs-benzina': ElektroautoVsBenzinaCalculator,
  'ekii-atbalsts': EkiiAtbalstsCalculator,
};

export function getCalculatorComponent(slug: string): ComponentType<CalculatorComponentProps> | undefined {
  return calculatorComponents[slug];
}
