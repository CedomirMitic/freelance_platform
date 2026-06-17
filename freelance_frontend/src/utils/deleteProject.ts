import { notify } from '@/src/utils/notify';
import { API_URL } from '@/src/constants/config';

export const deleteProject = async (id: number, role: 'admin' | 'recruiter') => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('AUTH_TOKEN') : null;
  
  if (!token) throw new Error("No authentication token found");

  const url = `${API_URL}${role}/projects/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete");
  }
  notify.success('Successfully deleted a project!');
  return true;
};