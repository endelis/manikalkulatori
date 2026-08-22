interface BreakdownRow {
  label: string;
  value: string;
}

interface BreakdownProps {
  rows: BreakdownRow[];
}

export function Breakdown({ rows }: BreakdownProps) {
  return (
    <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">{row.label}</dt>
          <dd className="font-mono text-value text-panel-text">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
