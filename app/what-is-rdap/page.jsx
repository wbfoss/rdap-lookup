import { BookOpen, Zap, Shield, Globe, Server, Database, Lock, Search, CheckCircle, ArrowRight } from "lucide-react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";

export const metadata = {
  title: 'What is RDAP? Complete Guide to Registration Data Access Protocol | RDAP vs WHOIS',
  description: 'Learn what RDAP (Registration Data Access Protocol) is, how it works, and why it\'s replacing WHOIS. Comprehensive guide covering RDAP benefits, API usage, security features, and implementation for domain lookup, IP queries, and network intelligence.',
  keywords: [
    'what is RDAP',
    'RDAP vs WHOIS',
    'Registration Data Access Protocol',
    'RDAP protocol explained',
    'RDAP API documentation',
    'how does RDAP work',
    'RDAP benefits over WHOIS',
    'RDAP JSON format',
    'RDAP security features',
    'RDAP privacy compliance',
    'RDAP GDPR compliance',
    'RDAP implementation guide',
    'RDAP query examples',
    'RDAP REST API',
    'RDAP structured data',
    'RDAP internationalization',
    'RDAP domain lookup tutorial',
    'RDAP IP address lookup',
    'RDAP ASN lookup guide',
    'RDAP authentication',
    'RDAP rate limiting',
    'RDAP bootstrap service',
    'RDAP server list',
    'RDAP RFC 7483',
    'IETF RDAP standard'
  ],
  alternates: {
    canonical: 'https://rdap.vercel.app/what-is-rdap',
  },
  openGraph: {
    title: 'What is RDAP? Complete Guide to Registration Data Access Protocol',
    description: 'Learn everything about RDAP - the modern replacement for WHOIS. Understand how RDAP works, its benefits, API usage, and why it\'s the future of domain and network intelligence.',
    url: 'https://rdap.vercel.app/what-is-rdap',
    type: 'article',
  },
};

export default function WhatIsRdapPage() {
  const breadcrumbItems = [
    { label: "What is RDAP?", href: null }
  ];

  return (
    <div className="min-h-screen bg-gray-50 bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumb items={breadcrumbItems} />
        {/* Hero Section */}
        <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-100 from-gray-800 to-gray-700 rounded-lg p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 bg-blue-900 rounded-xl">
              <BookOpen className="w-8 h-8 text-blue-600 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-white">What is RDAP? The Complete Guide</h1>
              <p className="text-lg text-gray-600 text-gray-300 mt-1">Understanding Registration Data Access Protocol - The Modern WHOIS Replacement</p>
            </div>
          </div>
          <p className="text-gray-700 text-gray-300 mt-4 text-lg leading-relaxed">
            Understanding the modern replacement for WHOIS - faster, more secure, and developer-friendly.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8">
          {/* Introduction */}
          <div className="bg-white bg-gray-800 rounded-lg shadow-sm border border-gray-200 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-blue-600 text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 text-white">What is RDAP (Registration Data Access Protocol)?</h2>
            </div>
            <hr className="border-gray-200 border-gray-600 mb-4" />
            <div>
              <p className="text-gray-700 text-gray-300 mb-4">
                RDAP (Registration Data Access Protocol) is a modern internet protocol designed to replace the 40-year-old WHOIS protocol for querying registration data of internet resources like domain names, IP addresses, and Autonomous System Numbers (ASNs). Developed by the Internet Engineering Task Force (IETF) and standardized in RFC 7483, RDAP provides structured, machine-readable data in JSON format.
              </p>
              <p className="text-gray-700 text-gray-300">
                Unlike WHOIS which returns unstructured plain text that varies between registrars, RDAP delivers consistent, standardized responses that applications can easily parse and process. This makes RDAP essential for developers building domain monitoring tools, cybersecurity applications, and compliance systems.
              </p>
            </div>
          </div>

          {/* Key Advantages */}
          <div className="bg-white bg-gray-800 rounded-lg shadow-sm border border-gray-200 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900 text-white">RDAP vs WHOIS: Key Advantages</h2>
            </div>
            <hr className="border-gray-200 border-gray-600 mb-4" />
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Database className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-white mb-1">Structured JSON Data</h3>
                      <p className="text-sm text-gray-600 text-gray-400">
                        Standardized JSON format eliminates parsing issues, enables reliable automation and integration with modern APIs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-white mb-1">Enhanced Security & GDPR</h3>
                      <p className="text-sm text-gray-600 text-gray-400">
                        HTTPS encryption by default with tiered access control for GDPR compliance and privacy protection.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Globe className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-white mb-1">Internationalization</h3>
                      <p className="text-sm text-gray-600 text-gray-400">
                        Native support for non-ASCII characters and IDNs in multiple languages including Chinese, Arabic, and Cyrillic.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Zap className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-white mb-1">RESTful API</h3>
                      <p className="text-sm text-gray-600 text-gray-400">
                        Predictable URL patterns like /domain/example.com make it intuitive for developers.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Lock className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-white mb-1">Authentication Support</h3>
                      <p className="text-sm text-gray-600 text-gray-400">
                        OAuth 2.0 support with built-in rate limiting for fair access and abuse prevention.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Server className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-white mb-1">Bootstrap Discovery</h3>
                      <p className="text-sm text-gray-600 text-gray-400">
                        Automatic discovery of correct RDAP server eliminates need for registry endpoints knowledge.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white bg-gray-800 rounded-lg shadow-sm border border-gray-200 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-6 h-6 text-purple-600 text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-900 text-white">How Does RDAP Work?</h2>
            </div>
            <hr className="border-gray-200 border-gray-600 mb-4" />
            <div>
              <p className="text-gray-700 text-gray-300 mb-4">
                RDAP operates as a RESTful web service over HTTPS. When you query a domain, IP address, or ASN, the RDAP client first consults the IANA bootstrap service to determine the authoritative RDAP server. The query is then forwarded to the appropriate registry or registrar's RDAP endpoint.
              </p>
              
              <div className="bg-gray-100 bg-gray-700 rounded-lg p-4 mb-4">
                <p className="font-semibold text-gray-900 text-white mb-3">RDAP returns structured JSON data containing:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Object class information",
                    "Registration details & dates",
                    "Status codes & lock states",
                    "Contact data (privacy-compliant)",
                    "Nameserver information",
                    "DNSSEC details",
                    "Related links & resources",
                    "Events history"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700 text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <p className="text-green-400 text-sm mb-2"># Example RDAP queries:</p>
                <pre className="text-gray-300 text-sm">
{`GET https://rdap.verisign.com/domain/example.com
GET https://rdap.arin.net/registry/ip/192.0.2.0
GET https://rdap.arin.net/registry/autnum/65536`}
                </pre>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="bg-white bg-gray-800 rounded-lg shadow-sm border border-gray-200 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-6 h-6 text-blue-600 text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 text-white">Common RDAP Use Cases</h2>
            </div>
            <hr className="border-gray-200 border-gray-600 mb-4" />
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 bg-blue-900/20 rounded-lg p-4 border border-blue-200 border-blue-800">
                  <h3 className="font-semibold text-gray-900 text-white mb-2">🔍 Domain Intelligence</h3>
                  <p className="text-sm text-gray-600 text-gray-400">
                    Track expiration dates, monitor ownership changes, detect suspicious registrations, and manage domain portfolios.
                  </p>
                </div>
                
                <div className="bg-green-50 bg-green-900/20 rounded-lg p-4 border border-green-200 border-green-800">
                  <h3 className="font-semibold text-gray-900 text-white mb-2">🛡️ Cybersecurity</h3>
                  <p className="text-sm text-gray-600 text-gray-400">
                    Investigate malicious domains, trace attack infrastructure, and build automated threat detection systems.
                  </p>
                </div>
                
                <div className="bg-yellow-50 bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 border-yellow-800">
                  <h3 className="font-semibold text-gray-900 text-white mb-2">⚖️ Compliance & Legal</h3>
                  <p className="text-sm text-gray-600 text-gray-400">
                    Verify ownership for legal proceedings, ensure trademark compliance, and maintain audit trails.
                  </p>
                </div>
                
                <div className="bg-purple-50 bg-purple-900/20 rounded-lg p-4 border border-purple-200 border-purple-800">
                  <h3 className="font-semibold text-gray-900 text-white mb-2">🌐 Network Operations</h3>
                  <p className="text-sm text-gray-600 text-gray-400">
                    Query IP allocations, research ASN information, troubleshoot routing issues, and maintain network docs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Implementation Status */}
          <div className="bg-white bg-gray-800 rounded-lg shadow-sm border border-gray-200 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-green-600 text-green-400" />
              <h2 className="text-xl font-semibold text-gray-900 text-white">RDAP Implementation Status</h2>
            </div>
            <hr className="border-gray-200 border-gray-600 mb-4" />
            <div>
              <p className="text-gray-700 text-gray-300 mb-4">
                RDAP is now mandatory for all ICANN-accredited registrars and registries:
              </p>
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 bg-blue-900 text-blue-200">
                    gTLDs
                  </span>
                  <span className="text-gray-600 text-gray-400">All generic top-level domains (.com, .org, .net)</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 bg-purple-900 text-purple-200">
                    ccTLDs
                  </span>
                  <span className="text-gray-600 text-gray-400">Many country codes (.uk, .ca, .au)</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 bg-green-900 text-green-200">
                    RIRs
                  </span>
                  <span className="text-gray-600 text-gray-400">ARIN, RIPE NCC, APNIC, LACNIC, AFRINIC</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 bg-yellow-900 text-yellow-200">
                    Registrars
                  </span>
                  <span className="text-gray-600 text-gray-400">GoDaddy, Namecheap, Cloudflare, and more</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
            <Search className="w-12 h-12 text-blue-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Try RDAP Lookup Now</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Experience the power of RDAP with our free lookup tool. Get comprehensive domain intelligence, IP information, and network data instantly.
            </p>
            <a 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start RDAP Lookup
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* FAQ Section */}
          <div className="bg-white bg-gray-800 rounded-lg shadow-sm border border-gray-200 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900 text-white">Frequently Asked Questions</h2>
            </div>
            <hr className="border-gray-200 border-gray-600 mb-4" />
            <div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-600 text-blue-400 mb-1">Is RDAP replacing WHOIS completely?</h3>
                  <p className="text-sm text-gray-600 text-gray-400">
                    Yes, RDAP is the designated successor to WHOIS. While WHOIS remains for backward compatibility, RDAP is now the primary protocol.
                  </p>
                </div>
                <hr className="border-gray-200 border-gray-600" />
                <div>
                  <h3 className="font-semibold text-blue-600 text-blue-400 mb-1">Is RDAP free to use?</h3>
                  <p className="text-sm text-gray-600 text-gray-400">
                    Yes, basic RDAP queries are free. Some registries may require authentication for enhanced data or high-volume queries.
                  </p>
                </div>
                <hr className="border-gray-200 border-gray-600" />
                <div>
                  <h3 className="font-semibold text-blue-600 text-blue-400 mb-1">How is RDAP more privacy-compliant?</h3>
                  <p className="text-sm text-gray-600 text-gray-400">
                    RDAP supports tiered access control, redacting personal information for unauthenticated queries while ensuring GDPR compliance.
                  </p>
                </div>
                <hr className="border-gray-200 border-gray-600" />
                <div>
                  <h3 className="font-semibold text-blue-600 text-blue-400 mb-1">Can I query expired domains?</h3>
                  <p className="text-sm text-gray-600 text-gray-400">
                    Yes, RDAP can return information about expired domains, including expiration dates and redemption status.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}