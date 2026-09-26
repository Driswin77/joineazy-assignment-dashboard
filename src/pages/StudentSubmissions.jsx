import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import EmptyState from '../components/EmptyState';
import { formatDateTime } from '../utils/calculations';

function markTone(marks, max) {
  if (marks == null) return 'text-slate-500';
  const pct = max ? marks / max : 0;
  if (pct >= 0.75) return 'text-emerald-700';
  if (pct >= 0.4) return 'text-slate-800';
  return 'text-amber-700';
}

export default function StudentSubmissions() {
  const { user } = useAuth();
  const { assignments, submissions } = useData();

  const items = submissions
    .filter((submission) => submission.studentId === user.id && submission.status === 'submitted')
    .map((submission) => ({
      submission,
      assignment: assignments.find((item) => item.id === submission.assignmentId),
    }))
    .filter((item) => item.assignment)
    .sort((a, b) => new Date(b.submission.submittedAt) - new Date(a.submission.submittedAt));

  const graded = items.filter((item) => item.submission.marks != null);
  const average =
    graded.length > 0
      ? Math.round(
          graded.reduce(
            (total, item) => total + (item.submission.marks / item.assignment.maxMarks) * 100,
            0
          ) / graded.length
        )
      : null;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Submissions</h2>
        <p className="mt-1 text-sm text-slate-500">
          Everything you have confirmed as submitted, newest first.
        </p>
      </header>

      {average != null ? (
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Average across graded work</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{average}%</p>
            </div>
            <p className="text-xs text-slate-500">
              {graded.length} of {items.length} graded
            </p>
          </div>
        </section>
      ) : null}

      {items.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No submissions yet"
          description="Once you confirm a submission, it will be recorded here."
        />
      ) : (
        <ul className="card divide-y divide-slate-100 overflow-hidden">
          {items.map(({ submission, assignment }) => {
            const hasMarks = submission.marks != null;

            return (
              <li key={submission.id}>
                <Link
                  to={`/student/assignments/${assignment.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {assignment.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{assignment.course}</p>
                    <p className="mt-1 text-xs text-slate-500 sm:hidden">
                      Submitted {formatDateTime(submission.submittedAt)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    {hasMarks ? (
                      <>
                        <p className={`text-sm font-semibold ${markTone(submission.marks, assignment.maxMarks)}`}>
                          {submission.marks} / {assignment.maxMarks}
                        </p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-500">
                          Marks
                        </p>
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        Awaiting marks
                      </span>
                    )}
                    <p className="mt-1 hidden text-[11px] text-slate-400 sm:block">
                      {formatDateTime(submission.submittedAt)}
                    </p>
                  </div>

                  <ChevronRight
                    className="hidden h-4 w-4 shrink-0 text-slate-300 sm:block"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}