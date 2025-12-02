import React, { useEffect } from 'react';
import { useCompany, useUpdateCompany } from '../api';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

export const CompanyEditPage: React.FC = () => {
  // parse id from pathname
  const segments = window.location.pathname.split('/').filter(Boolean);
  const id = Number(segments[segments.length - 1]);
  const { data: company, isLoading } = useCompany(id);
  const update = useUpdateCompany();

  const { register, handleSubmit, reset, formState } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (company) {
      reset({ name: company.name, address: company.address ?? undefined, industry: company.industry ?? undefined });
    }
  }, [company, reset]);

  const navigate = useNavigate();

  const onSubmit = (data: FormData) =>
    update.mutate({ id, data }, { onSuccess: () => navigate({ to: '/companies' }) });

  if (isLoading) return <div>Loading...</div>;

  if (!company) return <div>Company not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Company: {company.name}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input {...register('name')} className="w-full p-2 border rounded" />
          {formState.errors.name && <p className="text-red-500 text-sm mt-1">{String(formState.errors.name.message)}</p>}
        </div>

        <div>
          <label className="block font-medium">Address</label>
          <input {...register('address')} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Industry</label>
          <input {...register('industry')} className="w-full p-2 border rounded" />
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default CompanyEditPage;
