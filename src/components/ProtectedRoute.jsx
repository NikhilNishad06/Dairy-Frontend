import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProtectedRoute = ({ allowedRoles }) => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            // Safety timeout to prevent stuck loading screen
            const timeout = setTimeout(() => {
                setLoading(false);
            }, 5000);

            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                setSession(currentSession);

                if (currentSession) {
                    const { data, error } = await supabase
                        .from('users')
                        .select('role')
                        .eq('id', currentSession.user.id)
                        .maybeSingle();

                    if (!error && data) {
                        setUserRole(data.role);
                    } else {
                        // Default to customer if successfully authenticated but profile record is missing or DB error
                        setUserRole('customer');
                    }
                }
            } catch (error) {
                console.error('Error checking auth:', error);
            } finally {
                clearTimeout(timeout);
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    if (loading) {
        return (
            <div className="loading" style={{ flexDirection: 'column', gap: '20px' }}>
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div style={{ color: '#8B1A1A' }}>Securing your session... Please wait.</div>
            </div>
        );
    }

    if (!session) {
        console.log("No session found, redirecting to login");
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        console.log(`Role ${userRole} not in ${allowedRoles}, redirecting to login`);
        // If we are already at home or stuck, break the loop by going to login
        if (window.location.pathname === "/" || !userRole) {
            return (
                <div className="loading" style={{ flexDirection: 'column' }}>
                    <div style={{ color: '#8B1A1A' }}>Access Denied: Redirecting...</div>
                    <Navigate to="/login" replace />
                </div>
            );
        }
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
