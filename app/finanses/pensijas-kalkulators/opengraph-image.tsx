import { ImageResponse } from 'next/og';
import { computePension } from '@/lib/calculators/pensijas-kalkulators';
import { DEFAULT_INPUT } from '@/lib/calculators/pensijas-kalkulators-defaults';
import { formatCurrencyEUR } from '@/lib/format';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  const result = computePension(DEFAULT_INPUT);
  const monthly = formatCurrencyEUR(result.monthlyPension, { maximumFractionDigits: 0 });

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
        <div style={{ fontSize: 110, fontWeight: 700, color: '#B18CFF', display: 'flex' }}>{monthly}</div>
        <div style={{ fontSize: 40, color: '#E8ECF3', marginTop: 16 }}>aptuvenā 1. līmeņa pensija mēnesī</div>
        <div style={{ fontSize: 28, color: '#8A93A6', marginTop: 8 }}>rēķinot pēc VSAA formulas un koeficienta G</div>
      </div>
    ),
    { ...size },
  );
}
