import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';

export const AuditorDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Additional auditor specific content can go here */}
      </div>
    </DashboardLayout>
  );
};

export default AuditorDashboard;
