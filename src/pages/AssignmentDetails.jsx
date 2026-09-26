import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';
import ConfirmationModal from '../components/ConfirmationModal';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import {
  dueLabel,
  formatDate,
  formatDateTime,
  getStatus,
  getSubmission,
} from '../utils/calculations';

function MetaRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-800">{children}</dd>
    </div>
  );
}

export default function AssignmentDetails() {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const { assignments, submissions, markSubmitted } = useData();
  const { showToast } = useToast();

  const [step, setStep] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);

  const assignment = assignments.find((item) => item.id === assignmentId);

  if (!assignment || !assignment.assignedTo.includes(user.id)) {
    return (
      <EmptyState
        icon={FileText}
        title="Assignment not found"
        description="This assignment does not exist or is not assigned to you."
        action={
          <Link to="/student/assignments" className="btn-primary">
            Back to my assignments
          </Link>
        }
      />
    );
  }

  const submission = getSubmission(submissions, assignment.id, user.id);
  const status = getStatus(assignment, submission);
  const isSubmitted = submission?.status === 'submitted';

  const handleConfirmSubmission = () => {
    markSubmitted(assignment.id, user.id);
    setStep(null);
    showToast('Submission confirmed.');
  };

  return (
    <div className="space-y-6">
      <Link
        to="/student/assignments"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to assignments
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
            {assignment.course}
          </span>
          <h2 className="mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
            {assignment.title}
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">{assignment.description}</p>
        </div>

        <StatusBadge status={status} />
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-slate-900">Instructions</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{assignment.instructions}</p>
          </section>

          <section className="card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-900">How submission works</h3>
            </div>

            <ol className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                  1
                </span>
                Open the submission link and upload your work.
              </li>
              <li className="flex gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                  2
                </span>
                Come back here, tick the confirmation box and click Submit.
              </li>
              <li className="flex gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                  3
                </span>
                Confirm twice — the status only changes after the final confirmation.
              </li>
            </ol>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card p-5">
            <h3 className="text-sm font-semibold text-slate-900">Details</h3>

            <dl className="mt-2 divide-y divide-slate-100">
              <MetaRow label="Due date">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  {formatDate(assignment.dueDate)}
                </span>
              </MetaRow>
              <MetaRow label="Timeline">{dueLabel(assignment.dueDate)}</MetaRow>
              <MetaRow label="Created">{formatDate(assignment.createdAt)}</MetaRow>
              <MetaRow label="Maximum marks">{assignment.maxMarks}</MetaRow>
              <MetaRow label="Status">
                <StatusBadge status={status} />
              </MetaRow>
            </dl>

            <a
              href={assignment.submissionLink}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary mt-4 w-full"
            >
              Open submission link
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </section>

          {isSubmitted ? (
            <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <p className="text-sm font-semibold">Submission confirmed</p>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-emerald-700/90">
                Marked as submitted on {formatDateTime(submission.submittedAt)}. Your progress has
                been updated.
              </p>

              <div className="mt-4 border-t border-emerald-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-700">Marks</span>
                  <span className="text-sm font-semibold text-emerald-800">
                    {submission.marks != null
                      ? `${submission.marks} / ${assignment.maxMarks}`
                      : 'Not graded yet'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled
                className="mt-4 w-full cursor-not-allowed rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700"
              >
                Already submitted
              </button>
            </section>
          ) : (
            <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-800">Not submitted yet</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                Upload your work through the link above, then submit it here.
              </p>

              <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(event) => setAcknowledged(event.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-xs leading-relaxed text-slate-600">
                  I have uploaded my work to the submission link above.
                </span>
              </label>

              <button
                type="button"
                disabled={!acknowledged}
                onClick={() => setStep('first')}
                className="btn-primary mt-3 w-full"
              >
                Submit
              </button>

              {!acknowledged ? (
                <p className="mt-2 text-center text-[11px] text-slate-500">
                  Tick the box to enable submission.
                </p>
              ) : null}
            </section>
          )}
        </div>
      </div>

      <ConfirmationModal
        open={step === 'first'}
        title="Have you submitted this assignment?"
        description="You are about to mark this assignment as submitted. Make sure your file has been uploaded through the submission link first."
        confirmLabel="Yes, I have submitted"
        cancelLabel="Cancel"
        onConfirm={() => setStep('second')}
        onCancel={() => setStep(null)}
      />

      <ConfirmationModal
        open={step === 'second'}
        title="Final confirmation"
        description="Please confirm that you have actually submitted the assignment through the provided submission link. This will update your progress."
        confirmLabel="Confirm submission"
        cancelLabel="Go back"
        onConfirm={handleConfirmSubmission}
        onCancel={() => setStep('first')}
      />
    </div>
  );
}