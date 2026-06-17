'use client';
import { useEffect, useState } from 'react';
import { useAuth } from "@/src/context/AuthContext";
import ApplicationTable from "@/src/components/applications/Applicationtable";
import { API_URL } from '@/src/constants/config';

export default function MyApplications() {
  const { token } = useAuth();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}freelancer/my-applications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setApps);
  }, [token]);

  if (!token) {
    return <div className="p-10 text-center">Loading or unauthorized...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-black mb-6">My Applications</h1>
      <ApplicationTable data={apps} role="freelancer" token={token} />
    </div>
  );
}