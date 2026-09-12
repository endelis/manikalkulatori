export interface RiepuProtektoraDzilumaInputs {
  treadDepthMm: number;
  isWinterSeason: boolean;
}

export interface RiepuProtektoraDzilumaResult {
  minDepthMm: number;
  isCompliant: boolean;
  shortfallMm: number;
}

/** MK noteikumi Nr. 295 "Noteikumi par transportlīdzekļu valsts tehnisko apskati un
 * tehnisko kontroli uz ceļa": minimum tire tread depth for passenger cars (up to 3.5 t),
 * summer vs. the mandatory winter-tire period (1 December to 1 March). */
const SUMMER_MIN_DEPTH_MM = 1.6;
const WINTER_MIN_DEPTH_MM = 4;

export function calculateRiepuProtektoraDzilums(
  inputs: RiepuProtektoraDzilumaInputs,
): RiepuProtektoraDzilumaResult {
  const treadDepthMm = Math.max(0, inputs.treadDepthMm);
  const minDepthMm = inputs.isWinterSeason ? WINTER_MIN_DEPTH_MM : SUMMER_MIN_DEPTH_MM;

  const isCompliant = treadDepthMm >= minDepthMm;
  const shortfallMm = Math.max(0, minDepthMm - treadDepthMm);

  return { minDepthMm, isCompliant, shortfallMm };
}
