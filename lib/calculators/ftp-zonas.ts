export interface FtpZonuInputs {
  ftpWatts: number;
}

export interface FtpZone {
  name: string;
  minWatts: number;
  maxWatts: number | null;
}

export interface FtpZonuResult {
  zones: FtpZone[];
}

const ZONE_DEFINITIONS: { name: string; minPercent: number; maxPercent: number | null }[] = [
  { name: 'Aktīvā atpūta', minPercent: 0, maxPercent: 55 },
  { name: 'Izturība', minPercent: 56, maxPercent: 75 },
  { name: 'Temps', minPercent: 76, maxPercent: 90 },
  { name: 'Slieksnis', minPercent: 91, maxPercent: 105 },
  { name: 'VO2 max', minPercent: 106, maxPercent: 120 },
  { name: 'Anaerobā kapacitāte', minPercent: 121, maxPercent: 150 },
  { name: 'Neiromuskulārā jauda', minPercent: 151, maxPercent: null },
];

export function calculateFtpZonas(inputs: FtpZonuInputs): FtpZonuResult {
  const zones = ZONE_DEFINITIONS.map((zone) => ({
    name: zone.name,
    minWatts: Math.round((inputs.ftpWatts * zone.minPercent) / 100),
    maxWatts: zone.maxPercent === null ? null : Math.round((inputs.ftpWatts * zone.maxPercent) / 100),
  }));
  return { zones };
}
