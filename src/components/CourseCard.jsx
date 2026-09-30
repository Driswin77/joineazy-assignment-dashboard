import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import ProgressBar from './ProgressBar';

function rateTone(rate) {
  if (rate === 100) return 'success';
  if (rate >= 50) return 'primary';
  return 'warning';
}

function shortCourse(course) {
  return course
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function CourseCard({
  course,
  assignmentCount,
  completed,
  total,
  rate,
  to,
  role = 'student',
}) {
  return (
    <Link
      to={to}
      className="card group flex flex-col p-5 transition-colors hover:border-slate-300"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-600 text-xs font-bold text-white">
          {shortCourse(course)}
        </span>

        <span className="text-xs text-slate-500">
          {assignmentCount} {assignmentCount === 1 ? 'assignment' : 'assignments'}
        </span>
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-900 group-hover:text-brand-700">
        {course}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {role === 'student'
          ? `${completed} of ${total} submitted`
          : `${completed} of ${total} student submissions`}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <ProgressBar value={rate} tone={rateTone(rate)} className="flex-1" />
        <span className="w-9 shrink-0 text-right text-xs font-medium text-slate-600">
          {rate}%
        </span>
      </div>

      <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3 text-xs font-medium text-brand-600">
        {role === 'student' ? 'View assignments' : 'Manage'}
        <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
    </Link>
  );
}