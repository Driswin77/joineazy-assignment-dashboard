import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, LogOut, Menu, User } from 'lucide-react';
import Avatar from './Avatar';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  dueLabel,
  getAssignmentStats,
  getStatus,
  getSubmission,
} from '../utils/calculations';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { assignments, submissions } = useData();
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = useMemo(() => {
    if (!user) return [];

    if (user.role === 'student') {
      return assignments
        .filter((assignment) => assignment.assignedTo.includes(user.id))
        .filter(
          (assignment) =>
            getStatus(assignment, getSubmission(submissions, assignment.id, user.id)) !==
            'Submitted'
        )
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 4)
        .map((assignment) => ({
          id: assignment.id,
          title: assignment.title,
          detail: dueLabel(assignment.dueDate),
          to: `/student/assignments/${assignment.id}`,
        }));
    }

    return assignments
      .map((assignment) => ({ assignment, stats: getAssignmentStats(assignment, submissions) }))
      .filter(({ stats }) => stats.pending > 0)
      .sort((a, b) => b.stats.pending - a.stats.pending)
      .slice(0, 4)
      .map(({ assignment, stats }) => ({
        id: assignment.id,
        title: assignment.title,
        detail: `${stats.pending} of ${stats.total} students yet to submit`,
        to: `/admin/assignments/${assignment.id}`,
      }));
  }, [assignments, submissions, user]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center gap-0.5 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="-ml-1 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <Link
          to={user?.role === 'admin' ? '/admin' : '/student'}
          className="-ml-1 flex min-w-0 flex-1 items-center gap-0.5"
        >
          <Logo size="sm" className="!h-10 !w-10" />
          <span className="mt-0.5 truncate text-xl font-semibold tracking-tight text-slate-900">
           Rubric
          </span>
        </Link>

        {/* Desktop — empty spacer; the sidebar already carries the brand */}
        <div className="hidden min-w-0 flex-1 lg:block" />

        <div className="relative flex items-center gap-1" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === 'notifications' ? null : 'notifications')}
            className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Notifications"
            aria-expanded={openMenu === 'notifications'}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            {notifications.length > 0 ? (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white" />
            ) : null}
          </button>

          {openMenu === 'notifications' ? (
            <div className="absolute right-0 top-12 z-30 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop animate-fade-in">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
              </div>

              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-slate-500">
                  Nothing needs your attention right now.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {notifications.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={item.to}
                        className="block px-4 py-3 transition-colors hover:bg-slate-50"
                      >
                        <p className="truncate text-sm font-medium text-slate-800">{item.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{item.detail}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === 'profile' ? null : 'profile')}
            className="ml-1 flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-slate-100"
            aria-label="Account menu"
            aria-expanded={openMenu === 'profile'}
          >
            <Avatar name={user?.name} size="sm" />
          </button>

          {openMenu === 'profile' ? (
            <div className="absolute right-0 top-12 z-30 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop animate-fade-in">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
                <p className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium capitalize text-slate-600">
                  {user?.role}
                </p>
              </div>

              {user?.role === 'student' ? (
                <Link
                  to="/student/profile"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <User className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  Profile
                </Link>
              ) : null}

              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <LogOut className="h-4 w-4 text-slate-400" aria-hidden="true" />
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}