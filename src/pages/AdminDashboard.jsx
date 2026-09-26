import { Link } from 'react-router-dom';
import { CheckCircle2, ClipboardList, Clock, Plus, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import Avatar from '../components/Avatar';
import { formatDate, getAdminStats, getAssignmentStats } from '../utils/calculations';

function rateTone(rate) {
  if (rate === 100) return 'success';
  if (rate >= 50) return 'primary';
  return 'warning';
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { assignments, submissions, students } = useData();

  const stats = getAdminStats(assignments, submissions);

  const recentSubmissions = submissions
    .filter((submission) => submission.status === 'submitted' && submission.submittedAt)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5)
    .map((submission) => ({
      ...submission,
      student: students.find((item) => item.id === submission.studentId),
      assignment: assignments.find((item) => item.id === submission.assignmentId),
    }))
    .filter((item) => item.student && item.assignment);

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 sm:text-2xl">
            Welcome back, {user.name.split(' ')[0]}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 sm:mt-1">
            Track submissions across the assignments you have created.
          </p>
        </div>

      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Assignments"
          value={stats.totalAssignments}
          icon={ClipboardList}
          hint="Created by you"
        />
        <StatCard
          label="Students"
          value={stats.totalStudents}
          icon={Users}
          tone="slate"
          hint="Across all your assignments"
        />
        <StatCard
          label="Submitted"
          value={`${stats.submittedRate}%`}
          icon={CheckCircle2}
          tone="emerald"
          hint={`${stats.submitted} of ${stats.totalSubmissions} submissions`}
        />
        <StatCard
          label="Pending"
          value={`${stats.pendingRate}%`}
          icon={Clock}
          tone="amber"
          hint={`${stats.pending} still awaiting submission`}
        />
      </div>

      <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
        <section className="card overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 sm:px-5 sm:py-4">
            <h3 className="text-sm font-semibold text-slate-900">Submission overview</h3>
            <Link
              to="/admin/assignments"
              className="text-xs font-medium text-brand-600 transition-colors hover:text-brand-700"
            >
              Manage
            </Link>
          </div>

          {assignments.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              No assignments created yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {assignments.slice(0, 5).map((assignment) => {
                const assignmentStats = getAssignmentStats(assignment, submissions);

                return (
                  <li key={assignment.id}>
                    <Link
                      to={`/admin/assignments/${assignment.id}`}
                      className="block px-4 py-3.5 transition-colors hover:bg-slate-50 sm:px-5 sm:py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {assignment.title}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {assignment.course}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs font-medium text-slate-600">
                          {assignmentStats.submitted}/{assignmentStats.total}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center gap-3">
                        <ProgressBar
                          value={assignmentStats.rate}
                          tone={rateTone(assignmentStats.rate)}
                          className="flex-1"
                        />
                        <span className="w-9 shrink-0 text-right text-xs font-medium text-slate-600">
                          {assignmentStats.rate}%
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 sm:px-5 sm:py-4">
            <h3 className="text-sm font-semibold text-slate-900">Recent submissions</h3>
            <Link
              to="/admin/reviews"
              className="text-xs font-medium text-brand-600 transition-colors hover:text-brand-700"
            >
              See all
            </Link>
          </div>

          {recentSubmissions.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">No submissions yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentSubmissions.map((submission) => (
                <li key={submission.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                  <Avatar name={submission.student.name} size="sm" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {submission.student.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {submission.assignment.title}
                    </p>
                  </div>

                  <span className="shrink-0 text-[11px] text-slate-400 sm:text-xs">
                    {formatDate(submission.submittedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}