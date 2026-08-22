import type { ComponentType } from 'react';
import { ElektroautoVsBenzinaCalculator } from './ElektroautoVsBenzinaCalculator';

export const calculatorComponents: Record<string, ComponentType> = {
  'elektroauto-vs-benzina': ElektroautoVsBenzinaCalculator,
};

export function getCalculatorComponent(slug: string): ComponentType | undefined {
  return calculatorComponents[slug];
}
