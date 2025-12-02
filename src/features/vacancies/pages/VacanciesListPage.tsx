import React from 'react';
import { useNavigate, Outlet } from '@tanstack/react-router';
import { useVacancies, useDeleteVacancy } from '../api';
import { Vacancy } from '../types';

export const VacanciesListPage: React.FC = () => {
  const { data: vacancies, isLoading, isError, error } = useVacancies();
  const deleteMutation = useDeleteVacancy();
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this vacancy?')) deleteMutation.mutate(id);
  };

  if (isLoading) return <div>Loading vacancies...</div>;
  if (isError) return <div>Error loading vacancies: {(error as any)?.message}</div>;

  const items: Vacancy[] = Array.isArray(vacancies)
    ? (vacancies as Vacancy[])
    : vacancies && (vacancies as any).data && Array.isArray((vacancies as any).data)
    ? (vacancies as any).data
    : [];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Vacancies</h1>
        <button onClick={() => navigate({ to: '/vacancies/new' })} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create New Vacancy
        </button>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Title</th>
            <th className="py-2 px-4 border-b text-left">Company</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((v) => (
            <tr key={v.id}>
              <td className="py-2 px-4 border-b">{v.title}</td>
              <td className="py-2 px-4 border-b">{v.company?.name ?? '-'}</td>
              <td className="py-2 px-4 border-b text-center">
                <button onClick={() => navigate({ to: `/vacancies/${v.id}` })} className="text-indigo-600 hover:text-indigo-900 mr-4">
                  Edit
                </button>
                <button onClick={() => handleDelete(v.id)} disabled={deleteMutation.isPending} className="text-red-600 hover:text-red-900 disabled:opacity-50">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Outlet />
    </div>
  );
};

export default VacanciesListPage;
