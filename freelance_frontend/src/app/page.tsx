// app/page.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/src/context/AuthContext';
import DemoLogin from '@/src/components/DemoLogin';

export default function HomePage() {
  const { token, isLoading } = useAuth();

  return (
    <div className="bg-slate-50 min-h-[85vh] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-3xl text-center relative z-10 space-y-8">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 shadow-sm">
          🚀 Next-Gen Freelance Marketplace
        </span>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Find top tech talent or your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">Dream Project.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Connect with vetted developers, automate your hiring workflow, and manage premium projects seamlessly in one unified platform.
        </p>

        {/* Dynamic Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          {isLoading ? (
            <div className="h-12 w-40 bg-slate-200 animate-pulse rounded-xl"></div>
          ) : token ? (
            /* If user is logged in take him to dashboard*/
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
            >
              Go to Dashboard 💼 <span className="text-blue-200">→</span>
            </Link>
          ) : (
            /* if User is not logged in show him login/register */
            <>
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-center"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-sm transition-all text-center"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-[1.15]">Quick Access: </p>
          <DemoLogin />
        </div>
      </div>
    </div>
  );
}