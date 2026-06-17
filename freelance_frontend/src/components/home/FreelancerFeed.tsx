'use client';

import { useEffect, useState } from 'react';
import ProjectCard from '@/src/components/projects/ProjectCard';
import { Project } from '@/types/project';
import { API_URL } from '@/src/constants/config';

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch projects on component load
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchProjects = async (search = "") => {
    try {
      const res = await fetch(`${API_URL}projects?search=${search}`);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) return <div className="text-center py-20 font-medium">Loading projects...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 animate-fade-in">

      {/* HEADING */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Explore <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Available Projects</span>
          </h1>
          <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
            Discover your next freelance opportunity and connect with recruiters.
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-10">
        <div className="relative max-w-lg w-full group">
          <input
            type="text"
            placeholder="Search by project title, tech stack or keywords..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-5 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none text-slate-800 font-medium placeholder-slate-400 shadow-sm shadow-slate-100 group-hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all duration-200 text-sm"
          />
          
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              title="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          ) : (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* PROJECTS DISPLAY SECTION */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="text-center py-16 px-4 bg-white border border-slate-200/60 rounded-3xl shadow-sm max-w-md mx-auto mt-8">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center text-xl mx-auto mb-4 border border-slate-100">
            🔍
          </div>
          <h3 className="text-base font-bold text-slate-900">No projects found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
            We couldn't find anything matching your search criteria. Try using different keywords.
          </p>
        </div>
      )}
    </div>
  );
}