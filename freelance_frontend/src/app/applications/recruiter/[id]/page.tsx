'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from "@/src/context/AuthContext";
import ApplicationTable from "@/src/components/applications/Applicationtable";
import { API_URL } from '@/src/constants/config';

export default function RecruiterApplications() {
  const { id } = useParams();
  const { token, isLoading } = useAuth();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}recruiter/projects/${id}/applications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(setApps);
  }, [id, token]);

  if (!token || isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-black mb-6">Candidate Applications</h1>
      <ApplicationTable data={apps} role="recruiter" token={token || ''} />
    </div>
  );
}