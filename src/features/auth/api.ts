import { useMutation } from '@tanstack/react-query';
import apiClient from '../../lib/axios';
import useAuthStore from '../../store/auth';

type LoginPayload = { email: string; password: string };

const login = async (payload: LoginPayload): Promise<{ token: string }> => {
  const res = await apiClient.post('/auth/login', payload);
  return res.data;
};

export const useLogin = () => {
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.token) setToken(data.token);
    },
  });
};
