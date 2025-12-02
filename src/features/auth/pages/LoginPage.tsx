import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '../api';
import { useNavigate } from '@tanstack/react-router';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(2, 'Password too short'),
});

type FormData = z.infer<typeof schema>;

export const LoginPage: React.FC = () => {
  const login = useLogin();
  const { register, handleSubmit, formState } = useForm<FormData>({ resolver: zodResolver(schema) });

  const navigate = useNavigate();

  const onSubmit = (data: FormData) =>
    login.mutate(data, {
      onSuccess: () => {
        navigate({ to: '/' });
      },
    });

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Email</label>
          <input {...register('email')} className="w-full p-2 border rounded" />
          {formState.errors.email && <p className="text-red-500 text-sm mt-1">{String(formState.errors.email.message)}</p>}
        </div>

        <div>
          <label className="block font-medium">Password</label>
          <input type="password" {...register('password')} className="w-full p-2 border rounded" />
          {formState.errors.password && <p className="text-red-500 text-sm mt-1">{String(formState.errors.password.message)}</p>}
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
          {login.isPending ? 'Logging in...' : 'Login'
          }
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
