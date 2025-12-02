import React, { useEffect } from 'react';
import { useVacancy, useUpdateVacancy } from '../api';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCompanies } from '../../companies/api';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  salary: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().optional().nullable()),
  type: z.string().optional().nullable(),
  skills: z.string().optional().nullable(),
  experienceYears: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().optional().nullable()),
  companyId: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

export const VacancyEditPage: React.FC = () => {
  // parse id from pathname (same approach as CompanyEditPage)
  const segments = window.location.pathname.split('/').filter(Boolean);
  const id = Number(segments[segments.length - 1]);
  const { data: vacancy, isLoading } = useVacancy(id);
  const update = useUpdateVacancy();
  const navigate = useNavigate();
  const { data: companies } = useCompanies();

  const { register, handleSubmit, reset, formState } = useForm({ resolver: zodResolver(schema) });
  useEffect(() => {
    if (vacancy) {
      reset({
        title: vacancy.title,
        description: vacancy.description ?? undefined,
        salary: vacancy.salary ?? undefined,
        type: vacancy.type ?? undefined,
        skills: vacancy.skills ?? undefined,
        experienceYears: vacancy.experienceYears ?? undefined,
        companyId: vacancy.company ? String(vacancy.company.id) : undefined,
      });
    }
  }, [vacancy, reset]);

  if (isLoading) return <div>Loading...</div>;

  const onSubmit = (data: FormData) => {
    const payload: any = {
      title: data.title,
      description: data.description ?? undefined,
      salary: data.salary ?? undefined,
      type: data.type ?? undefined,
      skills: data.skills ?? undefined,
      experienceYears: data.experienceYears ?? undefined,
    };
    if (data.companyId) payload.companyId = Number(data.companyId);

    update.mutate({ id, data: payload }, {
      onSuccess: () => navigate({ to: '/vacancies' })
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Vacancy</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input {...register('title')} className="w-full p-2 border rounded" />
          {formState.errors.title && <p className="text-red-500 text-sm mt-1">{String(formState.errors.title.message)}</p>}
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea {...register('description')} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Salary</label>
          <input {...register('salary')} type="number" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Experience Years</label>
          <input {...register('experienceYears')} type="number" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Company</label>
          <select {...register('companyId')} className="w-full p-2 border rounded">
            <option value="">-- None --</option>
            {Array.isArray(companies) && companies.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save Changes</button>
      </form>
    </div>
  );
};

export default VacancyEditPage;
