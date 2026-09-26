import { NavLink, useLocation } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  Settings,
  Users,
  PlusCircle,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STUDENT_NAV = [
  { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/student/assignments', label: 'My Assignments', icon: ClipboardList },
  { to: '/student/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/student/submissions', label: 'Submissions', icon: CheckCircle2 },
];

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/assignments', label: 'Assignments', icon: ClipboardList },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/reviews', label: 'Reviews', icon: Inbox },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav({ onNavigate }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const isAdmin = user?.role === 'admin';
  const items = isAdmin ? ADMIN_NAV : STUDENT_NAV;

  const isActive = (item) =>
    item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-2 px-5 pb-4 pt-5">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
          isAdmin
            ? 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200'
            : 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200'
        }`}
      >
          {isAdmin ? (
            <Users className="h-3 w-3" aria-hidden="true" />
          ) : (
            <GraduationCap className="h-3 w-3" aria-hidden="true" />
          )}
          {isAdmin ? 'Professor' : 'Student'}
        </span>
      </div>

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 pt-1"
        aria-label="Main navigation"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] ${active ? 'text-brand-600' : 'text-slate-400'}`}
                aria-hidden="true"
              />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:flex">
      <SidebarNav />
    </aside>
  );
}