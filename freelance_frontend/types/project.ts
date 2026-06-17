export interface Project {
  id: number;
  title: string;
  description: string;
  skills: string[]; 
  budget: number;
  status: 'approved' | 'pending' | 'rejected';
  company_url?: string; 
  created_at: string;
  updated_at: string;
}