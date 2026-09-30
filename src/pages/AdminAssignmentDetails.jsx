import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, FileText, Pencil } from 'lucide-react';
import { useData } from '../context/DataContext';
import StudentProgress from '../components/StudentProgress';
import EmptyState from '../components/EmptyState';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import {
  formatDate,
  formatTime,
  getAssignmentState,
  getAssignmentStats,
} from '../utils/calculations';

export default function AdminAssignmentDetails() {
  const { assignmentId } = useParams();
  const { assignments, submissions } = useData();

  const assignment = assignments.find((item) => item.id === assignmentId);

  if (!assignment) {
    return (
      <EmptyState
        icon={FileText}
        title="Assignment not found"
        description="It may have been deleted. Head back to the assignment list."
        action={
          <Link to="/admin/assignments" className="btn-primary">
            Back to assignments
          </Link>
        }
      />
    );
  }

  const stats = getAssignmentStats(assignment, submissions);
  const state = getAssignmentState(assignment, stats);

  return (
    <div className="space-y-6">
      <Link
        to="/admin/assignments"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to assignments
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
              {assignment.course}
            </span>
            <span
              className={`rounded-md px-2 py-1 text-[11px] font-medium ${
                assignment.submissionType === 'group'
                  ? 'bg-violet-50 text-violet-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {assignment.submissionType === 'group' ? 'Group' : 'Individual'}
            </span>
          </div>

          <h2 className="mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
            {assignment.title}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-500">{assignment.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={state} />
          <Link to={`/admin/assignments/${assignment.id}/edit`} className="btn-secondary">
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-5 sm:p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-900">Instructions</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{assignment.instructions}</p>

          <a
            href={assignment.submissionLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            Open submission link
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </section>

        <section className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900">Submission progress</h3>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">{stats.rate}%</span>
            <span className="text-xs text-slate-500">
              {stats.submitted} of {stats.total} submitted
            </span>
          </div>

          <ProgressBar
            value={stats.rate}
            tone={stats.rate === 100 ? 'success' : stats.rate >= 50 ? 'primary' : 'warning'}
            className="mt-3"
          />

          <dl className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Due date</dt>
              <dd className="font-medium text-slate-800">
                {formatDate(assignment.dueDate)}
                {assignment.dueTime ? ` · ${formatTime(assignment.dueTime)}` : ''}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Created</dt>
              <dd className="font-medium text-slate-800">{formatDate(assignment.createdAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Maximum marks</dt>
              <dd className="font-medium text-slate-800">{assignment.maxMarks}</dd>
            </div>
          </dl>
        </section>
      </div>

      <StudentProgress assignment={assignment} />
    </div>
  );
}