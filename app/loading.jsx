'use client';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold text-gray-900 text-white">Loading RDAP Lookup Tool</p>
          <p className="text-sm text-gray-600 text-gray-400">Preparing modern domain intelligence...</p>
        </div>
      </div>
    </div>
  );
}