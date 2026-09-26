import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';
import ConfirmationModal from '../components/ConfirmationModal';
import Avatar from '../components/Avatar';

export default function AdminSettings() {
  const { user } = useAuth();
  const { resetData, assignments, submissions } = useData();
  const { showToast } = useToast();

  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    resetData();
    setConfirmReset(false);
    showToast('Demo data reset to its original state.', 'info');
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Account details and demo data controls.</p>
      </header>

      <section className="card p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900">Account</h3>

        <div className="mt-4 flex items-center gap-4">
          <Avatar name={user.name} size="lg" />

          <div>
            <p className="text-base font-semibold text-slate-900">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
            <p className="mt-1.5 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {user.title} · {user.department}
            </p>
          </div>
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900">Demo data</h3>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Assignments and submissions are stored in your browser's localStorage, so any changes you
          make survive a page refresh. Resetting restores the original mock data.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Assignments stored</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{assignments.length}</p>
          </div>

          <div className="rounded-lg border border-slate-200 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Submission records</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{submissions.length}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="btn-secondary mt-5"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset demo data
        </button>
      </section>

      <ConfirmationModal
        open={confirmReset}
        title="Reset demo data?"
        description="All assignments, submissions and progress changes you made will be replaced with the original mock data."
        confirmLabel="Reset data"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}