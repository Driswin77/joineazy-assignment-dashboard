const STATUS_STYLES = {
  Submitted: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  Overdue: 'bg-rose-50 text-rose-700 ring-rose-200',
  'Not Started': 'bg-slate-100 text-slate-600 ring-slate-200',
};

const DOT_STYLES = {
  Submitted: 'bg-emerald-500',
  Completed: 'bg-emerald-500',
  Pending: 'bg-amber-500',
  Overdue: 'bg-rose-500',
  'Not Started': 'bg-slate-400',
};

export default function StatusBadge({ status, className = '' }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES['Not Started'];
  const dot = DOT_STYLES[status] ?? DOT_STYLES['Not Started'];

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}