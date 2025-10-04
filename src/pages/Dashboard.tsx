import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import FarmerDashboard from '@/components/dashboards/FarmerDashboard';
import BuyerDashboard from '@/components/dashboards/BuyerDashboard';
import SupplierDashboard from '@/components/dashboards/SupplierDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  switch (userRole) {
    case 'farmer':
      return <FarmerDashboard />;
    case 'buyer':
      return <BuyerDashboard />;
    case 'supplier':
      return <SupplierDashboard />;
    default:
      return <Navigate to="/auth" replace />;
  }
};

export default Dashboard;
