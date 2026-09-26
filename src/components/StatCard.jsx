const TONES = {
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
  slate: 'bg-slate-100 text-slate-600',
};

export default function StatCard({ label, value, hint, icon: Icon, tone = 'brand' }) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
          <p className="mt-1.5 text-xl font-semibold tracking-tight text-slate-900 sm:mt-2 sm:text-2xl">
            {value}
          </p>
        </div>

        {Icon ? (
          <span
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg sm:h-10 sm:w-10 ${
              TONES[tone] ?? TONES.brand
            }`}
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </span>
        ) : null}
      </div>

      {hint ? <p className="mt-3 hidden text-xs text-slate-500 sm:block">{hint}</p> : null}
    </div>
  );
}