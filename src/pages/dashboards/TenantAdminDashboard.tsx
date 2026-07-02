import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';

export const TenantAdminDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Additional tenant admin specific content can go here */}
      </div>
    </DashboardLayout>
  );
};

export default TenantAdminDashboard;
