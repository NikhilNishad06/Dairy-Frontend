import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProtectedRoute = ({ allowedRoles }) => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                setSession(currentSession);

                if (currentSession) {
                    const { data, error } = await supabase
                        .from('users')
                        .select('role')
                        .eq('id', currentSession.user.id)
                        .single();

                    if (!error && data) {
                        setUserRole(data.role);
                    }
                }
            } catch (error) {
                console.error('Error checking auth:', error);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#FDF9F0' }}>
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
