import { useState } from 'react';
import { CheckCircle2, Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import { formatDateTime, getAssignmentStats } from '../utils/calculations';

export default function AdminReviews() {
  const { assignments, submissions, students } = useData();
  const [query, setQuery] = useState('');

  const search = query.trim().toLowerCase();

  const rows = submissions
    .filter((submission) => submission.status === 'submitted')
    .map((submission) => ({
      ...submission,
      student: students.find((item) => item.id === submission.studentId),
      assignment: assignments.find((item) => item.id === submission.assignmentId),
    }))
    .filter((item) => item.student && item.assignment)
    .filter(
      (item) =>
        item.student.name.toLowerCase().includes(search) ||
        item.assignment.title.toLowerCase().includes(search)
    )
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const awaitingReview = assignments.filter((assignment) => {
    const stats = getAssignmentStats(assignment, submissions);
    return stats.pending > 0;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Reviews</h2>
          <p className="mt-1 text-sm text-slate-500">
            Every submission recorded on your assignments, newest first.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search student or assignment"
            aria-label="Search submissions"
            className="input pl-9"
          />
        </div>
      </header>

      {awaitingReview.length > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {awaitingReview.length}{' '}
          {awaitingReview.length === 1 ? 'assignment still has' : 'assignments still have'} students
          who have not submitted yet.
        </div>
      ) : null}

      {rows.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No submissions found"
          description="Once students confirm their submissions they will show up here."
        />
      ) : (
        <ul className="card divide-y divide-slate-100 overflow-hidden">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center gap-4 px-5 py-4">
              <Avatar name={row.student.name} size="sm" />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{row.student.name}</p>
                <p className="truncate text-xs text-slate-500">
                  {row.assignment.title} · {row.assignment.course}
                </p>
              </div>

              <span className="hidden shrink-0 text-xs text-slate-500 sm:block">
                {formatDateTime(row.submittedAt)}
              </span>

              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Submitted
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}