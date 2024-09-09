import { Navigate } from 'react-router-dom';
import { useAuth } from '../../components/context/AuthProvider';
import UserService from '../service/UserService';

const RoleProtectedRoute = ({ element, roles }) => {
  const { isAuthenticated } = useAuth();
  const userRole = UserService.getRole(); // Obtén el rol del usuario usando UserService

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
