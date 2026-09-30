import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, ClipboardList, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
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

  const courseData = [...new Set(assignments.map((item) => item.course))].map((course) => {
    const courseAssignments = assignments.filter((item) => item.course === course);

    let submitted = 0;
    let possible = 0;

    courseAssignments.forEach((assignment) => {
      const assignmentStats = getAssignmentStats(assignment, submissions);
      submitted += assignmentStats.submitted;
      possible += assignmentStats.total;
    });

    return {
      course,
      assignmentCount: courseAssignments.length,
      completed: submitted,
      total: possible,
      rate: possible ? Math.round((submitted / possible) * 100) : 0,
    };
  });

  const recentSubmissions = submissions
    .filter((submission) => submission.status === 'submitted' && submission.submittedAt)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 4)
    .map((submission) => ({
      ...submission,
      student: students.find((item) => item.id === submission.studentId),
      assignment: assignments.find((item) => item.id === submission.assignmentId),
    }))
    .filter((item) => item.student && item.assignment);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Professor workspace
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            {user.name.split(' ')[0]}
          </h1>
          <p className="mt-1.5 text-xs text-slate-500">
            {assignments.length} assignments across {courseData.length} courses
          </p>
        </div>

        <Link
          to="/admin/create"
          className="btn-primary self-start !py-1.5 text-xs sm:self-auto sm:!py-2 sm:text-sm"
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          Create assignment
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4 p-5">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Assignments
            </p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900">
              {stats.totalAssignments}
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Submitted
            </p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900">
              {stats.submittedRate}%
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {stats.submitted} of {stats.totalSubmissions}
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-50 text-amber-600">
            <Clock className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Pending
            </p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900">
              {stats.pending}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">Awaiting submission</p>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Your courses</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {courseData.length} {courseData.length === 1 ? 'course' : 'courses'}
            </p>
          </div>

          <Link
            to="/admin/assignments"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            All assignments
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>

        {courseData.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No courses yet"
            description="Create an assignment and pick a course to get started."
            action={
              <Link to="/admin/create" className="btn-primary">
                Create assignment
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courseData.map((item) => (
              <CourseCard
                key={item.course}
                course={item.course}
                assignmentCount={item.assignmentCount}
                completed={item.completed}
                total={item.total}
                rate={item.rate}
                to={`/admin/assignments?course=${encodeURIComponent(item.course)}`}
                role="admin"
              />
            ))}
          </div>
        )}
      </section>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Recent submissions</h2>
          <Link
            to="/admin/reviews"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            See all
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>

        {recentSubmissions.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">No submissions yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentSubmissions.map((submission) => (
              <li key={submission.id} className="flex items-center gap-3 px-5 py-3.5">
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
  );
}