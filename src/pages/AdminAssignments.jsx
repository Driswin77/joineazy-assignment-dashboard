import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ClipboardList, Layers, Plus, Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';
import AssignmentTable from '../components/AssignmentTable';
import ConfirmationModal from '../components/ConfirmationModal';
import CoursesDrawer from '../components/CoursesDrawer';
import EmptyState from '../components/EmptyState';
import {
  getAssignmentState,
  getAssignmentStats,
  getCourses,
} from '../utils/calculations';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'overdue', label: 'Overdue' },
];

export default function AdminAssignments() {
  const { assignments, submissions, deleteAssignment } = useData();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const initialCourse = searchParams.get('course') ?? 'all';

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState(initialCourse);
  const [activeCourse, setActiveCourse] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const search = query.trim().toLowerCase();
  const courses = getCourses(assignments);

  const rows = assignments
    .map((assignment) => {
      const stats = getAssignmentStats(assignment, submissions);
      return { assignment, stats, state: getAssignmentState(assignment, stats) };
    })
    .filter(({ assignment, state }) => {
      const matchesQuery =
        assignment.title.toLowerCase().includes(search) ||
        assignment.course.toLowerCase().includes(search);

      if (!matchesQuery) return false;
      if (courseFilter !== 'all' && assignment.course !== courseFilter) return false;
      if (filter === 'all') return true;

      return state.toLowerCase() === filter;
    });

  const handleDelete = () => {
    if (!pendingDelete) return;

    deleteAssignment(pendingDelete.id);
    showToast(`"${pendingDelete.title}" was deleted.`, 'info');
    setPendingDelete(null);
  };

  const clearFilters = () => {
    setQuery('');
    setFilter('all');
    setCourseFilter('all');
  };

  const hasActiveFilters = query || filter !== 'all' || courseFilter !== 'all';

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 sm:text-2xl">Assignments</h2>
          <p className="mt-0.5 text-sm text-slate-500 sm:mt-1">
            Create and manage assignments for your students.
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

      {courses.length > 0 ? (
        <section className="card p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-slate-900">Browse by course</h3>
            <span className="text-xs text-slate-500">· {courses.length} courses</span>
          </div>

          <div className="-mx-4 mt-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <ul className="flex gap-2 pb-1">
              {courses.map((course) => {
                const count = assignments.filter((item) => item.course === course).length;

                return (
                  <li key={course} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveCourse(course)}
                      className="flex w-full min-w-[160px] items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-left transition-colors hover:border-brand-300 hover:bg-brand-50/40"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-800">
                          {course}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-slate-500">
                          {count} {count === 1 ? 'assignment' : 'assignments'}
                        </span>
                      </span>
                      <span className="text-xs font-medium text-brand-600">Open</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
            {FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`chip ${
                  filter === item.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              Clear
            </button>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={courseFilter}
            onChange={(event) => setCourseFilter(event.target.value)}
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

      {rows.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={
            assignments.length === 0
              ? 'No assignments created yet'
              : hasActiveFilters
                ? 'No assignments match your filters'
                : 'No assignments found'
          }
          description={
            assignments.length === 0
              ? 'Create your first assignment and assign it to students.'
              : hasActiveFilters
                ? 'Try removing a filter or searching for something else.'
                : 'Try a different search term or switch the filter.'
          }
          action={
            assignments.length === 0 ? (
              <Link to="/admin/create" className="btn-primary">
                Create assignment
              </Link>
            ) : hasActiveFilters ? (
              <button type="button" onClick={clearFilters} className="btn-secondary">
                Clear filters
              </button>
            ) : null
          }
        />
      ) : (
        <AssignmentTable rows={rows} onDelete={setPendingDelete} />
      )}

      <CoursesDrawer
        course={activeCourse}
        assignments={assignments}
        submissions={submissions}
        onClose={() => setActiveCourse(null)}
      />

      <ConfirmationModal
        open={Boolean(pendingDelete)}
        title="Delete this assignment?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" and all of its submission records will be removed. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete assignment"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}