import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface Props {
  email: string;
  setEmail: (val: string) => void;
  phone: string | undefined;
  setPhone: (val: string | undefined) => void;
  password: string;
  setPassword: (val: string) => void;
  errors: any;
  isEdit?: boolean;
}

export default function CommonFields({ 
  email, 
  setEmail, 
  phone, 
  setPhone, 
  password, 
  setPassword, 
  errors, 
  isEdit = false 
}: Props) {
  return (
    <>
      {/* EMAIL FIELD */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className={`w-full px-4 py-3 bg-slate-50/40 border rounded-xl outline-none text-slate-800 font-medium transition-all focus:ring-4 text-sm ${
            errors.email 
              ? 'border-rose-400 focus:ring-rose-500/10 focus:border-rose-500' 
              : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white'
          }`}
          required
        />
        {errors.email && (
          <p className="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-fade-in">
            <span>⚠️</span> {errors.email[0]}
          </p>
        )}
      </div>

      {/* PHONE NUMBER FIELD (Tailwind target inside PhoneInput package structure) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Phone Number
        </label>
        <div className={`group-phone w-full transition-all rounded-xl border bg-slate-50/40 px-4 py-1 flex items-center focus-within:bg-white focus-within:ring-4 ${
          errors.phone 
            ? 'border-rose-400 focus-within:ring-rose-500/10 focus-within:border-rose-500' 
            : 'border-slate-200 focus-within:ring-blue-500/10 focus-within:border-blue-500'
        }`}>
          <PhoneInput
            placeholder="Enter phone number"
            value={phone}
            onChange={setPhone}
            defaultCountry="AT"
            className="w-full text-sm font-medium text-slate-800 outline-none
              [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:py-2 [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:text-slate-800 [&_.PhoneInputInput]:font-medium
              [&_.PhoneInputCountryIcon]:rounded-[4px] [&_.PhoneInputCountryIcon]:shadow-sm"
          />
        </div>

        {errors.phone && (
          <p className="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-fade-in">
            <span>⚠️</span> {errors.phone[0]}
          </p>
        )}
      </div>

      {/* PASSWORD FIELD */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Password
          </label>
          {isEdit && (
            <span className="text-slate-400 text-[11px] font-bold">
              Leave blank to keep current
            </span>
          )}
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isEdit ? "Enter new password if changing" : "Minimum 8 characters"}
          className={`w-full px-4 py-3 bg-slate-50/40 border rounded-xl outline-none text-slate-800 font-medium transition-all focus:ring-4 text-sm ${
            errors.password 
              ? 'border-rose-400 focus:ring-rose-500/10 focus:border-rose-500' 
              : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white'
          }`}
          required={!isEdit}
        />
        {errors.password && (
          <p className="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-fade-in">
            <span>⚠️</span> {errors.password[0]}
          </p>
        )}
      </div>
    </>
  );
}