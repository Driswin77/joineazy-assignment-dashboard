import { useState } from 'react';
import { Users } from 'lucide-react';
import Avatar from './Avatar';
import { getStudentsByCourse } from '../utils/calculations';
import CourseCombobox from './CourseCombobox';

function emptyValues() {
  return {
    title: '',
    course: '',
    description: '',
    instructions: '',
    dueDate: '',
    dueTime: '',
    maxMarks: '',
    submissionLink: '',
    submissionType: 'individual',
  };
}

function toFormValues(initialValues) {
  if (!initialValues) return emptyValues();

  return {
    title: initialValues.title ?? '',
    course: initialValues.course ?? '',
    description: initialValues.description ?? '',
    instructions: initialValues.instructions ?? '',
    dueDate: initialValues.dueDate ?? '',
    dueTime: initialValues.dueTime ?? '',
    maxMarks: initialValues.maxMarks != null ? String(initialValues.maxMarks) : '',
    submissionLink: initialValues.submissionLink ?? '',
    submissionType: initialValues.submissionType ?? 'individual',
  };
}

function validate(values, enrolled) {
  const errors = {};

  if (!values.title.trim()) errors.title = 'Assignment title is required.';
  if (!values.course.trim()) errors.course = 'Course is required.';
  else if (enrolled.length === 0)
    errors.course = 'No students are enrolled in this course yet.';

  if (!values.description.trim()) errors.description = 'Add a short description.';
  if (!values.instructions.trim()) errors.instructions = 'Add submission instructions.';

  if (!values.dueDate) {
    errors.dueDate = 'Due date is required.';
  } else if (Number.isNaN(new Date(values.dueDate).getTime())) {
    errors.dueDate = 'Enter a valid date.';
  }

  if (!values.dueTime) errors.dueTime = 'Due time is required.';

  const marks = Number(values.maxMarks);
  if (!values.maxMarks) errors.maxMarks = 'Maximum marks is required.';
  else if (!Number.isFinite(marks) || marks <= 0) errors.maxMarks = 'Enter a number greater than 0.';

  if (!values.submissionLink.trim()) {
    errors.submissionLink = 'A submission link is required.';
  } else if (!/^https?:\/\/.+\..+/i.test(values.submissionLink.trim())) {
    errors.submissionLink = 'Enter a valid URL starting with http:// or https://';
  }

  return errors;
}

function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export default function AssignmentForm({
  initialValues,
  students,
  courses = [],
  onSubmit,
  onCancel,
  submitLabel,
}) {
  const [values, setValues] = useState(() => toFormValues(initialValues));
  const [errors, setErrors] = useState({});

  const enrolled = getStudentsByCourse(students, values.course);

  const updateField = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validate(values, enrolled);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      title: values.title.trim(),
      course: values.course.trim(),
      description: values.description.trim(),
      instructions: values.instructions.trim(),
      dueDate: values.dueDate,
      dueTime: values.dueTime,
      maxMarks: Number(values.maxMarks),
      submissionLink: values.submissionLink.trim(),
      submissionType: values.submissionType,
      assignedTo: enrolled.map((student) => student.id),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <section className="card p-5 sm:p-6">
        <div className="space-y-5">
          <Field label="Assignment title" htmlFor="title" error={errors.title}>
            <input
              id="title"
              name="title"
              type="text"
              value={values.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="React Dashboard Implementation"
              className="input"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field
              label="Course"
              htmlFor="course"
              error={errors.course}
              hint="Every student enrolled in this course will receive the assignment."
            >
              <CourseCombobox
                id="course"
                value={values.course}
                onChange={(next) => updateField('course', next)}
                options={courses}
                placeholder="Web Development"
                invalid={Boolean(errors.course)}
              />
            </Field>

            <Field label="Due date" htmlFor="dueDate" error={errors.dueDate}>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={values.dueDate}
                onChange={(event) => updateField('dueDate', event.target.value)}
                className="input"
                aria-invalid={Boolean(errors.dueDate)}
                aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
              />
            </Field>

            <Field label="Due time" htmlFor="dueTime" error={errors.dueTime}>
              <input
                id="dueTime"
                name="dueTime"
                type="time"
                value={values.dueTime}
                onChange={(event) => updateField('dueTime', event.target.value)}
                className="input"
                aria-invalid={Boolean(errors.dueTime)}
                aria-describedby={errors.dueTime ? 'dueTime-error' : undefined}
              />
            </Field>
          </div>

          <Field label="Submission type" htmlFor="submissionType">
            <div className="flex gap-2">
              {['individual', 'group'].map((type) => {
                const active = values.submissionType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField('submissionType', type)}
                    aria-pressed={active}
                    className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition-colors ${
                      active
                        ? 'border-brand-300 bg-brand-50 text-brand-700'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              {values.submissionType === 'group'
                ? 'Only the group leader can acknowledge. All members will be marked as submitted.'
                : 'Every student must acknowledge their own submission.'}
            </p>
          </Field>

          {values.course.trim() ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <p className="text-sm font-medium text-slate-800">
                    Students who will receive this
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-600">
                  {enrolled.length} {enrolled.length === 1 ? 'student' : 'students'}
                </span>
              </div>

              {enrolled.length === 0 ? (
                <p className="mt-2 text-xs text-rose-600">
                  No students are enrolled in "{values.course.trim()}" yet.
                </p>
              ) : (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {enrolled.map((student) => (
                    <li
                      key={student.id}
                      className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3"
                    >
                      <Avatar name={student.name} size="sm" />
                      <span className="text-xs font-medium text-slate-700">
                        {student.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          <Field label="Description" htmlFor="description" error={errors.description}>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={values.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="A short summary students will see on the assignment card."
              className="input resize-y"
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
          </Field>

          <Field label="Instructions" htmlFor="instructions" error={errors.instructions}>
            <textarea
              id="instructions"
              name="instructions"
              rows={4}
              value={values.instructions}
              onChange={(event) => updateField('instructions', event.target.value)}
              placeholder="What students need to submit and how."
              className="input resize-y"
              aria-invalid={Boolean(errors.instructions)}
              aria-describedby={errors.instructions ? 'instructions-error' : undefined}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Maximum marks" htmlFor="maxMarks" error={errors.maxMarks}>
              <input
                id="maxMarks"
                name="maxMarks"
                type="number"
                min="1"
                value={values.maxMarks}
                onChange={(event) => updateField('maxMarks', event.target.value)}
                placeholder="50"
                className="input"
                aria-invalid={Boolean(errors.maxMarks)}
                aria-describedby={errors.maxMarks ? 'maxMarks-error' : undefined}
              />
            </Field>

            <Field
              label="Submission link"
              htmlFor="submissionLink"
              error={errors.submissionLink}
              hint="OneDrive link or any external upload folder."
            >
              <input
                id="submissionLink"
                name="submissionLink"
                type="url"
                value={values.submissionLink}
                onChange={(event) => updateField('submissionLink', event.target.value)}
                placeholder="https://onedrive.live.com/..."
                className="input"
                aria-invalid={Boolean(errors.submissionLink)}
                aria-describedby={errors.submissionLink ? 'submissionLink-error' : undefined}
              />
            </Field>
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}