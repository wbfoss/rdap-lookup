'use client';

import { useState } from 'react';
import { Clock, Calendar, AlertCircle, CheckCircle, Search } from 'lucide-react';

export default function DomainAgeCalculator({ onClose }) {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const calculateDomainAge = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`/api/lookup?query=${encodeURIComponent(domain.trim())}&type=domain`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch domain data');
      }

      if (data.events && data.events.length > 0) {
        const registrationEvent = data.events.find(event => 
          event.eventAction === 'registration' || 
          event.eventAction === 'last update of RDAP database'
        );

        if (registrationEvent) {
          const registrationDate = new Date(registrationEvent.eventDate);
          const now = new Date();
          const ageInDays = Math.floor((now - registrationDate) / (1000 * 60 * 60 * 24));
          const ageInYears = Math.floor(ageInDays / 365);
          const remainingDays = ageInDays % 365;

          const isNewDomain = ageInDays < 30;
          const riskLevel = ageInDays < 30 ? 'high' : ageInDays < 90 ? 'medium' : 'low';

          setResult({
            domain: domain.trim(),
            registrationDate: registrationDate.toLocaleDateString(),
            ageInDays,
            ageInYears,
            remainingDays,
            isNewDomain,
            riskLevel,
            events: data.events
          });
        } else {
          throw new Error('Registration date not found in domain data');
        }
      } else {
        throw new Error('No event data available for this domain');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Domain Age Calculator</h2>
                <p className="text-gray-600">Calculate exact domain age and flag new domains</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={calculateDomainAge} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain name (e.g., example.com)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !domain.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {loading ? 'Analyzing...' : 'Calculate Age'}
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Domain Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Domain Age Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Domain</p>
                    <p className="font-semibold text-gray-900">{result.domain}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Registration Date</p>
                    <p className="font-semibold text-gray-900">{result.registrationDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age in Days</p>
                    <p className="font-semibold text-gray-900">{result.ageInDays.toLocaleString()} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age in Years</p>
                    <p className="font-semibold text-gray-900">
                      {result.ageInYears} years, {result.remainingDays} days
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Assessment */}
              <div className={`rounded-lg p-4 border ${getRiskColor(result.riskLevel)}`}>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  {result.isNewDomain ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  Security Assessment
                </h3>
                <div className="space-y-2">
                  <p className="font-medium">
                    Risk Level: <span className="capitalize">{result.riskLevel}</span>
                  </p>
                  {result.isNewDomain && (
                    <div className="text-sm">
                      <p className="font-medium text-red-700">⚠️ New Domain Alert</p>
                      <p>This domain is less than 30 days old and should be treated with caution.</p>
                    </div>
                  )}
                  {result.riskLevel === 'medium' && (
                    <div className="text-sm">
                      <p className="font-medium text-yellow-700">⚠️ Recently Registered</p>
                      <p>This domain is less than 90 days old. Exercise caution.</p>
                    </div>
                  )}
                  {result.riskLevel === 'low' && (
                    <div className="text-sm">
                      <p className="font-medium text-green-700">✓ Established Domain</p>
                      <p>This domain has been registered for a sufficient period.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Events */}
              {result.events && result.events.length > 1 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Domain Events History</h3>
                  <div className="space-y-2">
                    {result.events.map((event, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {event.eventAction.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm text-gray-600">
                          {new Date(event.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}