'use client';

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberField({ id, label, value, onChange, unit, min = 0, max, step = 1 }: NumberFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-label uppercase text-panel-muted">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 transition-colors duration-[120ms]">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          className="w-full bg-transparent font-mono text-lg text-panel-text outline-none"
          value={Number.isNaN(value) ? '' : value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const next = event.target.valueAsNumber;
            onChange(Number.isNaN(next) ? 0 : next);
          }}
        />
        {unit ? <span className="text-sm text-panel-muted">{unit}</span> : null}
      </div>
    </div>
  );
}
