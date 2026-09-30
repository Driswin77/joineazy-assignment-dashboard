import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate, formatTime } from '../utils/calculations';

export default function AssignmentCard({ assignment, status }) {
  return (
    <article className="card flex flex-col p-5 transition-shadow duration-200 hover:shadow-pop">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
          {assignment.course}
        </span>
        <StatusBadge status={status} />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-900">{assignment.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">
        {assignment.description}
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
        Due {formatDate(assignment.dueDate)}
        {assignment.dueTime ? ` · ${formatTime(assignment.dueTime)}` : ''}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <Link
          to={`/student/assignments/${assignment.id}`}
          className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
        >
          View details
        </Link>
        <span className="text-xs text-slate-400">{assignment.maxMarks} marks</span>
      </div>
    </article>
  );
}