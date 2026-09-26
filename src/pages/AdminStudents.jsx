import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import Avatar from '../components/Avatar';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';
import { getStudentStats } from '../utils/calculations';

function progressTone(value) {
  if (value >= 75) return 'success';
  if (value >= 40) return 'primary';
  return 'warning';
}

export default function AdminStudents() {
  const { assignments, submissions, students } = useData();
  const [query, setQuery] = useState('');

  const search = query.trim().toLowerCase();

  const rows = students
    .map((student) => ({ student, stats: getStudentStats(assignments, submissions, student.id) }))
    .filter(({ student }) => `${student.name} ${student.email}`.toLowerCase().includes(search));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Students</h2>
          <p className="mt-1 text-sm text-slate-500">
            Overall submission progress for every student in your assignments.
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
            placeholder="Search by name or email"
            aria-label="Search students"
            className="input pl-9"
          />
        </div>
      </header>

      {rows.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description="Try a different name or email address."
        />
      ) : (
        <>
          <div className="card hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Student</th>
                  <th scope="col" className="px-5 py-3 font-medium">Email</th>
                  <th scope="col" className="px-5 py-3 font-medium">Course</th>
                  <th scope="col" className="px-5 py-3 font-medium">Assignments</th>
                  <th scope="col" className="px-5 py-3 font-medium">Completion</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rows.map(({ student, stats }) => (
                  <tr key={student.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={student.name} size="sm" />
                        <div>
                          <p className="font-medium text-slate-800">{student.name}</p>
                          <p className="text-xs text-slate-500">{student.rollNo}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">{student.email}</td>
                    <td className="px-5 py-4 text-slate-600">{student.course}</td>

                    <td className="px-5 py-4 text-slate-600">
                      {stats.completed} of {stats.total}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <ProgressBar
                          value={stats.completionRate}
                          tone={progressTone(stats.completionRate)}
                          className="w-28"
                        />
                        <span className="w-10 text-xs font-medium text-slate-600">
                          {stats.completionRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {rows.map(({ student, stats }) => (
              <li key={student.id} className="card p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={student.name} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{student.name}</p>
                    <p className="truncate text-xs text-slate-500">{student.email}</p>
                  </div>
                </div>

                <div className="mt-3.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {stats.completed} of {stats.total} completed
                    </span>
                    <span className="font-medium text-slate-700">{stats.completionRate}%</span>
                  </div>
                  <ProgressBar
                    value={stats.completionRate}
                    tone={progressTone(stats.completionRate)}
                    className="mt-1.5"
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}