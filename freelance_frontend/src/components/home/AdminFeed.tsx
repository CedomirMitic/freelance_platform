'use client';

import { useEffect, useState, useCallback } from 'react';
import ProjectCard from '@/src/components/projects/ProjectCard';
import { Project } from '@/types/project';
import { deleteProject } from '@/src/utils/deleteProject';
import { useAuth } from "@/src/context/AuthContext";
import { API_URL } from '@/src/constants/config';

export default function AdminPage() {
  const { token, isLoading: isAuthLoading } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  //  Fetch function with abort signal if tabs are switched
  const fetchProjects = useCallback(async (search = "", targetTab: 'pending' | 'approved', signal?: AbortSignal) => {
    if (!token) return;

    setIsRefreshing(true);
    try {
      let url = `${API_URL}admin/projects?search=${search}&status=${targetTab}`;

      const res = await fetch(url, {
        signal, // Listen to signal if tab is switched
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await res.json();

      if (targetTab === 'approved') {
        const historyData = data.filter((p: Project) => p.status !== 'pending');
        setProjects(historyData);
      } else {
        const pendingData = data.filter((p: Project) => p.status === 'pending');
        setProjects(pendingData);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Prethodni zahtev otkazan jer je korisnik promenio tab/pretragu.');
        return;
      }
      console.error("Error loading admin projects:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [token]);

  // Debounce Use Effect
  useEffect(() => {
    if (isAuthLoading || !token) return;

    const controller = new AbortController();
    const { signal } = controller;

    // if search is empty get projects    
    if (searchTerm === '') {
      fetchProjects('', activeTab, signal);
    } else {
      // Debounce 300ms on input
      const delayDebounceFn = setTimeout(() => {
        fetchProjects(searchTerm, activeTab, signal);
      }, 300);

      // clear timer if user is inputing something
      return () => {
        clearTimeout(delayDebounceFn);
        controller.abort(); // Abort fetch also
      };
    }

    // Abort fetch on tab change
    return () => {
      controller.abort();
    };
  }, [token, isAuthLoading, activeTab, searchTerm, fetchProjects]);

  const handleTabChange = (tab: 'pending' | 'approved') => {
    if(tab === activeTab) return;
    setActiveTab(tab);
    setProjects([]);      // Clear data so it doesnt show on tab change if its changed
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProject(id, 'admin');
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 italic">Admin Workspace</h1>
          <p className="text-slate-500 font-medium mt-1">Manage project quality and optimization</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 mb-8 gap-6">
        <button
          onClick={() => handleTabChange('pending')}
          className={`pb-4 font-bold text-sm transition-all border-b-2 px-2 flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>⏳</span> Pending Moderation
        </button>
        <button
          onClick={() => handleTabChange('approved')}
          className={`pb-4 font-bold text-sm transition-all border-b-2 px-2 flex items-center gap-2 ${
            activeTab === 'approved'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>📋</span> Live & History Archive
        </button>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder={activeTab === 'pending' ? "Filter pending by title..." : "Search entire history archive..."}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 shadow-sm"
          />
          <span className="absolute right-3 top-3 text-slate-400">🔍</span>
        </div>
      </div>

      <div className="relative min-h-[400px]">
        {isRefreshing && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Added key so react can delete old html */}
        <div key={activeTab} className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${isRefreshing ? 'opacity-30' : 'opacity-100'}`}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="flex flex-col bg-white border border-slate-200 rounded-2xl p-2 shadow-sm relative">
                {activeTab === 'approved' && (
                  <span className={`absolute top-4 left-4 z-20 text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm ${
                    project.status === 'approved'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {project.status.toUpperCase()}
                  </span>
                )}
                <ProjectCard
                  project={project}
                  onDelete={handleDelete}
                  showControls={true}
                />
              </div>
            ))
          ) : (
            /* Show only when loading is finished and theres no data */
            !isRefreshing && (
              <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 text-lg">
                  {searchTerm !== '' 
                    ? `No results found for "${searchTerm}" 🔍`
                    : activeTab === 'pending'
                      ? "Everything is reviewed. No pending projects! ☕"
                      : "No records found in historical data."
                  }
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}