'use client';
export const dynamic = 'force-dynamic';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/context/AuthContext';
import { notify } from '@/src/utils/notify';
import { API_URL } from '@/src/constants/config';

// Prerender
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setShowSuccessMessage(true);

      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.access_token, data.user);
        notify.success('Successfully logged in!');
        router.push('/dashboard');
      } else {
        setErrors({ error: data.message || 'Invalid credentials' });
      }
    } catch (error) {
      alert('Error connecting to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12 bg-slate-50">
      
      {/* Return to home button */}
      <Link 
        href="/" 
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <span>←</span> Back to homepage
      </Link>

      {/* Main Container */}
      <div className="w-full max-w-md bg-white shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/60 p-6 sm:p-8">
        
        {/* Title and adds on form */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 font-bold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>

        {/* Succesfull registration badge */}
        {showSuccessMessage && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl mb-6 text-xs font-bold border border-emerald-150 shadow-sm flex items-start gap-2.5">
            <span className="text-base">🎉</span>
            <span>Account created successfully! Please sign in with your new credentials.</span>
          </div>
        )}

        {/* Error badge */}
        {errors.error && (
          <div className="bg-rose-50 text-rose-600 p-3.5 rounded-xl mb-6 text-sm font-semibold border border-rose-100 flex items-start gap-2.5 animate-shake">
            <span className="text-base">⚠️</span>
            <span>{errors.error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl outline-none text-slate-800 font-medium transition-all focus:ring-2 bg-slate-50/50 ${
                  errors.error 
                    ? 'border-rose-400 focus:ring-rose-500/20' 
                    : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white'
                }`}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl outline-none text-slate-800 font-medium transition-all focus:ring-2 bg-slate-50/50 ${
                errors.error 
                  ? 'border-rose-400 focus:ring-rose-500/20' 
                  : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white'
              }`}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 disabled:bg-slate-400 disabled:shadow-none active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}