import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import {
  dueLabel,
  formatDate,
  getStatus,
  getStudentAssignments,
  getStudentStats,
  getSubmission,
} from '../utils/calculations';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function todayLabel() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const { assignments, submissions } = useData();

  const myAssignments = getStudentAssignments(assignments, user.id);
  const stats = getStudentStats(assignments, submissions, user.id);

  const needsAttention = myAssignments
    .map((assignment) => ({
      assignment,
      status: getStatus(assignment, getSubmission(submissions, assignment.id, user.id)),
    }))
    .filter((item) => item.status !== 'Submitted')
    .sort((a, b) => new Date(a.assignment.dueDate) - new Date(b.assignment.dueDate))
    .slice(0, 4);

  const courseCount = new Set(myAssignments.map((item) => item.course)).size;

  return (
    <div className="space-y-6">
      {/* Greeting header */}
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {greeting()}
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            {user.name.split(' ')[0]}
          </h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3 w-3" aria-hidden="true" />
              {todayLabel()}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{user.rollNo}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{user.year}</span>
          </p>
        </div>

        <Link
          to="/student/assignments"
          className="btn-secondary self-start !py-1.5 text-xs sm:self-auto"
        >
          All assignments
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </header>

      {/* Progress card */}
      <section className="card p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              This semester
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
              {stats.completionRate}%
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {stats.completed} of {stats.total} submitted · {courseCount} courses
            </p>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${
              stats.overdue > 0
                ? 'bg-rose-50 text-rose-700 ring-rose-200'
                : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                stats.overdue > 0 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              aria-hidden="true"
            />
            {stats.overdue > 0
              ? `${stats.overdue} overdue`
              : 'On track'}
          </span>
        </div>

        <ProgressBar value={stats.completionRate} tone="success" className="mt-5 h-2" />
      </section>

      {/* Pending + Completed */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/student/pending"
          className="card flex flex-col p-5 transition-colors hover:border-slate-300"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Pending
            </p>
            <Clock className="h-4 w-4 text-amber-500" aria-hidden="true" />
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
            {stats.pending}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {stats.pending === 0 ? 'All caught up' : 'Still open'}
          </p>
        </Link>

        <Link
          to="/student/completed"
          className="card flex flex-col p-5 transition-colors hover:border-slate-300"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Completed
            </p>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
            {stats.completed}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {stats.completed === stats.total ? 'All done' : 'Submitted'}
          </p>
        </Link>
      </div>

      {/* Needs attention */}
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Needs attention</h2>

          <Link
            to="/student/assignments"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            View all
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>

        {needsAttention.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-medium text-slate-900">Nothing pending</p>
            <p className="mt-1 max-w-xs text-sm text-slate-500">
              You're up to date. New assignments will show up here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {needsAttention.map(({ assignment, status }) => (
              <li key={assignment.id}>
                <Link
                  to={`/student/assignments/${assignment.id}`}
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-slate-900 group-hover:text-brand-700">
                        {assignment.title}
                      </p>
                      <StatusBadge status={status} />
                    </div>

                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                      <span>{assignment.course}</span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" aria-hidden="true" />
                        {formatDate(assignment.dueDate)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-slate-600">
                        {dueLabel(assignment.dueDate)}
                      </span>
                    </p>
                  </div>

                  <ArrowRight
                    className="hidden h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-brand-600 sm:block"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}