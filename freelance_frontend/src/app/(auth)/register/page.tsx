// app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import FreelancerForm from '@/src/components/auth/FreelancerForm';
import CompanyForm from '@/src/components/auth/CompanyForm';
import Link from 'next/link';

export default function RegisterPage() {
  const [role, setRole] = useState<'freelancer' | 'recruiter'>('freelancer');

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12 bg-slate-50">
      
      {/* Back to homepage button */}
      <Link 
        href="/" 
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <span>←</span> Back to homepage
      </Link>

      {/* Container for form and buttons */}
      <div className="w-full max-w-xl">
        
        {/* Segmented Control */}
        <div className="bg-slate-200/70 p-1 rounded-2xl flex items-center mb-6 border border-slate-300/30">
          <button
            onClick={() => setRole('freelancer')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
              role === 'freelancer'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🚀 Freelancer
          </button>
          
          <button
            onClick={() => setRole('recruiter')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
              role === 'recruiter'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏢 Recruiter / Company
          </button>
        </div>

        <div className="bg-white shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/60 p-6 sm:p-8">
          
          {/* Render Component depending on role */}
          {role === 'freelancer' ? (
            <FreelancerForm />
          ) : (
            <CompanyForm />
          )}
        </div>

      </div>
    </div>
  );
}