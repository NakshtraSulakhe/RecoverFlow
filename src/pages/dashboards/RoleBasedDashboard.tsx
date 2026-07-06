import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import PlatformOwnerDashboard from './PlatformOwnerDashboard';
import TenantAdminDashboard from './TenantAdminDashboard';
import RecoveryManagerDashboard from './RecoveryManagerDashboard';
import TeamLeaderDashboard from './TeamLeaderDashboard';
import RecoveryAgentDashboard from './RecoveryAgentDashboard';
import LegalOfficerDashboard from './LegalOfficerDashboard';
import QADashboard from './QADashboard';
import AuditorDashboard from './AuditorDashboard';
import ReadOnlyDashboard from './ReadOnlyDashboard';

const DASHBOARD_COMPONENTS: Record<string, React.FC> = {
  platform_owner: PlatformOwnerDashboard,
  tenant_admin: TenantAdminDashboard,
  recovery_manager: RecoveryManagerDashboard,
  team_leader: TeamLeaderDashboard,
  recovery_agent: RecoveryAgentDashboard,
  legal_officer: LegalOfficerDashboard,
  qa: QADashboard,
  auditor: AuditorDashboard,
  read_only: ReadOnlyDashboard,
};

export const RoleBasedDashboard: React.FC = () => {
  const user = useAppSelector(
    state => state.auth.user
);
  const userRole = user?.user_type || 'read_only';
  
  const DashboardComponent = DASHBOARD_COMPONENTS[userRole] || ReadOnlyDashboard;
  
  return <DashboardComponent />;
};

export default RoleBasedDashboard;
