"use client";

import { use, useState, useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { notify } from '@/src/utils/notify';
import { API_URL } from '@/src/constants/config';

interface ApplyParams {
  id: string;
}

interface Project {
  title: string;
}

export default function ApplyPage({ params }: { params: Promise<ApplyParams> }) {
  const router = useRouter();
  const { id } = use(params);
  const { user, token } = useAuth(); //  Get Logged in user from Context
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  // Dynamic fallback: if AuthContext is still loading data we set email to empty string at first
  const userEmail = user?.email || "";

  useEffect(() => {

    // Fetch
    fetch(`${API_URL}projects/${id}`)
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(err => console.error("Failed to load project", err));
  }, [id]);

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("project_id", id);

    try {
      const res = await fetch(`${API_URL}projects/applications`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData,
      });

      if (res.ok) {
        if (res.ok) {
          notify.success('Successfully sent Application!');
          router.push('/dashboard');
        }
      } else {
        const errorData = await res.json();
        alert("Error: " + errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 sm:py-12 px-4 animate-fade-in">
      {!project ? (
        /* LOADING STATE */
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200/60 rounded-3xl shadow-sm">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-bold text-slate-500">Loading project details...</p>
        </div>
      ) : (
        <>
          {/* LINK Back  */}
          <div className="mb-6 text-left">
            <Link
              href={`/projects/${id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors group"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
              Back to project details
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
              💼 Project Application
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
              Apply for <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{project.title}</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2">
              Please submit your PDF documents to application pool.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/60">

            {/* EMAIL (Read-only) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Your Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">📧</span>
                <input
                  type="email"
                  name="email"
                  value={userEmail}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200/80 rounded-xl cursor-not-allowed text-slate-500 font-semibold text-sm outline-none shadow-inner"
                />
              </div>
            </div>

            <div className="w-full h-[1px] bg-slate-100 my-2"></div>

            {/* UPLOAD CV */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex justify-between">
                <span>Upload CV</span>
                <span className="text-blue-600 text-[11px] font-extrabold normal-case">Required *</span>
              </label>
              <div className="relative group/file">
                <input
                  type="file"
                  name="cv_file"
                  accept=".pdf"
                  required
                  className="w-full text-xs font-bold text-slate-500 bg-slate-50/50 border border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-2.5 transition-all outline-none
                    file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:shadow-md file:shadow-blue-500/10 file:cursor-pointer"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-base hidden sm:inline">📄</span>
              </div>
            </div>

            {/* UPLOAD MOTIVATION LETTER */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex justify-between">
                <span>Motivation Letter</span>
                <span className="text-blue-600 text-[11px] font-extrabold normal-case">Required *</span>
              </label>
              <div className="relative group/file">
                <input
                  type="file"
                  name="motivation_letter_file"
                  accept=".pdf"
                  required
                  className="w-full text-xs font-bold text-slate-500 bg-slate-50/50 border border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-2.5 transition-all outline-none
                    file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 file:shadow-md file:shadow-emerald-500/10 file:cursor-pointer"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-base hidden sm:inline">✉️</span>
              </div>
            </div>

            {/* ADDITIONAL DOCUMENT */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex justify-between">
                <span>Additional Document</span>
                <span className="text-slate-400 text-[11px] font-bold normal-case">Optional</span>
              </label>
              <div className="relative group/file">
                <input
                  type="file"
                  name="extra_file"
                  accept=".pdf"
                  className="w-full text-xs font-semibold text-slate-400 bg-slate-50/20 border border-dashed border-slate-200 hover:border-slate-400 rounded-xl p-2.5 transition-all outline-none
                    file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-slate-700 file:text-white hover:file:bg-slate-800 file:shadow-md file:cursor-pointer"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-base hidden sm:inline">📎</span>
              </div>
            </div>

            {/* SUBMIT  */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 disabled:bg-slate-400 disabled:shadow-none active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending application...</span>
                </>
              ) : (
                <span>Submit Application</span>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}