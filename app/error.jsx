'use client';

import { useEffect } from 'react';
import { Button, Card, CardBody } from '@heroui/react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to Vercel Analytics or your preferred logging service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardBody className="text-center space-y-6 p-8">
          <div className="flex justify-center">
            <div className="bg-danger/10 p-4 rounded-full">
              <AlertCircle className="w-8 h-8 text-danger" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
            <p className="text-default-500 text-sm">
              We encountered an unexpected error while loading the RDAP lookup tool.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              color="primary"
              variant="flat"
              onPress={reset}
              startContent={<RefreshCw className="w-4 h-4" />}
              className="w-full"
            >
              Try Again
            </Button>
            
            <Button
              as="a"
              href="/"
              variant="light"
              className="w-full"
            >
              Go Home
            </Button>
          </div>

          <div className="text-xs text-default-400">
            Error ID: {error?.digest || 'unknown'}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}