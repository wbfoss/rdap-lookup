"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Copy,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Server,
  Globe,
  Calendar,
  User,
  Key,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Mail,
  Lock,
  Unlock,
  Activity,
  MapPin,
  Building,
  Phone,
  AtSign,
  Clock,
  ExternalLink,
  Download,
  Share2,
  Info,
  ChevronRight,
  ChevronDown,
  Zap,
  Database,
  Network,
  Wifi,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  FileText,
  Settings,
  Plus,
  Minus,
} from "lucide-react";

export default function WhoisEquivalentDisplay({ data, objectType }) {
  const [copiedField, setCopiedField] = useState(null);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  
  // Refs for scrolling to sections
  const additionalInfoRef = useRef(null);
  const rawDataRef = useRef(null);
  const actionButtonsRef = useRef(null);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Scroll to section when toggled
  useEffect(() => {
    if (showAdditionalInfo && additionalInfoRef.current) {
      setTimeout(() => {
        additionalInfoRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [showAdditionalInfo]);

  useEffect(() => {
    if (showRawData && rawDataRef.current) {
      setTimeout(() => {
        rawDataRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [showRawData]);

  // Toggle functions with scroll
  const toggleAdditionalInfo = () => {
    if (!showAdditionalInfo) {
      setShowAdditionalInfo(true);
    } else {
      setShowAdditionalInfo(false);
      // Scroll back to action buttons when hiding
      setTimeout(() => {
        actionButtonsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  };

  const toggleRawData = () => {
    if (!showRawData) {
      setShowRawData(true);
    } else {
      setShowRawData(false);
      // Scroll back to action buttons when hiding
      setTimeout(() => {
        actionButtonsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));
    const absDays = Math.abs(diffDays);
    
    // Format the relative time with better descriptions
    let relative;
    if (diffDays < 0) {
      if (absDays === 1) {
        relative = "Yesterday";
      } else if (absDays < 7) {
        relative = `${absDays} days ago`;
      } else if (absDays < 30) {
        relative = `${Math.floor(absDays / 7)} weeks ago`;
      } else if (absDays < 365) {
        relative = `${Math.floor(absDays / 30)} months ago`;
      } else {
        const years = Math.floor(absDays / 365);
        const remainingDays = absDays % 365;
        if (remainingDays < 30) {
          relative = `${years} year${years > 1 ? 's' : ''} ago`;
        } else {
          relative = `${absDays.toLocaleString()} days ago`;
        }
      }
    } else if (diffDays === 0) {
      relative = "Today";
    } else {
      if (diffDays === 1) {
        relative = "Tomorrow";
      } else if (diffDays < 7) {
        relative = `In ${diffDays} days`;
      } else if (diffDays < 30) {
        relative = `In ${Math.floor(diffDays / 7)} weeks`;
      } else if (diffDays < 365) {
        relative = `In ${Math.floor(diffDays / 30)} months`;
      } else {
        const years = Math.floor(diffDays / 365);
        const remainingDays = diffDays % 365;
        if (remainingDays < 30) {
          relative = `In ${years} year${years > 1 ? 's' : ''}`;
        } else {
          relative = `In ${diffDays.toLocaleString()} days`;
        }
      }
    }
    
    return {
      formatted: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      relative: relative,
      isExpired: date < now,
      isExpiringSoon: diffDays > 0 && diffDays <= 30,
    };
  };

  const getStatusVariant = (status) => {
    if (!status) return "secondary";
    const statusLower = status.toLowerCase();
    if (statusLower.includes("active")) return "success";
    if (statusLower.includes("inactive")) return "destructive";
    if (statusLower.includes("transfer") || statusLower.includes("lock")) return "warning";
    return "secondary";
  };

  // Main WHOIS Equivalent Section - Always Visible
  const renderWhoisEquivalentSection = () => (
    <div className="space-y-6">
      {/* Header with WHOIS Comparison */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-3">
              <Database className="w-7 h-7" />
              Domain Registration Data
            </h2>
          </div>
          <div className="text-right">
            <Badge variant="success" className="text-sm px-3 py-1">
              ✅ RDAP Format
            </Badge>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Structured & Privacy-Compliant
            </p>
          </div>
        </div>
      </div>

      {/* Core Registration Information */}
      <Card className="shadow-lg border-l-4 border-l-blue-500">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
          <CardTitle className="text-xl flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            Core Domain Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Domain Details */}
            <div className="space-y-4">
              <WhoisField
                label="Domain Name"
                value={data.ldhName}
                icon={Globe}
                highlight
                copyable
                onCopy={() => copyToClipboard(data.ldhName, "domain")}
                copied={copiedField === "domain"}
              />
              
              <WhoisField
                label="Registry Handle"
                value={data.handle}
                icon={Key}
                copyable
                onCopy={() => copyToClipboard(data.handle, "handle")}
                copied={copiedField === "handle"}
                mono
              />

              <WhoisField
                label="Object Type"
                value={data.objectClassName}
                icon={Database}
              />

              {data.startAddress && (
                <WhoisField
                  label="IP Range"
                  value={`${data.startAddress} - ${data.endAddress}`}
                  icon={Network}
                  mono
                />
              )}
            </div>

            {/* Right Column - Status & Dates */}
            <div className="space-y-4">
              {/* Status */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Domain Status</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.status?.map((status, idx) => (
                    <Badge
                      key={idx}
                      variant={getStatusVariant(status)}
                      className="capitalize text-xs"
                    >
                      {status.replace(/([A-Z])/g, ' $1').trim()}
                    </Badge>
                  )) || <Badge variant="secondary">Unknown</Badge>}
                </div>
              </div>

              {/* Important Dates */}
              {data.events && data.events.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Important Dates</span>
                  </div>
                  <div className="space-y-2">
                    {data.events.slice(0, 3).map((event, idx) => {
                      const dateInfo = formatDate(event.eventDate);
                      return (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                            {event.eventAction.replace('registration', 'Registration').replace('expiration', 'Expiration').replace('last changed', 'Last Changed')}
                          </span>
                          <div className="text-right">
                            <div className={`text-base font-bold ${
                              dateInfo.isExpired ? 'text-red-600 dark:text-red-400' : 
                              dateInfo.isExpiringSoon ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
                            }`}>
                              {dateInfo.relative}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                              {dateInfo.formatted}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nameservers - Always visible for domains */}
      {data.nameservers && data.nameservers.length > 0 && (
        <Card className="shadow-lg border-l-4 border-l-purple-500">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
            <CardTitle className="text-xl flex items-center gap-2">
              <Server className="w-6 h-6 text-purple-600" />
              Nameservers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.nameservers.map((ns, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
                >
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-gray-500" />
                    <span className="font-mono text-sm">{ns.ldhName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(ns.ldhName, `ns-${idx}`)}
                  >
                    {copiedField === `ns-${idx}` ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Information - Always visible if available */}
      {data.entities && data.entities.length > 0 && (
        <Card className="shadow-lg border-l-4 border-l-green-500">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="w-6 h-6 text-green-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data.entities.slice(0, 4).map((entity, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-sm">{entity.roles?.join(", ") || "Contact"}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{entity.handle || "N/A"}</Badge>
                  </div>
                  
                  {entity.vcardArray && (
                    <div className="space-y-2">
                      {entity.vcardArray[1]?.slice(0, 3).map((item, i) => {
                        const [type, , , value] = item;
                        if (!value || !type) return null;
                        
                        const iconMap = {
                          fn: User,
                          org: Building,
                          email: Mail,
                          tel: Phone,
                          adr: MapPin,
                        };
                        const Icon = iconMap[type] || Info;
                        
                        return (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Icon className="w-3 h-3 text-gray-500 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400 capitalize">{type}:</span>
                            <span className="text-gray-900 dark:text-gray-100 truncate">
                              {Array.isArray(value) ? value.join(", ") : value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Additional Information Section - Collapsible
  const renderAdditionalInfoSection = () => (
    <div className="space-y-6">
      {/* Security & Technical Information */}
      {(data.secureDNS || data.emailSecurity || data.ssl) && (
        <Card className="shadow-lg border-l-4 border-l-red-500">
          <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30">
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-600" />
              Security Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* DNSSEC */}
              {data.secureDNS && (
                <SecurityCheck
                  title="DNSSEC"
                  status={data.secureDNS.delegationSigned ? "enabled" : "disabled"}
                  description={data.secureDNS.delegationSigned ? "Domain is cryptographically signed" : "No DNSSEC protection"}
                  icon={data.secureDNS.delegationSigned ? ShieldCheck : ShieldAlert}
                />
              )}

              {/* Email Security */}
              {data.emailSecurity && (
                <SecurityCheck
                  title="Email Security"
                  status={
                    (data.emailSecurity.spf && data.emailSecurity.spf !== "Not found") ||
                    (data.emailSecurity.dmarc && data.emailSecurity.dmarc !== "Not found")
                      ? "configured" : "missing"
                  }
                  description="SPF/DMARC configuration status"
                  icon={
                    (data.emailSecurity.spf && data.emailSecurity.spf !== "Not found") ||
                    (data.emailSecurity.dmarc && data.emailSecurity.dmarc !== "Not found")
                      ? Mail : AlertCircle
                  }
                />
              )}

              {/* SSL Certificate */}
              {data.ssl && (
                <SecurityCheck
                  title="SSL Certificate"
                  status={data.ssl.error ? "issue" : "valid"}
                  description={data.ssl.error ? "SSL certificate issues detected" : "Valid SSL certificate found"}
                  icon={data.ssl.error ? Unlock : Lock}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RBL Status for IPs */}
      {data.rbl && !data.rbl.error && (
        <Card className="shadow-lg border-l-4 border-l-orange-500">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-orange-600" />
              Blacklist Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(data.rbl).map(([provider, result]) => (
                <div
                  key={provider}
                  className={`p-3 rounded-lg border ${
                    result.status === "Listed"
                      ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                      : "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{provider}</span>
                    <Badge
                      variant={result.status === "Listed" ? "destructive" : "success"}
                      className="text-xs"
                    >
                      {result.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Action Buttons
  const renderActionButtons = () => (
    <div ref={actionButtonsRef} className="sticky top-4 z-10 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg border mb-6">
      <div className="flex flex-wrap gap-3">
        <Button
          variant={showAdditionalInfo ? "default" : "outline"}
          onClick={toggleAdditionalInfo}
          className="flex items-center gap-2 transition-all"
        >
          {showAdditionalInfo ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAdditionalInfo ? "Hide" : "Show"} Additional Info
        </Button>
        
        <Button
          variant={showRawData ? "default" : "outline"}
          onClick={toggleRawData}
          className="flex items-center gap-2 transition-all"
        >
          {showRawData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showRawData ? "Hide" : "Show"} Raw Data
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `rdap-${data.ldhName || data.handle || "result"}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </Button>
        
        <Button
          variant="outline"
          onClick={() => copyToClipboard(JSON.stringify(data, null, 2), "raw-data")}
          className="flex items-center gap-2"
        >
          {copiedField === "raw-data" ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          Copy All Data
        </Button>
      </div>
      
      {/* Visual indicators when sections are hidden */}
      {(!showAdditionalInfo || !showRawData) && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
          <Info className="w-3 h-3" />
          <span>Click buttons above to reveal more information</span>
        </div>
      )}
    </div>
  );

  // Raw Data Section
  const renderRawDataSection = () => (
    showRawData && (
      <div ref={rawDataRef} className="mb-6 animate-fade-in">
        <Card className="shadow-lg border-2 border-blue-500">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-950/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-5 h-5" />
              Raw RDAP Response
              <Badge variant="outline" className="ml-2">JSON Format</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto max-h-96 border font-mono">
              {JSON.stringify(data, null, 2)}
            </pre>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(JSON.stringify(data, null, 2), "raw-json")}
              >
                {copiedField === "raw-json" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span className="ml-2">Copy JSON</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );

  return (
    <div className="w-full max-w-6xl mx-auto animate-slide-in">
      {renderActionButtons()}
      {renderWhoisEquivalentSection()}
      
      {showAdditionalInfo && (
        <div ref={additionalInfoRef} className="mt-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-0.5 bg-gradient-to-r from-gray-300 to-transparent flex-1"></div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 px-3 bg-white dark:bg-gray-900">
              Additional Security & Technical Information
            </span>
            <div className="h-0.5 bg-gradient-to-l from-gray-300 to-transparent flex-1"></div>
          </div>
          {renderAdditionalInfoSection()}
        </div>
      )}
      
      {renderRawDataSection()}
    </div>
  );
}

// Helper Components
function WhoisField({ label, value, icon: Icon, copyable, onCopy, copied, mono = false, highlight = false }) {
  if (!value && value !== 0) return null;
  
  return (
    <div className={`${highlight ? 'p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className={`text-sm ${mono ? "font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded" : ""} ${highlight ? 'font-semibold text-blue-900 dark:text-blue-100' : ''} break-all`}>
          {value}
        </span>
        {copyable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="flex-shrink-0"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function SecurityCheck({ title, status, description, icon: Icon }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "enabled":
      case "valid":
      case "configured":
      case "active":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800";
      case "disabled":
      case "issue":
      case "missing":
      case "inactive":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800";
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950 dark:border-yellow-800";
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor(status)}`}>
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5" />
        <span className="font-semibold">{title}</span>
      </div>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
}