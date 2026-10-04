import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setAuthLoading } from '../../store/authSlice';
import api from '../../lib/axios';
import { Loader2 } from 'lucide-react';

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/auth/me');
        dispatch(setCredentials({ user: data.data.user }));
      } catch (err) {
        dispatch(setAuthLoading(false));
      }
    };
    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return children;
}
