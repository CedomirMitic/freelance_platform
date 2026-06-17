'use client';
import Link from 'next/link';
import { notify } from '@/src/utils/notify';
import { API_URL } from '@/src/constants/config';

interface AppData {
  id: number;
  project_id?: number;
  project?: { title: string };
  user?: { email: string };
  created_at: string;
  cv_path?: string;
  motivation_path?: string;
  extra_path?: string;
}

export default function ApplicationTable({
  data,
  role,
  token
}: {
  data: AppData[],
  role: 'recruiter' | 'freelancer',
  token?: string
}) {

  // Function for safe downlaod
  const handleDownload = async (appId: number, type: 'cv' | 'motivation' | 'extra') => {

    try {
      const response = await fetch(`${API_URL}recruiter/applications/${appId}/download/${type}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_${appId}`; // name of file
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      notify.error('Error while downloading a file!');
    }
  };

  if (!Array.isArray(data)) {
    return <div className="p-4 text-slate-500">No Data...</div>;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-widest">
          <tr>
            <th className="p-4">{role === 'recruiter' ? 'Candidate' : 'Project'}</th>
            <th className="p-4">Applied At</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((app) => (
            <tr key={app.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-semibold text-slate-900">
                {role === 'recruiter' ? app.user?.email : app.project?.title}
              </td>
              <td className="p-4 text-slate-500">{new Date(app.created_at).toLocaleDateString()}</td>
              <td className="p-4 text-right flex gap-3 justify-end">
                {role === 'recruiter' ? (
                  <>
                    {app.cv_path && (
                      <button onClick={() => handleDownload(app.id, 'cv')} className="text-blue-600 font-bold hover:underline">CV</button>
                    )}
                    {app.motivation_path && (
                      <button onClick={() => handleDownload(app.id, 'motivation')} className="text-indigo-600 font-bold hover:underline">Motiv</button>
                    )}
                    {app.extra_path && (
                      <button onClick={() => handleDownload(app.id, 'extra')} className="text-emerald-600 font-bold hover:underline">Extra</button>
                    )}
                  </>
                ) : (
                  <Link href={`/projects/${app.project_id}`} className="text-indigo-600 font-bold hover:underline">View</Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}