export interface SirdsdarbibasZonuInputs {
  maxHeartRate: number;
  restingHeartRate: number;
}

export interface HeartRateZone {
  name: string;
  minBpm: number;
  maxBpm: number;
}

export interface SirdsdarbibasZonuResult {
  heartRateReserve: number;
  zones: HeartRateZone[];
}

const HR_ZONE_DEFINITIONS: { name: string; minPercent: number; maxPercent: number }[] = [
  { name: 'Ļoti viegla', minPercent: 50, maxPercent: 60 },
  { name: 'Viegla', minPercent: 60, maxPercent: 70 },
  { name: 'Vidēja', minPercent: 70, maxPercent: 80 },
  { name: 'Augsta', minPercent: 80, maxPercent: 90 },
  { name: 'Maksimāla', minPercent: 90, maxPercent: 100 },
];

export function calculateSirdsdarbibasZonas(inputs: SirdsdarbibasZonuInputs): SirdsdarbibasZonuResult {
  const heartRateReserve = inputs.maxHeartRate - inputs.restingHeartRate;
  const zones = HR_ZONE_DEFINITIONS.map((zone) => ({
    name: zone.name,
    minBpm: Math.round(inputs.restingHeartRate + (heartRateReserve * zone.minPercent) / 100),
    maxBpm: Math.round(inputs.restingHeartRate + (heartRateReserve * zone.maxPercent) / 100),
  }));
  return { heartRateReserve, zones };
}
