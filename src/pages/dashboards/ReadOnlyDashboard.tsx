import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';

export const ReadOnlyDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Additional read only specific content can go here */}
      </div>
    </DashboardLayout>
  );
};

export default ReadOnlyDashboard;
