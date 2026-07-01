import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

interface UseApiCallOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

export const useApiCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async <T,>(
      apiFunction: () => Promise<T>,
      options: UseApiCallOptions = {}
    ): Promise<T | null> => {
      const {
        onSuccess,
        onError,
        showSuccessToast = false,
        showErrorToast = true,
        successMessage = 'Operation successful',
      } = options;

      setIsLoading(true);
      setError(null);

      try {
        const result = await apiFunction();
        
        if (showSuccessToast) {
          toast.success(successMessage);
        }
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(err?.message || 'An error occurred');
        setError(error);
        
        if (showErrorToast) {
          toast.error(error.message || 'Operation failed');
        }
        
        if (onError) {
          onError(error);
        }
        
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const retry = useCallback(
    async <T,>(
      apiFunction: () => Promise<T>,
      options: UseApiCallOptions = {},
      maxRetries: number = 3
    ): Promise<T | null> => {
      let lastError: Error | null = null;
      
      for (let i = 0; i < maxRetries; i++) {
        const result = await execute(apiFunction, { ...options, showErrorToast: false });
        
        if (result !== null) {
          return result;
        }
        
        lastError = error;
        
        // Wait before retrying (exponential backoff)
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
      
      if (lastError && options.showErrorToast !== false) {
        toast.error(`Operation failed after ${maxRetries} retries`);
      }
      
      return null;
    },
    [execute, error]
  );

  return {
    isLoading,
    error,
    execute,
    retry,
    clearError: () => setError(null),
  };
};

export default useApiCall;
