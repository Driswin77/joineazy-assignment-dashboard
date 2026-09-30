import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
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

  const courseData = [...new Set(myAssignments.map((item) => item.course))].map((course) => {
    const courseAssignments = myAssignments.filter((item) => item.course === course);
    const completed = courseAssignments.filter(
      (assignment) =>
        getStatus(assignment, getSubmission(submissions, assignment.id, user.id)) === 'Submitted'
    ).length;
    const total = courseAssignments.length;

    return {
      course,
      assignmentCount: total,
      completed,
      total,
      rate: total ? Math.round((completed / total) * 100) : 0,
    };
  });

  const needsAttention = myAssignments
    .map((assignment) => ({
      assignment,
      status: getStatus(assignment, getSubmission(submissions, assignment.id, user.id)),
    }))
    .filter((item) => item.status !== 'Submitted')
    .sort((a, b) => new Date(a.assignment.dueDate) - new Date(b.assignment.dueDate))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <header>
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
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/student/pending"
          className="card flex items-center gap-4 p-5 transition-colors hover:border-slate-300"
        >
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
          </div>
          <ArrowRight className="h-4 w-4 text-slate-300" aria-hidden="true" />
        </Link>

        <Link
          to="/student/completed"
          className="card flex items-center gap-4 p-5 transition-colors hover:border-slate-300"
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Completed
            </p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900">
              {stats.completed}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-300" aria-hidden="true" />
        </Link>
      </div>

      <section className="card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Overall progress</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {stats.completed} of {stats.total} assignments submitted
            </p>
          </div>
          <span className="text-2xl font-semibold tracking-tight text-slate-900">
            {stats.completionRate}%
          </span>
        </div>

        <ProgressBar value={stats.completionRate} tone="success" className="mt-4 h-2" />
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Your courses</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {courseData.length} {courseData.length === 1 ? 'course' : 'courses'} this semester
            </p>
          </div>

          <Link
            to="/student/assignments"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            All assignments
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>

        {courseData.length === 0 ? (
          <EmptyState
            title="No courses yet"
            description="Courses you are enrolled in will appear here."
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
                to={`/student/assignments?course=${encodeURIComponent(item.course)}`}
                role="student"
              />
            ))}
          </div>
        )}
      </section>

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