const TONES = {
  primary: 'bg-brand-600',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
};

export default function ProgressBar({ value = 0, tone = 'primary', className = '' }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${TONES[tone] ?? TONES.primary}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}