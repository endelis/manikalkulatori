import { ImageResponse } from 'next/og';
import { computeDzimstibas } from '@/lib/calculators/dzimstibas-kalkulators';
import { DEFAULT_INPUT } from '@/lib/calculators/dzimstibas-kalkulators-defaults';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  const result = computeDzimstibas(DEFAULT_INPUT);
  const perDay = result.perDay.toFixed(1).replace('.', ',');

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
        <div style={{ fontSize: 140, fontWeight: 700, color: '#B18CFF', display: 'flex' }}>{perDay}</div>
        <div style={{ fontSize: 40, color: '#E8ECF3', marginTop: 16 }}>bērni dienā nepieciešami</div>
        <div style={{ fontSize: 28, color: '#8A93A6', marginTop: 8 }}>lai Latvijas iedzīvotāju skaits vairs nesarūktu</div>
      </div>
    ),
    { ...size },
  );
}
