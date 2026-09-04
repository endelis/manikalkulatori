import { describe, expect, it } from 'vitest';
import { calculateFtpZonas } from './ftp-zonas';

describe('calculateFtpZonas', () => {
  it('computes all seven zones for an FTP of 250W', () => {
    const result = calculateFtpZonas({ ftpWatts: 250 });

    expect(result.zones).toHaveLength(7);
    expect(result.zones[0]).toEqual({ name: 'Aktīvā atpūta', minWatts: 0, maxWatts: 138 });
    expect(result.zones[3]).toEqual({ name: 'Slieksnis', minWatts: 228, maxWatts: 263 });
    expect(result.zones[6]).toEqual({ name: 'Neiromuskulārā jauda', minWatts: 378, maxWatts: null });
  });

  it('computes the endurance zone for an FTP of 200W', () => {
    const result = calculateFtpZonas({ ftpWatts: 200 });

    expect(result.zones[1]).toEqual({ name: 'Izturība', minWatts: 112, maxWatts: 150 });
  });

  it('guards against a zero FTP without crashing', () => {
    const result = calculateFtpZonas({ ftpWatts: 0 });

    expect(result.zones[0].minWatts).toBe(0);
    expect(result.zones[0].maxWatts).toBe(0);
  });
});
