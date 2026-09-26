import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const CONFIRM_TONES = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
};

export default function ConfirmationModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  onConfirm,
  onCancel,
  children,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    confirmRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-slate-900/40 animate-fade-in"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-pop animate-modal-in sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="confirmation-modal-title" className="text-base font-semibold text-slate-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onCancel}
            className="-mr-1 -mt-1 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
        ) : null}

        {children}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="btn-secondary">
            {cancelLabel}
          </button>

          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
              CONFIRM_TONES[tone] ?? CONFIRM_TONES.primary
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}