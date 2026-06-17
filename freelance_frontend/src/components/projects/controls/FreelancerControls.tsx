'use client';

import Link from 'next/link';
import { Project } from '@/types/project';

export default function FreelancerControls({ project }: { project: Project }) {
  return (
    <div className="mt-8 flex items-center gap-4 animate-fade-in">
      <Link
        href={`/projects/${project.id}/apply`}
        className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wider text-sm transition-all shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.98] w-full sm:w-auto"
      >
        {/* Icon for action */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="group-hover:translate-x-1 transition-transform"
        >
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        
        <span>Apply Now</span>
      </Link>

      <p className="text-xs font-semibold text-slate-400 hidden sm:block">
        Takes about 2 minutes.
      </p>
    </div>
  );
}