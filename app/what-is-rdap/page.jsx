import { Card, CardBody, CardHeader, Divider, Link } from "@heroui/react";
import { BookOpen, Zap, Shield, Globe, Server, Database, Lock, Search } from "lucide-react";

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
    images: [
      {
        url: '/api/og?title=What+is+RDAP?&description=Complete+Guide+to+Registration+Data+Access+Protocol',
        width: 1200,
        height: 630,
        alt: 'What is RDAP - Complete Guide',
      },
    ],
  },
};

export default function WhatIsRdapPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "What is RDAP? Complete Guide to Registration Data Access Protocol",
    "description": "Comprehensive guide explaining RDAP (Registration Data Access Protocol), its advantages over WHOIS, implementation details, and how to use RDAP for domain and network intelligence.",
    "author": {
      "@type": "Organization",
      "name": "RDAP Lookup Team"
    },
    "datePublished": "2024-01-15",
    "dateModified": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://rdap.vercel.app/what-is-rdap"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RDAP Lookup",
      "url": "https://rdap.vercel.app"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">What is RDAP? The Complete Guide</h1>
                <p className="text-default-500 mt-2">Understanding Registration Data Access Protocol - The Modern WHOIS Replacement</p>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">What is RDAP (Registration Data Access Protocol)?</h2>
              <p className="text-default-600 mb-4">
                RDAP (Registration Data Access Protocol) is a modern internet protocol designed to replace the 40-year-old WHOIS protocol for querying registration data of internet resources like domain names, IP addresses, and Autonomous System Numbers (ASNs). Developed by the Internet Engineering Task Force (IETF) and standardized in RFC 7483, RDAP provides structured, machine-readable data in JSON format, making it the preferred choice for automated domain intelligence and network analysis tools.
              </p>
              <p className="text-default-600">
                Unlike WHOIS which returns unstructured plain text that varies between registrars, RDAP delivers consistent, standardized responses that applications can easily parse and process. This makes RDAP essential for developers building domain monitoring tools, cybersecurity applications, and compliance systems.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">RDAP vs WHOIS: Key Differences and Advantages</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <Database className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Structured JSON Data Format</h3>
                    <p className="text-sm text-default-600 mt-1">
                      RDAP returns data in standardized JSON format, eliminating the parsing nightmares of WHOIS plain text. This structured format enables reliable automation, data extraction, and integration with modern APIs and applications.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Shield className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Enhanced Security & GDPR Compliance</h3>
                    <p className="text-sm text-default-600 mt-1">
                      RDAP uses HTTPS encryption by default and includes built-in mechanisms for tiered access control and data redaction. This ensures GDPR compliance and protects personal information while maintaining transparency for legitimate queries.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Globe className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Full Internationalization Support</h3>
                    <p className="text-sm text-default-600 mt-1">
                      RDAP natively handles non-ASCII characters and Internationalized Domain Names (IDNs), supporting queries and responses in multiple languages including Chinese, Arabic, Cyrillic, and other Unicode scripts.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">RESTful API Architecture</h3>
                    <p className="text-sm text-default-600 mt-1">
                      RDAP follows REST principles with predictable URL patterns and HTTP methods. Queries like /domain/example.com or /ip/192.0.2.1 make it intuitive for developers familiar with modern web APIs.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Lock className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Authentication & Rate Limiting</h3>
                    <p className="text-sm text-default-600 mt-1">
                      RDAP supports OAuth 2.0 and other authentication methods, enabling differentiated access levels. Built-in rate limiting prevents abuse while ensuring fair access to registration data.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Server className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Bootstrap Service Discovery</h3>
                    <p className="text-sm text-default-600 mt-1">
                      RDAP includes a bootstrap mechanism that automatically discovers the correct RDAP server for any query, eliminating the need to know specific registry endpoints beforehand.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How Does RDAP Work? Technical Overview</h2>
              <p className="text-default-600 mb-4">
                RDAP operates as a RESTful web service over HTTPS. When you query a domain, IP address, or ASN, the RDAP client first consults the IANA bootstrap service to determine the authoritative RDAP server. The query is then forwarded to the appropriate registry or registrar's RDAP endpoint, which returns structured JSON data containing:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-default-600">
                <li><strong>Object Class Information:</strong> Type of resource (domain, IP network, ASN, entity)</li>
                <li><strong>Registration Details:</strong> Creation date, expiration date, last updated timestamp</li>
                <li><strong>Status Information:</strong> EPP status codes, lock states, transfer eligibility</li>
                <li><strong>Contact Data:</strong> Registrant, admin, technical contacts (subject to privacy regulations)</li>
                <li><strong>Nameserver Information:</strong> Authoritative DNS servers and glue records</li>
                <li><strong>DNSSEC Details:</strong> DS records, algorithm information, key tags</li>
                <li><strong>Related Links:</strong> Self-links, related objects, terms of service</li>
                <li><strong>Events History:</strong> Registration events, transfers, updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Common RDAP Use Cases and Applications</h2>
              <div className="space-y-4">
                <div className="bg-default-50 dark:bg-default-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">🔍 Domain Intelligence and Monitoring</h3>
                  <p className="text-sm text-default-600">
                    Track domain expiration dates, monitor ownership changes, detect suspicious registrations, and build comprehensive domain portfolio management systems using RDAP's structured data.
                  </p>
                </div>
                <div className="bg-default-50 dark:bg-default-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">🛡️ Cybersecurity and Threat Intelligence</h3>
                  <p className="text-sm text-default-600">
                    Investigate malicious domains, trace attack infrastructure, perform incident response, and build automated threat detection systems leveraging RDAP's consistent data format.
                  </p>
                </div>
                <div className="bg-default-50 dark:bg-default-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">⚖️ Compliance and Legal Research</h3>
                  <p className="text-sm text-default-600">
                    Verify domain ownership for legal proceedings, ensure trademark compliance, investigate intellectual property disputes, and maintain audit trails with RDAP's authenticated responses.
                  </p>
                </div>
                <div className="bg-default-50 dark:bg-default-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">🌐 Network Operations and Management</h3>
                  <p className="text-sm text-default-600">
                    Query IP allocations, research ASN information, troubleshoot routing issues, and maintain network documentation using RDAP's comprehensive network data.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">RDAP Query Examples and API Usage</h2>
              <p className="text-default-600 mb-4">
                Here are common RDAP query patterns for different resource types:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm space-y-2">
                <div className="text-green-400"># Domain lookup</div>
                <div>GET https://rdap.verisign.com/domain/example.com</div>
                <div className="mt-3 text-green-400"># IP address lookup</div>
                <div>GET https://rdap.arin.net/registry/ip/192.0.2.0</div>
                <div className="mt-3 text-green-400"># ASN lookup</div>
                <div>GET https://rdap.arin.net/registry/autnum/65536</div>
                <div className="mt-3 text-green-400"># Entity (organization) lookup</div>
                <div>GET https://rdap.arin.net/registry/entity/EXAMPLE-ORG</div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">RDAP Implementation and Adoption Status</h2>
              <p className="text-default-600 mb-4">
                RDAP is now mandatory for all ICANN-accredited registrars and registries. Major implementations include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-default-600">
                <li><strong>gTLD Registries:</strong> All generic top-level domains (.com, .org, .net, etc.) support RDAP</li>
                <li><strong>ccTLD Registries:</strong> Many country-code TLDs have adopted RDAP (.uk, .ca, .au, etc.)</li>
                <li><strong>Regional Internet Registries:</strong> ARIN, RIPE NCC, APNIC, LACNIC, and AFRINIC all provide RDAP services</li>
                <li><strong>Domain Registrars:</strong> GoDaddy, Namecheap, Cloudflare, and other major registrars offer RDAP endpoints</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Getting Started with RDAP</h2>
              <p className="text-default-600 mb-4">
                Ready to start using RDAP for your domain and network intelligence needs? Here's how:
              </p>
              <ol className="list-decimal pl-6 space-y-3 text-default-600">
                <li>
                  <strong>Use Our Free RDAP Lookup Tool:</strong> The easiest way to query RDAP data is through our{" "}
                  <Link href="/" className="text-primary hover:underline">
                    web-based RDAP lookup tool
                  </Link>
                  . Simply enter a domain, IP address, or ASN to get instant results.
                </li>
                <li>
                  <strong>Access RDAP APIs Directly:</strong> For programmatic access, use the IANA bootstrap service at{" "}
                  <code className="bg-default-100 px-1 py-0.5 rounded">https://data.iana.org/rdap/</code> to discover RDAP endpoints.
                </li>
                <li>
                  <strong>Implement RDAP Clients:</strong> Use libraries like Python's rdap, Node.js rdap-client, or build custom integrations using standard HTTP clients.
                </li>
                <li>
                  <strong>Review RDAP Standards:</strong> Familiarize yourself with RFC 7483 (JSON Responses), RFC 7484 (Registration Data), and RFC 9082 (RDAP Protocol).
                </li>
              </ol>
            </section>

            <section className="bg-primary/5 dark:bg-primary/10 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Try RDAP Lookup Now
              </h2>
              <p className="text-default-600 mb-4">
                Experience the power of RDAP with our free lookup tool. Get comprehensive domain intelligence, IP information, and network data instantly.
              </p>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Start RDAP Lookup →
              </Link>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions About RDAP</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Is RDAP replacing WHOIS completely?</h3>
                  <p className="text-sm text-default-600">
                    Yes, RDAP is the designated successor to WHOIS. While WHOIS remains available for backward compatibility, RDAP is now the primary protocol for registration data access.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Is RDAP free to use?</h3>
                  <p className="text-sm text-default-600">
                    Yes, basic RDAP queries are free. However, some registries may require authentication for enhanced data access or high-volume queries.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">How is RDAP more privacy-compliant than WHOIS?</h3>
                  <p className="text-sm text-default-600">
                    RDAP supports tiered access control, allowing registries to redact personal information for unauthenticated queries while providing full data to authorized users, ensuring GDPR and privacy law compliance.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Can I query expired domains with RDAP?</h3>
                  <p className="text-sm text-default-600">
                    Yes, RDAP can return information about expired domains, including expiration dates and redemption status, though data availability varies by registry policy.
                  </p>
                </div>
              </div>
            </section>
          </CardBody>
        </Card>
      </div>
    </>
  );
}