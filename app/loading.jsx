'use client';

import { Spinner } from '@nextui-org/react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner 
          size="lg" 
          color="primary"
          classNames={{
            circle1: "border-b-primary",
            circle2: "border-b-primary",
          }}
        />
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold text-foreground">Loading RDAP Lookup Tool</p>
          <p className="text-sm text-default-500">Preparing modern domain intelligence...</p>
        </div>
      </div>
    </div>
  );
}