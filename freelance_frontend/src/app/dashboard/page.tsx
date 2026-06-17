// app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FreelancerFeed from '@/src/components/home/FreelancerFeed';
import RecruiterFeed from '@/src/components/home/RecruiterFeed';
import AdminFeed from '@/src/components/home/AdminFeed';
import { useAuth } from '@/src/context/AuthContext';

export default function DashboardPage() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login'); 
    }
  }, [isLoading, token, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center py-20 font-medium text-slate-500 animate-pulse text-lg">
          Loading your workspace...
        </div>
      </div>
    );
  }

  // If theres no token do not render anything if there is render depending on role
  if (!token) return null;

  const role = user?.role || null;

  if (role === 'admin') {
    return <AdminFeed />;
  }

  if (role === 'recruiter') {
    return <RecruiterFeed />;
  }

  return <FreelancerFeed />;
}