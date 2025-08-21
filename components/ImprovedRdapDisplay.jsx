"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";

export default function ImprovedRdapDisplay({ data, objectType }) {
  const [copiedField, setCopiedField] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    security: true,
    contacts: false,
    technical: false,
  });
  const [showRawData, setShowRawData] = useState(false);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));
    
    return {
      formatted: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      relative: diffDays < 0 
        ? `${Math.abs(diffDays)} days ago`
        : diffDays === 0 
        ? "Today"
        : `In ${diffDays} days`,
      isExpired: date < now,
      isExpiringSoon: diffDays > 0 && diffDays <= 30,
    };
  };

  const getSecurityScore = () => {
    let score = 0;
    let total = 0;

    // DNSSEC Check
    total += 25;
    if (data.secureDNS?.delegationSigned) score += 25;

    // Email Security
    total += 25;
    if (data.emailSecurity?.spf && data.emailSecurity.spf !== "Not found") score += 12.5;
    if (data.emailSecurity?.dmarc && data.emailSecurity.dmarc !== "Not found") score += 12.5;

    // SSL Certificate
    total += 25;
    if (data.ssl && !data.ssl.error) score += 25;

    // General Security
    total += 25;
    if (data.status && data.status.includes("active")) score += 12.5;
    if (data.nameservers && data.nameservers.length > 0) score += 12.5;

    return Math.round((score / total) * 100);
  };

  const getStatusVariant = (status) => {
    if (!status) return "secondary";
    const statusLower = status.toLowerCase();
    if (statusLower.includes("active")) return "success";
    if (statusLower.includes("inactive")) return "destructive";
    if (statusLower.includes("transfer") || statusLower.includes("lock")) return "warning";
    return "secondary";
  };

  // Main Overview Section
  const renderOverviewSection = () => (
    <Card className="mb-6 shadow-sm border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Quick Overview
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection('overview')}
          >
            {expandedSections.overview ? <ChevronDown /> : <ChevronRight />}
          </Button>
        </div>
      </CardHeader>
      <Collapsible open={expandedSections.overview}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Object Type</p>
                    <p className="text-xl font-bold text-blue-900 dark:text-blue-100 capitalize">
                      {data.objectClassName || objectType}
                    </p>
                  </div>
                  <Globe className="w-8 h-8 text-blue-500/30" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Status</p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">
                      {data.status?.[0] || "Unknown"}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500/30" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Security</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-purple-900 dark:text-purple-100">
                        {getSecurityScore()}%
                      </span>
                      <Progress value={getSecurityScore()} className="w-12 h-2" />
                    </div>
                  </div>
                  <Shield className="w-8 h-8 text-purple-500/30" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Registry</p>
                    <p className="text-sm font-bold text-orange-900 dark:text-orange-100 font-mono truncate">
                      {data.handle || "N/A"}
                    </p>
                  </div>
                  <Key className="w-8 h-8 text-orange-500/30" />
                </div>
              </div>
            </div>

            {/* Primary Info Card */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Primary Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.ldhName && (
                  <InfoField
                    label="Domain Name"
                    value={data.ldhName}
                    icon={Globe}
                    copyable
                    onCopy={() => copyToClipboard(data.ldhName, "domain")}
                    copied={copiedField === "domain"}
                  />
                )}
                
                {data.handle && (
                  <InfoField
                    label="Registry Handle"
                    value={data.handle}
                    icon={Key}
                    copyable
                    onCopy={() => copyToClipboard(data.handle, "handle")}
                    copied={copiedField === "handle"}
                    mono
                  />
                )}

                {data.startAddress && (
                  <InfoField
                    label="IP Range Start"
                    value={data.startAddress}
                    icon={Network}
                    mono
                  />
                )}

                {data.endAddress && (
                  <InfoField
                    label="IP Range End"
                    value={data.endAddress}
                    icon={Network}
                    mono
                  />
                )}
              </div>

              {data.status && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {data.status.map((status, idx) => (
                    <Badge
                      key={idx}
                      variant={getStatusVariant(status)}
                      className="capitalize"
                    >
                      {status.replace(/([A-Z])/g, ' $1').trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );

  // Security Section
  const renderSecuritySection = () => {
    const securityScore = getSecurityScore();
    const hasEmailSecurity = data.emailSecurity && (
      (data.emailSecurity.spf && data.emailSecurity.spf !== "Not found") ||
      (data.emailSecurity.dmarc && data.emailSecurity.dmarc !== "Not found") ||
      (data.emailSecurity.dkim && data.emailSecurity.dkim !== "Not found")
    );

    return (
      <Card className="mb-6 shadow-sm border-l-4 border-l-red-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              Security Analysis
              <Badge variant={securityScore >= 75 ? "success" : securityScore >= 50 ? "warning" : "destructive"}>
                {securityScore}% Secure
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('security')}
            >
              {expandedSections.security ? <ChevronDown /> : <ChevronRight />}
            </Button>
          </div>
        </CardHeader>
        <Collapsible open={expandedSections.security}>
          <CollapsibleContent>
            <CardContent className="pt-0">
              {/* Security Score Visualization */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Overall Security Score</span>
                  <span className="text-2xl font-bold">{securityScore}%</span>
                </div>
                <Progress value={securityScore} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  Based on DNSSEC, email security, SSL configuration, and domain status
                </p>
              </div>

              {/* Security Checks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* DNSSEC */}
                <SecurityCheck
                  title="DNSSEC"
                  status={data.secureDNS?.delegationSigned ? "enabled" : "disabled"}
                  description={data.secureDNS?.delegationSigned ? "Domain is cryptographically signed" : "No DNSSEC protection"}
                  icon={data.secureDNS?.delegationSigned ? ShieldCheck : ShieldAlert}
                />

                {/* SSL Certificate */}
                <SecurityCheck
                  title="SSL Certificate"
                  status={data.ssl && !data.ssl.error ? "valid" : "issue"}
                  description={data.ssl && !data.ssl.error ? "Valid SSL certificate found" : "SSL certificate issues detected"}
                  icon={data.ssl && !data.ssl.error ? Lock : Unlock}
                />

                {/* Email Security */}
                <SecurityCheck
                  title="Email Security"
                  status={hasEmailSecurity ? "configured" : "missing"}
                  description={hasEmailSecurity ? "Email security records found" : "No email security configuration"}
                  icon={hasEmailSecurity ? Mail : AlertCircle}
                />

                {/* Domain Status */}
                <SecurityCheck
                  title="Domain Status"
                  status={data.status?.includes("active") ? "active" : "inactive"}
                  description={data.status?.includes("active") ? "Domain is active" : "Domain status unknown"}
                  icon={data.status?.includes("active") ? CheckCircle2 : XCircle}
                />
              </div>

              {/* Detailed Security Info */}
              {data.emailSecurity && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Email Security Details</h4>
                  {data.emailSecurity.spf && data.emailSecurity.spf !== "Not found" && (
                    <DetailCard
                      title="SPF Record"
                      content={data.emailSecurity.spf}
                      icon={Mail}
                      copyable
                      onCopy={() => copyToClipboard(data.emailSecurity.spf, "spf")}
                      copied={copiedField === "spf"}
                    />
                  )}
                  
                  {data.emailSecurity.dmarc && data.emailSecurity.dmarc !== "Not found" && (
                    <DetailCard
                      title="DMARC Record"
                      content={data.emailSecurity.dmarc}
                      icon={Shield}
                      copyable
                      onCopy={() => copyToClipboard(data.emailSecurity.dmarc, "dmarc")}
                      copied={copiedField === "dmarc"}
                    />
                  )}

                  {data.emailSecurity.dkim && data.emailSecurity.dkim !== "Not found" && data.emailSecurity.dkim !== "Not looked up" && (
                    <DetailCard
                      title="DKIM Record"
                      content={data.emailSecurity.dkim}
                      icon={Key}
                      copyable
                      onCopy={() => copyToClipboard(data.emailSecurity.dkim, "dkim")}
                      copied={copiedField === "dkim"}
                    />
                  )}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  // Technical Section
  const renderTechnicalSection = () => (
    <Card className="mb-6 shadow-sm border-l-4 border-l-green-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Server className="w-5 h-5 text-green-500" />
            Technical Details
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection('technical')}
          >
            {expandedSections.technical ? <ChevronDown /> : <ChevronRight />}
          </Button>
        </div>
      </CardHeader>
      <Collapsible open={expandedSections.technical}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* Timeline */}
            {data.events && data.events.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Domain Timeline</h4>
                <div className="space-y-3">
                  {data.events.slice(0, 3).map((event, idx) => {
                    const dateInfo = formatDate(event.eventDate);
                    return (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          dateInfo.isExpired ? 'bg-gray-400' : 
                          dateInfo.isExpiringSoon ? 'bg-orange-500' : 'bg-green-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">{event.eventAction}</span>
                            <span className="text-sm text-muted-foreground">{dateInfo.formatted}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{dateInfo.relative}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nameservers */}
            {data.nameservers && data.nameservers.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Nameservers</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.nameservers.map((ns, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-muted-foreground" />
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
              </div>
            )}

            {/* SSL Certificate Details */}
            {data.ssl && !data.ssl.error && (
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">SSL Certificate</h4>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField
                      label="Subject"
                      value={data.ssl.subject?.CN}
                      icon={Globe}
                    />
                    <InfoField
                      label="Issuer"
                      value={data.ssl.issuer?.CN}
                      icon={Shield}
                    />
                    <InfoField
                      label="Valid From"
                      value={formatDate(data.ssl.valid_from).formatted}
                      icon={Calendar}
                    />
                    <InfoField
                      label="Valid Until"
                      value={formatDate(data.ssl.valid_to).formatted}
                      icon={Clock}
                    />
                  </div>
                  {data.ssl.fingerprint && (
                    <div className="mt-4">
                      <InfoField
                        label="Fingerprint"
                        value={data.ssl.fingerprint}
                        icon={Key}
                        mono
                        copyable
                        onCopy={() => copyToClipboard(data.ssl.fingerprint, "fingerprint")}
                        copied={copiedField === "fingerprint"}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RBL Status for IPs */}
            {data.rbl && !data.rbl.error && (
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Blacklist Status</h4>
                <div className="space-y-2">
                  {Object.entries(data.rbl).map(([provider, result]) => (
                    <div key={provider} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <span className="font-medium">{provider}</span>
                      <Badge variant={result.status === "Listed" ? "destructive" : "success"}>
                        {result.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );

  // Contacts Section
  const renderContactsSection = () => (
    <Card className="mb-6 shadow-sm border-l-4 border-l-purple-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-purple-500" />
            Contact Information
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection('contacts')}
          >
            {expandedSections.contacts ? <ChevronDown /> : <ChevronRight />}
          </Button>
        </div>
      </CardHeader>
      <Collapsible open={expandedSections.contacts}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {data.entities && data.entities.length > 0 ? (
              <div className="space-y-4">
                {data.entities.map((entity, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{entity.roles?.join(", ") || "Contact"}</span>
                      </div>
                      <Badge variant="outline">{entity.handle || "N/A"}</Badge>
                    </div>
                    
                    {entity.vcardArray && (
                      <div className="space-y-2">
                        {entity.vcardArray[1]?.map((item, i) => {
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
                            <div key={i} className="flex items-center gap-3">
                              <Icon className="w-4 h-4 text-muted-foreground" />
                              <div className="flex-1">
                                <span className="text-sm font-medium capitalize">{type}: </span>
                                <span className="text-sm">{Array.isArray(value) ? value.join(", ") : value}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No contact information available</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );

  // Actions Bar
  const renderActionsBar = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowRawData(!showRawData)}
      >
        {showRawData ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
        {showRawData ? "Hide Raw Data" : "Show Raw Data"}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `rdap-${data.ldhName || data.handle || "result"}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        <Download className="w-4 h-4 mr-2" />
        Export JSON
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => copyToClipboard(JSON.stringify(data, null, 2), "raw-data")}
      >
        {copiedField === "raw-data" ? (
          <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 mr-2" />
        )}
        Copy All Data
      </Button>
    </div>
  );

  // Raw Data Section
  const renderRawDataSection = () => (
    showRawData && (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="w-5 h-5" />
            Raw RDAP Response
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto max-h-96 border">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    )
  );

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-in">
      {renderActionsBar()}
      {renderOverviewSection()}
      {renderSecuritySection()}
      {renderTechnicalSection()}
      {renderContactsSection()}
      {renderRawDataSection()}
    </div>
  );
}

// Helper Components
function InfoField({ label, value, icon: Icon, copyable, onCopy, copied, mono = false }) {
  if (!value) return null;
  
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className={`text-sm ${mono ? "font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded" : ""} break-all`}>
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

function DetailCard({ title, content, icon: Icon, copyable, onCopy, copied }) {
  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">{title}</span>
        </div>
        {copyable && (
          <Button variant="ghost" size="sm" onClick={onCopy}>
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs font-mono overflow-x-auto">
        {content}
      </div>
    </div>
  );
}