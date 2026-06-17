'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import ProjectCard from '@/src/components/projects/ProjectCard';
import { Project } from '@/types/project';
import { deleteProject } from '@/src/utils/deleteProject';
import { useAuth } from "@/src/context/AuthContext";
import { API_URL } from '@/src/constants/config';

export default function RecruiterFeed() {
  const { token, isLoading: isAuthLoading, user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<'approved' | 'pending' | 'rejected'>('approved');

  // Fetch with abort on tab switch
  const fetchProjects = useCallback(async (search = "", status = activeStatus, signal?: AbortSignal) => {
    if (!token) return;

    setIsTabSwitching(true);
    try {
      const res = await fetch(`${API_URL}recruiter/projects?search=${search}&status=${status}`, {
        signal, 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      setProjects(data);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Prethodni recruiter zahtev uspešno otkazan.');
        return;
      }
      console.error("Failed to load projects", error);
    } finally {
      setIsTabSwitching(false);
    }
  }, [token]);

  // 2. Use effect for debounce and tab switch
  useEffect(() => {
    if (isAuthLoading || !token) return;

    const controller = new AbortController();
    const { signal } = controller;

    if (searchTerm === '') {
      fetchProjects('', activeStatus, signal);
    } else {
      const delayDebounceFn = setTimeout(() => {
        fetchProjects(searchTerm, activeStatus, signal);
      }, 300);

      return () => {
        clearTimeout(delayDebounceFn);
        controller.abort(); // Abort fetch if user is inputing
      };
    }

    return () => {
      controller.abort(); // Abort fetch if user switched tabs too quickly
    };
  }, [token, isAuthLoading, activeStatus, searchTerm, fetchProjects]);

  const handleStatusChange = (newStatus: 'approved' | 'pending' | 'rejected') => {
    if (newStatus === activeStatus) return;
    setActiveStatus(newStatus);
    setProjects([]);           // Clear data so it doesnt show on tab change 
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProject(id, 'recruiter');
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 animate-fade-in">

      {/* HEADING + CREATE LINK */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Recruiter <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
            Manage your posted projects, track approvals, and view applications.
          </p>
        </div>

        <Link
          href="/projects/create"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] text-sm"
        >
          <span className="text-base">＋</span> Create New Project
        </Link>
      </div>
      {/* FILTER and SEARCH BAR Div */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

        {/* STATUS TABS */}
        <div className="flex bg-slate-200/60 p-1 rounded-2xl border border-slate-300/20 max-w-md w-full sm:w-auto">
          {(['approved', 'pending', 'rejected'] as const).map((status) => {
            // Dynamic colors for status
            const dotColor =
              status === 'approved' ? 'bg-emerald-500' :
                status === 'pending' ? 'bg-amber-500' : 'bg-rose-500';

            return (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-black rounded-xl uppercase tracking-wider transition-all duration-200 ${activeStatus === status
                    ? 'bg-white text-slate-950 shadow-sm shadow-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                {status}
              </button>
            );
          })}
        </div>

        {/* SEARCH BAR */}
        <div className="relative max-w-sm w-full group">
          <input
            type="text"
            placeholder="Filter dashboard..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-5 pr-12 py-3 bg-white border border-slate-200 rounded-2xl outline-none text-slate-800 font-medium placeholder-slate-400 shadow-sm shadow-slate-100 group-hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all duration-200 text-sm"
          />

          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          ) : (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* PROJECTS DISPLAY SECTION */}
      <div className="relative min-h-[400px] w-full">
        {/* Spinner for Tab switching */}
        {isTabSwitching && (
          <div className="absolute inset-0 z-10 bg-slate-50/40 backdrop-blur-[1px] flex items-center justify-center rounded-3xl transition-all">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div
          key={activeStatus}
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-200 ${isTabSwitching ? 'opacity-30 scale-[0.99]' : 'opacity-100 scale-100'
            }`}
        >
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
                role={user?.role}
                showControls={true}
              />
            ))
          ) : (
            /* EMPTY STATE  */
            !isTabSwitching && (
              <div className="col-span-1 md:col-span-2 text-center py-16 px-4 bg-white border border-slate-200/60 rounded-3xl shadow-sm max-w-md mx-auto mt-4 w-full">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center text-lg mx-auto mb-4 border border-slate-100">
                  📁
                </div>
                <h3 className="text-base font-bold text-slate-900 capitalize">No {activeStatus} projects</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                  You haven't posted any projects that are currently marked as {activeStatus}.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}