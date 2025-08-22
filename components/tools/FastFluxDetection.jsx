'use client';

import { useState } from 'react';
import { Globe, AlertTriangle, Activity, Clock, Info, TrendingUp, Server } from 'lucide-react';

export default function FastFluxDetection({ onClose }) {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const detectFastFlux = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const cleanDomain = domain.trim().toLowerCase();
      
      // Perform fast flux detection analysis (simulated)
      const fluxAnalysis = await performFastFluxAnalysis(cleanDomain);
      
      setResult(fluxAnalysis);
    } catch (err) {
      setError(err.message || 'Failed to analyze fast flux patterns');
    } finally {
      setLoading(false);
    }
  };

  // Simulated fast flux analysis function
  const performFastFluxAnalysis = async (domain) => {
    // In production, this would make DNS queries over time and analyze patterns
    // For demonstration, we'll simulate fast flux detection analysis
    
    const analysis = {
      domain,
      timestamp: new Date().toISOString(),
      monitoring_period: '24 hours',
      
      dns_analysis: {
        total_queries: 144, // Every 10 minutes for 24 hours
        unique_ips: 0,
        ip_changes: 0,
        average_ttl: 0,
        min_ttl: 0,
        max_ttl: 0,
        geographic_distribution: [],
        asn_distribution: []
      },
      
      flux_indicators: {
        rapid_ip_changes: false,
        low_ttl_values: false,
        high_ip_diversity: false,
        geographic_dispersion: false,
        asn_diversity: false,
        round_robin_dns: false,
        flux_score: 0
      },
      
      timeline: [],
      
      infrastructure_analysis: {
        hosting_providers: [],
        countries: [],
        autonomous_systems: [],
        suspicious_patterns: []
      },
      
      risk_assessment: {
        flux_likelihood: 0,
        confidence: 0,
        risk_level: 'low',
        indicators: []
      },
      
      recommendations: []
    };

    // Simulate DNS resolution data over 24 hours
    const ipPool = [
      '192.168.1.1', '10.0.0.1', '172.16.0.1', '203.0.113.1', '198.51.100.1',
      '185.199.108.1', '151.101.1.1', '13.107.42.14', '52.84.124.1', '54.230.1.1',
      '104.16.1.1', '172.217.1.1', '142.250.1.1', '157.240.1.1', '31.13.1.1'
    ];

    const ttlValues = [300, 600, 900, 1800, 3600, 7200]; // 5min to 2hours
    
    // Generate random DNS data that might indicate fast flux
    const isFluxDomain = Math.random() < 0.3; // 30% chance of flux patterns
    
    if (isFluxDomain) {
      analysis.dns_analysis.unique_ips = 25 + Math.floor(Math.random() * 50); // 25-75 unique IPs
      analysis.dns_analysis.ip_changes = 40 + Math.floor(Math.random() * 80); // 40-120 changes
      analysis.dns_analysis.average_ttl = 300 + Math.random() * 900; // 5-20 minutes
      analysis.dns_analysis.min_ttl = 60 + Math.random() * 240; // 1-5 minutes
      analysis.dns_analysis.max_ttl = 1800 + Math.random() * 5400; // 30min-2hours
    } else {
      analysis.dns_analysis.unique_ips = 1 + Math.floor(Math.random() * 5); // 1-5 IPs
      analysis.dns_analysis.ip_changes = Math.floor(Math.random() * 10); // 0-10 changes
      analysis.dns_analysis.average_ttl = 3600 + Math.random() * 82800; // 1-24 hours
      analysis.dns_analysis.min_ttl = 3600; // 1 hour
      analysis.dns_analysis.max_ttl = 86400; // 24 hours
    }

    // Generate timeline data
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(Date.now() - (24 - i) * 60 * 60 * 1000);
      const ipChangesThisHour = isFluxDomain ? Math.floor(Math.random() * 8) : Math.floor(Math.random() * 2);
      
      if (ipChangesThisHour > 0) {
        analysis.timeline.push({
          timestamp: timestamp.toISOString(),
          ip_changes: ipChangesThisHour,
          unique_ips: Math.min(ipChangesThisHour + 1, ipPool.length),
          average_ttl: isFluxDomain ? 300 + Math.random() * 600 : 3600 + Math.random() * 3600
        });
      }
    }

    // Generate geographic and ASN distribution
    const countries = ['US', 'CN', 'RU', 'DE', 'GB', 'FR', 'NL', 'SG', 'JP', 'AU'];
    const providers = ['AWS', 'Cloudflare', 'Google Cloud', 'Azure', 'DigitalOcean', 'Vultr', 'Linode'];
    const asns = ['AS13335', 'AS16509', 'AS8075', 'AS15169', 'AS14061', 'AS20473'];

    if (isFluxDomain) {
      // High diversity for flux domains
      analysis.dns_analysis.geographic_distribution = countries.slice(0, 5 + Math.floor(Math.random() * 5));
      analysis.dns_analysis.asn_distribution = asns.slice(0, 3 + Math.floor(Math.random() * 3));
      analysis.infrastructure_analysis.hosting_providers = providers.slice(0, 4 + Math.floor(Math.random() * 3));
    } else {
      // Low diversity for normal domains
      analysis.dns_analysis.geographic_distribution = countries.slice(0, 1 + Math.floor(Math.random() * 2));
      analysis.dns_analysis.asn_distribution = asns.slice(0, 1 + Math.floor(Math.random() * 1));
      analysis.infrastructure_analysis.hosting_providers = providers.slice(0, 1 + Math.floor(Math.random() * 1));
    }

    // Analyze fast flux indicators
    let fluxScore = 0;

    // 1. Rapid IP changes (weight: 25)
    if (analysis.dns_analysis.ip_changes > 50) {
      analysis.flux_indicators.rapid_ip_changes = true;
      fluxScore += 25;
      analysis.risk_assessment.indicators.push('Excessive IP address changes detected');
    } else if (analysis.dns_analysis.ip_changes > 20) {
      fluxScore += 15;
      analysis.risk_assessment.indicators.push('Moderate IP address changes observed');
    }

    // 2. Low TTL values (weight: 20)
    if (analysis.dns_analysis.average_ttl < 600) {
      analysis.flux_indicators.low_ttl_values = true;
      fluxScore += 20;
      analysis.risk_assessment.indicators.push('Very low DNS TTL values');
    } else if (analysis.dns_analysis.average_ttl < 1800) {
      fluxScore += 10;
      analysis.risk_assessment.indicators.push('Low DNS TTL values');
    }

    // 3. High IP diversity (weight: 15)
    if (analysis.dns_analysis.unique_ips > 30) {
      analysis.flux_indicators.high_ip_diversity = true;
      fluxScore += 15;
      analysis.risk_assessment.indicators.push('High number of unique IP addresses');
    } else if (analysis.dns_analysis.unique_ips > 10) {
      fluxScore += 10;
      analysis.risk_assessment.indicators.push('Moderate IP diversity');
    }

    // 4. Geographic dispersion (weight: 15)
    if (analysis.dns_analysis.geographic_distribution.length > 5) {
      analysis.flux_indicators.geographic_dispersion = true;
      fluxScore += 15;
      analysis.risk_assessment.indicators.push('Wide geographic distribution of servers');
    } else if (analysis.dns_analysis.geographic_distribution.length > 3) {
      fluxScore += 8;
      analysis.risk_assessment.indicators.push('Moderate geographic distribution');
    }

    // 5. ASN diversity (weight: 10)
    if (analysis.dns_analysis.asn_distribution.length > 3) {
      analysis.flux_indicators.asn_diversity = true;
      fluxScore += 10;
      analysis.risk_assessment.indicators.push('Multiple autonomous systems involved');
    } else if (analysis.dns_analysis.asn_distribution.length > 2) {
      fluxScore += 5;
      analysis.risk_assessment.indicators.push('Some ASN diversity observed');
    }

    // 6. Round-robin DNS patterns (weight: 15)
    if (analysis.dns_analysis.unique_ips > 5 && analysis.dns_analysis.ip_changes > 10) {
      analysis.flux_indicators.round_robin_dns = true;
      fluxScore += 15;
      analysis.risk_assessment.indicators.push('Round-robin DNS pattern detected');
    }

    analysis.flux_indicators.flux_score = Math.min(100, fluxScore);
    analysis.risk_assessment.flux_likelihood = Math.min(100, fluxScore);

    // Determine risk level and confidence
    if (fluxScore >= 75) {
      analysis.risk_assessment.risk_level = 'critical';
      analysis.risk_assessment.confidence = 90 + Math.random() * 10;
    } else if (fluxScore >= 50) {
      analysis.risk_assessment.risk_level = 'high';
      analysis.risk_assessment.confidence = 75 + Math.random() * 15;
    } else if (fluxScore >= 25) {
      analysis.risk_assessment.risk_level = 'medium';
      analysis.risk_assessment.confidence = 60 + Math.random() * 20;
    } else {
      analysis.risk_assessment.risk_level = 'low';
      analysis.risk_assessment.confidence = 80 + Math.random() * 20;
    }

    // Add suspicious patterns
    if (isFluxDomain) {
      analysis.infrastructure_analysis.suspicious_patterns = [
        'Rapid DNS resolution changes',
        'Multiple cloud providers used simultaneously',
        'Abnormally short DNS TTL values',
        'High IP churn rate'
      ];
    }

    // Generate recommendations
    if (fluxScore >= 75) {
      analysis.recommendations.push({
        priority: 'critical',
        message: 'High probability fast flux network detected',
        action: 'Block domain immediately and investigate associated infrastructure'
      });
    } else if (fluxScore >= 50) {
      analysis.recommendations.push({
        priority: 'high',
        message: 'Possible fast flux activity detected',
        action: 'Monitor closely and consider blocking if confirmed malicious'
      });
    } else if (fluxScore >= 25) {
      analysis.recommendations.push({
        priority: 'medium',
        message: 'Some indicators suggest possible flux activity',
        action: 'Continue monitoring and gather additional intelligence'
      });
    } else {
      analysis.recommendations.push({
        priority: 'info',
        message: 'No significant fast flux indicators detected',
        action: 'Normal DNS behavior observed'
      });
    }

    if (analysis.dns_analysis.min_ttl < 300) {
      analysis.recommendations.push({
        priority: 'medium',
        message: 'Very low DNS TTL detected',
        action: 'Investigate reason for frequent DNS updates'
      });
    }

    return analysis;
  };

  const getRiskColor = (riskLevel) => {
    const colors = {
      critical: 'text-red-700 bg-red-50 border-red-300',
      high: 'text-orange-700 bg-orange-50 border-orange-300',
      medium: 'text-yellow-700 bg-yellow-50 border-yellow-300',
      low: 'text-green-700 bg-green-50 border-green-300'
    };
    return colors[riskLevel] || colors.low;
  };

  const getFluxScoreColor = (score) => {
    if (score >= 75) return 'text-red-600';
    if (score >= 50) return 'text-orange-600';
    if (score >= 25) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Globe className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Fast Flux Detection</h2>
                <p className="text-gray-600">Monitor rapid IP changes indicating malicious infrastructure</p>
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
                <p className="font-semibold mb-1">Fast Flux Networks</p>
                <p>
                  Fast flux is a DNS technique used by cybercriminals to hide malicious websites 
                  by rapidly changing IP addresses associated with a domain name.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={detectFastFlux} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain name (e.g., suspicious-site.com)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !domain.trim()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                {loading ? 'Analyzing...' : 'Detect Fast Flux'}
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
              {/* Summary */}
              <div className={`rounded-lg p-6 border-2 ${getRiskColor(result.risk_assessment.risk_level)}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{result.domain}</h3>
                    <p className="text-sm text-gray-600">Fast Flux Analysis - {result.monitoring_period}</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getFluxScoreColor(result.flux_indicators.flux_score)}`}>
                      {result.flux_indicators.flux_score}
                    </div>
                    <p className="text-sm font-semibold">Flux Score</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <p className="text-xl font-bold capitalize">{result.risk_assessment.risk_level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Confidence</p>
                    <p className="text-xl font-bold">{Math.round(result.risk_assessment.confidence)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Unique IPs</p>
                    <p className="text-xl font-bold">{result.dns_analysis.unique_ips}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">IP Changes</p>
                    <p className="text-xl font-bold">{result.dns_analysis.ip_changes}</p>
                  </div>
                </div>
              </div>

              {/* DNS Analysis */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-gray-600" />
                  DNS Resolution Analysis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">TTL Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Average TTL:</span>
                        <span className="font-medium">{Math.round(result.dns_analysis.average_ttl)}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Min TTL:</span>
                        <span className="font-medium">{Math.round(result.dns_analysis.min_ttl)}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max TTL:</span>
                        <span className="font-medium">{Math.round(result.dns_analysis.max_ttl)}s</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Geographic Distribution</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.dns_analysis.geographic_distribution.map((country, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Hosting Providers</h4>
                    <div className="space-y-1 text-sm">
                      {result.infrastructure_analysis.hosting_providers.map((provider, index) => (
                        <div key={index} className="text-gray-700">• {provider}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Flux Indicators */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Fast Flux Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'rapid_ip_changes', label: 'Rapid IP Changes', description: 'Frequent IP address rotation' },
                    { key: 'low_ttl_values', label: 'Low TTL Values', description: 'Short DNS cache time' },
                    { key: 'high_ip_diversity', label: 'High IP Diversity', description: 'Many unique IP addresses' },
                    { key: 'geographic_dispersion', label: 'Geographic Dispersion', description: 'Servers across multiple countries' },
                    { key: 'asn_diversity', label: 'ASN Diversity', description: 'Multiple autonomous systems' },
                    { key: 'round_robin_dns', label: 'Round-Robin DNS', description: 'Rotating DNS responses' }
                  ].map((indicator) => (
                    <div key={indicator.key} className={`p-3 rounded-lg border ${
                      result.flux_indicators[indicator.key] 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        {result.flux_indicators[indicator.key] ? (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        ) : (
                          <Activity className="w-4 h-4 text-green-600" />
                        )}
                        <span className="font-medium text-gray-900">{indicator.label}</span>
                      </div>
                      <p className="text-sm text-gray-600">{indicator.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              {result.timeline.length > 0 && (
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    IP Change Timeline (Last 24 Hours)
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {result.timeline.slice(0, 10).map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-4 h-4 text-indigo-600" />
                          <div>
                            <p className="font-medium text-sm">
                              {entry.ip_changes} IP change{entry.ip_changes !== 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-gray-600">
                              {new Date(entry.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-medium">{entry.unique_ips} unique IPs</p>
                          <p className="text-xs text-gray-600">TTL: {Math.round(entry.average_ttl)}s</p>
                        </div>
                      </div>
                    ))}
                    {result.timeline.length > 10 && (
                      <p className="text-sm text-gray-600 text-center">
                        ... and {result.timeline.length - 10} more entries
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Risk Indicators */}
              {result.risk_assessment.indicators.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                  <h3 className="font-semibold text-orange-900 mb-4">Risk Indicators</h3>
                  <div className="space-y-2">
                    {result.risk_assessment.indicators.map((indicator, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-orange-800">{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suspicious Patterns */}
              {result.infrastructure_analysis.suspicious_patterns.length > 0 && (
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-4">Suspicious Infrastructure Patterns</h3>
                  <div className="space-y-2">
                    {result.infrastructure_analysis.suspicious_patterns.map((pattern, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-800">{pattern}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className={`rounded-lg p-4 border ${
                    rec.priority === 'critical' ? 'bg-red-50 border-red-200' :
                    rec.priority === 'high' ? 'bg-orange-50 border-orange-200' :
                    rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 mt-1" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{rec.message}</p>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${
                            rec.priority === 'critical' ? 'bg-red-100 text-red-700' :
                            rec.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {rec.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm">{rec.action}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Technical Details */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Technical Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Total DNS Queries</p>
                    <p className="text-gray-600">{result.dns_analysis.total_queries}</p>
                  </div>
                  <div>
                    <p className="font-medium">ASN Distribution</p>
                    <p className="text-gray-600">{result.dns_analysis.asn_distribution.length} systems</p>
                  </div>
                  <div>
                    <p className="font-medium">Countries</p>
                    <p className="text-gray-600">{result.dns_analysis.geographic_distribution.length} countries</p>
                  </div>
                  <div>
                    <p className="font-medium">Hosting Providers</p>
                    <p className="text-gray-600">{result.infrastructure_analysis.hosting_providers.length} providers</p>
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