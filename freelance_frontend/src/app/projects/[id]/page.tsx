'use client';

import { Project } from '@/types/project';
import Link from 'next/link';
import { formatDate } from '@/src/utils/formatters';
import { useEffect, useState, use } from 'react';
import AdminControls from '@/src/components/projects/controls/AdminControls';
import RecruiterControls from '@/src/components/projects/controls/RecruiterControls';
import FreelancerControls from '@/src/components/projects/controls/FreelancerControls';
import { useAuth } from '@/src/context/AuthContext'; 
import { API_URL } from '@/src/constants/config';

export default function ProjectDetails({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params);
    const { user, isLoading: authLoading, token } = useAuth(); // Get Role from context

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const role = user?.role || null;

    useEffect(() => {
        // Wait for AuthContext to get us data back
        if (authLoading) return;

        // Render Url depending on role
        let apiUrl = `${API_URL}projects/${id}`;
        if (role === 'admin') {
            apiUrl = `${API_URL}admin/projects/${id}`;
        } else if (role === 'recruiter') {
            apiUrl = `${API_URL}recruiter/projects/${id}`;
        }

        const fetchProject = async () => {
            try {
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Server returned status: ${response.status}`);
                }

                const data = await response.json();
                setProject(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch project details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id, role, authLoading]); // Reacts when authcontext is finished loading

    
    if (authLoading || loading) {
        return <div className="p-10 text-center font-medium text-slate-500 animate-pulse">Loading project details...</div>;
    }

    if (error || !project) {
        return (
            <div className="p-10 text-red-500 max-w-4xl mx-auto bg-red-50 rounded-2xl border border-red-100 my-10">
                <h2 className="font-bold text-lg mb-2">Error Connection</h2>
                <p className="text-sm font-mono">{error}</p>
            </div>
        );
    }

    return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 animate-fade-in">
      
      {/* LINK BACK  */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> 
          Back to Projects
        </Link>
      </div>

      {/* Main GRID FOR DESKTOP AND MOBILE*/}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-8 shadow-sm">
          
          {/* Company tag / link */}
          {project.company_url ? (
            <a
              href={project.company_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100/80 transition-colors mb-4 group/link"
            >
              <span>🏢</span> Visit Company Website
              <span className="transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform text-[10px]">↗</span>
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl mb-4">
              <span>🏢</span> Verified Recruiter
            </span>
          )}

          {/* Title of project */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight mb-4">
            {project.title}
          </h1>

          {/* Date of upload of project */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6 pb-6 border-b border-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Posted on {formatDate(project.created_at)}</span>
          </div>

          {/* Project Description */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Project Description</h3>
            <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/*  (Skills) */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Required Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span 
                  key={skill} 
                  className="text-xs font-bold bg-slate-50 text-slate-650 px-3 py-1.5 rounded-xl border border-slate-200/60 shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side for Mobile and Desktop Div */}
        <div className="lg:col-span-1 bg-gradient-to-b from-slate-50 to-slate-100/50 border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24">
          
          {/* Budget Title*/}
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Project Budget
          </span>
          
          {/* Budget Diggit */}
          <div className="flex items-baseline text-slate-950 font-black text-3xl sm:text-4xl gap-1 mb-6">
            <span className="text-emerald-600 text-2xl font-extrabold">$</span>
            {project.budget.toLocaleString()}
            <span className="text-xs font-bold text-slate-400 ml-1.5 font-sans tracking-normal">Estimated</span>
          </div>

          <div className="w-full h-[1px] bg-slate-200/80 mb-6"></div>

          {/* Dynamic Controlls depending on user role */}
          <div className="space-y-3">
            {role === 'admin' && (
              <div className="w-full bg-white p-3 rounded-2xl border border-slate-200/80 shadow-inner">
                <AdminControls
                  project={project}
                  onStatusChange={() => window.location.reload()}
                />
              </div>
            )}

            {role === 'recruiter' && (
              <div className="w-full">
                <RecruiterControls project={project} />
              </div>
            )}

            {role !== 'admin' && role !== 'recruiter' && (
              <div className="w-full">
                <FreelancerControls project={project} />
              </div>
            )}
          </div>

          {/* Security info bellow buttons */}
          <p className="text-[11px] text-center font-medium text-slate-400 mt-4 flex items-center justify-center gap-1">
            🛡️ Secure applications via FreeLance system
          </p>

        </div>

      </div>
    </div>
  );
}