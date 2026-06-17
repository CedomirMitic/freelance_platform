'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from "@/src/context/AuthContext";
import { notify } from '@/src/utils/notify';
import { API_URL } from '@/src/constants/config';


interface EditProjectProps {
    params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditProjectProps) {
    const { id } = use(params);
    const router = useRouter();
    const { token, isLoading } = useAuth();

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [skills, setSkills] = useState<string>(''); 

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch current project data
    useEffect(() => {
        // If AuthContext is not loaded wait
        if (isLoading) return;

        // If Initalization is finished and user isnt loaded go back to login
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchCurrentProject = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}recruiter/projects/${id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 403) throw new Error("You are not authorized to edit this project.");
                    if (response.status === 401) throw new Error("Session expired. Please log in again.");
                    throw new Error("Failed to load project details.");
                }

                const data = await response.json();

                if (data.status === 'rejected') {
                    throw new Error("You cannot edit a rejected project.");
                }

                setTitle(data.title);
                setDescription(data.description);
                setBudget(data.budget.toString());
                setSkills(data.skills ? data.skills.join(', ') : '');
            } catch (err: any) {
                setError(err.message || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCurrentProject();
        }
    }, [id, token, isLoading, router]);

    // 2. Handle form submission
    const handleSubmit = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s !== '');

        try {
            const response = await fetch(`${API_URL}recruiter/projects/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    budget: parseFloat(budget),
                    skills: skillsArray
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong while updating.");
            }
            notify.success('Successfully edited a project!');
            router.push(`/projects/${id}`);
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to update project.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[75vh] flex flex-col items-center justify-center px-4">
                <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-bold text-slate-500 tracking-wide animate-pulse">Loading current project data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto my-10 px-4 sm:px-6 animate-fade-in">
            <div className="bg-white border border-slate-200/70 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Edit Project Details</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Update your project requirement information down below.</p>
                </div>

                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 mb-6 flex items-start gap-3">
                    <span className="text-amber-600 text-lg mt-0.5 select-none">⚠️</span>
                    <div>
                        <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Status Review Notice</h4>
                        <p className="text-xs sm:text-sm text-amber-700 font-medium mt-0.5 leading-relaxed">
                            If this project is currently approved, saving new changes will automatically return its status to <span className="font-bold underline">Pending Review</span>.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-2xl mb-6 text-sm font-semibold flex items-center gap-2">
                        <span>🚫</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Project Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-50/40 border border-slate-200 rounded-xl outline-none text-slate-800 font-medium transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-sm" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Detailed Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full px-4 py-3 bg-slate-50/40 border border-slate-200 rounded-xl outline-none text-slate-800 font-medium transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-sm" required></textarea>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Budget ($ USD)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full pl-8 pr-4 py-3 bg-slate-50/40 border border-slate-200 rounded-xl outline-none text-slate-800 font-semibold transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-sm" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Required Tech Stack <span className="text-slate-400 font-medium normal-case">(Comma separated)</span></label>
                        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full px-4 py-3 bg-slate-50/40 border border-slate-200 rounded-xl outline-none text-slate-800 font-medium transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-sm" required />
                    </div>
                    <div className="flex justify-between items-center pt-5 mt-6 border-t border-slate-100">
                        <Link href={`/projects/${id}`} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors py-2 px-1">Cancel</Link>
                        <button type="submit" disabled={submitting} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 disabled:from-slate-350 disabled:to-slate-400 disabled:shadow-none active:scale-[0.98] flex items-center gap-2 text-sm">
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Saving Changes...</span>
                                </>
                            ) : (
                                <span>Save Changes</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}