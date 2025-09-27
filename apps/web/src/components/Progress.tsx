interface ProgressProps {
  value: number;
}

export function Progress({ value }: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="h-2 w-full rounded-full bg-slate-200">
      <div
        className="h-2 rounded-full bg-sky-600 transition-all duration-300"
        style={{ width: `${clampedValue}%` }}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${clampedValue}%`}
      />
    </div>
  );
}
