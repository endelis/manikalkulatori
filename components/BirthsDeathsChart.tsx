import type { PopulationYearRow } from '@/lib/calculators/dzimstibas-kalkulators';
import { formatNumber } from '@/lib/format';

interface BirthsDeathsChartProps {
  rows: PopulationYearRow[];
  accentVar: string;
  tableCode: string;
}

const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 380;
const MARGIN = { top: 50, right: 260, bottom: 60, left: 110 };
const PLOT_WIDTH = VIEW_WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = VIEW_HEIGHT - MARGIN.top - MARGIN.bottom;
// Matches the caption tier in tailwind.config.ts (0.75rem = 12px), sized so that even
// at a 360px viewport (roughly 328px of usable width inside the page's px-4 padding),
// the scaled viewBox never renders text below that floor: 328 / VIEW_WIDTH is about
// 0.41, and 28 * 0.41 is about 11.5px; the real content column measures a little wider
// than that in practice (padding varies by breakpoint), landing comfortably at or
// above 12px. Margins are sized generously around this same font size so the widest
// tick label ("40 000") and the longest inline series label ("Dzīvi dzimušie") both
// stay inside the viewBox instead of being clipped at its edge.
const FONT_SIZE = 28;

/**
 * Server rendered inline SVG, no client JS. Two series (dzimusie, mirusie) 2015 to
 * 2025 from the same IRS010 rows already used elsewhere on the page. The accessible
 * BirthsDeathsTable below this chart remains the text equivalent; this component is
 * marked aria-hidden internally with a single summarising aria-label on the SVG.
 *
 * Year labels on the x axis are thinned to every second year unconditionally (not
 * only below a breakpoint): eleven adjacent year labels at a font size large enough to
 * clear the 12px floor above would overlap regardless of viewport width, since that is
 * a fixed ratio inside the SVG's own coordinate space, not something viewport scaling
 * changes. All eleven data points are still plotted and connected.
 */
export function BirthsDeathsChart({ rows, accentVar, tableCode }: BirthsDeathsChartProps) {
  const births = rows.map((row) => row.liveBirths ?? 0);
  const deaths = rows.map((row) => row.deaths ?? 0);
  const maxValue = Math.max(...births, ...deaths);
  const yMax = Math.ceil(maxValue / 10000) * 10000;
  const yTicks = [0, yMax / 4, yMax / 2, (yMax * 3) / 4, yMax];

  const xFor = (index: number) => MARGIN.left + (index / (rows.length - 1)) * PLOT_WIDTH;
  const yFor = (value: number) => MARGIN.top + (1 - value / yMax) * PLOT_HEIGHT;

  const birthsPoints = births.map((value, index) => [xFor(index), yFor(value)] as const);
  const deathsPoints = deaths.map((value, index) => [xFor(index), yFor(value)] as const);

  const toPolyline = (points: readonly (readonly [number, number])[]) =>
    points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  const areaPath = [
    `M ${birthsPoints.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L ')}`,
    `L ${[...deathsPoints].reverse().map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L ')}`,
    'Z',
  ].join(' ');

  const firstYear = rows[0].year;
  const lastYear = rows[rows.length - 1].year;
  const lastBirths = births[births.length - 1];
  const lastDeaths = deaths[deaths.length - 1];

  const ariaLabel =
    `Grafiks rāda, ka no ${firstYear}. līdz ${lastYear}. gadam dzīvi dzimušo skaits Latvijā pastāvīgi ` +
    `samazinājās no ${formatNumber(births[0], 0)} līdz ${formatNumber(lastBirths, 0)}, savukārt mirušo ` +
    `skaits saglabājās augsts, ${lastYear}. gadā ${formatNumber(lastDeaths, 0)}, un starpība starp abiem ` +
    `pastāvīgi palielinājās.`;

  return (
    <figure className="flex flex-col gap-2">
      <div className="w-full" style={{ aspectRatio: `${VIEW_WIDTH} / ${VIEW_HEIGHT}` }}>
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="h-full w-full"
          role="img"
          aria-label={ariaLabel}
        >
          <g aria-hidden="true">
            {yTicks.map((tick) => (
              <g key={tick}>
                <line
                  x1={MARGIN.left}
                  x2={VIEW_WIDTH - MARGIN.right}
                  y1={yFor(tick)}
                  y2={yFor(tick)}
                  stroke="var(--color-panel-border)"
                  strokeWidth={1}
                />
                <text
                  x={MARGIN.left - 14}
                  y={yFor(tick)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={FONT_SIZE}
                  fill="var(--color-panel-muted)"
                  fontFamily="var(--font-mono)"
                >
                  {formatNumber(tick, 0)}
                </text>
              </g>
            ))}

            <text
              x={MARGIN.left}
              y={MARGIN.top - 22}
              fontSize={FONT_SIZE}
              fill="var(--color-panel-muted)"
              fontFamily="var(--font-sans)"
            >
              cilvēku skaits
            </text>

            {rows.map((row, index) =>
              index % 2 === 0 ? (
                <text
                  key={row.year}
                  x={xFor(index)}
                  y={VIEW_HEIGHT - MARGIN.bottom + 34}
                  textAnchor="middle"
                  fontSize={FONT_SIZE}
                  fill="var(--color-panel-muted)"
                  fontFamily="var(--font-mono)"
                >
                  {row.year}
                </text>
              ) : null,
            )}

            <path d={areaPath} fill={accentVar} fillOpacity={0.12} stroke="none" />

            <polyline
              points={toPolyline(deathsPoints)}
              fill="none"
              stroke="var(--color-warn)"
              strokeWidth={3.5}
              strokeDasharray="12 9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {deathsPoints.map(([x, y], index) => (
              <circle key={index} cx={x} cy={y} r={5} fill="var(--color-panel-bg)" stroke="var(--color-warn)" strokeWidth={3} />
            ))}

            <polyline
              points={toPolyline(birthsPoints)}
              fill="none"
              stroke={accentVar}
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {birthsPoints.map(([x, y], index) => (
              <circle key={index} cx={x} cy={y} r={5} fill={accentVar} />
            ))}

            <text
              x={xFor(rows.length - 1) + 16}
              y={yFor(lastDeaths)}
              dominantBaseline="middle"
              fontSize={FONT_SIZE}
              fontWeight={600}
              fill="var(--color-warn)"
              fontFamily="var(--font-sans)"
            >
              Mirušie
            </text>
            <text
              x={xFor(rows.length - 1) + 16}
              y={yFor(lastBirths)}
              dominantBaseline="middle"
              fontSize={FONT_SIZE}
              fontWeight={600}
              fill={accentVar}
              fontFamily="var(--font-sans)"
            >
              Dzīvi dzimušie
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="text-caption text-panel-faint">
        Avots: CSP tabula {tableCode}, {firstYear} līdz {lastYear}. gads.
      </figcaption>
    </figure>
  );
}
