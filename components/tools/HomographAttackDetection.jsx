'use client';

import { useState } from 'react';
import { Eye, AlertTriangle, Shield, Globe, Copy, ExternalLink, Info } from 'lucide-react';
import { validateDomain, generateHomographVariations, fetchRDAPData, rdapRateLimiter, safeJsonParse } from '../../utils/security-tools';
import { ToolError, LoadingSpinner } from './ErrorBoundary';

export default function HomographAttackDetection({ onClose }) {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // Unicode characters that look similar to ASCII characters
  const homographMappings = {
    'a': ['а', 'ɑ', 'α', 'ａ', '𝐚', '𝑎', '𝒂', '𝓪', '𝔞', '𝕒', '𝖆', '𝗮', '𝘢', '𝙖'],
    'e': ['е', 'ℯ', 'ⅇ', 'ｅ', '𝐞', '𝑒', '𝒆', '𝓮', '𝔢', '𝕖', '𝖊', '𝗲', '𝘦', '𝙚'],
    'o': ['о', 'ο', '℮', 'ｏ', '𝐨', '𝑜', '𝒐', '𝓸', '𝔬', '𝕠', '𝖔', '𝗼', '𝘰', '𝙤'],
    'p': ['р', 'ρ', 'ｐ', '𝐩', '𝑝', '𝒑', '𝓹', '𝔭', '𝕡', '𝖕', '𝗽', '𝘱', '𝙥'],
    'c': ['с', 'ϲ', 'ｃ', '𝐜', '𝑐', '𝒄', '𝓬', '𝔠', '𝕔', '𝖈', '𝗰', '𝘤', '𝙘'],
    'x': ['х', 'χ', '×', 'ｘ', '𝐱', '𝑥', '𝒙', '𝔁', '𝔵', '𝕩', '𝖝', '𝗑', '𝘅', '𝘹', '𝙭'],
    'y': ['у', 'γ', 'ｙ', '𝐲', '𝑦', '𝒚', '𝔂', '𝔶', '𝕪', '𝖞', '𝗒', '𝘆', '𝘺', '𝙮'],
    'i': ['і', 'ι', 'ι', 'ｉ', '𝐢', '𝑖', '𝒊', '𝔦', '𝕚', '𝖎', '𝗂', '𝘪', '𝙞'],
    'j': ['ј', '𝐣', '𝑗', '𝒋', '𝔧', '𝕛', '𝖏', '𝗃', '𝘫', '𝙟'],
    'l': ['ӏ', 'l', 'ɩ', 'ｌ', '𝐥', '𝑙', '𝒍', '𝓵', '𝔩', '𝕝', '𝖑', '𝗅', '𝘭', '𝙡'],
    'd': ['ｄ', '𝐝', '𝑑', '𝒅', '𝓭', '𝔡', '𝕕', '𝖉', '𝗗', '𝘥', '𝙙'],
    'g': ['ℊ', 'ｇ', '𝐠', '𝑔', '𝒈', '𝓰', '𝔤', '𝕘', '𝖌', '𝗀', '𝘨', '𝙜'],
    'h': ['һ', 'ℎ', 'ｈ', '𝐡', '𝒉', '𝓱', '𝔥', '𝕙', '𝖍', '𝗁', '𝘩', '𝙝'],
    'k': ['κ', 'к', 'ｋ', '𝐤', '𝑘', '𝒌', '𝓴', '𝔨', '𝕜', '𝖐', '𝗄', '𝘬', '𝙠'],
    'm': ['м', 'ｍ', '𝐦', '𝑚', '𝒎', '𝓶', '𝔪', '𝕞', '𝖒', '𝗆', '𝘮', '𝙢'],
    'n': ['п', 'ｎ', '𝐧', '𝑛', '𝒏', '𝓷', '𝔫', '𝕟', '𝖓', '𝗇', '𝘯', '𝙣'],
    'r': ['г', 'ｒ', '𝐫', '𝑟', '𝒓', '𝓻', '𝔯', '𝕣', '𝖗', '𝗋', '𝘳', '𝙧'],
    's': ['ѕ', '𝐬', '𝑠', '𝒔', '𝓼', '𝔰', '𝕤', '𝖘', '𝗌', '𝘴', '𝙨'],
    't': ['т', '𝐭', '𝑡', '𝒕', '𝓽', '𝔱', '𝕥', '𝖙', '𝗍', '𝘵', '𝙩'],
    'u': ['υ', 'ｕ', '𝐮', '𝑢', '𝒖', '𝓾', '𝔲', '𝕦', '𝖚', '𝗎', '𝘶', '𝙪'],
    'v': ['ν', 'ｖ', '𝐯', '𝑣', '𝒗', '𝓿', '𝔳', '𝕧', '𝖛', '𝗏', '𝘷', '𝙫'],
    'w': ['ԝ', 'ｗ', '𝐰', '𝑤', '𝒘', '𝔀', '𝔴', '𝕨', '𝖜', '𝗐', '𝘸', '𝙬'],
    'z': ['ｚ', '𝐳', '𝑧', '𝒛', '𝓏', '𝔷', '𝕫', '𝖟', '𝗓', '𝘻', '𝙯']
  };

  const generateHomographVariations = (domain) => {
    const variations = [];
    const domainParts = domain.split('.');
    const domainName = domainParts[0];
    const tld = domainParts.slice(1).join('.');

    // Generate variations by replacing ASCII characters with similar Unicode characters
    const generateCombinations = (str, index = 0, current = '') => {
      if (index === str.length) {
        if (current !== str && current.length > 0) {
          const fullDomain = current + (tld ? '.' + tld : '');
          variations.push({
            domain: fullDomain,
            original: domain,
            type: 'Unicode Homograph',
            risk: 'high',
            changes: getChanges(str, current)
          });
        }
        return;
      }

      const char = str[index];
      const lowerChar = char.toLowerCase();
      
      // Add original character
      generateCombinations(str, index + 1, current + char);
      
      // Add homograph variations
      if (homographMappings[lowerChar] && variations.length < 100) {
        homographMappings[lowerChar].slice(0, 3).forEach(homograph => {
          const newChar = char === char.toUpperCase() ? homograph.toUpperCase() : homograph;
          generateCombinations(str, index + 1, current + newChar);
        });
      }
    };

    generateCombinations(domainName);
    
    return variations.slice(0, 50); // Limit to 50 variations
  };

  const getChanges = (original, variation) => {
    const changes = [];
    for (let i = 0; i < Math.min(original.length, variation.length); i++) {
      if (original[i] !== variation[i]) {
        changes.push({
          position: i,
          original: original[i],
          replacement: variation[i]
        });
      }
    }
    return changes;
  };

  const detectHomographs = (text) => {
    const suspicious = [];
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      // Check if character is potentially suspicious
      const charCode = char.charCodeAt(0);
      if (charCode > 127) { // Non-ASCII
        // Check if it looks similar to ASCII characters
        for (const [ascii, homographs] of Object.entries(homographMappings)) {
          if (homographs.includes(char)) {
            suspicious.push({
              position: i,
              character: char,
              looksSimilarTo: ascii,
              charCode: charCode.toString(16)
            });
          }
        }
      }
    }
    return suspicious;
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

  const analyzeHomographs = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const cleanDomain = domain.trim().toLowerCase();
      
      // Check if input domain has homograph characters
      const inputSuspiciousChars = detectHomographs(cleanDomain);
      
      // Generate homograph variations
      const variations = generateHomographVariations(cleanDomain);
      
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
        inputSuspiciousChars,
        totalVariations: variations.length,
        registeredCount: registered.length,
        suspiciousCount: suspicious.length,
        variations: checkedVariations,
        registered,
        suspicious
      });
    } catch (err) {
      setError(err.message || 'Failed to analyze homograph variations');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Homograph Attack Detection</h2>
                <p className="text-gray-600">Detect domains using similar-looking Unicode characters</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Info Box */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-1" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">What are Homograph Attacks?</p>
                <p>
                  Homograph attacks use Unicode characters that look similar to ASCII characters to create 
                  deceptive domain names. For example, "а" (Cyrillic) looks identical to "a" (Latin) but has 
                  a different Unicode value.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={analyzeHomographs} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain name (e.g., paypal.com)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !domain.trim()}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {loading ? 'Analyzing...' : 'Detect Homographs'}
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
              {/* Input Analysis */}
              {results.inputSuspiciousChars.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    ⚠️ Suspicious Characters Detected in Input
                  </h3>
                  <div className="space-y-2">
                    {results.inputSuspiciousChars.map((char, index) => (
                      <div key={index} className="bg-white rounded p-3 border border-red-200">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-lg bg-gray-100 px-2 py-1 rounded">
                            {char.character}
                          </span>
                          <div className="text-sm">
                            <p><strong>Position:</strong> {char.position}</p>
                            <p><strong>Looks similar to:</strong> <span className="font-mono">{char.looksSimilarTo}</span></p>
                            <p><strong>Unicode:</strong> U+{char.charCode.toUpperCase()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Variations Generated</h3>
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
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-gray-900">Risk Level</h3>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {results.suspiciousCount > 3 ? 'High' : results.suspiciousCount > 1 ? 'Medium' : 'Low'}
                  </p>
                </div>
              </div>

              {/* Suspicious Domains */}
              {results.suspicious.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Suspicious Registered Homographs ({results.suspicious.length})
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {results.suspicious.map((variation, index) => (
                      <div key={index} className="bg-white rounded p-3 border border-red-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {variation.domain}
                            </span>
                            <div className="text-xs text-gray-600">
                              {variation.changes.map((change, i) => (
                                <span key={i} className="bg-yellow-100 px-1 rounded mr-1">
                                  {change.original}→{change.replacement}
                                </span>
                              ))}
                            </div>
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
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Registered Variations */}
              {results.registered.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    All Registered Homograph Variations ({results.registered.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                    {results.registered.map((variation, index) => (
                      <div key={index} className="bg-white rounded p-3 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm">{variation.domain}</span>
                            <div className="text-xs text-gray-500">
                              {variation.changes.map((change, i) => (
                                <span key={i} className="bg-gray-100 px-1 rounded mr-1">
                                  {change.original}→{change.replacement}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(variation.domain)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy domain"
                          >
                            <Copy className="w-4 h-4" />
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
                  Available Homograph Variations (Sample)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {results.variations
                    .filter(v => !v.registered)
                    .slice(0, 10)
                    .map((variation, index) => (
                      <div key={index} className="bg-white rounded p-2 border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm text-gray-700">{variation.domain}</span>
                          <div className="text-xs text-gray-500">
                            {variation.changes.slice(0, 2).map((change, i) => (
                              <span key={i} className="bg-gray-100 px-1 rounded mr-1">
                                {change.original}→{change.replacement}
                              </span>
                            ))}
                          </div>
                        </div>
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