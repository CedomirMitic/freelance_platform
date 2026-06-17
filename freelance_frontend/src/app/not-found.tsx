'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5); 

  useEffect(() => {
    if (countdown === 0) {
      router.push('/');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 text-center">
        
        {/* ICON */}
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        
        <h1 className="text-5xl font-black text-slate-950 tracking-tight mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          The page you are looking for has been moved, deleted, or never existed in the first place.
        </p>

        {/* RE-DIRECT BOX */}
        <div className="bg-slate-50/50 rounded-2xl p-4 mb-6 border border-slate-100 flex items-center justify-center gap-3">
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Redirecting in {countdown}s
          </p>
        </div>

        {/* HOME BUTTON */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] text-sm shadow-lg shadow-slate-900/10"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}