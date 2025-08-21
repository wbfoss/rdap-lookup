import { Button, Card, CardBody } from '@heroui/react';
import { Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardBody className="text-center space-y-6 p-8">
          <div className="flex justify-center">
            <div className="bg-warning/10 p-4 rounded-full">
              <Search className="w-8 h-8 text-warning" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Page Not Found</h2>
            <p className="text-default-500 text-sm">
              The page you're looking for doesn't exist. Try searching for domain, IP, or ASN information instead.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              as={Link}
              href="/"
              color="primary"
              variant="flat"
              startContent={<Home className="w-4 h-4" />}
              className="w-full"
            >
              Go to RDAP Lookup
            </Button>
          </div>

          <div className="text-xs text-default-400">
            Error 404 - Page not found
          </div>
        </CardBody>
      </Card>
    </div>
  );
}