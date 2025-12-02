import React from 'react';
import { useNavigate, Outlet } from '@tanstack/react-router';
import { useCompanies, useDeleteCompany } from '../api';
import { Company } from '../types';

export const CompaniesListPage: React.FC = () => {
  const { data: companies, isLoading, isError, error } = useCompanies();
  const deleteMutation = useDeleteCompany();
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading companies...</div>;
  if (isError) return <div>Error loading companies: {(error as any)?.message}</div>;

  // Ensure we always have an array to map over. The backend returns an
  // envelope like { message: '', data: [...] } so guard for that case.
  const items: Company[] = Array.isArray(companies)
    ? (companies as Company[])
    : companies && (companies as any).data && Array.isArray((companies as any).data)
    ? (companies as any).data
    : [];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Companies</h1>
        <button onClick={() => navigate({ to: '/companies/new' })} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create New Company
        </button>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Industry</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((company) => (
            <tr key={company.id}>
              <td className="py-2 px-4 border-b">{company.name}</td>
              <td className="py-2 px-4 border-b">{company.industry ?? '-'}</td>
              <td className="py-2 px-4 border-b text-center">
                <button onClick={() => navigate({ to: `/companies/${company.id}` })} className="text-indigo-600 hover:text-indigo-900 mr-4">
                  Edit
                </button>
                <button onClick={() => handleDelete(company.id)} disabled={deleteMutation.isPending} className="text-red-600 hover:text-red-900 disabled:opacity-50">
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

export default CompaniesListPage;
