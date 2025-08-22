'use client';

import { useState } from "react";
import { X, Target, AlertTriangle, CheckCircle, Globe, Clock, Shield, Database, Search, Eye, Zap, Server, Signal } from "lucide-react";
import { safeJsonParse } from "../../utils/security-tools";

export default function DomainParkingAnalysis({ onClose }) {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const analyzeDomainParking = async () => {
    if (!domain.trim()) {
      setError('Please enter a domain name');
      return;
    }

    const cleanDomain = domain.trim().toLowerCase();

    if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanDomain)) {
      setError('Please enter a valid domain name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Perform real domain parking analysis
      const parkingAnalysis = await performRealParkingAnalysis(cleanDomain);
      setAnalysis(parkingAnalysis);
    } catch (err) {
      setError(err.message || 'Failed to analyze domain parking');
    } finally {
      setLoading(false);
    }
  };

  const performRealParkingAnalysis = async (domain) => {
    const analysis = {
      domain,
      timestamp: new Date().toISOString(),
      parking_indicators: {
        domain_status: 'unknown',
        parking_confidence: 0,
        parking_service: 'Unknown',
        revenue_model: 'none',
        ad_density: 0,
        click_value: '0.00'
      },
      technical_analysis: {
        dns_analysis: {
          nameservers: [],
          a_records: [],
          mx_records: [],
          txt_records: [],
          parking_ns_detected: false
        },
        http_analysis: {
          status_code: 0,
          server: 'Unknown',
          content_length: 0,
          page_load_time: '0s',
          redirect_count: 0,
          ssl_enabled: false
        },
        content_analysis: {
          title: '',
          meta_keywords: '',
          ad_blocks: 0,
          affiliate_links: 0,
          contact_forms: 0,
          parking_templates: []
        }
      },
      security_assessment: {
        malicious_potential: 'low',
        weaponization_risk: 'low',
        monitoring_priority: 'low',
        threat_indicators: []
      },
      recommendations: []
    };

    try {
      // Check DNS records
      const dnsResponse = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`);
      if (dnsResponse.ok) {
        const dnsData = await safeJsonParse(dnsResponse);
        if (dnsData.Answer) {
          analysis.technical_analysis.dns_analysis.a_records = dnsData.Answer.map(record => record.data);
        }
      }

      // Check nameservers
      const nsResponse = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=NS`);
      if (nsResponse.ok) {
        const nsData = await safeJsonParse(nsResponse);
        if (nsData.Answer) {
          analysis.technical_analysis.dns_analysis.nameservers = nsData.Answer.map(record => record.data);
          
          // Check for known parking nameservers
          const parkingNS = ['parkingcrew.net', 'sedoparking.com', 'parkingspa.com', 'above.com', 'bodis.com'];
          analysis.technical_analysis.dns_analysis.parking_ns_detected = analysis.technical_analysis.dns_analysis.nameservers.some(ns => 
            parkingNS.some(parking => ns.toLowerCase().includes(parking))
          );
        }
      }

      // Check HTTP response
      try {
        const httpResponse = await fetch(`https://${domain}`, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(10000)
        });
        
        analysis.technical_analysis.http_analysis.status_code = httpResponse.status;
        analysis.technical_analysis.http_analysis.ssl_enabled = true;
        analysis.technical_analysis.http_analysis.server = httpResponse.headers.get('server') || 'Unknown';
        
        if (httpResponse.ok) {
          // Try to get page content for parking detection
          const pageResponse = await fetch(`https://${domain}`, { 
            signal: AbortSignal.timeout(10000)
          });
          
          if (pageResponse.ok) {
            const pageContent = await pageResponse.text();
            analysis.technical_analysis.http_analysis.content_length = pageContent.length;
            
            // Analyze content for parking indicators
            const title = pageContent.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';
            analysis.technical_analysis.content_analysis.title = title;
            
            const metaKeywords = pageContent.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i)?.[1] || '';
            analysis.technical_analysis.content_analysis.meta_keywords = metaKeywords;
            
            // Check for parking indicators in content
            const parkingKeywords = [
              'domain for sale', 'buy this domain', 'premium domain', 'parked domain',
              'domain parking', 'sponsored listings', 'related searches', 'domain expired'
            ];
            
            const contentLower = pageContent.toLowerCase();
            const parkingMatches = parkingKeywords.filter(keyword => contentLower.includes(keyword));
            
            if (parkingMatches.length > 0) {
              analysis.parking_indicators.domain_status = 'parked';
              analysis.parking_indicators.parking_confidence = Math.min(100, parkingMatches.length * 25);
            }
            
            // Count potential ad blocks and affiliate links
            analysis.technical_analysis.content_analysis.ad_blocks = (pageContent.match(/class[^>]*ad[^>]*>/gi) || []).length;
            analysis.technical_analysis.content_analysis.affiliate_links = (pageContent.match(/affiliate|aff_id|clickbank/gi) || []).length;
            analysis.technical_analysis.content_analysis.contact_forms = (pageContent.match(/<form[^>]*>/gi) || []).length;
            
            // Check for known parking templates
            const parkingTemplates = ['sedo', 'godaddy', 'namecheap', 'afternic', 'parkingcrew'];
            analysis.technical_analysis.content_analysis.parking_templates = parkingTemplates.filter(template => 
              contentLower.includes(template)
            );
          }
        }
      } catch (httpError) {
        // Try HTTP if HTTPS fails
        try {
          const httpResponse = await fetch(`http://${domain}`, { 
            method: 'HEAD',
            signal: AbortSignal.timeout(10000)
          });
          analysis.technical_analysis.http_analysis.status_code = httpResponse.status;
          analysis.technical_analysis.http_analysis.ssl_enabled = false;
        } catch {
          // Domain not responding
        }
      }

      // Analyze for potential security risks
      if (analysis.parking_indicators.domain_status === 'parked') {
        // Check domain age through RDAP
        try {
          const rdapResponse = await fetch(`/api/lookup?query=${encodeURIComponent(domain)}&type=domain`);
          if (rdapResponse.ok) {
            const rdapData = await safeJsonParse(rdapResponse);
            const registrationEvent = rdapData.events?.find(e => e.eventAction === 'registration');
            if (registrationEvent) {
              const ageInDays = Math.floor((new Date() - new Date(registrationEvent.eventDate)) / (1000 * 60 * 60 * 24));
              
              if (ageInDays < 30) {
                analysis.security_assessment.threat_indicators.push({
                  type: 'Recent Registration',
                  present: true,
                  severity: 'medium',
                  description: 'Domain registered within last 30 days'
                });
                analysis.security_assessment.malicious_potential = 'medium';
              }
            }
          }
        } catch {
          // RDAP lookup failed
        }

        // Check for suspicious patterns
        if (analysis.technical_analysis.content_analysis.title.toLowerCase().includes('buy') ||
            analysis.technical_analysis.content_analysis.title.toLowerCase().includes('sale')) {
          analysis.security_assessment.threat_indicators.push({
            type: 'Commercial Intent',
            present: true,
            severity: 'low',
            description: 'Domain appears to be for sale'
          });
        }

        if (analysis.technical_analysis.dns_analysis.parking_ns_detected) {
          analysis.parking_indicators.parking_service = 'Commercial Parking Service';
          analysis.parking_indicators.parking_confidence = Math.max(analysis.parking_indicators.parking_confidence, 80);
        }
      }
    } catch (error) {
      throw new Error(`Domain parking analysis failed: ${error.message}`);
    }

    // Generate recommendations
    if (analysis.parking_indicators.domain_status === 'parked') {
      analysis.recommendations.push(
        'Monitor domain for status changes and content updates',
        'Set up alerts for DNS configuration modifications',
        'Check for similar domain registrations by same entity',
        'Monitor certificate transparency logs for SSL issuance',
        'Track domain expiration and renewal patterns'
      );

      if (analysis.security_assessment.malicious_potential !== 'low') {
        analysis.recommendations.push('Consider adding to security watchlist due to elevated risk factors');
      }
    } else {
      analysis.recommendations.push(
        'Domain appears to be actively used',
        'Continue standard security monitoring practices'
      );
    }

    return analysis;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    if (status === 'parked') return 'text-orange-600 bg-orange-50';
    if (status === 'active') return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-orange-50">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Domain Parking Analysis</h2>
              <p className="text-sm text-gray-600">Analyze domain parking status and security implications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Input Form */}
            <div className="mb-6">
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                Domain to Analyze
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  onClick={analyzeDomainParking}
                  disabled={loading}
                  className="px-6 py-2 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Analyze
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="space-y-6">
                {/* Domain Status Overview */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Domain Status Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Status</span>
                      </div>
                      <div className={`text-lg font-bold px-2 py-1 rounded ${getStatusColor(analysis.parking_indicators.domain_status)}`}>
                        {analysis.parking_indicators.domain_status.toUpperCase()}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-700">Confidence</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {analysis.parking_indicators.confidence_score}%
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Server className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Service</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {analysis.parking_indicators.parking_service || 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Analysis completed at {new Date(analysis.timestamp).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
