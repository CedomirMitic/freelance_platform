import { API_URL } from '@/src/constants/config';

export const fetchCurrentUser = async () => {
  const token = localStorage.getItem('AUTH_TOKEN');
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (res.ok) {
      return await res.json();
    }
    
    return null;
  } catch {
    return null;
  }
};