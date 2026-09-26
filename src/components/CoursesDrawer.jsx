import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Plus,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';
import { formatDate, getAssignmentState, getAssignmentStats } from '../utils/calculations';

function rateTone(rate) {
  if (rate === 100) return 'success';
  if (rate >= 50) return 'primary';
  return 'warning';
}

function shortCourse(course) {
  return course
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function CoursesDrawer({ course, assignments, submissions, onClose }) {
  useEffect(() => {
    if (!course) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [course, onClose]);

  if (!course) return null;

  const courseAssignments = assignments.filter((assignment) => assignment.course === course);

  const rows = courseAssignments.map((assignment) => {
    const stats = getAssignmentStats(assignment, submissions);
    return { assignment, stats, state: getAssignmentState(assignment, stats) };
  });

  const totalStudents = new Set(courseAssignments.flatMap((assignment) => assignment.assignedTo))
    .size;
  const submitted = rows.reduce((total, row) => total + row.stats.submitted, 0);
  const possible = rows.reduce((total, row) => total + row.stats.total, 0);
  const courseRate = possible ? Math.round((submitted / possible) * 100) : 0;
  const pending = possible - submitted;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-900/40 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="courses-drawer-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-pop animate-modal-in"
      >
        {/* Header */}
        <header className="border-b border-slate-200 bg-slate-50/60 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                {shortCourse(course)}
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Course overview
                </p>
                <h2
                  id="courses-drawer-title"
                  className="mt-0.5 truncate text-lg font-semibold text-slate-900"
                >
                  {course}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="-mr-1 -mt-1 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700"
              aria-label="Close drawer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Stats row */}
          <dl className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <dt className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <BookOpen className="h-3 w-3" aria-hidden="true" />
                Assignments
              </dt>
              <dd className="mt-1 text-base font-semibold text-slate-900">
                {courseAssignments.length}
              </dd>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <dt className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <Users className="h-3 w-3" aria-hidden="true" />
                Students
              </dt>
              <dd className="mt-1 text-base font-semibold text-slate-900">{totalStudents}</dd>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <dt className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <TrendingUp className="h-3 w-3" aria-hidden="true" />
                Completion
              </dt>
              <dd className="mt-1 text-base font-semibold text-slate-900">{courseRate}%</dd>
            </div>
          </dl>

          {/* Rate bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>
                {submitted} submitted · {pending} pending
              </span>
              <span className="font-medium text-slate-700">{courseRate}%</span>
            </div>
            <ProgressBar value={courseRate} tone={rateTone(courseRate)} className="mt-1.5" />
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {rows.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={BookOpen}
                title="No assignments in this course"
                description="Assignments created for this course will appear here."
              />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-5 pb-2 pt-5 sm:px-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Assignments
                </h3>
                <span className="text-[11px] text-slate-400">
                  {rows.length} {rows.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <ul className="divide-y divide-slate-100">
                {rows.map(({ assignment, stats, state }) => (
                  <li key={assignment.id}>
                    <Link
                      to={`/admin/assignments/${assignment.id}`}
                      onClick={onClose}
                      className="group block px-5 py-4 transition-colors hover:bg-slate-50 sm:px-6"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-brand-700">
                            {assignment.title}
                          </p>
                          <p className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" aria-hidden="true" />
                              {formatDate(assignment.dueDate)}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>
                              {stats.total} {stats.total === 1 ? 'student' : 'students'}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{assignment.maxMarks} marks</span>
                          </p>
                        </div>

                        <StatusBadge status={state} />
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <ProgressBar
                          value={stats.rate}
                          tone={rateTone(stats.rate)}
                          className="flex-1"
                        />
                        <span className="w-16 shrink-0 text-right text-[11px] font-medium text-slate-600">
                          {stats.submitted}/{stats.total} · {stats.rate}%
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-end text-[11px] font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                        View details
                        <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/60 px-5 py-3.5 sm:px-6">
          <p className="text-[11px] text-slate-500">
            {pending > 0
              ? `${pending} ${pending === 1 ? 'submission' : 'submissions'} still pending`
              : 'All submissions received'}
          </p>

          <Link
            to="/admin/create"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            New assignment
          </Link>
        </footer>
      </div>
    </div>
  );
}