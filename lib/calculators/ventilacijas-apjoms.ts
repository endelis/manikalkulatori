export interface VentilacijasApjomaInputs {
  occupantCount: number;
  roomVolumeM3: number;
}

export interface VentilacijasApjomaResult {
  /** Minimum required fresh air supply, m3/h, per LBN 231-15 point 97 (15 m3/h per
   * person, when occupants are the room's sole pollution source). */
  requiredFreshAirM3H: number;
  /** Air changes per hour needed to deliver that fresh air volume in the given room. */
  airChangesPerHour: number;
}

const MIN_FRESH_AIR_PER_PERSON_M3H = 15;

export function calculateVentilacijasApjoms(inputs: VentilacijasApjomaInputs): VentilacijasApjomaResult {
  const occupantCount = Math.max(0, inputs.occupantCount);
  const roomVolumeM3 = Math.max(0, inputs.roomVolumeM3);

  const requiredFreshAirM3H = occupantCount * MIN_FRESH_AIR_PER_PERSON_M3H;
  const airChangesPerHour = roomVolumeM3 > 0 ? requiredFreshAirM3H / roomVolumeM3 : 0;

  return { requiredFreshAirM3H, airChangesPerHour };
}
