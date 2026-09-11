export interface KmiInputs {
  weightKg: number;
  heightCm: number;
}

export type KmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface KmiResult {
  bmi: number;
  category: KmiCategory;
}

function categoryForBmi(bmi: number): KmiCategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

export function calculateKmi(inputs: KmiInputs): KmiResult {
  const heightM = Math.max(0, inputs.heightCm) / 100;
  const weightKg = Math.max(0, inputs.weightKg);

  if (heightM <= 0) {
    return { bmi: 0, category: 'normal' };
  }

  const bmi = weightKg / (heightM * heightM);
  return { bmi, category: categoryForBmi(bmi) };
}
