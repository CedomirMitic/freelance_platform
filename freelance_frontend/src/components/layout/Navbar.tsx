'use client';

import { useState } from 'react';
import Link from 'next/link';
import LogoutButton from '@/src/app/(auth)/LogoutButton';
import { useAuth } from '@/src/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, isLoading } = useAuth();
  const role = user?.role || null;
  const pathname = usePathname();

  // State for Mobile Control
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Loader for checking Session
  if (isLoading) {
    return (
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto h-[72px] animate-pulse flex items-center justify-between px-6">
          <div className="w-24 h-6 bg-slate-200 rounded-lg"></div>
          <div className="w-32 h-8 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] flex justify-between items-center">

        {/* Left side*/}
        <div className="flex items-center gap-8">
          {/* Logo / Brand */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 group"
          >
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-8 h-8 rounded-xl flex items-center justify-center font-black shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              F
            </span>
            <span>Free<span className="text-blue-600">Lance</span></span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${isActive('/')
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              Home
            </Link>

            {role && (
              <Link
                href="/dashboard"
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 ${isActive('/dashboard')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                {role === 'admin' ? '🛡️ Admin Workspace' : '💼 Dashboard'}
              </Link>
            )}

            {role === 'freelancer' && (
              <Link
                href="/applications/freelancer"
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${isActive('/applications/freelancer')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                📋 My Applications
              </Link>
            )}
            {role === 'recruiter' && (
              <Link
                href="/projects/create"
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${isActive('/projects/create') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                <span>✨</span> Create Project
              </Link>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {(role === 'recruiter' || role === 'freelancer') && (
            <Link
              href="/profile/setup"
              className="text-xs font-bold text-slate-500 hover:text-blue-600 border border-slate-200 px-3 py-1.5 rounded-lg transition"
            >
              Setup Profile
            </Link>
          )}

          {!role ? (
            <div className="flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition duration-200"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-1.5 pl-4 rounded-2xl shadow-sm">
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-slate-800 leading-tight">{user?.display_name}</span>
                <span className="text-[11px] font-semibold text-slate-400 capitalize">{role}</span>
              </div>
              <div className="w-[1px] h-6 bg-slate-200"></div>
              <LogoutButton />
            </div>
          )}
        </div>

        {/* Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-600 hover:text-slate-900 focus:outline-none p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Toggle Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute w-full bg-white border-b border-slate-200 left-0 transition-all duration-300 ease-in-out origin-top ${isMobileMenuOpen
          ? 'opacity-100 scale-y-100 visible pointer-events-auto'
          : 'opacity-0 scale-y-95 invisible pointer-events-none h-0 overflow-hidden'
          }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-3 shadow-xl bg-white">
          {/* Mobile Links */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-2.5 text-base font-semibold rounded-xl ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            Home
          </Link>

          {role && (
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2.5 text-base font-semibold rounded-xl ${isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              {role === 'admin' ? '🛡️ Admin Workspace' : '💼 Dashboard'}
            </Link>
          )}
          {role === 'freelancer' && (
            <Link
              href="/applications/freelancer"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2.5 text-base font-semibold rounded-xl ${isActive('/applications/freelancer') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              📋 My Applications
            </Link>
          )}
          {role === 'recruiter' && (
            <Link
              href="/projects/create"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2.5 text-base font-semibold rounded-xl ${isActive('/projects/create')? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              ✨ Create Project
            </Link>
          )}
          {(role === 'recruiter' || role === 'freelancer') && (
            <Link
              href="/profile/setup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-blue-600 border border-slate-100 rounded-xl"
            >
              Setup Profile
            </Link>
          )}

          {/* Seperator */}
          <div className="w-full h-[1px] bg-slate-100 my-2"></div>

          {/* Mobile Auth */}
          {!role ? (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-base font-bold text-slate-600 hover:bg-slate-50 rounded-xl text-center border border-slate-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-bold px-4 py-3 rounded-xl text-center shadow-sm"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-xl mt-2">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 leading-tight">{user?.display_name}</span>
                <span className="text-xs font-semibold text-slate-400 capitalize">{role}</span>
              </div>
              {/* Logout closes Mobile Menu */}
              <div onClick={() => setIsMobileMenuOpen(false)}>
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}