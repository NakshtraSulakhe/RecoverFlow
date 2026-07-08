import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { workflowTemplateService } from '../../../services/api/workflowTemplateService';

interface WorkflowTemplate {
  id: string;
  templateCode: string;
  templateName: string;
  description: string;
  isSystemTemplate: boolean;
  stages: any[];
}

interface Step4Props {
  data: any;
  updateData: (data: any) => void;
}

const Step4Workflows: React.FC<Step4Props> = ({ data, updateData }) => {
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const templates = await workflowTemplateService.getWorkflowTemplates();
        const normalizedTemplates = (templates || []).map((template: any) => ({
          id: template.id,
          templateCode: template.template_code || template.templateCode || '',
          templateName: template.template_name || template.templateName || 'Unnamed workflow',
          description: template.description || 'Workflow template',
          isSystemTemplate: template.is_system_template || template.isSystemTemplate || false,
          stages: Array.isArray(template.stages) ? template.stages : []
        }));

        setWorkflows(normalizedTemplates);

        if (!data.workflowTemplateId && normalizedTemplates.length > 0) {
          const preferredWorkflow = Array.isArray(data.selectedDomainPackDefaults?.defaultWorkflows)
            ? data.selectedDomainPackDefaults.defaultWorkflows.find((workflow: any) => {
                const code = workflow?.code || workflow?.template_code || workflow?.templateCode;
                const name = workflow?.name || workflow?.template_name || workflow?.templateName;
                return normalizedTemplates.some((template) => template.templateCode === code || template.templateName === name);
              })
            : null;

          const matchedWorkflow = preferredWorkflow
            ? normalizedTemplates.find((template) => template.templateCode === (preferredWorkflow.code || preferredWorkflow.template_code || preferredWorkflow.templateCode))
            : null;

          updateData({ workflowTemplateId: matchedWorkflow?.id || normalizedTemplates[0].id });
        }
      } catch (err) {
        console.error('Error fetching workflows:', err);
        setError('Failed to load workflows');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, []);

  const handleSelectWorkflow = (workflowId: string) => {
    updateData({ workflowTemplateId: workflowId });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ bgcolor: 'rgba(239,68,68,0.1)' }}>{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
        Setup Workflows
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        Choose a workflow template for your recovery process. You can customize this later.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {workflows.map((workflow) => (
          <Card
            key={workflow.id}
            sx={{
              bgcolor: data.workflowTemplateId === workflow.id ? 'rgba(99,102,241,0.1)' : 'rgba(24,24,27,0.8)',
              border: data.workflowTemplateId === workflow.id ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#6366f1',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardActionArea onClick={() => handleSelectWorkflow(workflow.id)} sx={{ p: 0 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
                  {workflow.templateName}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 2, fontSize: '0.9rem' }}>
                  {workflow.description}
                </Typography>

                {workflow.stages && workflow.stages.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {workflow.stages.map((stage: any, idx: number) => (
                      <Chip
                        key={`${workflow.id}-${idx}`}
                        label={stage.name || stage.stage_name || stage.stageName}
                        size="small"
                        sx={{
                          bgcolor: `${stage.color || '#6366f1'}20`,
                          color: stage.color || '#6366f1',
                          border: `1px solid ${(stage.color || '#6366f1')}40`
                        }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Step4Workflows;
