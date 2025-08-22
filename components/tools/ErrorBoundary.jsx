'use client';

import { useState } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export function ErrorBoundary({ children, fallback }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (error, errorInfo) => {
    setHasError(true);
    setError(error);
    console.error('Tool error:', error, errorInfo);
  };

  const retry = () => {
    setHasError(false);
    setError(null);
  };

  if (hasError) {
    return fallback || (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">
            {error?.message || 'An unexpected error occurred while running this security tool.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={retry}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export function ToolError({ error, onRetry, onClose }) {
  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    return 'An unexpected error occurred';
  };

  const getErrorType = (error) => {
    const message = getErrorMessage(error).toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return {
        type: 'Network Error',
        description: 'Unable to connect to the service. Please check your internet connection.',
        suggestions: [
          'Check your internet connection',
          'Try again in a few moments',
          'Contact support if the problem persists'
        ]
      };
    }
    
    if (message.includes('timeout')) {
      return {
        type: 'Request Timeout',
        description: 'The request took too long to complete.',
        suggestions: [
          'Try again with a shorter domain name',
          'Check if the domain is accessible',
          'Wait a moment and retry'
        ]
      };
    }
    
    if (message.includes('dns') || message.includes('resolve')) {
      return {
        type: 'DNS Resolution Error',
        description: 'Unable to resolve the domain name.',
        suggestions: [
          'Verify the domain name is correct',
          'Check if the domain exists',
          'Try without www prefix'
        ]
      };
    }
    
    if (message.includes('ssl') || message.includes('certificate')) {
      return {
        type: 'SSL/TLS Error',
        description: 'There was an issue with the SSL certificate.',
        suggestions: [
          'Check if HTTPS is enabled for this domain',
          'Verify the certificate is valid',
          'Try again later'
        ]
      };
    }
    
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return {
        type: 'Rate Limit Exceeded',
        description: 'Too many requests have been made. Please wait before trying again.',
        suggestions: [
          'Wait a few minutes before retrying',
          'Try again with fewer concurrent requests',
          'Contact support for rate limit increases'
        ]
      };
    }
    
    return {
      type: 'Analysis Error',
      description: getErrorMessage(error),
      suggestions: [
        'Verify the input is correct',
        'Try again in a few moments',
        'Contact support if the issue persists'
      ]
    };
  };

  const errorInfo = getErrorType(error);

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <div className="bg-red-100 p-2 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 mb-2">{errorInfo.type}</h3>
          <p className="text-red-700 mb-4">{errorInfo.description}</p>
          
          <div className="mb-4">
            <h4 className="font-medium text-red-900 mb-2">Suggestions:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
              {errorInfo.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ message = "Analyzing..." }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export function ValidationError({ message, onFix }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
      <AlertTriangle className="w-5 h-5 text-yellow-600" />
      <div className="flex-1">
        <p className="text-yellow-800">{message}</p>
      </div>
      {onFix && (
        <button
          onClick={onFix}
          className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded text-sm hover:bg-yellow-300 transition-colors"
        >
          Fix
        </button>
      )}
    </div>
  );
}