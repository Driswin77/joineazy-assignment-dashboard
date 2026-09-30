import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Logo from '../components/Logo';

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    role: 'student',
  });
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

    if (!form.name.trim()) return setError('Enter your full name.');
    if (!form.email.trim()) return setError('Enter your email.');
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      return setError('Enter a valid email address.');
    if (form.password.length < 6)
      return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');

    setSubmitting(true);
    const result = register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    });

    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    showToast('Account created. You can now sign in.');
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-white px-4 pb-10 pt-12 sm:pt-8">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-50/50 via-white to-slate-50"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Logo className="h-9 w-9" />
          <span className="text-2xl font-semibold leading-9 tracking-tight text-slate-900">
            Rubric
          </span>
        </div>

        <div className="card p-6 sm:p-7">
          <div className="mb-5">
            <h1 className="text-lg font-semibold text-slate-900">Create an account</h1>
            <p className="mt-1 text-sm text-slate-500">
              Choose a role and set up your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="name" className="label">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Driswin Kumar"
                className="input"
              />
            </div>

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
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="input pr-11"
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

            <div>
              <label htmlFor="confirm" className="label">
                Confirm password
              </label>
              <input
                id="confirm"
                name="confirm"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat your password"
                className="input"
              />
            </div>

            <div>
              <span className="label">Role</span>
              <div className="flex gap-2">
                {['student', 'admin'].map((role) => {
                  const active = form.role === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleChange({ target: { name: 'role', value: role } })}
                      aria-pressed={active}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition-colors ${
                        active
                          ? 'border-brand-300 bg-brand-50 text-brand-700'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {role === 'admin' ? 'Professor' : 'Student'}
                    </button>
                  );
                })}
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
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}