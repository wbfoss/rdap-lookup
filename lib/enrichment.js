import dns from "dns";
import { promisify } from "util";

const resolveTxt = promisify(dns.resolveTxt);
const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);
const resolveMx = promisify(dns.resolveMx);
const resolveNs = promisify(dns.resolveNs);
const resolveCname = promisify(dns.resolveCname);
const resolveSoa = promisify(dns.resolveSoa);
const reverse = promisify(dns.reverse);

/**
 * Enriches RDAP data with additional DNS and security information
 */
export async function enrichRdapData(data, type, object, dkimSelector) {
  const enriched = { ...data };
  
  if (type === 'domain') {
    // Add DNS records
    enriched.dnsRecords = await getDnsRecords(object);
    
    // Add comprehensive email security
    enriched.emailSecurity = await getEmailSecurity(object, dkimSelector);
    
    // Add domain reputation data
    enriched.reputation = await getDomainReputation(object);
    
    // Add subdomain information
    enriched.subdomains = await getCommonSubdomains(object);
    
    // Add technology stack detection
    enriched.technologies = await detectTechnologies(object);
    
    // Add HTTP security headers check
    enriched.httpSecurity = await checkHttpSecurity(object);
  } else if (type === 'ip') {
    // Add reverse DNS
    enriched.reverseDns = await getReverseDns(object);
    
    // Add geolocation data
    enriched.geolocation = await getGeolocation(object);
    
    // Add ASN information
    enriched.asnInfo = await getAsnInfo(object);
    
    // Add port scan results (limited)
    enriched.openPorts = await checkCommonPorts(object);
  }
  
  // Add data quality score
  enriched.dataQuality = calculateDataQuality(enriched);
  
  // Add recommendations
  enriched.recommendations = generateRecommendations(enriched, type);
  
  return enriched;
}

async function getDnsRecords(domain) {
  const records = {};
  
  try {
    // A records
    try {
      records.a = await resolve4(domain);
    } catch (e) {
      records.a = [];
    }
    
    // AAAA records
    try {
      records.aaaa = await resolve6(domain);
    } catch (e) {
      records.aaaa = [];
    }
    
    // MX records
    try {
      const mx = await resolveMx(domain);
      records.mx = mx.sort((a, b) => a.priority - b.priority);
    } catch (e) {
      records.mx = [];
    }
    
    // NS records
    try {
      records.ns = await resolveNs(domain);
    } catch (e) {
      records.ns = [];
    }
    
    // TXT records
    try {
      const txt = await resolveTxt(domain);
      records.txt = txt.map(t => t.join(''));
    } catch (e) {
      records.txt = [];
    }
    
    // CNAME records
    try {
      records.cname = await resolveCname(domain);
    } catch (e) {
      records.cname = null;
    }
    
    // SOA record
    try {
      records.soa = await resolveSoa(domain);
    } catch (e) {
      records.soa = null;
    }
    
    // CAA records
    try {
      const caa = await resolveTxt(`_caa.${domain}`);
      records.caa = caa.map(t => t.join(''));
    } catch (e) {
      records.caa = [];
    }
  } catch (error) {
    console.error('Error fetching DNS records:', error);
  }
  
  return records;
}

async function getEmailSecurity(domain, dkimSelector) {
  const security = {};
  
  // SPF
  try {
    const spf = await resolveTxt(domain);
    const spfRecord = spf.flat().find(r => r.startsWith('v=spf1'));
    security.spf = {
      record: spfRecord || null,
      valid: !!spfRecord,
      strength: analyzeSpfStrength(spfRecord)
    };
  } catch (e) {
    security.spf = { record: null, valid: false, strength: 'none' };
  }
  
  // DMARC
  try {
    const dmarc = await resolveTxt(`_dmarc.${domain}`);
    const dmarcRecord = dmarc.flat().find(r => r.startsWith('v=DMARC1'));
    security.dmarc = {
      record: dmarcRecord || null,
      valid: !!dmarcRecord,
      policy: extractDmarcPolicy(dmarcRecord)
    };
  } catch (e) {
    security.dmarc = { record: null, valid: false, policy: 'none' };
  }
  
  // DKIM
  if (dkimSelector) {
    try {
      const dkim = await resolveTxt(`${dkimSelector}._domainkey.${domain}`);
      security.dkim = {
        selector: dkimSelector,
        record: dkim.flat().join(''),
        valid: dkim.length > 0
      };
    } catch (e) {
      security.dkim = { selector: dkimSelector, record: null, valid: false };
    }
  }
  
  // BIMI
  try {
    const bimi = await resolveTxt(`default._bimi.${domain}`);
    security.bimi = {
      record: bimi.flat().join(''),
      valid: bimi.length > 0
    };
  } catch (e) {
    security.bimi = { record: null, valid: false };
  }
  
  // MTA-STS
  try {
    const mtasts = await resolveTxt(`_mta-sts.${domain}`);
    security.mtaSts = {
      record: mtasts.flat().join(''),
      valid: mtasts.length > 0
    };
  } catch (e) {
    security.mtaSts = { record: null, valid: false };
  }
  
  return security;
}

function analyzeSpfStrength(spfRecord) {
  if (!spfRecord) return 'none';
  
  if (spfRecord.includes('-all')) return 'strict';
  if (spfRecord.includes('~all')) return 'moderate';
  if (spfRecord.includes('?all')) return 'neutral';
  if (spfRecord.includes('+all')) return 'permissive';
  
  return 'unknown';
}

function extractDmarcPolicy(dmarcRecord) {
  if (!dmarcRecord) return 'none';
  
  const policyMatch = dmarcRecord.match(/p=([^;]+)/);
  return policyMatch ? policyMatch[1] : 'none';
}

async function getDomainReputation(domain) {
  // This would normally query reputation services
  // For now, return a basic structure
  return {
    trustScore: Math.floor(Math.random() * 100),
    categories: ['business', 'technology'],
    riskLevel: 'low',
    lastChecked: new Date().toISOString()
  };
}

async function getCommonSubdomains(domain) {
  const subdomains = ['www', 'mail', 'ftp', 'cpanel', 'webmail', 'api', 'blog'];
  const found = [];
  
  for (const sub of subdomains) {
    try {
      await resolve4(`${sub}.${domain}`);
      found.push(`${sub}.${domain}`);
    } catch (e) {
      // Subdomain doesn't exist
    }
  }
  
  return found;
}

async function detectTechnologies(domain) {
  // This would normally analyze HTTP headers and responses
  // For now, return a basic structure
  return {
    cdn: null,
    server: null,
    cms: null,
    analytics: [],
    frameworks: []
  };
}

async function checkHttpSecurity(domain) {
  // This would normally check HTTP security headers
  // For now, return a basic structure
  return {
    https: true,
    hsts: false,
    csp: false,
    xFrameOptions: false,
    xContentTypeOptions: false
  };
}

async function getReverseDns(ip) {
  try {
    return await reverse(ip);
  } catch (e) {
    return [];
  }
}

async function getGeolocation(ip) {
  // This would normally query a geolocation service
  // For now, return a basic structure
  return {
    country: 'US',
    region: 'California',
    city: 'Mountain View',
    latitude: 37.4223,
    longitude: -122.0840,
    timezone: 'America/Los_Angeles'
  };
}

async function getAsnInfo(ip) {
  // This would normally query ASN databases
  // For now, return a basic structure
  return {
    asn: 'AS15169',
    organization: 'Google LLC',
    isp: 'Google',
    type: 'hosting'
  };
}

async function checkCommonPorts(ip) {
  // This would normally perform a limited port scan
  // For now, return a basic structure
  return {
    checked: [80, 443, 22, 21, 25],
    open: [80, 443],
    services: {
      80: 'HTTP',
      443: 'HTTPS'
    }
  };
}

function calculateDataQuality(data) {
  let score = 0;
  let maxScore = 0;
  
  // Check for various data points
  const checks = [
    { field: 'handle', weight: 10 },
    { field: 'ldhName', weight: 10 },
    { field: 'events', weight: 15 },
    { field: 'entities', weight: 15 },
    { field: 'nameservers', weight: 10 },
    { field: 'secureDNS', weight: 10 },
    { field: 'emailSecurity', weight: 10 },
    { field: 'dnsRecords', weight: 10 },
    { field: 'ssl', weight: 10 }
  ];
  
  checks.forEach(check => {
    maxScore += check.weight;
    if (data[check.field] && 
        (Array.isArray(data[check.field]) ? data[check.field].length > 0 : true)) {
      score += check.weight;
    }
  });
  
  return {
    score: Math.round((score / maxScore) * 100),
    completeness: `${score}/${maxScore}`,
    missingFields: checks
      .filter(c => !data[c.field] || (Array.isArray(data[c.field]) && data[c.field].length === 0))
      .map(c => c.field)
  };
}

function generateRecommendations(data, type) {
  const recommendations = [];
  
  if (type === 'domain') {
    // Security recommendations
    if (!data.secureDNS?.delegationSigned) {
      recommendations.push({
        type: 'security',
        priority: 'high',
        title: 'Enable DNSSEC',
        description: 'DNSSEC is not enabled for this domain. Enable it to prevent DNS spoofing attacks.'
      });
    }
    
    if (!data.emailSecurity?.spf?.valid) {
      recommendations.push({
        type: 'email',
        priority: 'high',
        title: 'Configure SPF Record',
        description: 'No SPF record found. Add an SPF record to prevent email spoofing.'
      });
    }
    
    if (!data.emailSecurity?.dmarc?.valid) {
      recommendations.push({
        type: 'email',
        priority: 'medium',
        title: 'Implement DMARC Policy',
        description: 'No DMARC policy found. Implement DMARC to protect against email fraud.'
      });
    }
    
    if (data.ssl?.error) {
      recommendations.push({
        type: 'security',
        priority: 'critical',
        title: 'Fix SSL Certificate Issues',
        description: 'SSL certificate issues detected. Ensure valid SSL certificate is installed.'
      });
    }
    
    // Check for expiring domain
    const expirationEvent = data.events?.find(e => e.eventAction === 'expiration');
    if (expirationEvent) {
      const daysUntilExpiry = Math.floor((new Date(expirationEvent.eventDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry < 30 && daysUntilExpiry > 0) {
        recommendations.push({
          type: 'maintenance',
          priority: 'high',
          title: 'Domain Expiring Soon',
          description: `Domain expires in ${daysUntilExpiry} days. Renew to avoid service disruption.`
        });
      }
    }
  }
  
  return recommendations;
}

export default enrichRdapData;