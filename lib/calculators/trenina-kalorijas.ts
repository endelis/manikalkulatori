export type TreninaAktivitate = 'walking' | 'running' | 'cycling' | 'swimming';

export interface TreninaKalorijuInputs {
  activity: TreninaAktivitate;
  weightKg: number;
  durationMinutes: number;
}

export interface TreninaKalorijuResult {
  caloriesBurned: number;
}

const MET_VALUES: Record<TreninaAktivitate, number> = {
  walking: 3.8,
  running: 8.3,
  cycling: 7.5,
  swimming: 6.0,
};

export function calculateTreninaKalorijas(inputs: TreninaKalorijuInputs): TreninaKalorijuResult {
  const weightKg = Math.max(0, inputs.weightKg);
  const durationHours = Math.max(0, inputs.durationMinutes) / 60;
  const met = MET_VALUES[inputs.activity];

  const caloriesBurned = met * weightKg * durationHours;

  return { caloriesBurned };
}
