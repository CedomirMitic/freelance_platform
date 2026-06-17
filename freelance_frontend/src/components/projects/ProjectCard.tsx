'use client';

import { Project } from '@/types/project';
import Link from 'next/link';
import SkillTag from '@/src/components/projects/create/SkillTag';
import { formatDate } from '../../utils/formatters';
import { useState } from 'react';

interface ProjectCardProps {
    project: Project;
    onDelete?: (id: number) => void;
    showControls?: boolean;
    role?: string;
}

export default function ProjectCard({ project, onDelete, showControls, role }: ProjectCardProps) {
    // State for delete button
    const [isConfirming, setIsConfirming] = useState(false);

    return (
        <div className="bg-white border border-slate-200/70 p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-300 flex flex-col justify-between h-full relative group">

            <div>
                {/* Title budget and controls */}
                <div className="flex justify-between items-start gap-4 mb-3">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-950 tracking-tight leading-snug group-hover:text-blue-600 transition-colors pr-6">
                        {project.title}
                    </h2>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Budget Badge */}
                        <span className="inline-flex items-center text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-xl text-sm shadow-sm">
                            ${project.budget}
                        </span>

                        {/* Delete Button with Confirmation */}
                        {showControls && onDelete && (
                            <div className="relative z-10">
                                {!isConfirming ? (
                                    <button
                                        onClick={() => setIsConfirming(true)}
                                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all md:opacity-0 md:group-hover:opacity-100"
                                        title="Delete project"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                                        <button
                                            onClick={() => onDelete(project.id)}
                                            className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() => setIsConfirming(false)}
                                            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1.5"
                                        >
                                            No
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.skills && project.skills.length > 0 ? (
                        project.skills.map((skill) => (
                            <SkillTag key={skill} name={skill} />
                        ))
                    ) : (
                        <span className="text-xs text-slate-400 italic">No specific skills required</span>
                    )}
                </div>
            </div>

            {/* Bottom part of card */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group/link"
                >
                    View Details
                    <span className="transform group-hover/link:translate-x-1 transition-transform duration-200">
                        →
                    </span>
                </Link>

                {role === 'recruiter' && project.status === 'approved' && (
                    <Link
                        href={`/applications/recruiter/${project.id}`}
                        className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                        title="View Candidates"
                    >
                        <span>📋</span> Applications
                    </Link>
                )}

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {formatDate(project.created_at)}
                </span>
            </div>
        </div>
    );
}