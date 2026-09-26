import { useState } from 'react';
import { ClipboardList, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import AssignmentCard from '../components/AssignmentCard';
import EmptyState from '../components/EmptyState';
import {
  getStatus,
  getStudentAssignments,
  getSubmission,
} from '../utils/calculations';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'overdue', label: 'Overdue' },
];

const HEADINGS = {
  all: { title: 'My assignments', description: 'Everything assigned to you this semester.' },
  pending: { title: 'Pending assignments', description: 'Not submitted yet, still within the due date.' },
  completed: { title: 'Completed assignments', description: 'Assignments you have confirmed as submitted.' },
  overdue: { title: 'Overdue assignments', description: 'Past the due date and not submitted yet.' },
};

export default function StudentAssignments({ filter = 'all' }) {
  const { user } = useAuth();
  const { assignments, submissions } = useData();

  const [activeFilter, setActiveFilter] = useState(filter);
  const [activeCourse, setActiveCourse] = useState('all');
  const [query, setQuery] = useState('');

  const heading = HEADINGS[activeFilter] ?? HEADINGS.all;
  const search = query.trim().toLowerCase();

  const myAssignments = getStudentAssignments(assignments, user.id);

  const courses = [...new Set(myAssignments.map((item) => item.course))].sort();

  const items = myAssignments
    .map((assignment) => ({
      assignment,
      status: getStatus(assignment, getSubmission(submissions, assignment.id, user.id)),
    }))
    .filter(({ assignment, status }) => {
      const matchesQuery =
        assignment.title.toLowerCase().includes(search) ||
        assignment.course.toLowerCase().includes(search);

      if (!matchesQuery) return false;
      if (activeCourse !== 'all' && assignment.course !== activeCourse) return false;

      if (activeFilter === 'pending') return status === 'Pending';
      if (activeFilter === 'completed') return status === 'Submitted';
      if (activeFilter === 'overdue') return status === 'Overdue';

      return true;
    })
    .sort((a, b) => new Date(a.assignment.dueDate) - new Date(b.assignment.dueDate));

  return (
    <div className="space-y-5 sm:space-y-6">
      <header>
        <h2 className="text-lg font-semibold text-slate-900 sm:text-2xl">{heading.title}</h2>
        <p className="mt-0.5 text-sm text-slate-500 sm:mt-1">{heading.description}</p>
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveFilter(item.key)}
              className={`chip ${
                activeFilter === item.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={activeCourse}
            onChange={(event) => setActiveCourse(event.target.value)}
            aria-label="Filter by course"
            className="input w-full pr-8 sm:w-48"
          >
            <option value="all">All courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          <div className="relative sm:w-64">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search assignments"
              aria-label="Search assignments"
              className="input pl-9"
            />
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={
            activeFilter === 'all' && activeCourse === 'all'
              ? 'No assignments yet'
              : "You're all caught up 🎉"
          }
          description={
            activeFilter === 'all' && activeCourse === 'all'
              ? 'Assignments created by your professor will appear here.'
              : 'No assignments match the current filters.'
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map(({ assignment, status }) => (
            <AssignmentCard key={assignment.id} assignment={assignment} status={status} />
          ))}
        </div>
      )}
    </div>
  );
}