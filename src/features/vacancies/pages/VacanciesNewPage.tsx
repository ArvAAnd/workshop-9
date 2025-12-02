import React from 'react';
import { useCreateVacancy } from '../api';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import { Vacancy } from '../types';
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

export const VacanciesNewPage: React.FC = () => {
  const create = useCreateVacancy();
  const navigate = useNavigate();
  const { data: companies } = useCompanies();

  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(schema) });

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

    create.mutate(payload, {
      onSuccess: () => navigate({ to: '/vacancies' })
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Vacancy</h1>
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

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Create</button>
      </form>
    </div>
  );
};

export default VacanciesNewPage;
