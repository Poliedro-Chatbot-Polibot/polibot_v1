import axios from 'axios';
import { router, usePathname } from 'expo-router';
import React, { createContext, use, useCallback, useEffect, type PropsWithChildren } from 'react';
import { Auth } from '../types/auth.types';
import config from '../utils/config';
import { useStorageState } from './useStorageState';


const AuthContext = createContext<{
  signIn: (data: Auth) => void;
  signOut: () => void;
  sessionVerify: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  sessionVerify: () => null,
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const pathname = usePathname();


  const verifyToken = useCallback(async () => {
    if (!session) return router.replace('/(auth)/sign-in');    
    
    let sessionData: Auth | null = null;
    
    try {
      sessionData = JSON.parse(session);
    } catch {
      setSession(null);
      router.replace('/(auth)/sign-in');
      return;
    }
    
    if (!sessionData?.access) {
      router.replace('/(auth)/sign-in');
      return;
    }
    

    try {
      await axios.post(`${config.apiUrl}/auth/token/verify/`, {
        token: sessionData.access
      });

      const response = await axios.get(`${config.apiUrl}/auth/user`,{
        headers: {
          Authorization:  `Bearer ${sessionData['access']}`
        }
      });

      sessionData['user'] = response.data;
      setSession(JSON.stringify(sessionData));
      
    } catch (e: any) {
      setSession(null);
      router.replace('/(auth)/sign-in');
    }
  }, [session, setSession]);

  
  useEffect(() => {
    if (pathname.includes('sign')) return;
    verifyToken();
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        signIn: (data) => {
          setSession(JSON.stringify(data));
          router.replace('/'); 
        },
        signOut: () => {
          setSession(null);
        },
        sessionVerify: ()=> {
          verifyToken();
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}