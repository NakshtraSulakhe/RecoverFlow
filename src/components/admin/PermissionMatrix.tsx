import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Tooltip,
} from '@mui/material';
import { Save, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Permission {
  id: string;
  module_code: string;
  action_code: string;
  permission_code: string;
  name: string;
  description: string;
  action_name: string;
  granted: boolean;
}

interface ModulePermissions {
  module_code: string;
  permissions: Permission[];
}

interface PermissionMatrixProps {
  roleId: string;
  onSave?: (permissionIds: string[]) => void;
  readOnly?: boolean;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  roleId,
  onSave,
  readOnly = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modules, setModules] = useState<ModulePermissions[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPermissionMatrix();
  }, [roleId]);

  const loadPermissionMatrix = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/v1/roles/${roleId}/permission-matrix`);
      const data = await response.json();

      if (data.success) {
        setModules(data.data);
        
        // Initialize selected permissions
        const selected = new Set<string>();
        data.data.forEach((module: ModulePermissions) => {
          module.permissions.forEach((perm: Permission) => {
            if (perm.granted) {
              selected.add(perm.id);
            }
          });
        });
        setSelectedPermissions(selected);
      } else {
        setError(data.message || 'Failed to load permission matrix');
      }
    } catch (err) {
      setError('Failed to load permission matrix');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    if (readOnly) return;

    setSelectedPermissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  const handleSelectAllInModule = (moduleCode: string) => {
    if (readOnly) return;

    const module = modules.find(m => m.module_code === moduleCode);
    if (!module) return;

    const modulePermissionIds = module.permissions.map(p => p.id);
    const allSelected = modulePermissionIds.every(id => selectedPermissions.has(id));

    setSelectedPermissions(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        modulePermissionIds.forEach(id => newSet.delete(id));
      } else {
        modulePermissionIds.forEach(id => newSet.add(id));
      }
      return newSet;
    });
  };

  const handleSelectAllByAction = (actionCode: string) => {
    if (readOnly) return;

    const actionPermissionIds = modules
      .flatMap(m => m.permissions)
      .filter(p => p.action_code === actionCode)
      .map(p => p.id);

    const allSelected = actionPermissionIds.every(id => selectedPermissions.has(id));

    setSelectedPermissions(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        actionPermissionIds.forEach(id => newSet.delete(id));
      } else {
        actionPermissionIds.forEach(id => newSet.add(id));
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const permissionIds = Array.from(selectedPermissions);
      
      const response = await fetch(`/api/v1/roles/${roleId}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permission_matrix_ids: permissionIds }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Permissions saved successfully');
        if (onSave) {
          onSave(permissionIds);
        }
      } else {
        toast.error(data.message || 'Failed to save permissions');
      }
    } catch (err) {
      toast.error('Failed to save permissions');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getActions = () => {
    if (modules.length === 0) return [];
    const firstModule = modules[0];
    return firstModule.permissions.map(p => ({
      code: p.action_code,
      name: p.action_name,
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button
          size="small"
          onClick={loadPermissionMatrix}
          startIcon={<RefreshCw size={16} />}
          sx={{ ml: 1 }}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  const actions = getActions();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Permission Matrix</Typography>
        <Box display="flex" gap={2}>
          <Button
            startIcon={<RefreshCw size={16} />}
            onClick={loadPermissionMatrix}
            disabled={loading}
          >
            Refresh
          </Button>
          {!readOnly && (
            <Button
              variant="contained"
              startIcon={<Save size={16} />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </Box>
      </Box>

      <Paper elevation={2}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>Module</TableCell>
                {actions.map(action => (
                  <TableCell key={action.code} align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <Checkbox
                        size="small"
                        checked={modules.every(m =>
                          m.permissions
                            .filter(p => p.action_code === action.code)
                            .every(p => selectedPermissions.has(p.id))
                        )}
                        onChange={() => handleSelectAllByAction(action.code)}
                        disabled={readOnly}
                      />
                      <Typography variant="caption">{action.name}</Typography>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {modules.map((module) => (
                <TableRow key={module.module_code}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={module.permissions.every(p => selectedPermissions.has(p.id))}
                      onChange={() => handleSelectAllInModule(module.module_code)}
                      disabled={readOnly}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {module.module_code.charAt(0).toUpperCase() + module.module_code.slice(1)}
                    </Typography>
                  </TableCell>
                  {actions.map(action => {
                    const permission = module.permissions.find(p => p.action_code === action.code);
                    return (
                      <TableCell key={action.code} align="center">
                        {permission ? (
                          <Tooltip title={permission.description || permission.name}>
                            <Checkbox
                              size="small"
                              checked={selectedPermissions.has(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              disabled={readOnly}
                            />
                          </Tooltip>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box mt={2}>
        <Typography variant="caption" color="text.secondary">
          Selected permissions: {selectedPermissions.size}
        </Typography>
      </Box>
    </Box>
  );
};
