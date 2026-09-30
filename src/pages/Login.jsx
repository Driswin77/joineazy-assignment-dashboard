import { useState } from 'react';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { demoAccounts } from '../data/mockData';
import Logo from '../components/Logo';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError('Enter both your email and password.');
      return;
    }

    setSubmitting(true);
    const result = login(form.email, form.password);

    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    showToast(`Signed in as ${result.user.name}.`);
    navigate(`/${result.user.role}`, { replace: true });
  };

  const fillDemo = (account) => {
    setForm({ email: account.email, password: account.password });
    setError('');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-white px-4 pb-10 pt-12 sm:pt-8">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-50/50 via-white to-slate-50"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <div className="card p-6 sm:p-7">
         <div className="mb-6 flex items-center justify-center gap-0">
            <Logo className="h-9 w-9" />
            <span className="text-2xl font-semibold leading-9 tracking-tight text-slate-900 translate-x-0 translate-y-1">
              Rubric
            </span>
          </div>

          <div className="mb-5">
            <h1 className="text-lg font-semibold text-slate-900">Sign in to continue</h1>
            <p className="mt-1 text-sm text-slate-500">
              Use a demo account below to explore both roles.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@joineazy.demo"
                className="input"
                aria-invalid={Boolean(error)}
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input pr-11"
                  aria-invalid={Boolean(error)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700"
              >
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {error}
              </div>
            ) : null}

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">
              Create one
            </Link>
          </p>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Demo accounts
            </p>

            <div className="mt-3 space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemo(account)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-left transition-colors hover:border-brand-300 hover:bg-brand-50/50"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-800">{account.role}</span>
                    <span className="text-xs font-medium text-brand-600">Use this</span>
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {account.email} · {account.password}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}