import { ImageResponse } from 'next/og';
import { computeTumsas } from '@/lib/calculators/tumsas-kalkulators';
import { DEFAULT_BIRTH_DATE, buildTumsasInput } from '@/lib/calculators/tumsas-kalkulators-defaults';
import { formatNumber } from '@/lib/format';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  // A fixed reference date, not the real clock, so this generated image is stable
  // between builds instead of changing every day.
  const result = computeTumsas(buildTumsasInput(DEFAULT_BIRTH_DATE, '2026-09-04'));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0B0E14',
          color: '#E8ECF3',
          fontFamily: 'sans-serif',
          padding: 64,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 32, color: '#8A93A6', marginBottom: 16 }}>Manikalkulatori.lv</div>
        <div style={{ fontSize: 110, fontWeight: 700, color: '#B18CFF', display: 'flex' }}>
          {formatNumber(result.totalDarkDays, 0)}
        </div>
        <div style={{ fontSize: 40, color: '#E8ECF3', marginTop: 16 }}>dienas pavadītas tumsā</div>
        <div style={{ fontSize: 28, color: '#8A93A6', marginTop: 8 }}>pēc Rīgas gaismas stundu svārstībām</div>
      </div>
    ),
    { ...size },
  );
}
