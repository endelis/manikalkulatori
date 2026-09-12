import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
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
          backgroundColor: '#FAFAF9',
          color: '#1C1917',
          fontFamily: 'sans-serif',
          padding: 64,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, color: '#1C1917', display: 'flex' }}>
          Manikalkulatori.lv
        </div>
        <div style={{ fontSize: 34, color: '#57534E', marginTop: 24 }}>
          Bezmaksas kalkulatori auto, finanšu, mājokļa, veselības un sporta jautājumiem
        </div>
      </div>
    ),
    { ...size },
  );
}
