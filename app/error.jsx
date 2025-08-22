'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to Vercel Analytics or your preferred logging service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center space-y-6 p-8">
          <div className="flex justify-center">
            <div className="bg-red-100 bg-red-900/20 p-4 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-600 text-red-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 text-white">Something went wrong</h2>
            <p className="text-gray-600 text-gray-400 text-sm">
              We encountered an unexpected error while loading the RDAP lookup tool.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            
            <a
              href="/"
              className="w-full block text-center text-gray-600 text-gray-400 hover:text-gray-800 hover:text-gray-200 px-4 py-2 transition-colors"
            >
              Go Home
            </a>
          </div>

          <div className="text-xs text-gray-500 text-gray-500">
            Error ID: {error?.digest || 'unknown'}
          </div>
        </div>
      </div>
    </div>
  );
}