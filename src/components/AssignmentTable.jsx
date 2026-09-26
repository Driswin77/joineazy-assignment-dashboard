import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/calculations';

function rateTone(rate) {
  if (rate === 100) return 'success';
  if (rate >= 50) return 'primary';
  return 'warning';
}

export default function AssignmentTable({ rows, onDelete }) {
  return (
    <>
      <div className="card hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">Assignment</th>
              <th scope="col" className="px-5 py-3 font-medium">Due date</th>
              <th scope="col" className="px-5 py-3 font-medium">Students</th>
              <th scope="col" className="px-5 py-3 font-medium">Submissions</th>
              <th scope="col" className="px-5 py-3 font-medium">Status</th>
              <th scope="col" className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map(({ assignment, stats, state }) => (
              <tr key={assignment.id} className="transition-colors hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-800">{assignment.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{assignment.course}</p>
                </td>

                <td className="px-5 py-4 text-slate-600">{formatDate(assignment.dueDate)}</td>

                <td className="px-5 py-4 text-slate-600">{stats.total}</td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <ProgressBar value={stats.rate} tone={rateTone(stats.rate)} className="w-24" />
                    <span className="w-20 text-xs text-slate-600">
                      {stats.submitted}/{stats.total} · {stats.rate}%
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={state} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/admin/assignments/${assignment.id}`}
                      className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      aria-label={`View ${assignment.title}`}
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    </Link>

                    <Link
                      to={`/admin/assignments/${assignment.id}/edit`}
                      className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      aria-label={`Edit ${assignment.title}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onDelete(assignment)}
                      className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Delete ${assignment.title}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {rows.map(({ assignment, stats, state }) => (
          <li key={assignment.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{assignment.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {assignment.course} · Due {formatDate(assignment.dueDate)}
                </p>
              </div>
              <StatusBadge status={state} />
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{stats.total} students</span>
                <span className="font-medium text-slate-700">
                  {stats.submitted}/{stats.total} submitted
                </span>
              </div>
              <ProgressBar value={stats.rate} tone={rateTone(stats.rate)} className="mt-1.5" />
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
              <Link
                to={`/admin/assignments/${assignment.id}`}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                View
              </Link>

              <Link
                to={`/admin/assignments/${assignment.id}/edit`}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={() => onDelete(assignment)}
                className="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-center text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}