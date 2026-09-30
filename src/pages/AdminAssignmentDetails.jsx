import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  Info,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';
import ConfirmationModal from '../components/ConfirmationModal';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import Avatar from '../components/Avatar';
import {
  dueLabel,
  formatDate,
  formatDateTime,
  formatTime,
  getStatus,
  getSubmission,
} from '../utils/calculations';
import { getGroupForStudent, getGroupMembers } from '../data/mockData';

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

  const isGroup = assignment.submissionType === 'group';
  const myGroup = isGroup ? getGroupForStudent(assignment.course, user.id) : null;
  const isLeader = myGroup?.leaderId === user.id;
  const groupMembers = myGroup ? getGroupMembers(myGroup.id) : [];

  const submission = getSubmission(submissions, assignment.id, user.id);
  const status = getStatus(assignment, submission);
  const isSubmitted = submission?.status === 'submitted';

  const leaderSubmission =
    isGroup && myGroup
      ? getSubmission(submissions, assignment.id, myGroup.leaderId)
      : null;
  const leaderSubmitted = leaderSubmission?.status === 'submitted';
  const leader = groupMembers.find((member) => member.id === myGroup?.leaderId);

  const handleConfirmSubmission = () => {
    markSubmitted(assignment.id, user.id);
    setStep(null);
    showToast(
      isGroup
        ? 'Submission confirmed for your group.'
        : 'Submission confirmed.'
    );
  };

  const canSubmit = !isGroup || (isGroup && isLeader && !leaderSubmitted);

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
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
              {assignment.course}
            </span>
            <span
              className={`rounded-md px-2 py-1 text-[11px] font-medium ${
                isGroup
                  ? 'bg-violet-50 text-violet-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isGroup ? 'Group' : 'Individual'}
            </span>
          </div>

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

          {isGroup && myGroup ? (
            <section className="card p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-900">
                  {myGroup.name}
                </h3>
                <span className="text-xs text-slate-500">
                  · {groupMembers.length} members
                </span>
              </div>

              <ul className="mt-4 space-y-2">
                {groupMembers.map((member) => {
                  const memberSubmission = getSubmission(submissions, assignment.id, member.id);
                  const memberSubmitted = memberSubmission?.status === 'submitted';
                  const isGroupLeader = member.id === myGroup.leaderId;

                  return (
                    <li
                      key={member.id}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5"
                    >
                      <Avatar name={member.name} size="sm" />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {member.name}
                          </p>
                          {isGroupLeader ? (
                            <span className="rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-700">
                              Leader
                            </span>
                          ) : null}
                          {member.id === user.id ? (
                            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                              You
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {memberSubmitted ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Submitted
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Pending</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

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
                {isGroup
                  ? 'The group leader confirms submission on behalf of the team.'
                  : 'Tick the confirmation box and click Submit.'}
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
                  {assignment.dueTime ? ` · ${formatTime(assignment.dueTime)}` : ''}
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
                {isGroup && !isLeader && leader
                  ? `Submitted by ${leader.name} on ${formatDateTime(submission.submittedAt)}.`
                  : `Marked as submitted on ${formatDateTime(submission.submittedAt)}.`}
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
            </section>
          ) : isGroup && !myGroup ? (
            <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-center gap-2 text-amber-800">
                <Users className="h-4 w-4" aria-hidden="true" />
                <p className="text-sm font-semibold">No group yet</p>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-amber-800/90">
                You are not part of any group. Form or join one to submit this assignment.
              </p>
            </section>
          ) : isGroup && !isLeader ? (
            <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-800">Waiting for your group leader</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                {leader ? `${leader.name} has` : 'Your group leader has'} not confirmed the
                submission yet. Once they do, this assignment will show as submitted for your
                whole team.
              </p>
            </section>
          ) : (
            <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-800">Not submitted yet</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                {isGroup
                  ? 'As group leader, confirming here will mark the submission for your entire team.'
                  : 'Upload your work through the link above, then submit it here.'}
              </p>

              {canSubmit ? (
                <>
                  <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3">
                    <input
                      id="acknowledge-submission"
                      name="acknowledge-submission"
                      type="checkbox"
                      checked={acknowledged}
                      onChange={(event) => setAcknowledged(event.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-xs leading-relaxed text-slate-600">
                      {isGroup
                        ? 'I confirm my team has uploaded the work to the submission link.'
                        : 'I have uploaded my work to the submission link above.'}
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
                </>
              ) : null}
            </section>
          )}
        </div>
      </div>

      <ConfirmationModal
        open={step === 'first'}
        title="Have you submitted this assignment?"
        description={
          isGroup
            ? 'You are about to mark this assignment as submitted for your entire group. Make sure the work has been uploaded through the submission link first.'
            : 'You are about to mark this assignment as submitted. Make sure your file has been uploaded through the submission link first.'
        }
        confirmLabel="Yes, I have submitted"
        cancelLabel="Cancel"
        onConfirm={() => setStep('second')}
        onCancel={() => setStep(null)}
      />

      <ConfirmationModal
        open={step === 'second'}
        title="Final confirmation"
        description={
          isGroup
            ? 'Please confirm that your group has actually submitted the assignment through the provided submission link. This will mark all group members as submitted.'
            : 'Please confirm that you have actually submitted the assignment through the provided submission link. This will update your progress.'
        }
        confirmLabel="Confirm submission"
        cancelLabel="Go back"
        onConfirm={handleConfirmSubmission}
        onCancel={() => setStep('first')}
      />
    </div>
  );
}