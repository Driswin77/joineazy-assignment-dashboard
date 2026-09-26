import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Avatar from '../components/Avatar';
import ProgressBar from '../components/ProgressBar';
import { getStudentStats } from '../utils/calculations';

export default function StudentProfile() {
  const { user } = useAuth();
  const { assignments, submissions } = useData();

  const stats = getStudentStats(assignments, submissions, user.id);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Profile</h2>
        <p className="mt-1 text-sm text-slate-500">Your account details and overall progress.</p>
      </header>

      <section className="card p-5 sm:p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar name={user.name} size="lg" />

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
            <p className="text-sm text-slate-500">{user.email}</p>
            <p className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {user.course} · {user.year}
            </p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Roll number</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">{user.rollNo}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Assignments</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">{stats.total}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Completed</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">
              {stats.completed} of {stats.total}
            </dd>
          </div>
        </dl>
      </section>

      <section className="card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Overall completion</h3>
          <span className="text-sm font-medium text-slate-700">{stats.completionRate}%</span>
        </div>

        <ProgressBar value={stats.completionRate} tone="success" className="mt-4 h-2.5" />

        <p className="mt-3 text-xs text-slate-500">
          {stats.completed} submitted · {stats.pending} pending · {stats.overdue} overdue
        </p>
      </section>
    </div>
  );
}