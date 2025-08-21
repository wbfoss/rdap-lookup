import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'RDAP Lookup Tool - Modern Domain Intelligence & WHOIS Alternative',
  description: 'Free RDAP lookup tool for domain, IP, and ASN queries. Modern replacement for WHOIS with structured data, security analysis, and privacy compliance. Get comprehensive domain intelligence instantly.',
  keywords: [
    'RDAP lookup',
    'domain lookup', 
    'WHOIS alternative',
    'domain intelligence',
    'IP lookup',
    'ASN lookup',
    'domain security',
    'DNS security',
    'DNSSEC checker',
    'domain registration data',
    'registry data',
    'domain expiry checker',
    'nameserver lookup',
    'domain contacts',
    'SSL certificate checker',
    'email security',
    'SPF checker',
    'DMARC checker',
    'DKIM checker',
    'domain analysis',
    'cybersecurity tools',
    'network tools'
  ],
  authors: [{ name: 'RDAP Lookup Team' }],
  creator: 'RDAP Lookup Team',
  publisher: 'RDAP Lookup',
  category: 'Technology',
  classification: 'Network Tools',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rdap.vercel.app',
    siteName: 'RDAP Lookup Tool',
    title: 'RDAP Lookup Tool - Modern Domain Intelligence & WHOIS Alternative',
    description: 'Free RDAP lookup tool for domain, IP, and ASN queries. Modern replacement for WHOIS with structured data, security analysis, and privacy compliance.',
    images: [
      {
        url: 'https://rdap.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RDAP Lookup Tool - Modern Domain Intelligence',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rdaplookup',
    creator: '@rdaplookup',
    title: 'RDAP Lookup Tool - Modern Domain Intelligence',
    description: 'Free RDAP lookup tool for domain, IP, and ASN queries. Modern replacement for WHOIS with structured data and security analysis.',
    images: ['https://rdap.vercel.app/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://rdap.vercel.app',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'RDAP Lookup',
    'application-name': 'RDAP Lookup Tool',
    'msapplication-TileColor': '#2563eb',
    'theme-color': '#2563eb',
  },
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "RDAP Lookup Tool",
    "description": "Free RDAP lookup tool for domain, IP, and ASN queries. Modern replacement for WHOIS with structured data, security analysis, and privacy compliance.",
    "url": "https://rdap.vercel.app",
    "applicationCategory": "NetworkApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "RDAP Lookup Team"
    },
    "featureList": [
      "Domain RDAP Lookup",
      "IP Address RDAP Lookup", 
      "ASN RDAP Lookup",
      "Entity RDAP Lookup",
      "DNSSEC Verification",
      "SSL Certificate Analysis",
      "Email Security Analysis",
      "SPF Record Checker",
      "DMARC Record Checker", 
      "DKIM Record Checker",
      "Nameserver Analysis",
      "Domain Expiry Monitoring",
      "Blacklist Checking",
      "JSON Export",
      "Privacy Compliant"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "IT Professionals, Domain Administrators, Security Researchers, Network Engineers"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
