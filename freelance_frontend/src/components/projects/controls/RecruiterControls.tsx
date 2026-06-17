'use client';

import Link from 'next/link';
import { Project } from '@/types/project';

export default function RecruiterControls({ project }: { project: Project }) {
  
  // REJECTED STATE
  if (project.status === 'rejected') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl">
        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
        <span className="text-xs font-black text-rose-700 uppercase tracking-wider">Project Rejected</span>
      </div>
    );
  }

  // EDIT STATE
  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/projects/${project.id}/edit`}
        className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-5 py-2.5 rounded-xl font-bold transition-all text-xs uppercase tracking-wider shadow-sm shadow-slate-100 active:scale-[0.98]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        Edit Project
      </Link>
    </div>
  );
}