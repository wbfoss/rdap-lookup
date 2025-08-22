// Validation utilities for security tools
export const validateDomain = (domain) => {
  if (!domain || typeof domain !== 'string') {
    throw new Error('Domain is required');
  }
  
  const cleanDomain = domain.trim().toLowerCase();
  
  if (!cleanDomain) {
    throw new Error('Domain cannot be empty');
  }
  
  // Basic domain format validation
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!domainRegex.test(cleanDomain)) {
    throw new Error('Invalid domain format. Please enter a valid domain name (e.g., example.com)');
  }
  
  // Check for minimum length
  if (cleanDomain.length < 3) {
    throw new Error('Domain name is too short');
  }
  
  // Check for maximum length
  if (cleanDomain.length > 255) {
    throw new Error('Domain name is too long');
  }
  
  // Check if it has at least one dot (TLD)
  if (!cleanDomain.includes('.')) {
    throw new Error('Domain must include a top-level domain (e.g., .com, .org)');
  }
  
  return cleanDomain;
};

export const validateIP = (ip) => {
  if (!ip || typeof ip !== 'string') {
    throw new Error('IP address is required');
  }
  
  const cleanIP = ip.trim();
  
  // IPv4 validation
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  // IPv6 validation (simplified)
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  
  if (!ipv4Regex.test(cleanIP) && !ipv6Regex.test(cleanIP)) {
    throw new Error('Invalid IP address format');
  }
  
  return cleanIP;
};

export const validateDomainOrIP = (input) => {
  if (!input || typeof input !== 'string') {
    throw new Error('Domain or IP address is required');
  }
  
  const cleanInput = input.trim().toLowerCase();
  
  try {
    // Try IP validation first
    return { type: 'ip', value: validateIP(cleanInput) };
  } catch {
    try {
      // Try domain validation
      return { type: 'domain', value: validateDomain(cleanInput) };
    } catch (domainError) {
      throw new Error('Please enter a valid domain name or IP address');
    }
  }
};

// DNS over HTTPS utilities
export const fetchDNSRecord = async (domain, recordType = 'TXT') => {
  const response = await fetch(
    `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${recordType}`,
    {
      headers: {
        'Accept': 'application/dns-json'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`DNS lookup failed: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (data.Status !== 0) {
    throw new Error(`DNS query failed with status: ${data.Status}`);
  }
  
  return data;
};

export const fetchMultipleDNSRecords = async (domain, recordTypes = ['A', 'MX', 'TXT']) => {
  const promises = recordTypes.map(type => 
    fetchDNSRecord(domain, type).catch(error => ({ error: error.message, type }))
  );
  
  const results = await Promise.all(promises);
  
  const recordMap = {};
  results.forEach((result, index) => {
    const type = recordTypes[index];
    if (result.error) {
      recordMap[type] = { error: result.error };
    } else {
      recordMap[type] = result;
    }
  });
  
  return recordMap;
};

// RDAP utilities
export const fetchRDAPData = async (domain) => {
  const response = await fetch(`/api/lookup?query=${encodeURIComponent(domain)}&type=domain`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `RDAP lookup failed: ${response.status}`);
  }
  
  return response.json();
};

// Rate limiting utility
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }
  
  async waitForSlot() {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.windowMs - (now - oldestRequest);
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.waitForSlot();
      }
    }
    
    this.requests.push(now);
  }
}

export const dnsRateLimiter = new RateLimiter(20, 60000); // 20 requests per minute
export const rdapRateLimiter = new RateLimiter(10, 60000); // 10 requests per minute

// Fetch with timeout and retry
export const fetchWithRetry = async (url, options = {}, maxRetries = 3, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
    
    if (maxRetries > 0 && (error.message.includes('fetch') || error.message.includes('network'))) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return fetchWithRetry(url, options, maxRetries - 1, timeout);
    }
    
    throw error;
  }
};

// Common SSL/TLS checking
export const checkHTTPS = async (domain) => {
  try {
    const response = await fetchWithRetry(`https://${domain}`, { 
      method: 'HEAD',
      mode: 'no-cors'
    }, 1, 5000);
    
    return {
      available: true,
      status: response.status || 200
    };
  } catch (error) {
    return {
      available: false,
      error: error.message
    };
  }
};

// Security header parsing
export const parseSecurityHeaders = (headers) => {
  const securityHeaders = {};
  
  // HSTS
  const hsts = headers.get('strict-transport-security');
  if (hsts) {
    securityHeaders.hsts = {
      enabled: true,
      maxAge: parseInt(hsts.match(/max-age=(\d+)/)?.[1] || '0'),
      includeSubdomains: hsts.includes('includeSubDomains'),
      preload: hsts.includes('preload')
    };
  }
  
  // CSP
  const csp = headers.get('content-security-policy');
  if (csp) {
    securityHeaders.csp = {
      enabled: true,
      policy: csp
    };
  }
  
  // X-Frame-Options
  const xfo = headers.get('x-frame-options');
  if (xfo) {
    securityHeaders.xFrameOptions = {
      enabled: true,
      value: xfo
    };
  }
  
  // X-Content-Type-Options
  const xcto = headers.get('x-content-type-options');
  if (xcto) {
    securityHeaders.xContentTypeOptions = {
      enabled: true,
      value: xcto
    };
  }
  
  return securityHeaders;
};

// Suspicious TLD list
export const SUSPICIOUS_TLDS = [
  'tk', 'ml', 'ga', 'cf', 'pp.ua', 'icu', 'top', 'click', 'download',
  'stream', 'science', 'racing', 'party', 'review', 'trade', 'accountant',
  'loan', 'men', 'cricket', 'date', 'faith', 'gdn', 'win', 'bid'
];

export const checkSuspiciousTLD = (domain) => {
  const tld = domain.split('.').pop().toLowerCase();
  return SUSPICIOUS_TLDS.includes(tld);
};

// Common typosquatting patterns
export const generateTyposquatVariations = (domain, maxVariations = 50) => {
  const variations = new Set();
  const baseDomain = domain.toLowerCase();
  const [domainName, ...tldParts] = baseDomain.split('.');
  const tld = tldParts.join('.');
  
  // Character substitution patterns
  const substitutions = {
    'a': ['e', 'o', 's', 'q', '@'],
    'e': ['a', 'i', 'o', '3'],
    'i': ['o', 'u', 'e', 'l', '1'],
    'o': ['i', 'u', 'a', '0'],
    'u': ['i', 'o', 'y'],
    'l': ['1', 'i', 'j'],
    'm': ['n', 'rn'],
    'n': ['m', 'h'],
    'r': ['t', 'n'],
    't': ['r', 'f'],
    's': ['5', 'z', '$'],
    'z': ['s', '2'],
    '0': ['o', 'O'],
    '1': ['l', 'i', 'I']
  };
  
  // Character omission
  for (let i = 0; i < domainName.length; i++) {
    const omitted = domainName.slice(0, i) + domainName.slice(i + 1);
    if (omitted.length > 1) {
      variations.add(`${omitted}.${tld}`);
    }
  }
  
  // Character insertion
  const commonInserts = ['a', 'e', 'i', 'o', 'u', 'l', 'r', 'n', 'm', '1'];
  for (let i = 0; i <= domainName.length && variations.size < maxVariations; i++) {
    for (const char of commonInserts) {
      const inserted = domainName.slice(0, i) + char + domainName.slice(i);
      variations.add(`${inserted}.${tld}`);
    }
  }
  
  // Character substitution
  for (let i = 0; i < domainName.length && variations.size < maxVariations; i++) {
    const currentChar = domainName[i];
    if (substitutions[currentChar]) {
      for (const newChar of substitutions[currentChar]) {
        const substituted = domainName.slice(0, i) + newChar + domainName.slice(i + 1);
        variations.add(`${substituted}.${tld}`);
      }
    }
  }
  
  // QWERTY keyboard adjacent keys
  const qwertyMap = {
    'q': ['w', 'a'], 'w': ['q', 'e', 's'], 'e': ['w', 'r', 'd'], 'r': ['e', 't', 'f'],
    't': ['r', 'y', 'g'], 'y': ['t', 'u', 'h'], 'u': ['y', 'i', 'j'], 'i': ['u', 'o', 'k'],
    'o': ['i', 'p', 'l'], 'p': ['o', 'l'],
    'a': ['q', 's', 'z'], 's': ['a', 'd', 'w', 'x'], 'd': ['s', 'f', 'e', 'c'],
    'f': ['d', 'g', 'r', 'v'], 'g': ['f', 'h', 't', 'b'], 'h': ['g', 'j', 'y', 'n'],
    'j': ['h', 'k', 'u', 'm'], 'k': ['j', 'l', 'i'], 'l': ['k', 'o'],
    'z': ['a', 'x'], 'x': ['z', 'c', 's'], 'c': ['x', 'v', 'd'], 'v': ['c', 'b', 'f'],
    'b': ['v', 'n', 'g'], 'n': ['b', 'm', 'h'], 'm': ['n', 'j']
  };
  
  for (let i = 0; i < domainName.length && variations.size < maxVariations; i++) {
    const currentChar = domainName[i];
    if (qwertyMap[currentChar]) {
      for (const newChar of qwertyMap[currentChar]) {
        const substituted = domainName.slice(0, i) + newChar + domainName.slice(i + 1);
        variations.add(`${substituted}.${tld}`);
      }
    }
  }
  
  return Array.from(variations).slice(0, maxVariations);
};

// Homograph attack detection
export const generateHomographVariations = (domain, maxVariations = 30) => {
  const variations = new Set();
  const baseDomain = domain.toLowerCase();
  const [domainName, ...tldParts] = baseDomain.split('.');
  const tld = tldParts.join('.');
  
  // Common homograph substitutions
  const homographs = {
    'a': ['а', 'α', 'à', 'á', 'ā'], // Cyrillic, Greek, accented
    'e': ['е', 'ε', 'è', 'é', 'ē'],
    'o': ['о', 'ο', 'ò', 'ó', 'ō', '0'],
    'p': ['р', 'ρ'],
    'c': ['с', 'ç'],
    'x': ['х', 'χ'],
    'y': ['у', 'ỳ', 'ý'],
    'i': ['і', 'ι', 'ì', 'í', '1', 'l'],
    'n': ['η'],
    'h': ['һ'],
    's': ['ѕ', '$'],
    'b': ['ḃ'],
    'd': ['ḋ'],
    'g': ['ġ'],
    'm': ['ṁ'],
    't': ['ṫ']
  };
  
  // Generate variations with homograph substitutions
  for (let i = 0; i < domainName.length && variations.size < maxVariations; i++) {
    const currentChar = domainName[i];
    if (homographs[currentChar]) {
      for (const substitute of homographs[currentChar]) {
        const variant = domainName.slice(0, i) + substitute + domainName.slice(i + 1);
        variations.add(`${variant}.${tld}`);
      }
    }
  }
  
  return Array.from(variations).slice(0, maxVariations);
};

export default {
  validateDomain,
  validateIP,
  validateDomainOrIP,
  fetchDNSRecord,
  fetchMultipleDNSRecords,
  fetchRDAPData,
  fetchWithRetry,
  checkHTTPS,
  parseSecurityHeaders,
  checkSuspiciousTLD,
  generateTyposquatVariations,
  generateHomographVariations,
  dnsRateLimiter,
  rdapRateLimiter,
  SUSPICIOUS_TLDS
};