import React from 'react';
import { useCreateCompany } from '../api';
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

export const CompaniesNewPage: React.FC = () => {
  const create = useCreateCompany();
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    create.mutate(data as any, {
      onSuccess: () => {
        navigate({ to: '/companies' });
      },
      onError: (err: any) => {
        // show backend validation error messages where possible
        const serverMessage = err?.response?.data?.message ?? err?.response?.data ?? err?.message ?? 'Unknown error';
        // eslint-disable-next-line no-console
        console.error('Create company error:', err, serverMessage);
        alert(typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage));
      },
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Company</h1>
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
          Create
        </button>
      </form>
    </div>
  );
};

export default CompaniesNewPage;
