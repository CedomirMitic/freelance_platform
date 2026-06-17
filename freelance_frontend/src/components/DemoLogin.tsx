'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { API_URL } from '@/src/constants/config';
import { notify } from '@/src/utils/notify';

export default function DemoLogin() {
  const { login } = useAuth();
  const router = useRouter();

  const handleDemoLogin = async (role: 'freelancer' | 'recruiter' | 'admin') => {
    const credentials = {
      freelancer: { email: 'freelancer@demo.com', password: 'password' },
      recruiter: { email: 'recruiter@demo.com', password: 'password' },
      admin: { email: 'admin@demo.com', password: 'password' },
    };

    try {
      const response = await fetch(`${API_URL}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials[role]),
      });

      const data = await response.json();

      if (response.ok) {
        // Koristimo isti šablon kao u tvom handleSubmit
        login(data.access_token, data.user);
        notify.success(`Logged in as ${role.toUpperCase()}!`);
        router.push('/dashboard');
      } else {
        notify.error(data.message || 'Demo login failed.');
      }
    } catch (error) {
      notify.error('Error connecting to the server.');
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-8">
      <button 
        onClick={() => handleDemoLogin('freelancer')} 
        className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-sm transition-all text-center"
      >
        Login as Freelancer
      </button>
      <button 
        onClick={() => handleDemoLogin('recruiter')} 
        className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-sm transition-all text-center"
      >
        Login as Recruiter
      </button>
      <button 
        onClick={() => handleDemoLogin('admin')} 
        className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-sm transition-all text-center"
      >
        Login as Admin
      </button>
    </div>
  );
}