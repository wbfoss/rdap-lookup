'use client';

import { useState } from 'react';
import { AlertTriangle, Shield, Globe, Info, CheckCircle, XCircle } from 'lucide-react';

export default function SuspiciousTLDFlagging({ onClose }) {
  const [domain, setDomain] = useState('');
  const [bulkDomains, setBulkDomains] = useState('');
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // Categorized TLD lists
  const tldCategories = {
    highRisk: {
      tlds: ['.tk', '.ml', '.ga', '.cf', '.click', '.download', '.review', '.top', '.win', '.bid', 
             '.stream', '.trade', '.racing', '.loan', '.date', '.men', '.cricket', '.party', '.science',
             '.webcam', '.accountant', '.faith', '.link', '.work', '.gq'],
      description: 'Frequently used in phishing, malware distribution, and scam campaigns',
      riskLevel: 'critical'
    },
    mediumRisk: {
      tlds: ['.xyz', '.site', '.online', '.website', '.space', '.live', '.life', '.world', '.today',
             '.email', '.help', '.cloud', '.company', '.business', '.support', '.tech', '.store'],
      description: 'Higher than average abuse rates, require additional verification',
      riskLevel: 'medium'
    },
    lowRisk: {
      tlds: ['.com', '.org', '.net', '.edu', '.gov', '.mil', '.int'],
      description: 'Traditional TLDs with established reputation and stricter registration policies',
      riskLevel: 'low'
    },
    premiumTlds: {
      tlds: ['.io', '.dev', '.app', '.ai', '.co', '.me', '.tv', '.design', '.studio'],
      description: 'Premium TLDs with higher registration costs and generally legitimate use',
      riskLevel: 'very-low'
    },
    countryCode: {
      tlds: ['.us', '.uk', '.ca', '.au', '.de', '.fr', '.jp', '.cn', '.ru', '.br', '.in', '.it', '.es'],
      description: 'Country code TLDs with varying risk levels based on registration policies',
      riskLevel: 'varies'
    },
    newGeneric: {
      tlds: ['.shop', '.blog', '.news', '.club', '.info', '.pro', '.biz', '.name', '.mobi'],
      description: 'Newer generic TLDs with moderate risk profiles',
      riskLevel: 'low-medium'
    }
  };

  const analyzeTLD = (domainName) => {
    const parts = domainName.toLowerCase().split('.');
    const tld = '.' + parts[parts.length - 1];
    
    for (const [category, data] of Object.entries(tldCategories)) {
      if (data.tlds.includes(tld)) {
        return {
          tld,
          category,
          description: data.description,
          riskLevel: data.riskLevel,
          inList: true
        };
      }
    }
    
    // If TLD not in any list, classify as unknown
    return {
      tld,
      category: 'unknown',
      description: 'Uncommon or new TLD - risk level uncertain',
      riskLevel: 'unknown',
      inList: false
    };
  };

  const checkDomainDetails = async (domainName) => {
    try {
      const response = await fetch(`/api/lookup?query=${encodeURIComponent(domainName)}&type=domain`);
      const data = await response.json();
      
      if (response.ok && data) {
        // Extract additional risk indicators
        const registrationDate = data.events?.find(e => e.eventAction === 'registration')?.eventDate;
        const ageInDays = registrationDate ? 
          Math.floor((new Date() - new Date(registrationDate)) / (1000 * 60 * 60 * 24)) : null;
        
        return {
          exists: true,
          ageInDays,
          isNew: ageInDays !== null && ageInDays < 30,
          dnssec: data.secureDNS || false,
          status: data.status || [],
          registrar: data.port43 || 'Unknown'
        };
      }
    } catch {
      // Domain doesn't exist or error
    }
    
    return {
      exists: false,
      ageInDays: null,
      isNew: false,
      dnssec: false,
      status: [],
      registrar: 'Unknown'
    };
  };

  const analyzeDomains = async (e) => {
    e.preventDefault();
    
    const domainsToAnalyze = mode === 'single' 
      ? [domain.trim()]
      : bulkDomains.split('\n').map(d => d.trim()).filter(d => d);
    
    if (domainsToAnalyze.length === 0) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const analysisResults = [];
      const statistics = {
        total: domainsToAnalyze.length,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        unknown: 0
      };

      for (const domainName of domainsToAnalyze) {
        const tldAnalysis = analyzeTLD(domainName);
        const domainDetails = await checkDomainDetails(domainName);
        
        // Calculate combined risk score
        let combinedRisk = tldAnalysis.riskLevel;
        const riskFactors = [];
        
        if (tldAnalysis.riskLevel === 'critical') {
          riskFactors.push('Suspicious TLD');
        }
        
        if (domainDetails.isNew) {
          riskFactors.push('Newly registered (< 30 days)');
          if (combinedRisk === 'low') combinedRisk = 'medium';
          if (combinedRisk === 'medium') combinedRisk = 'high';
        }
        
        if (!domainDetails.dnssec && domainDetails.exists) {
          riskFactors.push('No DNSSEC');
        }
        
        if (domainDetails.status.some(s => s.includes('Hold') || s.includes('pending'))) {
          riskFactors.push('Suspicious domain status');
          combinedRisk = 'high';
        }

        const result = {
          domain: domainName,
          ...tldAnalysis,
          ...domainDetails,
          combinedRisk,
          riskFactors
        };
        
        analysisResults.push(result);
        
        // Update statistics
        if (combinedRisk === 'critical') statistics.critical++;
        else if (combinedRisk === 'high') statistics.high++;
        else if (combinedRisk === 'medium' || combinedRisk === 'low-medium') statistics.medium++;
        else if (combinedRisk === 'low' || combinedRisk === 'very-low') statistics.low++;
        else statistics.unknown++;
      }

      setResults({
        domains: analysisResults,
        statistics,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message || 'Failed to analyze domains');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (risk) => {
    const badges = {
      'critical': 'bg-red-100 text-red-800 border-red-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low-medium': 'bg-yellow-50 text-yellow-700 border-yellow-100',
      'low': 'bg-green-100 text-green-800 border-green-200',
      'very-low': 'bg-blue-100 text-blue-800 border-blue-200',
      'unknown': 'bg-gray-100 text-gray-800 border-gray-200',
      'varies': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return badges[risk] || badges['unknown'];
  };

  const exportResults = () => {
    if (!results) return;
    
    const csv = [
      'Domain,TLD,Category,Risk Level,Exists,Age (days),DNSSEC,Risk Factors',
      ...results.domains.map(d => 
        `"${d.domain}","${d.tld}","${d.category}","${d.combinedRisk}","${d.exists}","${d.ageInDays || 'N/A'}","${d.dnssec}","${d.riskFactors.join('; ')}"`
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tld-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Suspicious TLD Flagging</h2>
                <p className="text-gray-600">Identify domains using commonly abused TLDs</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setMode('single')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'single' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Single Domain
            </button>
            <button
              onClick={() => setMode('bulk')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'bulk' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bulk Analysis
            </button>
          </div>

          {/* Form */}
          <form onSubmit={analyzeDomains} className="mb-6">
            {mode === 'single' ? (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="Enter domain name (e.g., example.tk)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !domain.trim()}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  {loading ? 'Analyzing...' : 'Analyze TLD'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={bulkDomains}
                  onChange={(e) => setBulkDomains(e.target.value)}
                  placeholder="Enter domains (one per line)&#10;example.tk&#10;suspicious.ml&#10;legitimate.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows="5"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !bulkDomains.trim()}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  {loading ? 'Analyzing...' : `Analyze ${bulkDomains.split('\n').filter(d => d.trim()).length} Domains`}
                </button>
              </div>
            )}
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
              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{results.statistics.total}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-red-600">Critical</p>
                  <p className="text-2xl font-bold text-red-700">{results.statistics.critical}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-orange-600">High</p>
                  <p className="text-2xl font-bold text-orange-700">{results.statistics.high}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-yellow-600">Medium</p>
                  <p className="text-2xl font-bold text-yellow-700">{results.statistics.medium}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-green-600">Low</p>
                  <p className="text-2xl font-bold text-green-700">{results.statistics.low}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">Unknown</p>
                  <p className="text-2xl font-bold text-gray-700">{results.statistics.unknown}</p>
                </div>
              </div>

              {/* Export Button */}
              {results.domains.length > 1 && (
                <button
                  onClick={exportResults}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Export Results as CSV
                </button>
              )}

              {/* Domain Analysis Results */}
              <div className="space-y-3">
                {results.domains.map((domainResult, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{domainResult.domain}</h3>
                        <p className="text-sm text-gray-600">TLD: {domainResult.tld}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskBadge(domainResult.combinedRisk)}`}>
                        {domainResult.combinedRisk.toUpperCase()} RISK
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">TLD Category</p>
                        <p className="font-medium capitalize">{domainResult.category.replace(/([A-Z])/g, ' $1').trim()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Domain Status</p>
                        <p className="font-medium">{domainResult.exists ? 'Registered' : 'Not Registered'}</p>
                      </div>
                      {domainResult.exists && (
                        <>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Domain Age</p>
                            <p className="font-medium">
                              {domainResult.ageInDays !== null 
                                ? `${domainResult.ageInDays} days ${domainResult.isNew ? '(NEW!)' : ''}`
                                : 'Unknown'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">DNSSEC</p>
                            <p className="font-medium flex items-center gap-1">
                              {domainResult.dnssec ? (
                                <><CheckCircle className="w-4 h-4 text-green-600" /> Enabled</>
                              ) : (
                                <><XCircle className="w-4 h-4 text-red-600" /> Disabled</>
                              )}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-sm text-gray-600 mb-2">Risk Assessment</p>
                      <p className="text-sm text-gray-700 mb-2">{domainResult.description}</p>
                      {domainResult.riskFactors.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {domainResult.riskFactors.map((factor, i) => (
                            <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                              {factor}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* TLD Reference */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  TLD Risk Categories Reference
                </h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(tldCategories).map(([category, data]) => (
                    <div key={category} className="flex items-start gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskBadge(data.riskLevel)}`}>
                        {data.riskLevel.toUpperCase()}
                      </span>
                      <div>
                        <p className="font-medium capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-gray-600 text-xs">{data.description}</p>
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