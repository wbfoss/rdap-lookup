'use client';

import { useState } from 'react';

// shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

/**
 * Example structured data display for RDAP.
 * Customize as needed.
 */
function StructuredRdapData({ data }) {
  const {
    objectClassName,
    handle,
    ldhName,
    startAddress,
    endAddress,
    entities,
    events,
    status,
  } = data;

  return (
    <div className="space-y-4">
      {/* Basic Info Table */}
      <div className="overflow-auto">
        <table className="w-full border border-gray-200 text-sm">
          <tbody>
            {objectClassName && (
              <tr>
                <td className="p-2 font-medium bg-gray-50 w-1/3">
                  Object Class
                </td>
                <td className="p-2">{objectClassName}</td>
              </tr>
            )}
            {handle && (
              <tr>
                <td className="p-2 font-medium bg-gray-50">Handle</td>
                <td className="p-2">{handle}</td>
              </tr>
            )}
            {ldhName && (
              <tr>
                <td className="p-2 font-medium bg-gray-50">LDH Name</td>
                <td className="p-2">{ldhName}</td>
              </tr>
            )}
            {startAddress && (
              <tr>
                <td className="p-2 font-medium bg-gray-50">Start Address</td>
                <td className="p-2">{startAddress}</td>
              </tr>
            )}
            {endAddress && (
              <tr>
                <td className="p-2 font-medium bg-gray-50">End Address</td>
                <td className="p-2">{endAddress}</td>
              </tr>
            )}
            {Array.isArray(status) && status.length > 0 && (
              <tr>
                <td className="p-2 font-medium bg-gray-50">Status</td>
                <td className="p-2">{status.join(', ')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Entities */}
      {Array.isArray(entities) && entities.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2">Entities</h4>
          <ul className="list-disc pl-5 space-y-1">
            {entities.map((entity, idx) => (
              <li key={idx}>
                {entity.handle || 'No entity handle'}
                {entity.roles && ` (roles: ${entity.roles.join(', ')})`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Events */}
      {Array.isArray(events) && events.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2">Events</h4>
          <ul className="list-disc pl-5 space-y-1">
            {events.map((event, idx) => (
              <li key={idx}>
                <strong>{event.eventAction}:</strong> {event.eventDate}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  // Make "domain" the default type
  const [type, setType] = useState('domain');
  const [objectValue, setObjectValue] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showJson, setShowJson] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setResult(null);
    setError(null);
    setIsLoading(true);
    setShowJson(false);

    try {
      const res = await fetch('/api/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, object: objectValue }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error fetching RDAP data.');
      }
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setType('domain'); // reset to domain
    setObjectValue('');
    setResult(null);
    setError(null);
    setShowJson(false);
  }

  return (
    <main className="container mx-auto p-4 max-w-xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">RDAP Lookup Tool v1.0</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* RDAP Type */}
            <div>
              <Label htmlFor="type" className="mb-2 block text-sm font-medium">
                Object Type
              </Label>
              <Select value={type} onValueChange={(val) => setType(val)}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select an RDAP type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="domain">Domain</SelectItem>
                  <SelectItem value="ip">IP</SelectItem>
                  <SelectItem value="autnum">ASN (autnum)</SelectItem>
                  <SelectItem value="entity">Entity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* RDAP Object Input */}
            <div>
              <Label
                htmlFor="objectValue"
                className="mb-2 block text-sm font-medium"
              >
                Object Identifier
              </Label>
              <Input
                id="objectValue"
                type="text"
                placeholder="e.g. google.com or 8.8.8.8"
                value={objectValue}
                onChange={(e) => setObjectValue(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="default"
                type="submit"
                disabled={!type || !objectValue || isLoading}
              >
                {isLoading ? 'Checking...' : 'Lookup'}
              </Button>
              {result && (
                <Button variant="outline" type="button" onClick={resetForm}>
                  Make Another Query
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="mb-4">
          <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold flex justify-between">
              <span>Lookup Result</span>
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowJson((prev) => !prev)}
              >
                {showJson ? 'Hide JSON' : 'Show JSON'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showJson ? (
              <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            ) : (
              <StructuredRdapData data={result} />
            )}
          </CardContent>
        </Card>
      )}

     {/* Footer Section */}
<div className="mt-6 text-xs text-gray-600">
  Special Thanks to <a
    href="https://rdap.org"
    target="_blank"
    rel="noopener noreferrer"
    className="underline"
  >
    rdap.org
  </a> and <a
    href="https://iana.org"
    target="_blank"
    rel="noopener noreferrer"
    className="underline"
  >
    iana.org
  </a> | Hosted on <a
    href="https://vercel.com"
    target="_blank"
    rel="noopener noreferrer"
    className="underline"
  
  > vercel.com </a> | This is an open-source project | <a
    href="https://github.com/alokemajumder/rdap-lookup"
    target="_blank"
    rel="noopener noreferrer"
    className="underline"
  >
    Contribute at GitHub
  </a>
</div>
    </main>
  );
}