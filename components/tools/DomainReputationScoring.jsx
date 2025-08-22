'use client';

import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { safeJsonParse } from "../../utils/security-tools";

export default function DomainReputationScoring({ onClose }) {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const calculateReputationScore = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Validate domain format - allow anything.extension format
      const cleanDomain = domain.trim();
      if (!/^[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(cleanDomain)) {
        throw new Error('Please enter a valid domain name (e.g., example.com)');
      }

      // For now, simulate reputation scoring with realistic data
      // In production, this would use multiple threat intelligence sources

      // Simulate domain data
      const simulatedData = {
        events: [{
          eventAction: 'registration',
          eventDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 5).toISOString() // Random date within last 5 years
        }],
        port43: Math.random() > 0.5 ? 'whois.godaddy.com' : 'whois.namecheap.com',
        secureDNS: Math.random() > 0.3, // 70% chance of DNSSEC
        status: Math.random() > 0.8 ? ['serverHold'] : ['active'],
        nameservers: [
          { ldhName: 'ns1.example.com' },
          { ldhName: 'ns2.example.com' }
        ]
      };

      // Calculate various reputation factors
      const factors = {};
      let totalScore = 0;
      const weights = {
        domainAge: 25,
        registrar: 15,
        dnssec: 15,
        status: 15,
        nameservers: 10,
        tld: 10,
        updates: 10
      };

      // 1. Domain Age Score (25 points max)
      if (simulatedData.events && simulatedData.events.length > 0) {
        const registrationEvent = simulatedData.events.find(event => 
          event.eventAction === 'registration' || 
          event.eventAction === 'last update of RDAP database'
        );
        
        if (registrationEvent) {
          const registrationDate = new Date(registrationEvent.eventDate);
          const ageInDays = Math.floor((new Date() - registrationDate) / (1000 * 60 * 60 * 24));
          
          let ageScore = 0;
          let ageRisk = 'high';
          
          if (ageInDays < 30) {
            ageScore = 0;
            ageRisk = 'critical';
          } else if (ageInDays < 90) {
            ageScore = 5;
            ageRisk = 'high';
          } else if (ageInDays < 180) {
            ageScore = 10;
            ageRisk = 'medium';
          } else if (ageInDays < 365) {
            ageScore = 15;
            ageRisk = 'low';
          } else if (ageInDays < 730) {
            ageScore = 20;
            ageRisk = 'very-low';
          } else {
            ageScore = 25;
            ageRisk = 'minimal';
          }
          
          factors.domainAge = {
            score: ageScore,
            maxScore: weights.domainAge,
            value: `${Math.floor(ageInDays / 365)} years, ${ageInDays % 365} days`,
            risk: ageRisk,
            details: `Domain is ${ageInDays} days old`
          };
          totalScore += ageScore;
        }
      }

      // 2. Registrar Reputation (15 points max)
      const trustedRegistrars = ['godaddy', 'namecheap', 'cloudflare', 'google', 'amazon', 'gandi', 'hover'];
      const registrarName = simulatedData.port43?.toLowerCase() || '';
      let registrarScore = 10; // Default medium trust
      let registrarRisk = 'medium';
      
      if (trustedRegistrars.some(trusted => registrarName.includes(trusted))) {
        registrarScore = 15;
        registrarRisk = 'low';
      } else if (registrarName.includes('private') || registrarName.includes('proxy')) {
        registrarScore = 5;
        registrarRisk = 'high';
      }
      
      factors.registrar = {
        score: registrarScore,
        maxScore: weights.registrar,
        value: simulatedData.port43 || 'Unknown',
        risk: registrarRisk,
        details: 'Registrar reputation assessment'
      };
      totalScore += registrarScore;

      // 3. DNSSEC Status (15 points max)
      const dnssecScore = simulatedData.secureDNS ? 15 : 0;
      factors.dnssec = {
        score: dnssecScore,
        maxScore: weights.dnssec,
        value: simulatedData.secureDNS ? 'Enabled' : 'Disabled',
        risk: simulatedData.secureDNS ? 'low' : 'medium',
        details: simulatedData.secureDNS ? 'DNSSEC is properly configured' : 'DNSSEC not enabled'
      };
      totalScore += dnssecScore;

      // 4. Domain Status (15 points max)
      let statusScore = 15;
      let statusRisk = 'low';
      const statuses = simulatedData.status || [];
      
      if (statuses.some(s => s.includes('serverHold') || s.includes('clientHold'))) {
        statusScore = 0;
        statusRisk = 'critical';
      } else if (statuses.some(s => s.includes('pendingDelete') || s.includes('redemptionPeriod'))) {
        statusScore = 5;
        statusRisk = 'high';
      } else if (statuses.some(s => s.includes('inactive'))) {
        statusScore = 10;
        statusRisk = 'medium';
      }
      
      factors.status = {
        score: statusScore,
        maxScore: weights.status,
        value: statuses.join(', ') || 'Active',
        risk: statusRisk,
        details: 'Domain status assessment'
      };
      totalScore += statusScore;

      // 5. Nameservers (10 points max)
      const nameservers = simulatedData.nameservers || [];
      let nsScore = 10;
      let nsRisk = 'low';
      
      if (nameservers.length === 0) {
        nsScore = 0;
        nsRisk = 'critical';
      } else if (nameservers.length === 1) {
        nsScore = 5;
        nsRisk = 'medium';
      } else if (nameservers.length >= 2) {
        nsScore = 10;
        nsRisk = 'low';
      }
      
      factors.nameservers = {
        score: nsScore,
        maxScore: weights.nameservers,
        value: `${nameservers.length} nameserver(s)`,
        risk: nsRisk,
        details: nameservers.map(ns => ns.ldhName).join(', ') || 'No nameservers'
      };
      totalScore += nsScore;

      // 6. TLD Reputation (10 points max)
      const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.click', '.download', '.review', '.top', '.win', '.bid'];
      const premiumTLDs = ['.com', '.org', '.net', '.edu', '.gov', '.io', '.dev', '.app'];
      const domainTLD = '.' + cleanDomain.split('.').pop();
      
      let tldScore = 5; // Default neutral
      let tldRisk = 'medium';
      
      if (premiumTLDs.includes(domainTLD)) {
        tldScore = 10;
        tldRisk = 'low';
      } else if (suspiciousTLDs.includes(domainTLD)) {
        tldScore = 0;
        tldRisk = 'high';
      }
      
      factors.tld = {
        score: tldScore,
        maxScore: weights.tld,
        value: domainTLD,
        risk: tldRisk,
        details: `TLD reputation for ${domainTLD}`
      };
      totalScore += tldScore;

      // 7. Recent Updates (10 points max)
      let updateScore = 10;
      let updateRisk = 'low';
      
      if (simulatedData.events && simulatedData.events.length > 0) {
        // Simulate last change event
        const lastUpdate = { 
          eventAction: 'last changed', 
          eventDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() 
        };
        
        const updateDate = new Date(lastUpdate.eventDate);
        const daysSinceUpdate = Math.floor((new Date() - updateDate) / (1000 * 60 * 60 * 24));
        
        if (daysSinceUpdate < 7) {
          updateScore = 5;
          updateRisk = 'medium';
        } else if (daysSinceUpdate < 30) {
          updateScore = 7;
          updateRisk = 'low-medium';
        }
      }
      
      factors.updates = {
        score: updateScore,
        maxScore: weights.updates,
        value: 'Normal activity',
        risk: updateRisk,
        details: 'Recent update activity assessment'
      };
      totalScore += updateScore;

      // Calculate final reputation
      const maxPossibleScore = Object.values(weights).reduce((a, b) => a + b, 0);
      const percentageScore = Math.round((totalScore / maxPossibleScore) * 100);
      
      let overallRisk = 'critical';
      let overallRating = 'Very Poor';
      
      if (percentageScore >= 90) {
        overallRisk = 'minimal';
        overallRating = 'Excellent';
      } else if (percentageScore >= 75) {
        overallRisk = 'low';
        overallRating = 'Good';
      } else if (percentageScore >= 60) {
        overallRisk = 'medium';
        overallRating = 'Fair';
      } else if (percentageScore >= 40) {
        overallRisk = 'high';
        overallRating = 'Poor';
      }

      setResult({
        domain: cleanDomain,
        totalScore,
        maxScore: maxPossibleScore,
        percentageScore,
        overallRisk,
        overallRating,
        factors,
        rawData: simulatedData
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    const colors = {
      'critical': 'text-red-700 bg-red-100 border-red-300',
      'high': 'text-orange-700 bg-orange-100 border-orange-300',
      'medium': 'text-yellow-700 bg-yellow-100 border-yellow-300',
      'low-medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'low': 'text-green-600 bg-green-50 border-green-200',
      'very-low': 'text-green-700 bg-green-100 border-green-300',
      'minimal': 'text-blue-700 bg-blue-100 border-blue-300'
    };
    return colors[risk] || colors['medium'];
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-blue-600';
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Domain Reputation Scoring</h2>
                <p className="text-gray-600">Comprehensive domain trust assessment</p>
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
          <form onSubmit={calculateReputationScore} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain name (e.g., example.com)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !domain.trim()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                {loading ? 'Analyzing...' : 'Calculate Score'}
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
              {/* Overall Score */}
              <div className={`rounded-lg p-6 border-2 ${getRiskColor(result.overallRisk)}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{result.domain}</h3>
                    <p className="text-sm opacity-75">Domain Reputation Analysis</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-bold ${getScoreColor(result.percentageScore)}`}>
                      {result.percentageScore}%
                    </div>
                    <p className="text-sm font-semibold">{result.overallRating}</p>
                  </div>
                </div>
                
                {/* Score Bar */}
                <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      result.percentageScore >= 90 ? 'bg-blue-500' :
                      result.percentageScore >= 75 ? 'bg-green-500' :
                      result.percentageScore >= 60 ? 'bg-yellow-500' :
                      result.percentageScore >= 40 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${result.percentageScore}%` }}
                  />
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span>Total Score: {result.totalScore}/{result.maxScore}</span>
                  <span className="font-semibold">Risk Level: {result.overallRisk.replace('-', ' ').toUpperCase()}</span>
                </div>
              </div>

              {/* Factor Breakdown */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-600" />
                  Reputation Factors Analysis
                </h3>
                
                <div className="space-y-3">
                  {Object.entries(result.factors).map(([key, factor]) => (
                    <div key={key} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(factor.risk)}`}>
                            {factor.risk.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">{factor.score}</span>
                          <span className="text-gray-500">/{factor.maxScore}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p><strong>Value:</strong> {factor.value}</p>
                        <p className="mt-1">{factor.details}</p>
                      </div>
                      
                      {/* Mini progress bar */}
                      <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full ${
                            factor.score / factor.maxScore >= 0.8 ? 'bg-green-500' :
                            factor.score / factor.maxScore >= 0.5 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Security Recommendations
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  {!result.factors.dnssec || result.factors.dnssec.score === 0 ? (
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Enable DNSSEC to protect against DNS spoofing attacks</span>
                    </li>
                  ) : null}
                  {result.factors.domainAge && result.factors.domainAge.score < 15 ? (
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>New domain detected - Exercise caution and verify legitimacy</span>
                    </li>
                  ) : null}
                  {result.factors.nameservers && result.factors.nameservers.score < 10 ? (
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Configure redundant nameservers for better reliability</span>
                    </li>
                  ) : null}
                  {result.factors.tld && result.factors.tld.score === 0 ? (
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Domain uses a commonly abused TLD - Verify ownership carefully</span>
                    </li>
                  ) : null}
                  {result.percentageScore >= 75 ? (
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>This domain shows good reputation indicators</span>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}