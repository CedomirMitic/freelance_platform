'use client';

import { useRouter } from 'next/navigation';
import CommonFields from '@/src/components/auth/CommonFields';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/src/constants/config';

export default function RegisterPage() {
    const router = useRouter();

    // --- STATE FOR ALL FIELDS ---
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState<string | undefined>();
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<any>({});

    // --- Handle Submit ---
    const handleSubmit = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const currentErrors: any = {};

        if (phone && !isValidPhoneNumber(phone)) {
            currentErrors.phone = ['This phone number is not valid.'];
        }

        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
            setIsSubmitting(false);
            return;
        }

        setErrors({});

        try {
            const response = await fetch(`${API_URL}register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    company_name: companyName,
                    address: address,
                    email,
                    phone,
                    password,
                    role: 'recruiter',
                }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/login?registered=true');
            } else {
                if (response.status === 422) {
                    setErrors(data.errors);
                } else {
                    alert(data.message || 'Something went wrong');
                }
            }
        } catch (error) {
            alert('There was an error while connecting.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
            <div className="w-full max-w-xl bg-white shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/60 p-6 sm:p-8">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Register Company</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 font-bold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Company name */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Company Name
                        </label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. Acme Corporation"
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

                    {/* Address */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Address
                        </label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="e.g. 123 Luxury St, Belgrade"
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

                    {/* Common fields from component */}
                    <div className="pt-2 border-t border-slate-100/80 space-y-5">
                        <CommonFields
                            email={email} setEmail={setEmail}
                            phone={phone} setPhone={setPhone}
                            password={password} setPassword={setPassword}
                            errors={errors}
                        />
                    </div>

                    {/* Register button with spinner */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 disabled:bg-slate-400 disabled:shadow-none active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Creating account...</span>
                            </>
                        ) : (
                            <span>Register Company</span>
                        )}
                    </button>

                </form>
            </div>
    );
}