interface AdSlotProps {
  minHeight: number;
  label?: string;
}

export function AdSlot({ minHeight, label = 'Reklāma' }: AdSlotProps) {
  return (
    <div
      className="flex items-center justify-center rounded-md border border-dashed border-panel-border text-xs text-panel-muted"
      style={{ minHeight }}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}
