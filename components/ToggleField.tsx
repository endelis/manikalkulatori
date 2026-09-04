'use client';

interface ToggleFieldProps {
  id: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  trueLabel: string;
  falseLabel: string;
}

export function ToggleField({ id, label, value, onChange, trueLabel, falseLabel }: ToggleFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <span id={`${id}-label`} className="text-label uppercase text-panel-muted">
        {label}
      </span>
      <div role="group" aria-labelledby={`${id}-label`} className="flex gap-2">
        <button
          type="button"
          aria-pressed={!value}
          onClick={() => onChange(false)}
          className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors duration-[120ms] ${
            !value
              ? 'border-panel-border-strong bg-panel-surface-2 text-panel-text'
              : 'border-panel-border bg-panel-surface text-panel-muted'
          }`}
        >
          {falseLabel}
        </button>
        <button
          type="button"
          aria-pressed={value}
          onClick={() => onChange(true)}
          className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors duration-[120ms] ${
            value
              ? 'border-panel-border-strong bg-panel-surface-2 text-panel-text'
              : 'border-panel-border bg-panel-surface text-panel-muted'
          }`}
        >
          {trueLabel}
        </button>
      </div>
    </div>
  );
}
