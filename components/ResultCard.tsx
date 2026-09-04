export type ResultCardTone = 'winner' | 'loser' | 'neutral';

interface ResultCardProps {
  label: string;
  value: string;
  tone: ResultCardTone;
  accentVar: string;
  sublabel?: string;
}

export function ResultCard({ label, value, tone, accentVar, sublabel }: ResultCardProps) {
  const color = tone === 'winner' ? accentVar : tone === 'loser' ? 'var(--color-warn)' : 'var(--color-panel-text)';

  return (
    <div className="reveal rounded-lg border bg-panel-surface p-6" style={{ borderColor: color }}>
      <p className="text-sm text-panel-muted">{label}</p>
      <p className="font-mono text-hero" style={{ color }}>
        {value}
      </p>
      {sublabel ? <p className="mt-1 text-sm text-panel-muted">{sublabel}</p> : null}
    </div>
  );
}
