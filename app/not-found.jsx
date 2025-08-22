import { Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg">
        <div className="text-center space-y-6 p-8">
          <div className="flex justify-center">
            <div className="bg-yellow-100 p-4 rounded-full">
              <Search className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Page Not Found</h2>
            <p className="text-gray-600 text-sm">
              The page you're looking for doesn't exist. Try searching for domain, IP, or ASN information instead.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Home className="w-4 h-4" />
              Go to DomainIntel
            </Link>
          </div>

          <div className="text-xs text-gray-500">
            Error 404 - Page not found
          </div>
        </div>
      </div>
    </div>
  );
}