export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
      {Icon ? (
        <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      ) : null}

      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>

      {description ? <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p> : null}

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}