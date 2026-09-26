import { useState } from 'react';
import { Mail, Search, Users } from 'lucide-react';
import Avatar from './Avatar';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';
import ConfirmationModal from './ConfirmationModal';
import { useToast } from './Toast';
import { formatDate, getStudentProgress, getSubmission } from '../utils/calculations';
import { useData } from '../context/DataContext';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'pending', label: 'Not submitted' },
];

function progressTone(value) {
  if (value >= 75) return 'success';
  if (value >= 40) return 'primary';
  return 'warning';
}

function marksTone(marks, max) {
  if (marks == null) return 'text-slate-400';
  const pct = max ? marks / max : 0;
  if (pct >= 0.75) return 'text-emerald-700';
  if (pct >= 0.4) return 'text-slate-800';
  return 'text-amber-700';
}

export default function StudentProgress({ assignment }) {
  const { assignments, submissions, students, setMarks } = useData();
  const { showToast } = useToast();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const rows = assignment.assignedTo
    .map((studentId) => students.find((student) => student.id === studentId))
    .filter(Boolean)
    .map((student) => {
      const submission = getSubmission(submissions, assignment.id, student.id);

      return {
        student,
        submitted: submission?.status === 'submitted',
        submittedAt: submission?.submittedAt,
        marks: submission?.marks ?? null,
        overall: getStudentProgress(assignments, submissions, student.id),
      };
    });

  const search = query.trim().toLowerCase();

  const visibleRows = rows.filter((row) => {
    const matchesQuery = `${row.student.name} ${row.student.email}`.toLowerCase().includes(search);
    const matchesFilter =
      filter === 'all' || (filter === 'submitted' ? row.submitted : !row.submitted);

    return matchesQuery && matchesFilter;
  });

  const openMarks = (row) => {
    setEditing(row);
    setDraft(row.marks != null ? String(row.marks) : '');
    setError('');
  };

  const closeMarks = () => {
    setEditing(null);
    setDraft('');
    setError('');
  };

  const saveMarks = () => {
    if (!editing) return;

    const value = Number(draft);

    if (draft === '' || !Number.isFinite(value) || value < 0) {
      setError('Enter a valid number.');
      return;
    }

    if (value > assignment.maxMarks) {
      setError(`Marks cannot exceed ${assignment.maxMarks}.`);
      return;
    }

    setMarks(assignment.id, editing.student.id, value);
    showToast(`Marks saved for ${editing.student.name}.`);
    closeMarks();
  };

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Student submissions</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {rows.filter((row) => row.submitted).length} of {rows.length} students have submitted
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search students"
              aria-label="Search students"
              className="input w-full pl-9 sm:w-56"
            />
          </div>

          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            {FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`chip flex-1 justify-center whitespace-nowrap ${
                  filter === item.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {visibleRows.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={Users}
            title="No students found"
            description="Try a different search term or switch the filter."
          />
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Student</th>
                  <th scope="col" className="px-5 py-3 font-medium">Email</th>
                  <th scope="col" className="px-5 py-3 font-medium">Overall</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  <th scope="col" className="px-5 py-3 font-medium">Marks</th>
                  <th scope="col" className="px-5 py-3 font-medium">Submitted</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {visibleRows.map((row) => (
                  <tr key={row.student.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={row.student.name} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-800">{row.student.name}</p>
                          <p className="text-xs text-slate-500">{row.student.rollNo}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-slate-600">{row.student.email}</td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <ProgressBar
                          value={row.overall}
                          tone={progressTone(row.overall)}
                          className="w-24"
                        />
                        <span className="w-10 text-xs font-medium text-slate-600">
                          {row.overall}%
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <StatusBadge status={row.submitted ? 'Submitted' : 'Pending'} />
                    </td>

                    <td className="px-5 py-3.5">
                      {row.submitted ? (
                        <span className={`text-sm font-medium ${marksTone(row.marks, assignment.maxMarks)}`}>
                          {row.marks != null ? `${row.marks} / ${assignment.maxMarks}` : '—'}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Not submitted</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-slate-600">
                      {row.submittedAt ? formatDate(row.submittedAt) : '—'}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {row.submitted ? (
                          <button
                            type="button"
                            onClick={() => openMarks(row)}
                            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            {row.marks != null ? 'Edit marks' : 'Give marks'}
                          </button>
                        ) : null}

                        <a
                          href={`mailto:${row.student.email}?subject=Regarding ${assignment.title}`}
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                          aria-label={`Email ${row.student.name}`}
                        >
                          <Mail className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-slate-100 md:hidden">
            {visibleRows.map((row) => (
              <li key={row.student.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={row.student.name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {row.student.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">{row.student.email}</p>
                    </div>
                  </div>

                  <StatusBadge status={row.submitted ? 'Submitted' : 'Pending'} />
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Overall progress</span>
                    <span className="font-medium text-slate-700">{row.overall}%</span>
                  </div>
                  <ProgressBar
                    value={row.overall}
                    tone={progressTone(row.overall)}
                    className="mt-1.5"
                  />
                </div>

                {row.submitted ? (
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Marks</span>
                    <span className={`font-medium ${marksTone(row.marks, assignment.maxMarks)}`}>
                      {row.marks != null ? `${row.marks} / ${assignment.maxMarks}` : 'Not graded'}
                    </span>
                  </div>
                ) : null}

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="text-slate-500">
                    {row.submittedAt ? `Submitted ${formatDate(row.submittedAt)}` : 'Not submitted yet'}
                  </span>

                  <div className="flex items-center gap-1">
                    {row.submitted ? (
                      <button
                        type="button"
                        onClick={() => openMarks(row)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 font-medium text-slate-700"
                      >
                        {row.marks != null ? 'Edit marks' : 'Give marks'}
                      </button>
                    ) : null}

                    <a
                      href={`mailto:${row.student.email}?subject=Regarding ${assignment.title}`}
                      className="rounded-lg p-2 text-slate-500"
                      aria-label={`Email ${row.student.name}`}
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmationModal
        open={Boolean(editing)}
        title="Enter marks"
        description={
          editing
            ? `Award marks for ${editing.student.name} on "${assignment.title}". Maximum is ${assignment.maxMarks}.`
            : ''
        }
        confirmLabel="Save marks"
        cancelLabel="Cancel"
        onConfirm={saveMarks}
        onCancel={closeMarks}
      >
        <div className="mt-4">
          <label htmlFor="marks" className="label">
            Marks out of {assignment.maxMarks}
          </label>
          <input
            id="marks"
            type="number"
            min="0"
            max={assignment.maxMarks}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              if (error) setError('');
            }}
            placeholder={`e.g. ${Math.round(assignment.maxMarks * 0.8)}`}
            className="input"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'marks-error' : undefined}
          />
          {error ? (
            <p id="marks-error" className="mt-1 text-xs text-rose-600">
              {error}
            </p>
          ) : null}
        </div>
      </ConfirmationModal>
    </section>
  );
}