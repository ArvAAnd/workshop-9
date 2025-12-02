import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../lib/axios';
import { Vacancy } from './types';

const getVacancies = async (): Promise<Vacancy[]> => {
  const res = await apiClient.get('/vacancies');
  const payload = res.data;

  // Backend returns envelope like { message: '', data: [...] }
  if (Array.isArray(payload)) return payload as Vacancy[];
  if (payload && Array.isArray(payload.data)) return payload.data as Vacancy[];
  if (payload && Array.isArray((payload as any).rows)) return (payload as any).rows as Vacancy[];
  if (payload && Array.isArray((payload as any).payload)) return (payload as any).payload as Vacancy[];

  return [];
};

const getVacancyById = async (id: number): Promise<Vacancy> => {
  const res = await apiClient.get(`/vacancies/${id}`);
  const payload = res.data;

  if (payload && payload.data) {
    if (Array.isArray(payload.data)) return payload.data[0];
    return payload.data as Vacancy;
  }

  return payload as Vacancy;
};

const createVacancy = async (payload: Omit<Vacancy, 'id'>): Promise<Vacancy> => {
  // Send as x-www-form-urlencoded to match Postman example
  const params = new URLSearchParams();
  params.append('title', payload.title);
  if (payload.description) params.append('description', payload.description);
  if (payload.salary != null) params.append('salary', String(payload.salary));
  if (payload.skills) params.append('skills', String(payload.skills));
  if (payload.experienceYears != null) params.append('experience_years', String(payload.experienceYears));
  // include employer_id if company provided (Postman uses employer_id)
  if (payload.company?.id) params.append('employer_id', String(payload.company.id));
  // also include companyId if frontend passes it
  if ((payload as any).companyId) params.append('companyId', String((payload as any).companyId));

  const res = await apiClient.post('/vacancies', params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return res.data;
};

const updateVacancy = async ({ id, data }: { id: number; data: Partial<Vacancy> }): Promise<Vacancy> => {
  const params = new URLSearchParams();
  if (data.title) params.append('title', data.title as string);
  if ((data as any).description) params.append('description', (data as any).description as string);
  if ((data as any).salary != null) params.append('salary', String((data as any).salary));
  if ((data as any).skills) params.append('skills', String((data as any).skills));
  if ((data as any).experienceYears != null) params.append('experience_years', String((data as any).experienceYears));
  if ((data as any).company && (data as any).company.id) params.append('employer_id', String((data as any).company.id));

  const res = await apiClient.put(`/vacancies/${id}`, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return res.data;
};

const deleteVacancy = async (id: number): Promise<void> => {
  await apiClient.delete(`/vacancies/${id}`);
};

export const useVacancies = () => useQuery<Vacancy[]>({ queryKey: ['vacancies'], queryFn: getVacancies });

export const useVacancy = (id: number) =>
  useQuery<Vacancy>({ queryKey: ['vacancies', id], queryFn: () => getVacancyById(id) });

export const useCreateVacancy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVacancy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
    },
  });
};

export const useUpdateVacancy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVacancy,
    onSuccess: (updated: Vacancy) => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      queryClient.setQueryData(['vacancies', updated.id], updated);
    },
  });
};

export const useDeleteVacancy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVacancy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
    },
  });
};