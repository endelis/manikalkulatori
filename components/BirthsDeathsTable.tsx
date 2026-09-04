import type { PopulationYearRow } from '@/lib/calculators/dzimstibas-kalkulators';
import { formatNumber } from '@/lib/format';

interface BirthsDeathsTableProps {
  rows: PopulationYearRow[];
  accentVar: string;
  /** Locative place name for the caption, e.g. "Latvijā" or "Daugavpilī". */
  placeName?: string;
}

/**
 * A real HTML table doubling as the chart: bar widths are CSS, the numbers are real
 * table cells, so it is its own text equivalent and needs no separate description.
 */
export function BirthsDeathsTable({ rows, accentVar, placeName = 'Latvijā' }: BirthsDeathsTableProps) {
  const maxValue = Math.max(...rows.map((row) => Math.max(row.liveBirths ?? 0, row.deaths ?? 0)));
  const firstYear = rows[0]?.year;
  const lastYear = rows[rows.length - 1]?.year;

  return (
    <table className="w-full border-collapse text-sm">
      <caption className="mb-2 text-left text-panel-muted">
        Dzīvi dzimušie un mirušie {placeName}, {firstYear} līdz {lastYear}. gads
      </caption>
      <thead>
        <tr className="border-b border-panel-border text-left text-panel-muted">
          <th scope="col" className="py-1 pr-2 font-normal">
            Gads
          </th>
          <th scope="col" className="py-1 pr-2 font-normal">
            Dzīvi dzimušie
          </th>
          <th scope="col" className="py-1 font-normal">
            Mirušie
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.year} className="border-b border-panel-border/50">
            <th scope="row" className="py-1 pr-2 text-left font-mono font-normal text-panel-text">
              {row.year}
            </th>
            <td className="py-1 pr-2">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 rounded-sm"
                  style={{
                    width: `${((row.liveBirths ?? 0) / maxValue) * 100}%`,
                    backgroundColor: accentVar,
                  }}
                  aria-hidden="true"
                />
                <span className="font-mono text-panel-text">{formatNumber(row.liveBirths ?? 0, 0)}</span>
              </div>
            </td>
            <td className="py-1">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 rounded-sm"
                  style={{ width: `${((row.deaths ?? 0) / maxValue) * 100}%`, backgroundColor: 'var(--color-warn)' }}
                  aria-hidden="true"
                />
                <span className="font-mono text-panel-text">{formatNumber(row.deaths ?? 0, 0)}</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
