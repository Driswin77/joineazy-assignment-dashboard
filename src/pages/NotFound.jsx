import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you were looking for does not exist or has moved.
        </p>

        <Link to={user ? `/${user.role}` : '/login'} className="btn-primary mt-6">
          {user ? 'Back to dashboard' : 'Go to sign in'}
        </Link>
      </div>
    </div>
  );
}