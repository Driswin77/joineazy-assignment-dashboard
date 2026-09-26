import { Link } from 'react-router-dom';
import { CalendarDays, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import {
  daysUntil,
  dueLabel,
  getStatus,
  getStudentAssignments,
  getSubmission,
} from '../utils/calculations';

const DOT_TONES = {
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
  brand: 'bg-brand-500',
  slate: 'bg-slate-400',
};

function shortMonth(dateValue) {
  return new Date(dateValue).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
}

export default function StudentCalendar() {
  const { user } = useAuth();
  const { assignments, submissions } = useData();

  const items = getStudentAssignments(assignments, user.id)
    .map((assignment) => ({
      assignment,
      status: getStatus(assignment, getSubmission(submissions, assignment.id, user.id)),
      days: daysUntil(assignment.dueDate),
    }))
    .sort((a, b) => a.days - b.days);

  const groups = [
    { key: 'overdue', title: 'Overdue', tone: 'rose', items: items.filter((item) => item.days < 0) },
    { key: 'today', title: 'Due today', tone: 'amber', items: items.filter((item) => item.days === 0) },
    {
      key: 'week',
      title: 'Next 7 days',
      tone: 'brand',
      items: items.filter((item) => item.days > 0 && item.days <= 7),
    },
    { key: 'later', title: 'Later', tone: 'slate', items: items.filter((item) => item.days > 7) },
  ].filter((group) => group.items.length > 0);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Calendar</h2>
        <p className="mt-1 text-sm text-slate-500">
          Your assignments grouped by how soon they are due.
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nothing scheduled"
          description="Assignments assigned to you will appear here, grouped by due date."
        />
      ) : (
        <div className="space-y-5">
          {groups.map((group) => (
            <section key={group.key} className="card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3.5">
                <span
                  className={`h-2 w-2 rounded-full ${DOT_TONES[group.tone]}`}
                  aria-hidden="true"
                />
                <h3 className="text-sm font-semibold text-slate-900">{group.title}</h3>
                <span className="text-xs text-slate-500">
                  · {group.items.length} {group.items.length === 1 ? 'assignment' : 'assignments'}
                </span>
              </div>

              <ul className="divide-y divide-slate-100">
                {group.items.map(({ assignment, status }) => (
                  <li key={assignment.id}>
                    <Link
                      to={`/student/assignments/${assignment.id}`}
                      className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="w-12 shrink-0 rounded-lg border border-slate-200 bg-slate-50 py-1.5 text-center">
                        <p className="text-base font-semibold leading-none text-slate-900">
                          {new Date(assignment.dueDate).getDate()}
                        </p>
                        <p className="mt-1 text-[10px] font-medium tracking-wide text-slate-500">
                          {shortMonth(assignment.dueDate)}
                        </p>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {assignment.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {assignment.course}
                        </p>
                      </div>

                      <span className="hidden shrink-0 text-xs text-slate-500 md:block">
                        {dueLabel(assignment.dueDate)}
                      </span>

                      <StatusBadge status={status} />

                      <ChevronRight
                        className="hidden h-4 w-4 shrink-0 text-slate-300 sm:block"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}