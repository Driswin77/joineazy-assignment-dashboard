export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function daysUntil(dateValue) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const target = new Date(dateValue);
  target.setHours(0, 0, 0, 0);

  return Math.round((target - start) / 86400000);
}

export function isOverdue(dateValue) {
  return daysUntil(dateValue) < 0;
}

export function dueLabel(dateValue) {
  const diff = daysUntil(dateValue);

  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  if (diff > 1) return `Due in ${diff} days`;
  if (diff === -1) return 'Overdue by 1 day';
  return `Overdue by ${Math.abs(diff)} days`;
}

export function getSubmission(submissions, assignmentId, studentId) {
  return submissions.find(
    (submission) => submission.assignmentId === assignmentId && submission.studentId === studentId
  );
}

export function getStatus(assignment, submission) {
  if (submission?.status === 'submitted') return 'Submitted';
  if (isOverdue(assignment.dueDate)) return 'Overdue';
  return 'Pending';
}

export function getStudentAssignments(assignments, studentId) {
  return assignments.filter((assignment) => assignment.assignedTo.includes(studentId));
}

export function getStudentStats(assignments, submissions, studentId) {
  const list = getStudentAssignments(assignments, studentId);

  let completed = 0;
  let pending = 0;
  let overdue = 0;

  list.forEach((assignment) => {
    const status = getStatus(assignment, getSubmission(submissions, assignment.id, studentId));

    if (status === 'Submitted') completed += 1;
    else if (status === 'Overdue') overdue += 1;
    else pending += 1;
  });

  const total = list.length;

  return {
    total,
    completed,
    pending,
    overdue,
    completionRate: total ? Math.round((completed / total) * 100) : 0,
  };
}

export function getStudentProgress(assignments, submissions, studentId) {
  return getStudentStats(assignments, submissions, studentId).completionRate;
}

export function getAssignmentStats(assignment, submissions) {
  const list = submissions.filter((submission) => submission.assignmentId === assignment.id);
  const submitted = list.filter((submission) => submission.status === 'submitted').length;
  const total = list.length;

  return {
    total,
    submitted,
    pending: total - submitted,
    rate: total ? Math.round((submitted / total) * 100) : 0,
  };
}

export function getAssignmentState(assignment, stats) {
  if (stats.total > 0 && stats.submitted === stats.total) return 'Completed';
  if (isOverdue(assignment.dueDate)) return 'Overdue';
  return 'Pending';
}

export function getAdminStats(assignments, submissions) {
  const totalStudents = new Set(assignments.flatMap((assignment) => assignment.assignedTo)).size;
  const relevant = submissions.filter((submission) =>
    assignments.some((assignment) => assignment.id === submission.assignmentId)
  );
  const submitted = relevant.filter((submission) => submission.status === 'submitted').length;
  const submittedRate = relevant.length ? Math.round((submitted / relevant.length) * 100) : 0;

  return {
    totalAssignments: assignments.length,
    totalStudents,
    submitted,
    pending: relevant.length - submitted,
    totalSubmissions: relevant.length,
    submittedRate,
    pendingRate: 100 - submittedRate,
  };
}
export function getCourses(assignments) {
  return [...new Set(assignments.map((assignment) => assignment.course))].sort();
}

export function getStudentsByCourse(students, course) {
  if (!course) return [];
  const target = course.trim().toLowerCase();
  return students.filter((student) =>
    student.enrolledCourses.some((item) => item.toLowerCase() === target)
  );
}