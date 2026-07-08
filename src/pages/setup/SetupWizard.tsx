
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container
} from '@mui/material';
import { toast } from 'react-toastify';
import { organizationConfigService } from '../../services/api/organizationConfigService';
import { domainPackService } from '../../services/api/domainPackService';
import { workflowTemplateService } from '../../services/api/workflowTemplateService';

// Import wizard steps
import Step1Welcome from './steps/Step1Welcome';
import Step2DomainPack from './steps/Step2DomainPack';
import Step3BusinessUnits from './steps/Step3BusinessUnits';
import Step4Workflows from './steps/Step4Workflows';
import Step5Modules from './steps/Step5Modules';
import Step6BusinessRules from './steps/Step6BusinessRules';
import Step7Review from './steps/Step7Review';

export interface WizardData {
  logoUrl: string;
  businessName: string;
  industryCode: string;
  country: string;
  timezone: string;
  currency: string;
  businessHours: Record<string, unknown>;
  selectedDomainPackId: string;
  businessUnits: Array<Record<string, unknown>>;
  workflowTemplateId: string;
  enabledModules: string[];
  businessRules: Record<string, unknown>;
  workingDays: string[];
  holidayCalendar: unknown[];
  approvalHierarchy: unknown[];
  slaConfig: Record<string, unknown>;
  defaultLanguage: string;
}

const initialWizardData: WizardData = {
  logoUrl: '',
  businessName: '',
  industryCode: '',
  country: '',
  timezone: '',
  currency: '',
  businessHours: {},
  selectedDomainPackId: '',
  businessUnits: [],
  workflowTemplateId: '',
  enabledModules: [],
  businessRules: {},
  workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  holidayCalendar: [],
  approvalHierarchy: [],
  slaConfig: {},
  defaultLanguage: 'en',
};

const steps = [
  'Welcome & Organization Details',
  'Choose Domain Pack',
  'Configure Business Units',
  'Setup Workflows',
  'Enable Modules',
  'Business Rules',
  'Review & Complete',
];

export const SetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);

  useEffect(() => {
    // Check if setup is already completed
    const checkSetupStatus = async () => {
      try {
        const config = await organizationConfigService.getConfiguration();
        if (config?.organizationSetupCompleted) {
          navigate('/app/dashboard');
          return;
        }
        // Initialize from saved config
        if (config) {
          setWizardData(prev => ({
            ...prev,
            logoUrl: config.logoUrl || '',
            businessName: config.businessName || '',
            industryCode: config.industryCode || '',
            country: config.country || '',
            timezone: config.timezone || 'UTC',
            currency: config.currency || 'USD',
            businessHours: config.businessHours || {},
            selectedDomainPackId: config.appliedDomainPackId || '',
            workflowTemplateId: config.appliedWorkflowTemplateId || '',
            workingDays: config.workingDays || [],
            holidayCalendar: config.holidayCalendar || [],
            approvalHierarchy: config.approvalHierarchy || [],
            slaConfig: config.slaConfig || {},
            defaultLanguage: config.defaultLanguage || 'en'
          }));
          setActiveStep(config.setupCurrentStep || 0);
        }
      } catch (error) {
        console.error('Error checking setup status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSetupStatus();
  }, [navigate]);

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = async () => {
    // Save current step progress
    try {
      setSaving(true);
      if (activeStep === 1 && wizardData.selectedDomainPackId) {
        await domainPackService.applyDomainPack(wizardData.selectedDomainPackId);
      }

      if (activeStep === 3 && wizardData.workflowTemplateId) {
        await workflowTemplateService.applyWorkflowTemplate(wizardData.workflowTemplateId);
      }

      await organizationConfigService.updateConfiguration({
        setupCurrentStep: activeStep + 1,
        logoUrl: wizardData.logoUrl,
        businessName: wizardData.businessName,
        industryCode: wizardData.industryCode,
        country: wizardData.country,
        timezone: wizardData.timezone,
        currency: wizardData.currency,
        businessHours: wizardData.businessHours,
        workingDays: wizardData.workingDays,
        holidayCalendar: wizardData.holidayCalendar,
        approvalHierarchy: wizardData.approvalHierarchy,
        slaConfig: wizardData.slaConfig,
        defaultLanguage: wizardData.defaultLanguage,
        appliedDomainPackId: wizardData.selectedDomainPackId,
        appliedWorkflowTemplateId: wizardData.workflowTemplateId
      });
      
      setActiveStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleComplete = async () => {
    try {
      setSaving(true);
      await organizationConfigService.completeSetup();
      toast.success('Organization setup completed successfully!');
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Error completing setup:', error);
      toast.error('Failed to complete setup');
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <Step1Welcome data={wizardData} updateData={updateWizardData} />;
      case 1:
        return <Step2DomainPack data={wizardData} updateData={updateWizardData} />;
      case 2:
        return <Step3BusinessUnits data={wizardData} updateData={updateWizardData} />;
      case 3:
        return <Step4Workflows data={wizardData} updateData={updateWizardData} />;
      case 4:
        return <Step5Modules data={wizardData} updateData={updateWizardData} />;
      case 5:
        return <Step6BusinessRules data={wizardData} updateData={updateWizardData} />;
      case 6:
        return <Step7Review data={wizardData} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#09090b'
        }}
      >
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#09090b', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
            Organization Setup
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Complete the setup to get started with RecoverFlow
          </Typography>
        </Box>

        <Paper
          sx={{
            bgcolor: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            p: 3,
            mb: 3
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{
                  '& .MuiStepLabel-label': {
                    color: 'rgba(255,255,255,0.6)',
                    '&.Mui-active': { color: '#6366f1' },
                    '&.Mui-completed': { color: '#10b981' }
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'rgba(255,255,255,0.2)',
                    '&.Mui-active': { color: '#6366f1' },
                    '&.Mui-completed': { color: '#10b981' }
                  }
                }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Card
            sx={{
              bgcolor: 'rgba(24,24,27,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 2
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {renderStepContent()}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Button
                  disabled={activeStep === 0 || saving}
                  onClick={handleBack}
                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  Back
                </Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleComplete}
                      disabled={saving}
                      sx={{
                        bgcolor: '#6366f1',
                        '&:hover': { bgcolor: '#4f46e5' },
                        minWidth: 150
                      }}
                    >
                      {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Complete Setup'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={saving}
                      sx={{
                        bgcolor: '#6366f1',
                        '&:hover': { bgcolor: '#4f46e5' },
                        minWidth: 100
                      }}
                    >
                      {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Next'}
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Paper>
      </Container>
    </Box>
  );
};

export default SetupWizard;

