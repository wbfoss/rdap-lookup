import { Info, Code as CodeIcon, Zap, GitBranch, Users, Shield, Globe, Star, TrendingUp, ExternalLink } from "lucide-react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";

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
  },
};

export default function AboutPage() {
  const breadcrumbItems = [
    { label: "About", href: null }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumb items={breadcrumbItems} />
        {/* Hero Section */}
        <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 bg-blue-900 rounded-xl">
              <Info className="w-8 h-8 text-blue-600 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-white">About RDAP Lookup Tool</h1>
              <p className="text-lg text-gray-600 text-gray-300 mt-1">Free & Open Source Domain Intelligence Platform</p>
            </div>
          </div>
          <p className="text-gray-700 text-gray-300 mt-4 text-lg leading-relaxed">
            Building the future of domain intelligence with transparency, community collaboration, and cutting-edge technology.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8">
          {/* Mission Section */}
          <div className="bg-white bg-gray-800 rounded-lg shadow-sm border border-gray-200 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-blue-600 text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 text-white">Open Source Domain Intelligence</h2>
            </div>
            <hr className="border-gray-200 border-gray-600 mb-4" />
            <div>
              <p className="text-gray-700 text-gray-300 mb-4">
                RDAP Lookup is a completely free, open source web application that provides comprehensive domain intelligence, IP address lookup, and network analysis capabilities. Built with modern web technologies and designed for developers, security researchers, and IT professionals.
              </p>
              <p className="text-gray-700 text-gray-300">
                As an open source project hosted on GitHub, we believe in transparency, community collaboration, and making powerful domain lookup tools freely available. Our mission is to democratize access to domain intelligence and provide a modern alternative to traditional WHOIS lookups.
              </p>
            </div>
          </div>

          {/* GitHub CTA */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <GitBranch className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Join Our Open Source Community</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Help us build the future of domain intelligence tools. Star our repository, contribute code, report issues, or suggest new features. Every contribution makes a difference!
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/gensecaihq/rdap-lookup"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <Star className="w-4 h-4" />
                Star on GitHub
              </a>
              <a
                href="https://github.com/gensecaihq/rdap-lookup/fork"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                Fork Repository
              </a>
              <a
                href="https://github.com/gensecaihq/rdap-lookup/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-600 transition-colors"
              >
                <Users className="w-4 h-4" />
                Report Issues
              </a>
            </div>
          </div>

          {/* Why We Built This */}
          <div className="bg-white bg-gray-800 rounded-lg shadow-sm border border-gray-200 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900 text-white">Why We Built This</h2>
            </div>
            <hr className="border-gray-200 border-gray-600 mb-4" />
            <div>
              <p className="text-gray-700 text-gray-300 mb-4">
                Traditional WHOIS lookups are outdated, inconsistent, and difficult to parse programmatically. RDAP solves these problems with structured JSON data, but most RDAP tools are either command-line only, require technical expertise, or come with expensive subscriptions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex gap-3">
                  <div className="text-2xl">🌍</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-white mb-1">Democratize Access</h3>
                    <p className="text-sm text-gray-600 text-gray-400">Make RDAP queries accessible to everyone</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-2xl">📊</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-white mb-1">Comprehensive Data</h3>
                    <p className="text-sm text-gray-600 text-gray-400">Security analysis, SSL checks, email auth</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-2xl">👨‍💻</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-white mb-1">Developer Friendly</h3>
                    <p className="text-sm text-gray-600 text-gray-400">Clean, structured data for integration</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-2xl">🔒</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-white mb-1">Privacy First</h3>
                    <p className="text-sm text-gray-600 text-gray-400">No tracking, no accounts required</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 bg-blue-900/20 rounded-lg p-6 border border-blue-200 border-blue-800">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-blue-600 text-blue-400" />
                <h3 className="font-semibold text-gray-900 text-white">Domain RDAP Lookup</h3>
              </div>
              <p className="text-sm text-gray-600 text-gray-400">
                Query any domain name to get registration details, nameservers, status codes, expiration dates, and complete RDAP response data in structured JSON format.
              </p>
            </div>

            <div className="bg-green-50 bg-green-900/20 rounded-lg p-6 border border-green-200 border-green-800">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-green-600 text-green-400" />
                <h3 className="font-semibold text-gray-900 text-white">Security Analysis</h3>
              </div>
              <p className="text-sm text-gray-600 text-gray-400">
                Comprehensive security checks including DNSSEC validation, SSL certificate analysis, SPF/DKIM/DMARC email authentication, and blacklist status.
              </p>
            </div>

            <div className="bg-yellow-50 bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 border-yellow-800">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-yellow-600 text-yellow-400" />
                <h3 className="font-semibold text-gray-900 text-white">IP & ASN Lookup</h3>
              </div>
              <p className="text-sm text-gray-600 text-gray-400">
                Look up IP addresses and Autonomous System Numbers to get network allocation details, organization information, and routing data.
              </p>
            </div>

            <div className="bg-purple-50 bg-purple-900/20 rounded-lg p-6 border border-purple-200 border-purple-800">
              <div className="flex items-center gap-3 mb-3">
                <CodeIcon className="w-5 h-5 text-purple-600 text-purple-400" />
                <h3 className="font-semibold text-gray-900 text-white">Developer Friendly</h3>
              </div>
              <p className="text-sm text-gray-600 text-gray-400">
                Export results as JSON, access raw RDAP responses, and integrate with your applications. Perfect for automation and bulk analysis.
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-white bg-gray-800 rounded-lg shadow-sm border border-gray-200 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-purple-600 text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-900 text-white">Technology Stack</h2>
            </div>
            <hr className="border-gray-200 border-gray-600 mb-4" />
            <div>
              <p className="text-gray-700 text-gray-300 mb-6">
                Built with modern, performant web technologies ensuring fast lookups and smooth user experience:
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 bg-blue-900 text-blue-200">
                  Next.js 14
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800 bg-cyan-900 text-cyan-200">
                  React 18
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 bg-green-900 text-green-200">
                  Tailwind CSS
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 bg-red-900 text-red-200">
                  TypeScript
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 bg-blue-900 text-blue-200">
                  Vercel
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 bg-purple-900 text-purple-200">
                  RDAP APIs
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 bg-green-900 text-green-200">
                  Edge Functions
                </span>
              </div>
            </div>
          </div>

          {/* Support CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
            <Star className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Support the Project</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              If you find RDAP Lookup useful, please consider supporting the project by starring our repository and sharing with your network.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://github.com/gensecaihq/rdap-lookup"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                <Star className="w-4 h-4" />
                ⭐ Star on GitHub
              </a>
              <a
                href="https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20free%20RDAP%20lookup%20tool!%20%F0%9F%9A%80&url=https://rdap.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-400 transition-colors"
              >
                Share on Twitter
              </a>
              <a
                href="https://www.linkedin.com/sharing/share-offsite/?url=https://rdap.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
              >
                Share on LinkedIn
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white bg-gray-800 rounded-lg shadow-sm border border-gray-200 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-gray-600 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 text-white">Contact & Community</h2>
            </div>
            <hr className="border-gray-200 border-gray-600 mb-4" />
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="https://github.com/gensecaihq/rdap-lookup/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 text-gray-400 hover:text-blue-600 hover:text-blue-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>GitHub Discussions</span>
                </a>
                <a
                  href="https://github.com/gensecaihq/rdap-lookup/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 text-gray-400 hover:text-blue-600 hover:text-blue-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Report Issues</span>
                </a>
                <a
                  href="https://github.com/gensecaihq/rdap-lookup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 text-gray-400 hover:text-blue-600 hover:text-blue-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
                <a
                  href="https://github.com/gensecaihq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 text-gray-400 hover:text-blue-600 hover:text-blue-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Organization Profile</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}