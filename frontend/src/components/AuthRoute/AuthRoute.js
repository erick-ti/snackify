import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AuthRoute({ children }) {
    // sets the returnUrl for after the user has been authenticated
    const location = useLocation();
    // verifies if user is logged in or not
    const { user } = useAuth();
  return user ? ( // if user is logged in
    children  // show children - 
  ) : ( // user is not logged in
    // navigates user to login page, takes user back to previous URL once logged in
    <Navigate to={`/login?returnUrl=${location.pathname}`} replace /> // replace - removes all history (can't go back)
  );
}