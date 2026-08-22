import type { ComponentType } from 'react';
import { ElektroautoVsBenzinaCalculator } from './ElektroautoVsBenzinaCalculator';
import { EkiiAtbalstsCalculator } from './EkiiAtbalstsCalculator';
import { KaskoCalculator } from './KaskoCalculator';
import { OctaCalculator } from './OctaCalculator';
import { LizingsVsKreditsCalculator } from './LizingsVsKreditsCalculator';
import { DegvielasIzmaksasCalculator } from './DegvielasIzmaksasCalculator';

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
  'kasko-kalkulators': KaskoCalculator,
  'octa-kalkulators': OctaCalculator,
  'lizings-vs-kredits': LizingsVsKreditsCalculator,
  'degvielas-izmaksas': DegvielasIzmaksasCalculator,
};

export function getCalculatorComponent(slug: string): ComponentType<CalculatorComponentProps> | undefined {
  return calculatorComponents[slug];
}
