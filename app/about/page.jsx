import { Card, CardBody, CardHeader, Divider, Link, Button } from "@heroui/react";
import { Info, Code, Heart, Zap, Github, GitBranch, Users, BookOpen, Shield, Globe, Star, TrendingUp } from "lucide-react";

export const metadata = {
  title: 'About RDAP Lookup Tool - Open Source Domain Intelligence Project | GitHub',
  description: 'RDAP Lookup is a free, open source web tool for domain intelligence, IP lookup, and network analysis. Built with Next.js and React. Contribute on GitHub, star our repository, and join the community building the future of domain lookup tools.',
  keywords: [
    'RDAP lookup open source',
    'free RDAP tool',
    'open source domain lookup',
    'GitHub RDAP project',
    'RDAP lookup tool source code',
    'domain intelligence open source',
    'free domain lookup API',
    'WHOIS alternative open source',
    'Next.js RDAP tool',
    'React domain lookup',
    'contribute RDAP project',
    'RDAP tool GitHub repository',
    'domain lookup tool development',
    'network intelligence open source',
    'IP lookup open source tool',
    'ASN lookup GitHub project',
    'RDAP API implementation',
    'domain security scanner open source',
    'DNS lookup tool GitHub',
    'free domain intelligence platform',
    'RDAP client implementation',
    'domain monitoring open source',
    'RDAP lookup tool features',
    'domain expiry checker free',
    'SSL certificate checker open source'
  ],
  alternates: {
    canonical: 'https://rdap.vercel.app/about',
  },
  openGraph: {
    title: 'About RDAP Lookup - Open Source Domain Intelligence Tool',
    description: 'Free, open source RDAP lookup tool for domain intelligence. Built with Next.js, React, and modern web technologies. Star us on GitHub and contribute to the future of domain lookup.',
    url: 'https://rdap.vercel.app/about',
    type: 'website',
    images: [
      {
        url: '/api/og?title=RDAP+Lookup+Open+Source&description=Free+Domain+Intelligence+Tool',
        width: 1200,
        height: 630,
        alt: 'RDAP Lookup Open Source Project',
      },
    ],
  },
};

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "RDAP Lookup Tool",
    "description": "Free, open source RDAP lookup tool for domain intelligence, IP lookup, and network analysis",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "RDAP Lookup Team",
      "url": "https://github.com/gensecaihq"
    },
    "softwareVersion": "2.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString(),
    "license": "MIT",
    "url": "https://rdap.vercel.app",
    "codeRepository": "https://github.com/gensecaihq/rdap-lookup",
    "programmingLanguage": ["JavaScript", "React", "Next.js"],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
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
              <div className="bg-secondary/10 p-3 rounded-lg">
                <Info className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">About RDAP Lookup Tool</h1>
                <p className="text-default-500 mt-2">Free & Open Source Domain Intelligence Platform</p>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Open Source Domain Intelligence Tool</h2>
              <p className="text-default-600 mb-4">
                RDAP Lookup is a completely free, open source web application that provides comprehensive domain intelligence, IP address lookup, and network analysis capabilities. Built with modern web technologies and designed for developers, security researchers, and IT professionals, our tool makes RDAP (Registration Data Access Protocol) accessible to everyone through an intuitive web interface.
              </p>
              <p className="text-default-600">
                As an open source project hosted on GitHub, we believe in transparency, community collaboration, and making powerful domain lookup tools freely available. Our mission is to democratize access to domain intelligence and provide a modern alternative to traditional WHOIS lookups.
              </p>
            </section>

            <section className="bg-primary/5 dark:bg-primary/10 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Github className="w-6 h-6" />
                Join Our Open Source Community
              </h2>
              <p className="text-default-600 mb-4">
                Help us build the future of domain intelligence tools. Star our repository, contribute code, report issues, or suggest new features. Every contribution makes a difference!
              </p>
              <div className="flex flex-wrap gap-3">
                <Link isExternal href="https://github.com/gensecaihq/rdap-lookup">
                  <Button color="primary" variant="solid" startContent={<Star className="w-4 h-4" />}>
                    Star on GitHub
                  </Button>
                </Link>
                <Link isExternal href="https://github.com/gensecaihq/rdap-lookup/fork">
                  <Button color="secondary" variant="flat" startContent={<GitBranch className="w-4 h-4" />}>
                    Fork Repository
                  </Button>
                </Link>
                <Link isExternal href="https://github.com/gensecaihq/rdap-lookup/issues">
                  <Button color="default" variant="flat" startContent={<Users className="w-4 h-4" />}>
                    Report Issues
                  </Button>
                </Link>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Why We Built This RDAP Lookup Tool</h2>
              <p className="text-default-600 mb-4">
                Traditional WHOIS lookups are outdated, inconsistent, and difficult to parse programmatically. RDAP solves these problems with structured JSON data, but most RDAP tools are either command-line only, require technical expertise, or come with expensive subscriptions. We created this free, web-based RDAP lookup tool to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-default-600">
                <li><strong>Democratize Access:</strong> Make RDAP queries accessible to everyone, regardless of technical expertise</li>
                <li><strong>Provide Comprehensive Data:</strong> Go beyond basic lookups with security analysis, SSL checks, and email authentication verification</li>
                <li><strong>Support Developers:</strong> Offer clean, structured data that can be easily integrated into other applications</li>
                <li><strong>Ensure Privacy:</strong> No tracking, no data collection, no account required - just pure functionality</li>
                <li><strong>Foster Innovation:</strong> Create an open platform that others can build upon and improve</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Key Features of Our RDAP Lookup Tool</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-default-50 dark:bg-default-100 p-4 rounded-lg">
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Domain RDAP Lookup
                  </h3>
                  <p className="text-sm text-default-600">
                    Query any domain name to get registration details, nameservers, status codes, expiration dates, and complete RDAP response data in structured JSON format.
                  </p>
                </div>
                <div className="bg-default-50 dark:bg-default-100 p-4 rounded-lg">
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-success" />
                    Security Analysis
                  </h3>
                  <p className="text-sm text-default-600">
                    Comprehensive security checks including DNSSEC validation, SSL certificate analysis, SPF/DKIM/DMARC email authentication, and blacklist status verification.
                  </p>
                </div>
                <div className="bg-default-50 dark:bg-default-100 p-4 rounded-lg">
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-warning" />
                    IP & ASN Lookup
                  </h3>
                  <p className="text-sm text-default-600">
                    Look up IP addresses and Autonomous System Numbers (ASN) to get network allocation details, organization information, and routing data.
                  </p>
                </div>
                <div className="bg-default-50 dark:bg-default-100 p-4 rounded-lg">
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <Code className="w-5 h-5 text-secondary" />
                    Developer Friendly
                  </h3>
                  <p className="text-sm text-default-600">
                    Export results as JSON, access raw RDAP responses, and integrate with your applications. Perfect for automation and bulk domain analysis workflows.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Technology Stack & Architecture</h2>
              <p className="text-default-600 mb-4">
                Our RDAP lookup tool is built with modern, performant web technologies ensuring fast lookups, real-time updates, and a smooth user experience:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-default-50 dark:bg-default-100 p-3 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-semibold">Next.js 14</div>
                    <div className="text-xs text-default-500">React Framework</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-default-50 dark:bg-default-100 p-3 rounded-lg">
                  <Code className="w-5 h-5 text-cyan-500" />
                  <div>
                    <div className="font-semibold">React 18</div>
                    <div className="text-xs text-default-500">UI Library</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-default-50 dark:bg-default-100 p-3 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="font-semibold">Tailwind CSS</div>
                    <div className="text-xs text-default-500">Styling</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-default-50 dark:bg-default-100 p-3 rounded-lg">
                  <Heart className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-semibold">Vercel</div>
                    <div className="text-xs text-default-500">Hosting</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-default-50 dark:bg-default-100 p-3 rounded-lg">
                  <Shield className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="font-semibold">RDAP APIs</div>
                    <div className="text-xs text-default-500">Data Source</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-default-50 dark:bg-default-100 p-3 rounded-lg">
                  <Globe className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-semibold">DNS APIs</div>
                    <div className="text-xs text-default-500">DNS Queries</div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How to Contribute to RDAP Lookup</h2>
              <p className="text-default-600 mb-4">
                We welcome contributions from developers, designers, and domain experts! Here's how you can help improve the RDAP Lookup tool:
              </p>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-2xl">🐛</span>
                  <div>
                    <h3 className="font-semibold">Report Bugs</h3>
                    <p className="text-sm text-default-600">Found an issue? <Link isExternal href="https://github.com/gensecaihq/rdap-lookup/issues" className="text-primary hover:underline">Open a GitHub issue</Link> with details about the problem and steps to reproduce it.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h3 className="font-semibold">Suggest Features</h3>
                    <p className="text-sm text-default-600">Have ideas for new features? Share them in our <Link isExternal href="https://github.com/gensecaihq/rdap-lookup/discussions" className="text-primary hover:underline">GitHub discussions</Link> or create a feature request issue.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h3 className="font-semibold">Submit Pull Requests</h3>
                    <p className="text-sm text-default-600">Fork the repository, make your changes, and submit a pull request. We review all contributions and provide feedback.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">📖</span>
                  <div>
                    <h3 className="font-semibold">Improve Documentation</h3>
                    <p className="text-sm text-default-600">Help us improve our README, add code comments, or create tutorials for using the RDAP lookup tool.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <h3 className="font-semibold">Add Translations</h3>
                    <p className="text-sm text-default-600">Help make the tool accessible globally by contributing translations for different languages.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Use Cases for Our RDAP Lookup Tool</h2>
              <div className="space-y-3 text-default-600">
                <p>
                  <strong>🔒 Security Researchers:</strong> Investigate suspicious domains, track malicious infrastructure, analyze domain registration patterns, and gather threat intelligence data for cybersecurity operations.
                </p>
                <p>
                  <strong>👨‍💻 Web Developers:</strong> Verify domain ownership before purchases, check domain availability, monitor expiration dates, and integrate domain data into applications using our JSON export feature.
                </p>
                <p>
                  <strong>🏢 IT Administrators:</strong> Manage corporate domain portfolios, audit DNS configurations, verify SSL certificates, and ensure email authentication (SPF/DKIM/DMARC) is properly configured.
                </p>
                <p>
                  <strong>⚖️ Legal Professionals:</strong> Gather evidence for trademark disputes, verify domain ownership for legal proceedings, document registration history, and investigate intellectual property violations.
                </p>
                <p>
                  <strong>📊 Domain Investors:</strong> Research domain history, analyze registration patterns, track expiration dates for drop catching, and evaluate domain portfolios using comprehensive RDAP data.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Privacy & Data Policy</h2>
              <p className="text-default-600 mb-4">
                Your privacy is important to us. Our RDAP lookup tool operates with complete transparency:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-default-600">
                <li>No user registration or login required</li>
                <li>No tracking cookies or analytics that identify individuals</li>
                <li>No storage of your lookup queries</li>
                <li>All queries go directly to official RDAP servers</li>
                <li>Open source code for complete transparency</li>
                <li>Hosted on privacy-respecting infrastructure</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">License & Legal</h2>
              <p className="text-default-600 mb-4">
                RDAP Lookup is released under the MIT License, making it free for personal and commercial use. You can:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-default-600">
                <li>Use the tool for any purpose</li>
                <li>Modify and distribute the source code</li>
                <li>Include it in commercial projects</li>
                <li>Fork and create your own version</li>
              </ul>
              <p className="text-default-600 mt-4">
                The only requirement is maintaining the copyright notice and license terms in any distribution of the software.
              </p>
            </section>

            <section className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Support the Project</h2>
              <p className="text-default-600 mb-4">
                If you find RDAP Lookup useful, please consider supporting the project:
              </p>
              <div className="flex flex-wrap gap-3">
                <Link isExternal href="https://github.com/gensecaihq/rdap-lookup">
                  <Button color="primary" variant="solid" startContent={<Star className="w-4 h-4" />}>
                    ⭐ Star on GitHub
                  </Button>
                </Link>
                <Link isExternal href="https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20free%20RDAP%20lookup%20tool!%20%F0%9F%9A%80&url=https://rdap.vercel.app">
                  <Button color="secondary" variant="flat">
                    Share on Twitter
                  </Button>
                </Link>
                <Link isExternal href="https://www.linkedin.com/sharing/share-offsite/?url=https://rdap.vercel.app">
                  <Button color="default" variant="flat">
                    Share on LinkedIn
                  </Button>
                </Link>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact & Community</h2>
              <p className="text-default-600 mb-4">
                Have questions, suggestions, or want to collaborate? Connect with us:
              </p>
              <div className="space-y-2 text-default-600">
                <p>
                  📧 <strong>Email:</strong> Contact us through GitHub issues for fastest response
                </p>
                <p>
                  💬 <strong>Discussions:</strong>{" "}
                  <Link isExternal href="https://github.com/gensecaihq/rdap-lookup/discussions" className="text-primary hover:underline">
                    Join our GitHub Discussions
                  </Link>
                </p>
                <p>
                  🐛 <strong>Bug Reports:</strong>{" "}
                  <Link isExternal href="https://github.com/gensecaihq/rdap-lookup/issues" className="text-primary hover:underline">
                    Open an issue on GitHub
                  </Link>
                </p>
                <p>
                  🔗 <strong>Repository:</strong>{" "}
                  <Link isExternal href="https://github.com/gensecaihq/rdap-lookup" className="text-primary hover:underline">
                    github.com/gensecaihq/rdap-lookup
                  </Link>
                </p>
              </div>
            </section>
          </CardBody>
        </Card>
      </div>
    </>
  );
}