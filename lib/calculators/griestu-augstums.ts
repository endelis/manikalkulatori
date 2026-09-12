export type TelpasVeids =
  | 'dzivojama-telpa'
  | 'publiska-telpa'
  | 'gaitenis-sanitara-telpa'
  | 'tehniska-telpa';

export interface GriestuAugstumaInputs {
  ceilingHeightM: number;
  roomType: TelpasVeids;
}

export interface GriestuAugstumaResult {
  minHeightM: number;
  isCompliant: boolean;
  shortfallM: number;
}

/**
 * Minimum height from clean floor level to the underside of the ceiling construction,
 * per LBN 200-21 point 7 (points 7.1-7.7). "tehniska-telpa" uses point 7.5's 1,8 m
 * (basement/foundation/attic/technical floor), not point 7.6's 1,6 m short-passage
 * exception, which this calculator does not model.
 */
export const MIN_HEIGHTS_M: Record<TelpasVeids, number> = {
  'dzivojama-telpa': 2.5,
  'publiska-telpa': 2.7,
  'gaitenis-sanitara-telpa': 2.2,
  'tehniska-telpa': 1.8,
};

export function calculateGriestuAugstums(inputs: GriestuAugstumaInputs): GriestuAugstumaResult {
  const ceilingHeightM = Math.max(0, inputs.ceilingHeightM);
  const minHeightM = MIN_HEIGHTS_M[inputs.roomType];

  const isCompliant = ceilingHeightM >= minHeightM;
  const shortfallM = Math.max(0, minHeightM - ceilingHeightM);

  return { minHeightM, isCompliant, shortfallM };
}
