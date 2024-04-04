import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import NotFound from '../NotFound/NotFound';
import AuthRoute from '../AuthRoute/AuthRoute';

// don't export this function, need to tie in with AuthRoute later
function AdminRoute({children}) {
    const { user } = useAuth();

    return (
        // if user is admin, show children, otherwise show NotFound message
        user.isAdmin?  children :
        <NotFound
            linkRoute="/dashboard"
            linkText="Go to Dashboard"
            message="You don't have acess to this page"
        />
    )
}

const AdminRouteExport = ({children}) => (
    // by wrapping with AuthRoute, it will authenticate user log in first
    <AuthRoute>
        <AdminRoute>{children}</AdminRoute>
    </AuthRoute>
);


// now export THIS function, which authenticate if user is logged in or not, THEN checks if they are an admin
export default AdminRouteExport;