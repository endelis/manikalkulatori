interface ResultCardProps {
  label: string;
  value: string;
  accentVar: string;
  sublabel?: string;
}

export function ResultCard({ label, value, accentVar, sublabel }: ResultCardProps) {
  return (
    <div className="rounded-lg border border-panel-border bg-panel-surface p-6" style={{ borderColor: accentVar }}>
      <p className="text-sm text-panel-muted">{label}</p>
      <p className="font-mono text-4xl font-semibold" style={{ color: accentVar }}>
        {value}
      </p>
      {sublabel ? <p className="mt-1 text-sm text-panel-muted">{sublabel}</p> : null}
    </div>
  );
}
