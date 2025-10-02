import React, { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Typography } from './ui/typography';
import { Card, CardContent } from './ui/card';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export default function ApiKeyModal({ isOpen, onClose, onSave }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('openai_api_key') || '';
      setApiKey(storedKey);
      setValidationStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  const validateApiKey = async (key: string): Promise<boolean> => {
    if (!key.trim()) {
      setValidationStatus('error');
      setErrorMessage('API key is required');
      return false;
    }

    if (!key.startsWith('sk-')) {
      setValidationStatus('error');
      setErrorMessage('OpenAI API key should start with "sk-"');
      return false;
    }

    setIsValidating(true);
    setValidationStatus('validating');
    setErrorMessage('');

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });

      if (response.ok) {
        setValidationStatus('success');
        setErrorMessage('');
        return true;
      } else {
        setValidationStatus('error');
        setErrorMessage('Invalid API key. Please check and try again.');
        return false;
      }
    } catch (error) {
      setValidationStatus('error');
      setErrorMessage('Failed to validate API key. Please check your connection.');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    const isValid = await validateApiKey(apiKey);
    
    if (isValid) {
      onSave(apiKey);
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    
    // Reset validation status when user starts typing
    if (validationStatus !== 'idle') {
      setValidationStatus('idle');
      setErrorMessage('');
    }
  };

  const getStatusIcon = () => {
    switch (validationStatus) {
      case 'validating':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Key className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (validationStatus) {
      case 'validating':
        return 'Validating API key...';
      case 'success':
        return 'API key is valid';
      case 'error':
        return 'Invalid API key';
      default:
        return 'Enter your OpenAI API key';
    }
  };

  const getStatusTextColor = () => {
    switch (validationStatus) {
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <Typography variant="h3" weight="semibold">
              Connect Your OpenAI Key
            </Typography>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter your OpenAI key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={handleInputChange}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isValidating}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setShowKey(!showKey)}
                    disabled={isValidating}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 text-sm">
              {getStatusIcon()}
              <span className={getStatusTextColor()}>
                {getStatusText()}
              </span>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <Typography variant="p3" className="text-red-800 dark:text-red-400">
                  {errorMessage}
                </Typography>
              </div>
            )}

            {/* Help text */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <Typography variant="p3" className="text-blue-800 dark:text-blue-400">
                <strong>Security Note:</strong> Your API key is stored locally in your browser and never shared with our servers.
              </Typography>
            </div>

            {/* Don't have key link */}
            <div className="text-center">
              <Typography variant="p3" className="text-gray-600 dark:text-gray-400">
                Don't have an OpenAI key?{' '}
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  Click Here
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Typography>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose} disabled={isValidating}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!apiKey.trim() || isValidating}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              'Verify'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
