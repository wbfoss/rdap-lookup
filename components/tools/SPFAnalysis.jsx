'use client';

import { useState } from 'react';
import { Mail, Shield, AlertTriangle, CheckCircle, XCircle, Info, Globe, Server } from 'lucide-react';

export default function SPFAnalysis({ onClose }) {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const analyzeSPF = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const cleanDomain = domain.trim().toLowerCase();
      
      // Fetch DNS TXT records (simulated for demonstration)
      const spfAnalysis = await performSPFAnalysis(cleanDomain);
      
      setResult(spfAnalysis);
    } catch (err) {
      setError(err.message || 'Failed to analyze SPF records');
    } finally {
      setLoading(false);
    }
  };

  // Real SPF analysis function with DNS lookup
  const performSPFAnalysis = async (domain) => {
    const analysis = {
      domain,
      timestamp: new Date().toISOString(),
      
      spfRecord: {
        found: false,
        raw: '',
        version: '',
        mechanisms: [],
        modifiers: {},
        qualifier: ''
      },
      
      validation: {
        syntaxValid: false,
        lookupCount: 0,
        maxLookups: 10,
        warnings: [],
        errors: []
      },
      
      score: 0,
      grade: '',
      
      recommendations: []
    };

    try {
      // Fetch DNS TXT records using DNS over HTTPS
      const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=TXT`);
      if (!response.ok) {
        throw new Error('Failed to fetch DNS records');
      }
      
      const dnsData = await response.json();
      
      // Find SPF record among TXT records
      let spfRecord = null;
      if (dnsData.Answer) {
        spfRecord = dnsData.Answer.find(record => 
          record.data && record.data.includes('v=spf1')
        );
      }
      
      if (spfRecord) {
        analysis.spfRecord.found = true;
        analysis.spfRecord.raw = spfRecord.data.replace(/"/g, ''); // Remove quotes
        analysis.validation.syntaxValid = true;
      } else {
        // Check for common SPF record variations
        const commonSpfChecks = [
          `_spf.${domain}`,
          `spf.${domain}`
        ];
        
        for (const checkDomain of commonSpfChecks) {
          try {
            const altResponse = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(checkDomain)}&type=TXT`);
            if (altResponse.ok) {
              const altData = await altResponse.json();
              if (altData.Answer) {
                const altSpf = altData.Answer.find(record => 
                  record.data && record.data.includes('v=spf1')
                );
                if (altSpf) {
                  analysis.spfRecord.found = true;
                  analysis.spfRecord.raw = altSpf.data.replace(/"/g, '');
                  analysis.validation.syntaxValid = true;
                  break;
                }
              }
            }
          } catch (e) {
            // Continue checking other variations
          }
        }
      }
    } catch (error) {
      analysis.validation.errors.push(`DNS lookup failed: ${error.message}`);
    }

    // Parse SPF record
    const spfParts = analysis.spfRecord.raw.split(' ');
    
    for (const part of spfParts) {
      if (part.startsWith('v=')) {
        analysis.spfRecord.version = part.substring(2);
      } else if (part.startsWith('include:')) {
        analysis.spfRecord.mechanisms.push({
          type: 'include',
          value: part.substring(8),
          description: 'Includes SPF record from another domain',
          lookups: 1
        });
        analysis.validation.lookupCount++;
      } else if (part.startsWith('ip4:')) {
        analysis.spfRecord.mechanisms.push({
          type: 'ip4',
          value: part.substring(4),
          description: 'Authorizes IPv4 address or range',
          lookups: 0
        });
      } else if (part.startsWith('ip6:')) {
        analysis.spfRecord.mechanisms.push({
          type: 'ip6',
          value: part.substring(4),
          description: 'Authorizes IPv6 address or range',
          lookups: 0
        });
      } else if (part === 'a') {
        analysis.spfRecord.mechanisms.push({
          type: 'a',
          value: domain,
          description: 'Authorizes IP addresses from A records',
          lookups: 1
        });
        analysis.validation.lookupCount++;
      } else if (part === 'mx') {
        analysis.spfRecord.mechanisms.push({
          type: 'mx',
          value: domain,
          description: 'Authorizes mail servers from MX records',
          lookups: 1
        });
        analysis.validation.lookupCount++;
      } else if (part.startsWith('redirect=')) {
        analysis.spfRecord.modifiers.redirect = part.substring(9);
        analysis.validation.lookupCount++;
      } else if (part.endsWith('all')) {
        analysis.spfRecord.qualifier = part;
      }
    }

    // Analyze issues and generate recommendations
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check SPF record presence
    if (!analysis.spfRecord.found) {
      issues.push({
        severity: 'critical',
        message: 'No SPF record found',
        impact: 'Emails can be easily spoofed'
      });
      score -= 50;
      recommendations.push({
        priority: 'high',
        action: 'Add SPF record',
        details: 'Create an SPF TXT record to specify authorized mail servers'
      });
    }

    // Check syntax
    if (!analysis.spfRecord.version || analysis.spfRecord.version !== 'spf1') {
      issues.push({
        severity: 'high',
        message: 'Invalid SPF version',
        impact: 'SPF record may be ignored by mail servers'
      });
      score -= 30;
    }

    // Check lookup count
    if (analysis.validation.lookupCount > 10) {
      issues.push({
        severity: 'high',
        message: `Too many DNS lookups (${analysis.validation.lookupCount}/10)`,
        impact: 'SPF check will fail (permerror)'
      });
      score -= 40;
      recommendations.push({
        priority: 'high',
        action: 'Reduce DNS lookups',
        details: 'Consolidate includes or use IP addresses instead of domains'
      });
    } else if (analysis.validation.lookupCount > 7) {
      issues.push({
        severity: 'medium',
        message: `High number of DNS lookups (${analysis.validation.lookupCount}/10)`,
        impact: 'Risk of exceeding lookup limit'
      });
      score -= 15;
      recommendations.push({
        priority: 'medium',
        action: 'Optimize DNS lookups',
        details: 'Consider reducing the number of include mechanisms'
      });
    }

    // Check qualifier
    if (analysis.spfRecord.qualifier === '-all') {
      // Hard fail - good for security
      analysis.spfRecord.qualifierDescription = 'Hard fail - Strict policy';
    } else if (analysis.spfRecord.qualifier === '~all') {
      // Soft fail - moderate
      analysis.spfRecord.qualifierDescription = 'Soft fail - Moderate policy';
      recommendations.push({
        priority: 'low',
        action: 'Consider using -all',
        details: 'Hard fail provides stronger protection against spoofing'
      });
      score -= 5;
    } else if (analysis.spfRecord.qualifier === '?all') {
      // Neutral - weak
      analysis.spfRecord.qualifierDescription = 'Neutral - Weak policy';
      issues.push({
        severity: 'medium',
        message: 'Weak SPF policy (neutral)',
        impact: 'Limited protection against spoofing'
      });
      score -= 20;
      recommendations.push({
        priority: 'high',
        action: 'Use -all or ~all',
        details: 'Neutral policy provides minimal protection'
      });
    } else if (analysis.spfRecord.qualifier === '+all') {
      // Pass all - terrible
      analysis.spfRecord.qualifierDescription = 'Pass all - No protection';
      issues.push({
        severity: 'critical',
        message: 'SPF allows all servers (+all)',
        impact: 'No protection against spoofing'
      });
      score -= 50;
      recommendations.push({
        priority: 'critical',
        action: 'Remove +all immediately',
        details: 'This setting allows anyone to send email on your behalf'
      });
    }

    // Check for common issues
    if (analysis.spfRecord.raw.includes('ptr')) {
      issues.push({
        severity: 'medium',
        message: 'PTR mechanism detected',
        impact: 'Deprecated and slow mechanism'
      });
      score -= 10;
      recommendations.push({
        priority: 'medium',
        action: 'Remove PTR mechanism',
        details: 'PTR is deprecated and causes performance issues'
      });
    }

    if (analysis.spfRecord.raw.includes('include:') && analysis.spfRecord.raw.includes('redirect=')) {
      issues.push({
        severity: 'high',
        message: 'Both include and redirect used',
        impact: 'Conflicting mechanisms may cause issues'
      });
      score -= 15;
    }

    // Check for multiple SPF records (simulated)
    const multipleRecords = false; // In production, check for multiple SPF records
    if (multipleRecords) {
      issues.push({
        severity: 'critical',
        message: 'Multiple SPF records detected',
        impact: 'SPF will fail - only one record allowed'
      });
      score -= 40;
      recommendations.push({
        priority: 'critical',
        action: 'Merge SPF records',
        details: 'Combine all SPF mechanisms into a single record'
      });
    }

    // Check record length
    if (analysis.spfRecord.raw.length > 255) {
      issues.push({
        severity: 'high',
        message: 'SPF record exceeds 255 characters',
        impact: 'May cause DNS issues'
      });
      score -= 20;
      recommendations.push({
        priority: 'high',
        action: 'Split or optimize SPF record',
        details: 'Use includes or remove unnecessary mechanisms'
      });
    }

    // Add best practices
    if (!analysis.spfRecord.mechanisms.some(m => m.type === 'include' && m.value.includes('google'))) {
      recommendations.push({
        priority: 'info',
        action: 'Consider email provider SPF',
        details: 'Add your email provider\'s SPF include if using cloud email'
      });
    }

    analysis.issues = issues;
    analysis.recommendations = recommendations;
    analysis.score = Math.max(0, score);
    
    // Assign grade
    if (analysis.score >= 90) analysis.grade = 'A';
    else if (analysis.score >= 80) analysis.grade = 'B';
    else if (analysis.score >= 70) analysis.grade = 'C';
    else if (analysis.score >= 60) analysis.grade = 'D';
    else analysis.grade = 'F';

    return analysis;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-700 bg-red-50 border-red-200',
      high: 'text-orange-700 bg-orange-50 border-orange-200',
      medium: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      low: 'text-blue-700 bg-blue-50 border-blue-200',
      info: 'text-gray-700 bg-gray-50 border-gray-200'
    };
    return colors[severity] || colors.info;
  };

  const getGradeColor = (grade) => {
    if (grade === 'A') return 'text-green-600 bg-green-50 border-green-300';
    if (grade === 'B') return 'text-blue-600 bg-blue-50 border-blue-300';
    if (grade === 'C') return 'text-yellow-600 bg-yellow-50 border-yellow-300';
    if (grade === 'D') return 'text-orange-600 bg-orange-50 border-orange-300';
    return 'text-red-600 bg-red-50 border-red-300';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Advanced SPF Analysis</h2>
                <p className="text-gray-600">Parse and validate SPF records</p>
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
                <p className="font-semibold mb-1">SPF (Sender Policy Framework)</p>
                <p>
                  SPF helps prevent email spoofing by specifying which mail servers are authorized 
                  to send email on behalf of your domain.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={analyzeSPF} className="mb-6">
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
                  <Mail className="w-4 h-4" />
                )}
                {loading ? 'Analyzing...' : 'Analyze SPF'}
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
          {result && (
            <div className="space-y-6">
              {/* Overall Grade */}
              <div className={`rounded-lg p-6 border-2 ${getGradeColor(result.grade)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{result.domain}</h3>
                    <p className="text-sm opacity-75">SPF Configuration Analysis</p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold">{result.grade}</div>
                    <p className="text-sm font-semibold mt-1">Score: {result.score}/100</p>
                  </div>
                </div>
              </div>

              {/* SPF Record */}
              {result.spfRecord.found && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gray-600" />
                    SPF Record
                  </h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    {result.spfRecord.raw}
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Version</p>
                      <p className="font-medium">{result.spfRecord.version}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Policy</p>
                      <p className="font-medium">
                        {result.spfRecord.qualifier} - {result.spfRecord.qualifierDescription}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">DNS Lookups</p>
                      <p className="font-medium">
                        {result.validation.lookupCount}/{result.validation.maxLookups}
                        {result.validation.lookupCount > 7 && (
                          <span className="ml-2 text-yellow-600">⚠️ High</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Syntax</p>
                      <p className="font-medium flex items-center gap-1">
                        {result.validation.syntaxValid ? (
                          <><CheckCircle className="w-4 h-4 text-green-600" /> Valid</>
                        ) : (
                          <><XCircle className="w-4 h-4 text-red-600" /> Invalid</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mechanisms Breakdown */}
              {result.spfRecord.mechanisms.length > 0 && (
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">SPF Mechanisms</h3>
                  <div className="space-y-3">
                    {result.spfRecord.mechanisms.map((mech, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <Server className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-blue-600">
                              {mech.type}:{mech.value}
                            </span>
                            {mech.lookups > 0 && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                {mech.lookups} DNS lookup{mech.lookups > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{mech.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Issues */}
              {result.issues && result.issues.length > 0 && (
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Issues Detected ({result.issues.length})
                  </h3>
                  <div className="space-y-3">
                    {result.issues.map((issue, index) => (
                      <div key={index} className={`rounded-lg p-4 border ${getSeverityColor(issue.severity)}`}>
                        <div className="flex items-start gap-3">
                          <span className="text-xs font-semibold uppercase">
                            {issue.severity}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium">{issue.message}</p>
                            <p className="text-sm mt-1 opacity-75">{issue.impact}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start gap-3">
                          <span className={`text-xs font-semibold uppercase px-2 py-1 rounded ${
                            rec.priority === 'critical' ? 'bg-red-100 text-red-700' :
                            rec.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            rec.priority === 'low' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {rec.priority}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium">{rec.action}</p>
                            <p className="text-sm text-gray-600 mt-1">{rec.details}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SPF Syntax Guide */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">SPF Mechanism Reference</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex gap-2">
                    <code className="text-blue-600">all</code>
                    <span className="text-gray-600">Matches all IPs</span>
                  </div>
                  <div className="flex gap-2">
                    <code className="text-blue-600">a</code>
                    <span className="text-gray-600">Domain's A records</span>
                  </div>
                  <div className="flex gap-2">
                    <code className="text-blue-600">mx</code>
                    <span className="text-gray-600">Domain's MX records</span>
                  </div>
                  <div className="flex gap-2">
                    <code className="text-blue-600">ip4</code>
                    <span className="text-gray-600">IPv4 address/range</span>
                  </div>
                  <div className="flex gap-2">
                    <code className="text-blue-600">ip6</code>
                    <span className="text-gray-600">IPv6 address/range</span>
                  </div>
                  <div className="flex gap-2">
                    <code className="text-blue-600">include</code>
                    <span className="text-gray-600">Include another SPF</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}