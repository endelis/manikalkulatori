export type DarbaVeids =
  | 'dokumentu-sistematizacija'
  | 'lasisana-rakstisana'
  | 'tehniska-raseshana'
  | 'sapulcu-telpas'
  | 'klientu-pienemsana'
  | 'noliktavas-arhivi';

export interface DarbaVietasApgaismojumaInputs {
  illuminanceLux: number;
  workType: DarbaVeids;
}

export interface DarbaVietasApgaismojumaResult {
  minLux: number;
  isCompliant: boolean;
  shortfallLux: number;
}

/** MK noteikumi Nr. 359 "Darba aizsardzības prasības darba vietās", 2. pielikums:
 * minimālais apgaismojums (lx) pēc darba veida. */
export const MIN_LUX_BY_WORK_TYPE: Record<DarbaVeids, number> = {
  'dokumentu-sistematizacija': 300,
  'lasisana-rakstisana': 500,
  'tehniska-raseshana': 750,
  'sapulcu-telpas': 500,
  'klientu-pienemsana': 300,
  'noliktavas-arhivi': 200,
};

export function calculateDarbaVietasApgaismojums(
  inputs: DarbaVietasApgaismojumaInputs,
): DarbaVietasApgaismojumaResult {
  const illuminanceLux = Math.max(0, inputs.illuminanceLux);
  const minLux = MIN_LUX_BY_WORK_TYPE[inputs.workType];

  const isCompliant = illuminanceLux >= minLux;
  const shortfallLux = Math.max(0, minLux - illuminanceLux);

  return { minLux, isCompliant, shortfallLux };
}
