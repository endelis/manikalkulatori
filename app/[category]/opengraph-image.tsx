import { ImageResponse } from 'next/og';
import { categories, getCategory } from '@/lib/registry';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamicParams = false;

const ACCENT_HEX: Record<string, string> = {
  auto: '#0F766E',
  finanses: '#2563EB',
  majoklis: '#B45309',
  veseliba: '#BE185D',
  sports: '#15803D',
  sabiedriba: '#7C3AED',
};

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const category = getCategory(resolvedParams.category) ?? categories[0];
  const accent = ACCENT_HEX[category.slug] ?? '#1C1917';

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
        <div style={{ fontSize: 30, color: '#57534E', marginBottom: 16 }}>Manikalkulatori.lv</div>
        <div style={{ fontSize: 76, fontWeight: 700, color: accent, display: 'flex' }}>{category.title}</div>
        <div style={{ fontSize: 32, color: '#57534E', marginTop: 24, display: 'flex' }}>{category.description}</div>
      </div>
    ),
    { ...size },
  );
}
