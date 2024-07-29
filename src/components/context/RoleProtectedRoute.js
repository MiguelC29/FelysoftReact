import { Navigate } from 'react-router-dom';
import { useAuth } from '../../components/context/AuthProvider';

const RoleProtectedRoute = ({ element, roles }) => {
  const { isAuthenticated } = useAuth();
  const userRole = localStorage.getItem('role');

  // Verificar si el usuario está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario tiene uno de los roles permitidos
  if (!roles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default RoleProtectedRoute;
