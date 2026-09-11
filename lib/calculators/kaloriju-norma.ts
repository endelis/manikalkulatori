export type KalorijuNormasDzimums = 'male' | 'female';

export type KalorijuNormasAktivitate =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'veryActive';

export interface KalorijuNormasInputs {
  sex: KalorijuNormasDzimums;
  weightKg: number;
  heightCm: number;
  age: number;
  activityLevel: KalorijuNormasAktivitate;
}

export interface KalorijuNormasResult {
  bmr: number;
  tdee: number;
}

const ACTIVITY_MULTIPLIERS: Record<KalorijuNormasAktivitate, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

export function calculateKalorijuNorma(inputs: KalorijuNormasInputs): KalorijuNormasResult {
  const weightKg = Math.max(0, inputs.weightKg);
  const heightCm = Math.max(0, inputs.heightCm);
  const age = Math.max(0, inputs.age);

  const sexConstant = inputs.sex === 'male' ? 5 : -161;
  const bmr = Math.max(0, 10 * weightKg + 6.25 * heightCm - 5 * age + sexConstant);

  const tdee = bmr * ACTIVITY_MULTIPLIERS[inputs.activityLevel];

  return { bmr, tdee };
}
