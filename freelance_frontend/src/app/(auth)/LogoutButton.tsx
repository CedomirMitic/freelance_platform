'use client';

import { useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { API_URL } from '@/src/constants/config';

export default function LogoutButton() {
  const { logout, token } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      
      if (token) {
        await fetch(`${API_URL}logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error("Logout failed on server, cleaning local session anyway.");
    } finally {
      logout();
      setIsLoggingOut(false);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition font-medium disabled:opacity-50"
    >
      {isLoggingOut ? "Logging out..." : "Log out"}
    </button>
  );
}