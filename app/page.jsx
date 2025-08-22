"use client";

import { useState, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Header from "../components/Header";
import { 
  Search,
  Globe,
  Server,
  Shield,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Database,
  Download,
  Copy,
  ExternalLink,
  Info,
  Mail,
  Lock,
  Building,
  MapPin,
  Phone,
  Key,
  ShieldCheck,
  ShieldAlert,
  Network
} from "lucide-react";

export default function HomePage() {
  const [type, setType] = useState("domain");
  const [objectValue, setObjectValue] = useState("");
  const [dkimSelector, setDkimSelector] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(Date.now());
  const [isResetting, setIsResetting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const captchaRef = useRef(null);
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  function validateInput(type, value) {
    if (!value) return "Object identifier is required.";

    switch (type) {
      case "domain":
        if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          return "Please enter a valid domain name (e.g., google.com).";
        }
        break;
      case "ip":
        if (!/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:$/.test(value)) {
          return "Please enter a valid IPv4 or IPv6 address.";
        }
        break;
      case "autnum":
        if (!/^(AS|as)?[0-9]+$/.test(value)) {
          return "Please enter a valid ASN (e.g., 15169 or AS15169).";
        }
        break;
      case "entity":
        if (value.length < 2) {
          return "Entity handle must be at least 2 characters long.";
        }
        break;
      default:
        return "Invalid object type.";
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validateInput(type, objectValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY && !captchaToken) {
      setError("Please complete the captcha verification.");
      return;
    }

    setIsLoading(true);
    setError(null);

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
      setActiveTab("overview");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCaptchaVerify = (token) => {
    setCaptchaToken(token);
    setError(null);
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken("");
  };

  const handleCaptchaError = () => {
    setError("Captcha verification failed. Please try again.");
    setCaptchaToken("");
  };

  const handleReset = () => {
    setIsResetting(true);
    setResult(null);
    setError(null);
    setObjectValue("");
    setDkimSelector("");
    setCaptchaToken("");
    setCaptchaKey(Date.now());
    setActiveTab("overview");
    setTimeout(() => setIsResetting(false), 300);
  };

  const formatJsonDisplay = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Search Form - Left Column */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:sticky lg:top-20">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Search className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">RDAP Query</h2>
                    <p className="text-sm text-gray-500">Enter domain, IP, or ASN</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Query Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Query Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      disabled={result !== null}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                      <option value="domain">Domain</option>
                      <option value="ip">IP Address</option>
                      <option value="autnum">ASN (Autonomous System)</option>
                      <option value="entity">Entity</option>
                    </select>
                  </div>

                  {/* Query Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Query Value
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {type === "domain" ? <Globe className="w-4 h-4 text-gray-400" /> :
                         type === "ip" ? <Network className="w-4 h-4 text-gray-400" /> :
                         type === "autnum" ? <Database className="w-4 h-4 text-gray-400" /> :
                         <Key className="w-4 h-4 text-gray-400" />}
                      </div>
                      <input
                        type="text"
                        value={objectValue}
                        onChange={(e) => setObjectValue(e.target.value)}
                        placeholder={
                          type === "domain" ? "example.com" :
                          type === "ip" ? "8.8.8.8" :
                          type === "autnum" ? "AS15169" :
                          "HANDLE"
                        }
                        disabled={result !== null}
                        required
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                  </div>

                  {/* DKIM Selector for domain queries */}
                  {type === "domain" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DKIM Selector (Optional)
                      </label>
                      <input
                        type="text"
                        value={dkimSelector}
                        onChange={(e) => setDkimSelector(e.target.value)}
                        placeholder="default"
                        disabled={result !== null}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        For DKIM record validation
                      </p>
                    </div>
                  )}

                  {/* Captcha */}
                  {!result && process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY && (
                    <div className="flex justify-center">
                      <HCaptcha
                        key={captchaKey}
                        ref={captchaRef}
                        sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
                        onVerify={handleCaptchaVerify}
                        onExpire={handleCaptchaExpire}
                        onError={handleCaptchaError}
                        theme="light"
                      />
                    </div>
                  )}

                  {/* Development Notice */}
                  {!result && !process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                      <p className="text-yellow-800 text-sm text-center">
                        ⚠️ CAPTCHA disabled for development
                      </p>
                    </div>
                  )}

                  {/* Submit/Reset Buttons */}
                  <div className="flex gap-3">
                    {!result ? (
                      <button
                        type="submit"
                        disabled={isLoading || (process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY && !captchaToken)}
                        className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Looking up...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4" />
                            Lookup
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleReset}
                        disabled={isResetting}
                        className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isResetting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Resetting...
                          </>
                        ) : (
                          "New Query"
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Results - Right Column */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            {!result && !isLoading && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to lookup RDAP data
                </h3>
                <p className="text-gray-500 mb-6">
                  Enter a domain, IP address, ASN, or entity handle to get started with your RDAP query.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <Globe className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">Domains</p>
                    <p className="text-gray-500">google.com</p>
                  </div>
                  <div className="text-center">
                    <Network className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">IP Addresses</p>
                    <p className="text-gray-500">8.8.8.8</p>
                  </div>
                  <div className="text-center">
                    <Database className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">ASN</p>
                    <p className="text-gray-500">AS15169</p>
                  </div>
                  <div className="text-center">
                    <Key className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">Entities</p>
                    <p className="text-gray-500">HANDLE</p>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Results Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        RDAP Results
                      </h3>
                    </div>
                    <button
                      onClick={() => copyToClipboard(formatJsonDisplay(result), 'full')}
                      className="inline-flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                      {copiedField === 'full' ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy JSON
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {['overview', 'raw'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                          activeTab === tab
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Basic Info */}
                      {result.rdap && (
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-3">
                            Basic Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.rdap.objectClassName && (
                              <div>
                                <span className="text-sm font-medium text-gray-500">Object Type:</span>
                                <p className="text-gray-900">{result.rdap.objectClassName}</p>
                              </div>
                            )}
                            {result.rdap.handle && (
                              <div>
                                <span className="text-sm font-medium text-gray-500">Handle:</span>
                                <p className="text-gray-900">{result.rdap.handle}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Security Info */}
                      {(result.dnssec || result.ssl || result.spf || result.dmarc || result.dkim) && (
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-3">
                            Security Analysis
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {result.dnssec && (
                              <div className="flex items-center gap-2">
                                <Shield className={`w-4 h-4 ${result.dnssec.enabled ? 'text-green-500' : 'text-red-500'}`} />
                                <span className="text-sm text-gray-900">
                                  DNSSEC: {result.dnssec.enabled ? 'Enabled' : 'Disabled'}
                                </span>
                              </div>
                            )}
                            {result.ssl && (
                              <div className="flex items-center gap-2">
                                <Lock className={`w-4 h-4 ${result.ssl.valid ? 'text-green-500' : 'text-red-500'}`} />
                                <span className="text-sm text-gray-900">
                                  SSL: {result.ssl.valid ? 'Valid' : 'Invalid'}
                                </span>
                              </div>
                            )}
                            {result.spf && (
                              <div className="flex items-center gap-2">
                                <Mail className={`w-4 h-4 ${result.spf.valid ? 'text-green-500' : 'text-red-500'}`} />
                                <span className="text-sm text-gray-900">
                                  SPF: {result.spf.valid ? 'Valid' : 'Invalid'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'raw' && (
                    <div>
                      <pre className="bg-gray-100 rounded-md p-4 text-sm overflow-auto max-h-96 text-gray-900">
                        {formatJsonDisplay(result)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}