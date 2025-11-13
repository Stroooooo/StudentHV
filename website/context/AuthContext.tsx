import LoginPage from '@/components/page/login-page';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { venv } from '@/config/env';
import { useQuery } from '@tanstack/react-query';
import { createContext, useEffect, useState } from 'react';

const AuthContext: any = createContext(null);

function AuthProvider({ children }: any) {
    const {data, isLoading, isError} = useQuery({ 
        queryKey: ['auth'], 
        queryFn: async () => {
            const res = await fetch(venv.SERVER + "/auth/authenticated", {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            return res.json()
        }
    })

    const isAuthenticated = data?.sucsess === "true"

    if (isLoading) {
        return (
            <div className='min-w-screen min-h-screen flex justify-center items-center bg-white'>
                <Spinner />
            </div>
        )
    }

    if (isError || !isAuthenticated) {
        return <LoginPage />
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };