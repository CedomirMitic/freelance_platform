// src/app/profile/setup/page.tsx
'use client';

import { useAuth } from '@/src/context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CommonFields from '@/src/components/auth/CommonFields';
import { notify } from '@/src/utils/notify';
import { API_URL } from '@/src/constants/config';


export default function ProfileSetupPage() {
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [errors, setErrors] = useState<any>({});
    const router = useRouter();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        company_name: '',
        address: '',
        email: '',
        password: '',
        phone: '' as string | undefined,
    });


    useEffect(() => {
        const loadProfileData = async () => {
            if (!token) return;

            try {
                const res = await fetch(`${API_URL}profile/edit-data`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        first_name: data.first_name,
                        last_name: data.last_name,
                        company_name: data.company_name,
                        address: data.address,
                        email: data.email,
                        password: '',
                        phone: data.phone || '',
                    });
                }
            } catch (err) {
                console.error("Error while loading profile data", err);
            } finally {
                setFetchingData(false);
            }
        };

        loadProfileData();
    }, [token]); // Starts as soon as token from AuthContext becomes available


    const handleSubmit = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({}); // Reset errros before sending again

        try {
            const res = await fetch(`${API_URL}profile/update`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                notify.success('Successfully updated profile!');
                router.push('/dashboard');
            } else if (res.status === 422) {
                setErrors(data.errors || {});
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!user || fetchingData) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4">
        <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-slate-500 tracking-wide animate-pulse">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12 bg-slate-50/50">
      <div className="w-full max-w-xl bg-white shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/60 p-6 sm:p-8 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            👤 Account Settings
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Complete your profile
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Please update details for your{' '}
            <span className="font-bold text-blue-600 px-1.5 py-0.5 bg-blue-50 rounded-md text-xs uppercase tracking-wide">
              {user.role}
            </span>{' '}
            account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Dynamic fields for freelancer */}
          {user.role === 'freelancer' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl outline-none text-slate-800 font-medium transition-all focus:ring-2 bg-slate-50/50 ${
                    errors.first_name 
                      ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                      : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white'
                  }`}
                  required
                />
                {errors.first_name && (
                  <p className="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.first_name[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl outline-none text-slate-800 font-medium transition-all focus:ring-2 bg-slate-50/50 ${
                    errors.last_name 
                      ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                      : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white'
                  }`}
                  required
                />
                {errors.last_name && (
                  <p className="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.last_name[0]}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Dynamic fields for recruiter*/}
          {user.role === 'recruiter' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl outline-none text-slate-800 font-medium transition-all focus:ring-2 bg-slate-50/50 ${
                    errors.company_name 
                      ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                      : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white'
                  }`}
                  required
                />
                {errors.company_name && (
                  <p className="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.company_name[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Company Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl outline-none text-slate-800 font-medium transition-all focus:ring-2 bg-slate-50/50 ${
                    errors.address 
                      ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                      : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white'
                  }`}
                  required
                />
                {errors.address && (
                  <p className="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.address[0]}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* SPREADED COMMON FIELDS ZONE */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <CommonFields
              email={formData.email}
              setEmail={(val) => setFormData(prev => ({ ...prev, email: val }))}
              phone={formData.phone}
              setPhone={(val) => setFormData(prev => ({ ...prev, phone: val }))}
              password={formData.password}
              setPassword={(val) => setFormData(prev => ({ ...prev, password: val }))}
              errors={errors}
              isEdit={true}
            />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => window.location.href = '/dashboard'}
              className="w-full border border-slate-200 text-slate-600 py-3.5 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-800 active:scale-[0.99] transition-all text-sm text-center shadow-sm"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Profile</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}