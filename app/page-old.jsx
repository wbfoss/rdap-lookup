"use client";

import { useState, useRef, useEffect } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import WhoisEquivalentDisplay from "@/components/WhoisEquivalentDisplay";
import GitHubBadge from "@/components/GitHubBadge";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function HomePage() {
  const [type, setType] = useState("domain");
  const [objectValue, setObjectValue] = useState("");
  const [dkimSelector, setDkimSelector] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hasQueryResult, setHasQueryResult] = useState(false); // New state for query result presence
  const [captchaKey, setCaptchaKey] = useState(Date.now()); // Key to force hCaptcha re-render
  const [isResetting, setIsResetting] = useState(false); // Track reset state
  const captchaRef = useRef(null);

  // Apply dark mode by default on component mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  function validateInput(type, value) {
    if (!value) return "Object identifier is required.";

    switch (type) {
      case "domain":
        // Basic domain validation: must contain a dot and have no spaces.
        if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          return "Please enter a valid domain name (e.g., google.com).";
        }
        break;
      case "ip":
        // Basic IP validation (IPv4 or IPv6).
        if (!/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:$/.test(value)) {
          return "Please enter a valid IPv4 or IPv6 address.";
        }
        break;
      case "autnum":
        // ASN validation: must be a number, optionally prefixed with 'AS'.
        if (!/^(AS|as)?[0-9]+$/.test(value)) {
          return "Please enter a valid ASN (e.g., 15169 or AS15169).";
        }
        break;
      case "entity":
        // Entity validation is less strict, but we can enforce some basic rules.
        if (value.length < 2) {
          return "Entity handle must be at least 2 characters long.";
        }
        break;
      default:
        return "Invalid object type.";
    }

    return null; // No error
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validateInput(type, objectValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!captchaToken) {
      setError("Please complete the captcha verification.");
      return;
    }

    setResult(null);
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          object: objectValue,
          dkimSelector,
          captchaToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error fetching RDAP data.");
      }
      setResult(data);
      setHasQueryResult(true); // Set to true after a successful query
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function resetForm() {
    setIsResetting(true);
    
    // Clear form data
    setType("domain");
    setObjectValue("");
    setDkimSelector("");
    setResult(null);
    setError(null);
    setCaptchaToken("");
    
    // Force hCaptcha re-render with new key
    setCaptchaKey(Date.now());
    
    // Reset hCaptcha and ensure it's properly cleared
    if (captchaRef.current) {
      try {
        captchaRef.current.reset();
      } catch (error) {
        console.error('Error resetting hCaptcha:', error);
      }
    }
    
    // Small delay to ensure everything is reset properly
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setHasQueryResult(false);
    setIsResetting(false);
  }

  return (
    <>
      {/* SEO and Accessibility */}
      <header className="sr-only">
        <h1>RDAP Lookup Tool - Modern Domain Intelligence and WHOIS Alternative</h1>
        <p>
          Free, fast, and comprehensive RDAP lookup service for domains, IP addresses, and ASN queries. 
          Get structured domain registration data, security analysis, and privacy-compliant information 
          that replaces traditional WHOIS lookups with modern JSON-based responses.
        </p>
      </header>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* GitHub Badge with Live Star Count */}
        <GitHubBadge owner="gensecaihq" repo="rdap-lookup" />
        
        <main className="container mx-auto px-4 py-6 max-w-6xl" role="main">
        <div className={`${hasQueryResult ? 'grid grid-cols-1 lg:grid-cols-12 gap-8' : 'max-w-2xl mx-auto'}`}>
          {/* Form Section */}
          <div className={hasQueryResult ? 'lg:col-span-4' : 'w-full'}>
            <Card className="mb-6 shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
                <CardTitle className="text-2xl font-bold flex justify-between items-center" role="banner">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" aria-label="Search icon">🔍</span>
                    <div>
                      <h2 className="text-2xl font-bold">RDAP Lookup Tool</h2>
                      <div className="text-sm opacity-90 font-normal">Modern Domain Intelligence & WHOIS Alternative</div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={toggleDarkMode} 
                    className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                    size="sm"
                  >
                    {isDarkMode ? "🌞" : "🌙"}
                  </Button>
                </CardTitle>
              </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* RDAP Type */}
            <div>
              <Label htmlFor="type" className="mb-2 block text-sm font-medium">
                Object Type
              </Label>
              <Select value={type} onValueChange={(val) => setType(val)} disabled={hasQueryResult}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select an RDAP type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="domain">Domain</SelectItem>
                  <SelectItem value="ip">IP</SelectItem>
                  <SelectItem value="autnum">ASN (autnum)</SelectItem>
                  <SelectItem value="entity">Entity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* RDAP Object Input */}
            <div>
              <Label
                htmlFor="objectValue"
                className="mb-2 block text-sm font-medium"
              >
                Object Identifier
              </Label>
              <Input
                id="objectValue"
                type="text"
                placeholder="e.g. google.com or 8.8.8.8"
                value={objectValue}
                onChange={(e) => setObjectValue(e.target.value)}
                required
                disabled={hasQueryResult}
              />
            </div>

            {/* DKIM Selector (optional, for domains only) */}
            {type === "domain" && (
              <div>
                <Label
                  htmlFor="dkimSelector"
                  className="mb-2 block text-sm font-medium"
                >
                  DKIM Selector (Optional)
                </Label>
                <Input
                  id="dkimSelector"
                  type="text"
                  placeholder="e.g., google"
                  value={dkimSelector}
                  onChange={(e) => setDkimSelector(e.target.value)}
                  disabled={hasQueryResult}
                />
              </div>
            )}

            {/* hCaptcha */}
            <div className="flex justify-center">
              <HCaptcha
                key={captchaKey}
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken("")}
                onError={() => setCaptchaToken("")}
                ref={captchaRef}
              />
            </div>

            <div className="flex items-center gap-2 mt-6">
              {!hasQueryResult ? (
                <Button
                  type="submit"
                  disabled={!type || !objectValue || isLoading || !captchaToken}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-xl"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      <span className="text-base">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🔍</span>
                      <span>Start RDAP Lookup</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={resetForm} 
                  disabled={isResetting} 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-xl"
                >
                  {isResetting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Resetting...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✨</span>
                      Make Another Query
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
            </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <div className="mb-4">
                <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md dark:border-red-700 dark:bg-red-900 dark:text-red-300">
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}

            {/* Educational Content Section */}
            {!hasQueryResult && (
              <aside className="mt-8" role="complementary">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    Why RDAP Instead of WHOIS? The Future of Domain Lookups
                  </h3>
                  <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                    <p>
                      <strong>RDAP (Registration Data Access Protocol)</strong> is the modern, standardized replacement for the legacy WHOIS protocol, providing significant improvements:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">RDAP Advantages:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• <strong>Structured JSON Data:</strong> Machine-readable responses</li>
                          <li>• <strong>Internationalization:</strong> Better support for non-ASCII domains</li>
                          <li>• <strong>RESTful API:</strong> Easy integration with modern applications</li>
                          <li>• <strong>Access Control:</strong> Privacy-compliant data access</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">WHOIS Limitations:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• <strong>Unstructured Text:</strong> Difficult to parse automatically</li>
                          <li>• <strong>Protocol Variations:</strong> Inconsistent implementations</li>
                          <li>• <strong>Limited Security:</strong> No built-in access controls</li>
                          <li>• <strong>Legacy Format:</strong> Designed for 1980s technology</li>
                        </ul>
                      </div>
                    </div>
                    <p className="pt-2 text-xs text-blue-700 dark:text-blue-300">
                      RDAP is the official successor to WHOIS, recommended by ICANN and implemented by major registries worldwide.
                    </p>
                  </div>
                </div>
                
                <footer className="text-xs text-center text-gray-600 dark:text-gray-400" role="contentinfo">
                  <p className="mb-2">
                    <strong>Trusted Data Sources:</strong> Powered by{" "}
                    <a href="https://rdap.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600" title="Official RDAP data source">
                      rdap.org
                    </a>{" "}
                    and{" "}
                    <a href="https://iana.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600" title="Internet Assigned Numbers Authority">
                      iana.org
                    </a>{" "}
                    • Compliant with ICANN standards and global registry policies
                  </p>
                  <p className="mb-2">
                    <strong>Features:</strong> Domain lookup, IP lookup, ASN lookup, DNSSEC verification, SSL analysis, 
                    email security checks (SPF, DMARC, DKIM), nameserver analysis, expiry monitoring, JSON export
                  </p>
                  <p>
                    Free open source tool hosted on{" "}
                    <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600" title="Vercel hosting platform">
                      Vercel
                    </a>{" "}
                    •{" "}
                    <a href="https://github.com/gensecaihq/rdap-lookup" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600" title="View source code and contribute">
                      Contribute on GitHub
                    </a>{" "}
                    • Built with Next.js, React, and Tailwind CSS
                  </p>
                </footer>
              </aside>
            )}
          </div>

          {/* Results Section */}
          {hasQueryResult && result && (
            <div className="lg:col-span-8">
              <WhoisEquivalentDisplay data={result} objectType={type} />
            </div>
          )}
        </div>

        {/* Educational Footer for results view */}
        {hasQueryResult && (
          <footer className="mt-8 pt-8 border-t" role="contentinfo">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                    <span className="text-2xl" aria-label="Rocket emoji">🚀</span>
                    RDAP: The Modern Standard for Domain Intelligence
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                    You just experienced <strong>RDAP (Registration Data Access Protocol)</strong> - the modern successor to WHOIS. 
                    Unlike legacy WHOIS text-based queries, RDAP provides structured, standardized, and privacy-compliant domain information.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Why RDAP is Better:</h4>
                      <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                        <li>✅ Structured JSON responses</li>
                        <li>✅ RESTful HTTP/HTTPS protocol</li>
                        <li>✅ Internationalization support</li>
                        <li>✅ Built-in privacy controls</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">WHOIS Limitations:</h4>
                      <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                        <li>❌ Unstructured text output</li>
                        <li>❌ Inconsistent formats</li>
                        <li>❌ Limited Unicode support</li>
                        <li>❌ No access control</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="lg:border-l lg:border-blue-200 dark:lg:border-blue-700 lg:pl-6">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Learn More</h4>
                  <div className="space-y-2 text-sm">
                    <a 
                      href="https://www.icann.org/rdap" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      📚 ICANN RDAP Documentation
                    </a>
                    <a 
                      href="https://tools.ietf.org/html/rfc7483" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      📋 RFC 7483 - RDAP Specification
                    </a>
                    <a 
                      href="https://github.com/gensecaihq/rdap-lookup" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      🌟 Star this project on GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-center text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                <strong>Powered by:</strong>{" "}
                <a href="https://rdap.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">
                  rdap.org
                </a>{" "}
                and{" "}
                <a href="https://iana.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">
                  iana.org
                </a>{" "}
                • Built with Next.js and hosted on{" "}
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">
                  Vercel
                </a>
              </p>
              <p>
                Open source project •{" "}
                <a href="https://github.com/gensecaihq/rdap-lookup" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">
                  Contribute on GitHub
                </a>{" "}
                • Made with ❤️ for the developer community
              </p>
            </div>
          </footer>
        )}
      </main>
    </div>
    </>
  );
}

