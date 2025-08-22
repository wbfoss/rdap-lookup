'use client';

import { useState } from 'react';
import { Search, AlertTriangle, Shield, Globe, Copy, ExternalLink } from 'lucide-react';
import { safeJsonParse } from "../../utils/security-tools";

export default function TyposquattingDetection({ onClose }) {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const generateTyposquatVariations = (domain) => {
    const variations = [];
    const baseDomain = domain.toLowerCase();
    
    // Character substitution (common typos)
    const substitutions = {
      'a': ['e', 'o', 's', 'q'],
      'e': ['a', 'i', 'o'],
      'i': ['o', 'u', 'e'],
      'o': ['i', 'u', 'a', '0'],
      'u': ['i', 'o', 'y'],
      'l': ['1', 'i'],
      'm': ['n', 'rn'],
      'n': ['m', 'h'],
      'r': ['t'],
      't': ['r'],
      's': ['5', 'z'],
      'z': ['s'],
      '0': ['o'],
      '1': ['l', 'i']
    };

    // Character omission
    for (let i = 0; i < baseDomain.length; i++) {
      const omitted = baseDomain.slice(0, i) + baseDomain.slice(i + 1);
      if (omitted.length > 2 && omitted.includes('.')) {
        variations.push({ domain: omitted, type: 'Character Omission', risk: 'medium' });
      }
    }

    // Character insertion
    const commonInserts = ['a', 'e', 'i', 'o', 'u', 'l', 'r', 'n', 'm'];
    for (let i = 0; i <= baseDomain.length; i++) {
      commonInserts.forEach(char => {
        const inserted = baseDomain.slice(0, i) + char + baseDomain.slice(i);
        if (inserted !== baseDomain && inserted.includes('.')) {
          variations.push({ domain: inserted, type: 'Character Insertion', risk: 'medium' });
        }
      });
    }

    // Character substitution
    for (let i = 0; i < baseDomain.length; i++) {
      const currentChar = baseDomain[i];
      if (substitutions[currentChar]) {
        substitutions[currentChar].forEach(newChar => {
          const substituted = baseDomain.slice(0, i) + newChar + baseDomain.slice(i + 1);
          if (substituted !== baseDomain) {
            variations.push({ 
              domain: substituted, 
              type: 'Character Substitution',
              risk: currentChar === 'o' && newChar === '0' ? 'high' : 'medium'
            });
          }
        });
      }
    }

    // Adjacent key substitution (QWERTY keyboard)
    const qwertyMap = {
      'q': ['w'], 'w': ['q', 'e'], 'e': ['w', 'r'], 'r': ['e', 't'], 't': ['r', 'y'],
      'y': ['t', 'u'], 'u': ['y', 'i'], 'i': ['u', 'o'], 'o': ['i', 'p'], 'p': ['o'],
      'a': ['s'], 's': ['a', 'd'], 'd': ['s', 'f'], 'f': ['d', 'g'], 'g': ['f', 'h'],
      'h': ['g', 'j'], 'j': ['h', 'k'], 'k': ['j', 'l'], 'l': ['k'],
      'z': ['x'], 'x': ['z', 'c'], 'c': ['x', 'v'], 'v': ['c', 'b'], 'b': ['v', 'n'],
      'n': ['b', 'm'], 'm': ['n']
    };

    for (let i = 0; i < baseDomain.length; i++) {
      const currentChar = baseDomain[i];
      if (qwertyMap[currentChar]) {
        qwertyMap[currentChar].forEach(newChar => {
          const substituted = baseDomain.slice(0, i) + newChar + baseDomain.slice(i + 1);
          if (substituted !== baseDomain) {
            variations.push({ 
              domain: substituted, 
              type: 'Adjacent Key',
              risk: 'medium'
            });
          }
        });
      }
    }

    // Remove duplicates and limit results
    const uniqueVariations = variations
      .filter((v, index, self) => index === self.findIndex(t => t.domain === v.domain))
      .slice(0, 50);

    return uniqueVariations;
  };

  const checkDomainRegistration = async (variations) => {
    const batchSize = 10;
    const checkedVariations = [];

    for (let i = 0; i < variations.length; i += batchSize) {
      const batch = variations.slice(i, i + batchSize);
      const batchPromises = batch.map(async (variation) => {
        try {
          const response = await fetch(`/api/lookup?query=${encodeURIComponent(variation.domain)}&type=domain`);
          const data = await safeJsonParse(response);
          
          return {
            ...variation,
            registered: response.ok && data.handle,
            registrationDate: data.events?.find(e => e.eventAction === 'registration')?.eventDate,
            status: response.ok ? 'registered' : 'available'
          };
        } catch {
          return {
            ...variation,
            registered: false,
            status: 'unknown'
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      checkedVariations.push(...batchResults);
    }

    return checkedVariations;
  };

  const analyzeTyposquatting = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const cleanDomain = domain.trim().toLowerCase();
      
      // Generate variations
      const variations = generateTyposquatVariations(cleanDomain);
      
      // Check registration status
      const checkedVariations = await checkDomainRegistration(variations);
      
      // Categorize results
      const registered = checkedVariations.filter(v => v.registered);
      const suspicious = registered.filter(v => {
        const regDate = v.registrationDate ? new Date(v.registrationDate) : null;
        const isRecent = regDate && (new Date() - regDate) < (90 * 24 * 60 * 60 * 1000); // 90 days
        return isRecent || v.risk === 'high';
      });

      setResults({
        originalDomain: cleanDomain,
        totalVariations: variations.length,
        registeredCount: registered.length,
        suspiciousCount: suspicious.length,
        variations: checkedVariations,
        registered,
        suspicious
      });
    } catch (err) {
      setError(err.message || 'Failed to analyze domain variations');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getRiskBadge = (risk) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[risk]}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Typosquatting Detection</h2>
                <p className="text-gray-600">Generate and analyze domain variations</p>
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
          <form onSubmit={analyzeTyposquatting} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain name (e.g., google.com)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !domain.trim()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {loading ? 'Analyzing...' : 'Detect Variations'}
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Total Variations</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{results.totalVariations}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Registered</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{results.registeredCount}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-gray-900">Suspicious</h3>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{results.suspiciousCount}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Risk Score</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {results.suspiciousCount > 5 ? 'High' : results.suspiciousCount > 2 ? 'Medium' : 'Low'}
                  </p>
                </div>
              </div>

              {/* Suspicious Domains */}
              {results.suspicious.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Suspicious Registered Domains ({results.suspicious.length})
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {results.suspicious.map((variation, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded p-3 border border-red-200">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm">{variation.domain}</span>
                          <span className={getRiskBadge(variation.risk)}>{variation.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(variation.domain)}
                            className="text-gray-500 hover:text-gray-700"
                            title="Copy domain"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <a
                            href={`https://${variation.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700"
                            title="Visit domain"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Registered Domains */}
              {results.registered.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    All Registered Variations ({results.registered.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {results.registered.map((variation, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded p-2 border border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{variation.domain}</span>
                          <span className={getRiskBadge(variation.risk)}>{variation.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => copyToClipboard(variation.domain)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy domain"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Variations Sample */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-green-900 mb-3">
                  Available Variations (Sample)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {results.variations
                    .filter(v => !v.registered)
                    .slice(0, 12)
                    .map((variation, index) => (
                      <div key={index} className="bg-white rounded p-2 border border-green-200">
                        <span className="font-mono text-sm text-gray-700">{variation.domain}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}