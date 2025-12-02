import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../lib/axios';
import { Company } from './types';

// API functions
const getCompanies = async (): Promise<Company[]> => {
  const res = await apiClient.get('/companies');
  const payload = res.data;

  // Backend returns an envelope like { message: '', data: [...] }
  // Normalize to always return an array of Company
  if (Array.isArray(payload)) return payload as Company[];
  if (payload && Array.isArray(payload.data)) return payload.data as Company[];
  if (payload && Array.isArray((payload as any).rows)) return (payload as any).rows as Company[];
  if (payload && Array.isArray((payload as any).payload)) return (payload as any).payload as Company[];

  // Fallback: return empty array to avoid runtime map errors
  return [];
};

const getCompanyById = async (id: number): Promise<Company> => {
  const res = await apiClient.get(`/companies/${id}`);
  const payload = res.data;

  // Handle envelope responses: { data: { ... } } or { data: [ {...} ] }
  if (payload && payload.data) {
    if (Array.isArray(payload.data)) return payload.data[0];
    return payload.data as Company;
  }

  return payload as Company;
};

const createCompany = async (payload: Omit<Company, 'id'>): Promise<Company> => {
  // backend Postman collection uses x-www-form-urlencoded; use URLSearchParams for compatibility
  const params = new URLSearchParams();
  params.append('company_name', payload.name);
  if (payload.industry) params.append('industry_type', payload.industry);
  if (payload.address) params.append('address', payload.address);
  

  const res = await apiClient.post('/companies', params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return res.data;
};

const updateCompany = async ({ id, data }: { id: number; data: Partial<Company> }): Promise<Company> => {
  const params = new URLSearchParams();
  if (data.name) params.append('company_name', data.name as string);
  if ((data as any).address) params.append('address', (data as any).address as string);
  if ((data as any).industry) params.append('industry_type', (data as any).industry as string);

  const res = await apiClient.put(`/companies/${id}`, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return res.data;
};

const deleteCompany = async (id: number): Promise<void> => {
  await apiClient.delete(`/companies/${id}`);
};

// Hooks
export const useCompanies = () => useQuery<Company[]>({ queryKey: ['companies'], queryFn: getCompanies });

export const useCompany = (id: number) =>
  useQuery<Company>({ queryKey: ['companies', id], queryFn: () => getCompanyById(id) });

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCompany,
    onSuccess: (updated: Company) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.setQueryData(['companies', updated.id], updated);
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};
