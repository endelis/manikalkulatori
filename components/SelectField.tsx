'use client';

interface SelectFieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: SelectFieldOption[];
  onChange: (value: string) => void;
}

export function SelectField({ id, label, value, options, onChange }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-label uppercase text-panel-muted">
        {label}
      </label>
      <div className="flex items-center rounded-xl border border-panel-border-strong bg-panel-surface-2 px-3 py-2.5 transition-colors duration-[120ms] focus-within:border-panel-text">
        <select
          id={id}
          className="w-full bg-transparent text-lg text-panel-text outline-none"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
