'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import SkillTag from '@/src/components/projects/create/SkillTag';
import { useAuth } from "@/src/context/AuthContext";
import { notify } from '@/src/utils/notify';
import { API_URL } from '@/src/constants/config';

export default function CreateProject() {
  const router = useRouter();
  const { token } = useAuth();

  // --- STATE FOR ALL FIELDS ---
  const [skillError, setSkillError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Function for  SKILLS ---
  const addSkill = (e: React.MouseEvent | React.KeyboardEvent) => {

    e.preventDefault();
    setSkillError('');
    const trimmedSkill = currentSkill.trim();

    if (!trimmedSkill) return;

    if (!skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setCurrentSkill('');
    } else {
      setSkillError('This skill already exists!');
      //Delete error after 3 sec
      setTimeout(() => setSkillError(''), 3000);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // --- Handle Submit ---
  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {

      const response = await fetch(`${API_URL}recruiter/projects`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          budget: Number(budget),
          skills,
          status: 'active'
        }),
      });

      if (response.ok) {
        notify.success('Succesfully created a project!');
        router.push('/dashboard');
        router.refresh();
      } else {
        alert('Server Error, while sending...');
      }
    } catch (error) {
      alert('There was an error while connecting.');
    } finally {
      setIsSubmitting(false);
    }
  };

return (
    <div className="max-w-2xl mx-auto my-6 sm:my-10 px-4 sm:px-6 animate-fade-in">
      
      {/* LINK BACK TO DASHBOARD */}
      <div className="mb-6 text-left">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> 
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white border border-slate-200/70 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
        
        {/* ZAGLAVLJE */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            🚀 New Listing
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Create a New Project
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Fill out the details correctly to attract the best freelancers possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* 1. PROJECT HEADLINE */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Project Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build an E-Commerce Platform"
              className="w-full px-4 py-3 bg-slate-50/40 border border-slate-200 rounded-xl outline-none text-slate-800 font-medium transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-sm"
              required
            />
          </div>

          {/* 2. DESCRIPTION */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Detailed Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tasks, responsibilities, and expected deliverables clearly..."
              className="w-full px-4 py-3 bg-slate-50/40 border border-slate-200 rounded-xl outline-none text-slate-800 font-medium transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-sm leading-relaxed"
              rows={6}
              required
            />
          </div>

          {/* 3. REQUIRED SKILLS ZONE */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Required Tech Stack / Skills
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(e);
                  }
                }}
                placeholder="Type a skill (e.g. React, Next.js) and press Add"
                className={`flex-grow px-4 py-3 bg-slate-50/40 border rounded-xl outline-none text-slate-800 font-medium transition-all text-sm focus:bg-white ${
                  skillError 
                    ? 'border-rose-400 focus:ring-4 focus:ring-rose-500/10' 
                    : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                }`}
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.97] shadow-sm"
              >
                Add
              </button>
            </div>

            {/* Error Message Space */}
            <div className="h-5 mt-1.5 pl-1">
              {skillError && (
                <p className="text-rose-500 text-xs font-semibold flex items-center gap-1 animate-fade-in">
                  <span>⚠️</span> {skillError}
                </p>
              )}
            </div>

            {/* Additional skills showup */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50/60 border border-slate-100 rounded-2xl mt-1">
                {skills.map((skill) => (
                  <SkillTag
                    key={skill}
                    name={skill}
                    onRemove={removeSkill}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 4. BUDGET */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Project Budget ($ USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-slate-50/40 border border-slate-200 rounded-xl outline-none text-slate-800 font-semibold transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-sm"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.99]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Publishing Project...</span>
                </>
              ) : (
                <span>Publish Project</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}