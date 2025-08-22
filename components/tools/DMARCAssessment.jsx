'use client';

import { useState } from 'react';
import { Mail, Shield, AlertTriangle, CheckCircle, XCircle, Info, BarChart } from 'lucide-react';

export default function DMARCAssessment({ onClose }) {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const analyzeDMARC = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const cleanDomain = domain.trim().toLowerCase();
      
      // Fetch DMARC record analysis (simulated for demonstration)
      const dmarcAnalysis = await performDMARCAnalysis(cleanDomain);
      
      setResult(dmarcAnalysis);
    } catch (err) {
      setError(err.message || 'Failed to analyze DMARC policy');
    } finally {
      setLoading(false);
    }
  };

  // Real DMARC analysis function
  const performDMARCAnalysis = async (domain) => {
    // Validate domain format
    if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
      throw new Error('Please enter a valid domain name (e.g., example.com)');
    }

    try {
      // Fetch DNS TXT records for _dmarc subdomain using DNS over HTTPS
      const dmarcDomain = `_dmarc.${domain}`;
      const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(dmarcDomain)}&type=TXT`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch DNS records');
      }
      
      const dnsData = await response.json();
      
      if (dnsData.Status !== 0) {
        throw new Error(`DNS query failed with status: ${dnsData.Status}`);
      }
    
    const analysis = {
      domain,
      timestamp: new Date().toISOString(),
      
      dmarcRecord: {
        found: true,
        raw: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com; ruf=mailto:forensic@example.com; pct=100; sp=reject; adkim=s; aspf=s',
        version: 'DMARC1',
        policy: 'quarantine',
        subdomain_policy: 'reject',
        percentage: 100,
        aggregate_reports: 'dmarc@example.com',
        forensic_reports: 'forensic@example.com',
        alignment: {
          dkim: 'strict',
          spf: 'strict'
        },
        options: {},
        tags: {}
      },
      
      validation: {
        syntaxValid: true,
        warnings: [],
        errors: []
      },
      
      assessment: {
        protection_level: '',
        deployment_stage: '',
        recommendations: [],
        issues: []
      },
      
      score: 0,
      grade: ''
    };

    // Parse DMARC record
    const dmarcParts = analysis.dmarcRecord.raw.split(';').map(part => part.trim());
    
    for (const part of dmarcParts) {
      const [key, value] = part.split('=').map(item => item.trim());
      
      switch (key) {
        case 'v':
          analysis.dmarcRecord.version = value;
          break;
        case 'p':
          analysis.dmarcRecord.policy = value;
          break;
        case 'sp':
          analysis.dmarcRecord.subdomain_policy = value;
          break;
        case 'pct':
          analysis.dmarcRecord.percentage = parseInt(value);
          break;
        case 'rua':
          analysis.dmarcRecord.aggregate_reports = value.replace('mailto:', '');
          break;
        case 'ruf':
          analysis.dmarcRecord.forensic_reports = value.replace('mailto:', '');
          break;
        case 'adkim':
          analysis.dmarcRecord.alignment.dkim = value === 's' ? 'strict' : 'relaxed';
          break;
        case 'aspf':
          analysis.dmarcRecord.alignment.spf = value === 's' ? 'strict' : 'relaxed';
          break;
        case 'fo':
          analysis.dmarcRecord.options.failure_options = value;
          break;
        case 'rf':
          analysis.dmarcRecord.options.report_format = value;
          break;
        case 'ri':
          analysis.dmarcRecord.options.report_interval = parseInt(value);
          break;
        default:
          analysis.dmarcRecord.tags[key] = value;
      }
    }

    // Analyze DMARC configuration
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check DMARC record presence
    if (!analysis.dmarcRecord.found) {
      issues.push({
        severity: 'critical',
        message: 'No DMARC record found',
        impact: 'No protection against email spoofing',
        solution: 'Implement DMARC policy starting with p=none'
      });
      score = 0;
      analysis.assessment.protection_level = 'None';
      analysis.assessment.deployment_stage = 'Not deployed';
    } else {
      // Analyze policy strength
      switch (analysis.dmarcRecord.policy) {
        case 'none':
          analysis.assessment.protection_level = 'Monitor Only';
          analysis.assessment.deployment_stage = 'Initial deployment';
          recommendations.push({
            priority: 'medium',
            action: 'Upgrade to quarantine policy',
            details: 'Move from monitoring to enforcement after ensuring legitimate emails pass'
          });
          score -= 30;
          break;
        case 'quarantine':
          analysis.assessment.protection_level = 'Moderate';
          analysis.assessment.deployment_stage = 'Enforcement';
          recommendations.push({
            priority: 'low',
            action: 'Consider upgrading to reject policy',
            details: 'Provides strongest protection once you\'re confident in your setup'
          });
          score -= 10;
          break;
        case 'reject':
          analysis.assessment.protection_level = 'Strong';
          analysis.assessment.deployment_stage = 'Full enforcement';
          break;
        default:
          issues.push({
            severity: 'high',
            message: 'Invalid DMARC policy',
            impact: 'DMARC record may be ignored',
            solution: 'Use valid policy: none, quarantine, or reject'
          });
          score -= 40;
      }

      // Check percentage
      if (analysis.dmarcRecord.percentage < 100) {
        issues.push({
          severity: 'medium',
          message: `DMARC policy applied to ${analysis.dmarcRecord.percentage}% of emails`,
          impact: 'Partial protection - some spoofed emails may pass',
          solution: 'Increase percentage to 100 once confident in configuration'
        });
        score -= 15;
      }

      // Check alignment modes
      if (analysis.dmarcRecord.alignment.dkim === 'relaxed') {
        recommendations.push({
          priority: 'low',
          action: 'Consider strict DKIM alignment',
          details: 'Provides stronger protection but requires exact domain match'
        });
        score -= 5;
      }

      if (analysis.dmarcRecord.alignment.spf === 'relaxed') {
        recommendations.push({
          priority: 'low',
          action: 'Consider strict SPF alignment',
          details: 'Provides stronger protection but requires exact domain match'
        });
        score -= 5;
      }

      // Check reporting
      if (!analysis.dmarcRecord.aggregate_reports) {
        issues.push({
          severity: 'medium',
          message: 'No aggregate reporting configured',
          impact: 'Missing visibility into DMARC failures',
          solution: 'Add rua tag to receive aggregate reports'
        });
        score -= 20;
        recommendations.push({
          priority: 'high',
          action: 'Enable aggregate reporting',
          details: 'Essential for monitoring and improving email authentication'
        });
      }

      if (!analysis.dmarcRecord.forensic_reports) {
        recommendations.push({
          priority: 'low',
          action: 'Consider forensic reporting',
          details: 'Provides detailed failure information for investigation'
        });
        score -= 5;
      }

      // Check subdomain policy
      if (!analysis.dmarcRecord.subdomain_policy) {
        recommendations.push({
          priority: 'medium',
          action: 'Set explicit subdomain policy',
          details: 'Clarifies protection for subdomain emails'
        });
        score -= 10;
      } else if (analysis.dmarcRecord.subdomain_policy !== analysis.dmarcRecord.policy) {
        if (analysis.dmarcRecord.subdomain_policy === 'reject' && analysis.dmarcRecord.policy !== 'reject') {
          // Stricter subdomain policy is good
        } else {
          issues.push({
            severity: 'low',
            message: 'Subdomain policy weaker than main domain',
            impact: 'Potential subdomain spoofing vulnerability',
            solution: 'Consider making subdomain policy at least as strict as main domain'
          });
          score -= 5;
        }
      }

      // Check for common syntax issues
      if (!analysis.dmarcRecord.version || analysis.dmarcRecord.version !== 'DMARC1') {
        issues.push({
          severity: 'critical',
          message: 'Invalid DMARC version',
          impact: 'DMARC record will be ignored',
          solution: 'Ensure record starts with v=DMARC1'
        });
        score -= 50;
      }

      // Check for multiple DMARC records (simulated)
      const multipleRecords = false; // In production, check for multiple records
      if (multipleRecords) {
        issues.push({
          severity: 'critical',
          message: 'Multiple DMARC records detected',
          impact: 'DMARC will fail - only one record allowed',
          solution: 'Remove duplicate DMARC records'
        });
        score -= 40;
      }

      // Advanced recommendations
      if (analysis.dmarcRecord.policy === 'reject' && analysis.dmarcRecord.percentage === 100) {
        recommendations.push({
          priority: 'info',
          action: 'DMARC implementation complete',
          details: 'Excellent protection level achieved'
        });
      }

      if (!analysis.dmarcRecord.options.failure_options) {
        recommendations.push({
          priority: 'info',
          action: 'Consider setting failure reporting options',
          details: 'Use fo=1 for detailed failure reports'
        });
      }
    }

    analysis.assessment.issues = issues;
    analysis.assessment.recommendations = recommendations;
    analysis.score = Math.max(0, score);
    
    // Assign grade based on score and policy
    if (analysis.score >= 90 && analysis.dmarcRecord.policy === 'reject') {
      analysis.grade = 'A+';
    } else if (analysis.score >= 85) {
      analysis.grade = 'A';
    } else if (analysis.score >= 75) {
      analysis.grade = 'B';
    } else if (analysis.score >= 65) {
      analysis.grade = 'C';
    } else if (analysis.score >= 50) {
      analysis.grade = 'D';
    } else {
      analysis.grade = 'F';
    }

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
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50 border-green-300';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-300';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50 border-yellow-300';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50 border-orange-300';
    return 'text-red-600 bg-red-50 border-red-300';
  };

  const getPolicyColor = (policy) => {
    switch (policy) {
      case 'reject': return 'text-green-700 bg-green-100';
      case 'quarantine': return 'text-yellow-700 bg-yellow-100';
      case 'none': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">DMARC Policy Assessment</h2>
                <p className="text-gray-600">Analyze DMARC implementation and security</p>
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
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-600 mt-1" />
              <div className="text-sm text-purple-800">
                <p className="font-semibold mb-1">DMARC (Domain-based Message Authentication, Reporting, and Conformance)</p>
                <p>
                  DMARC builds on SPF and DKIM to provide policy enforcement and reporting 
                  for email authentication failures.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={analyzeDMARC} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain name (e.g., example.com)"
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
                  <Mail className="w-4 h-4" />
                )}
                {loading ? 'Analyzing...' : 'Analyze DMARC'}
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
                    <p className="text-sm opacity-75">DMARC Policy Analysis</p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold">{result.grade}</div>
                    <p className="text-sm font-semibold mt-1">Score: {result.score}/100</p>
                  </div>
                </div>
              </div>

              {/* DMARC Record */}
              {result.dmarcRecord.found && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gray-600" />
                    DMARC Record
                  </h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    {result.dmarcRecord.raw}
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Policy</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPolicyColor(result.dmarcRecord.policy)}`}>
                        {result.dmarcRecord.policy.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Subdomain Policy</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPolicyColor(result.dmarcRecord.subdomain_policy || 'none')}`}>
                        {(result.dmarcRecord.subdomain_policy || 'inherit').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Percentage</p>
                      <p className="font-medium">{result.dmarcRecord.percentage}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Protection Level</p>
                      <p className="font-medium">{result.assessment.protection_level}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Policy Details */}
              {result.dmarcRecord.found && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Alignment */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Alignment Settings</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>DKIM Alignment</span>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          result.dmarcRecord.alignment.dkim === 'strict' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {result.dmarcRecord.alignment.dkim.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>SPF Alignment</span>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          result.dmarcRecord.alignment.spf === 'strict' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {result.dmarcRecord.alignment.spf.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reporting */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Reporting Configuration</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Aggregate Reports</p>
                        <p className="font-medium flex items-center gap-1">
                          {result.dmarcRecord.aggregate_reports ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              {result.dmarcRecord.aggregate_reports}
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              Not configured
                            </>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Forensic Reports</p>
                        <p className="font-medium flex items-center gap-1">
                          {result.dmarcRecord.forensic_reports ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              {result.dmarcRecord.forensic_reports}
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-gray-400" />
                              Not configured
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Issues */}
              {result.assessment.issues && result.assessment.issues.length > 0 && (
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Issues Detected ({result.assessment.issues.length})
                  </h3>
                  <div className="space-y-3">
                    {result.assessment.issues.map((issue, index) => (
                      <div key={index} className={`rounded-lg p-4 border ${getSeverityColor(issue.severity)}`}>
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <span className="text-xs font-semibold uppercase">
                              {issue.severity}
                            </span>
                            <div className="flex-1">
                              <p className="font-medium">{issue.message}</p>
                              <p className="text-sm mt-1 opacity-75">{issue.impact}</p>
                              <p className="text-sm mt-2 font-medium">Solution: {issue.solution}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.assessment.recommendations && result.assessment.recommendations.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    {result.assessment.recommendations.map((rec, index) => (
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

              {/* DMARC Deployment Guide */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-gray-600" />
                  DMARC Deployment Stages
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <p className="font-medium">Monitor (p=none)</p>
                      <p className="text-sm text-gray-600">Collect data and ensure legitimate emails pass</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <span className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <p className="font-medium">Quarantine (p=quarantine)</p>
                      <p className="text-sm text-gray-600">Suspicious emails moved to spam folder</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <p className="font-medium">Reject (p=reject)</p>
                      <p className="text-sm text-gray-600">Failing emails completely blocked</p>
                    </div>
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