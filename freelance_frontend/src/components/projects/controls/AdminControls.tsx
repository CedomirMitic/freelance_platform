// src/components/projects/controls/AdminControls.tsx
'use client';

import { useState } from 'react';
import { Project } from '@/types/project';
import { useAuth } from "@/src/context/AuthContext";
import { notify } from '@/src/utils/notify';
import { API_URL } from '@/src/constants/config';

interface AdminControlsProps {
  project: Project;
  onStatusChange: () => void;
}

export default function AdminControls({ project, onStatusChange }: AdminControlsProps) {
  const [updating, setUpdating] = useState(false);
  const { token } = useAuth();

  const handleStatusUpdate = async (newStatus: 'approved' | 'rejected' | 'pending') => {
    setUpdating(true);
    try {
      const res = await fetch(`${API_URL}admin/projects/${project.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        notify.success(`Successfully updated status to ${newStatus}`);

        setTimeout(() => {
                onStatusChange();
            }, 700);
            
      } else {
        const data = await res.json();
        notify.error(data.message || "Unauthorized access.");
      }
    } catch (error) {
      notify.error('Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  if (updating) {
    return (
      <div className="flex items-center justify-center gap-2 bg-slate-50/80 border border-slate-200/60 p-5 mt-5 rounded-2xl animate-pulse">
        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Updating project status...</span>
      </div>
    );
  }

  return (
    <div className="mt-6 p-5 bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">

      {/* Left Side: Info on current status */}
      <div>
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider select-none">
          Admin Management
        </h4>
        <p className="text-xs font-semibold text-slate-600 mt-0.5">
          Current status:{' '}
          <span className={`font-bold capitalize ${project.status === 'approved' ? 'text-emerald-600' :
              project.status === 'pending' ? 'text-amber-600' : 'text-rose-600'
            }`}>
            {project.status}
          </span>
        </p>
      </div>

      {/* Right field : Action depending on role */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">

        {/* PENDING ACTIONS */}
        {project.status === 'pending' && (
          <>
            <button
              onClick={() => handleStatusUpdate('approved')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] shadow-sm shadow-emerald-600/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Approve
            </button>

            <button
              onClick={() => handleStatusUpdate('rejected')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] shadow-sm shadow-rose-500/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Reject
            </button>
          </>
        )}

        {/* APPROVED ACTIONS */}
        {project.status === 'approved' && (
          <>
            <button
              onClick={() => handleStatusUpdate('pending')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] shadow-sm shadow-amber-500/10"
            >
              <svg xmlns="http://www.w3.org/2000/xl" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Return to Pending
            </button>

            <button
              onClick={() => handleStatusUpdate('rejected')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] shadow-sm shadow-rose-600/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="15"></line>
                <line x1="15" y1="9" x2="9" y2="15"></line>
              </svg>
              Reject / Ban
            </button>
          </>
        )}

        {/* REJECTED ACTIONS */}
        {project.status === 'rejected' && (
          <>
            <button
              onClick={() => handleStatusUpdate('pending')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] shadow-sm shadow-amber-500/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
              </svg>
              Reconsider
            </button>

            <button
              onClick={() => handleStatusUpdate('approved')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] shadow-sm shadow-emerald-600/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Force Approve
            </button>
          </>
        )}

      </div>
    </div>
  );
}