"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Zap,
  Database,
  Network,
} from "lucide-react";

export default function RdapResultDisplay({ data, objectType }) {
  const [copiedField, setCopiedField] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const relative = getRelativeTime(date);
    return {
      formatted: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      relative,
      isExpired: date < new Date(),
      isExpiringSoon: date < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = date - now;
    const days = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return `${days} days ago`;
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 30) return `In ${days} days`;
    if (days < 365) return `In ${Math.floor(days / 30)} months`;
    return `In ${Math.floor(days / 365)} years`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { variant: "success", icon: CheckCircle2, label: "Active" },
      inactive: { variant: "secondary", icon: XCircle, label: "Inactive" },
      "client transfer prohibited": { variant: "warning", icon: Lock, label: "Transfer Locked" },
      "client delete prohibited": { variant: "warning", icon: Lock, label: "Delete Locked" },
      "server transfer prohibited": { variant: "destructive", icon: Shield, label: "Server Locked" },
    };

    const config = statusMap[status?.toLowerCase()] || {
      variant: "outline",
      icon: Info,
      label: status,
    };

    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getSecurityScore = () => {
    let score = 0;
    let checks = [];

    if (data.secureDNS?.delegationSigned) {
      score += 25;
      checks.push({ name: "DNSSEC", status: "pass", icon: ShieldCheck });
    } else {
      checks.push({ name: "DNSSEC", status: "fail", icon: ShieldAlert });
    }

    if (data.emailSecurity?.spf && data.emailSecurity.spf !== "Not found") {
      score += 25;
      checks.push({ name: "SPF", status: "pass", icon: Mail });
    } else {
      checks.push({ name: "SPF", status: "fail", icon: Mail });
    }

    if (data.emailSecurity?.dmarc && data.emailSecurity.dmarc !== "Not found") {
      score += 25;
      checks.push({ name: "DMARC", status: "pass", icon: Shield });
    } else {
      checks.push({ name: "DMARC", status: "fail", icon: Shield });
    }

    if (data.ssl && !data.ssl.error) {
      score += 25;
      checks.push({ name: "SSL/TLS", status: "pass", icon: Lock });
    } else {
      checks.push({ name: "SSL/TLS", status: "fail", icon: Unlock });
    }

    return { score, checks };
  };

  const renderOverviewTab = () => {
    const security = getSecurityScore();
    
    return (
      <div className="space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Object Type</p>
                  <p className="text-lg font-semibold capitalize">{data.objectClassName}</p>
                </div>
                <Globe className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold">
                    {data.status?.[0] || "Unknown"}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Security Score</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{security.score}%</span>
                    <Progress value={security.score} className="w-16 h-2" />
                  </div>
                </div>
                <Shield className="w-8 h-8 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Handle</p>
                  <p className="text-sm font-mono truncate">{data.handle || "N/A"}</p>
                </div>
                <Key className="w-8 h-8 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Primary Information Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Database className="w-5 h-5" />
                Primary Information
              </h3>
              <div className="flex gap-2 mt-2 sm:mt-0">
                {data.status?.map((status) => getStatusBadge(status))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.ldhName && (
                <InfoRow
                  label="Domain Name"
                  value={data.ldhName}
                  icon={Globe}
                  onCopy={() => copyToClipboard(data.ldhName, "domain")}
                  copied={copiedField === "domain"}
                />
              )}
              {data.handle && (
                <InfoRow
                  label="Registry Handle"
                  value={data.handle}
                  icon={Key}
                  onCopy={() => copyToClipboard(data.handle, "handle")}
                  copied={copiedField === "handle"}
                />
              )}
              {data.startAddress && (
                <InfoRow
                  label="IP Range Start"
                  value={data.startAddress}
                  icon={Network}
                />
              )}
              {data.endAddress && (
                <InfoRow
                  label="IP Range End"
                  value={data.endAddress}
                  icon={Network}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Overview */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5" />
              Security Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {security.checks.map((check) => {
                const Icon = check.icon;
                return (
                  <div
                    key={check.name}
                    className={`p-3 rounded-lg border ${
                      check.status === "pass"
                        ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                        : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{check.name}</span>
                      <Icon
                        className={`w-4 h-4 ${
                          check.status === "pass" ? "text-green-600" : "text-red-600"
                        }`}
                      />
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        check.status === "pass" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {check.status === "pass" ? "Configured" : "Not Configured"}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTimelineTab = () => {
    const events = data.events || [];
    const sortedEvents = [...events].sort(
      (a, b) => new Date(b.eventDate) - new Date(a.eventDate)
    );

    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" />
              Domain Lifecycle Timeline
            </h3>
            
            {sortedEvents.length > 0 ? (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                {sortedEvents.map((event, idx) => {
                  const dateInfo = formatDate(event.eventDate);
                  const isExpiry = event.eventAction === "expiration";
                  
                  return (
                    <div key={idx} className="relative flex items-start mb-6 last:mb-0">
                      <div
                        className={`absolute left-2 w-4 h-4 rounded-full border-2 ${
                          dateInfo.isExpired
                            ? "bg-gray-500 border-gray-600"
                            : isExpiry && dateInfo.isExpiringSoon
                            ? "bg-orange-500 border-orange-600"
                            : "bg-green-500 border-green-600"
                        }`}
                      ></div>
                      <div className="ml-10 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold capitalize flex items-center gap-2">
                              {event.eventAction}
                              {isExpiry && dateInfo.isExpiringSoon && !dateInfo.isExpired && (
                                <Badge variant="warning" className="text-xs">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Expiring Soon
                                </Badge>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {dateInfo.formatted} at {dateInfo.time}
                            </p>
                          </div>
                          <Badge variant="outline" className="mt-2 sm:mt-0">
                            {dateInfo.relative}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No timeline events available</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Important Dates Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((event, idx) => {
            const dateInfo = formatDate(event.eventDate);
            const eventIcons = {
              registration: Calendar,
              expiration: Clock,
              "last changed": Activity,
            };
            const Icon = eventIcons[event.eventAction] || Calendar;
            
            return (
              <Card key={idx}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-0.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">{event.eventAction}</p>
                      <p className="text-sm text-muted-foreground">{dateInfo.formatted}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {dateInfo.relative}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContactsTab = () => {
    const entities = data.entities || [];
    
    return (
      <div className="space-y-4">
        {entities.length > 0 ? (
          entities.map((entity, idx) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {entity.roles?.join(", ") || "Contact"}
                  </h4>
                  <Badge variant="outline">{entity.handle || "N/A"}</Badge>
                </div>
                
                {entity.vcardArray && (
                  <div className="space-y-3">
                    {entity.vcardArray[1].map((item, i) => {
                      const [type, , , value] = item;
                      const iconMap = {
                        fn: User,
                        org: Building,
                        email: Mail,
                        tel: Phone,
                        adr: MapPin,
                      };
                      const Icon = iconMap[type] || Info;
                      
                      if (!value) return null;
                      
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium capitalize">{type}</p>
                            <p className="text-sm text-muted-foreground">
                              {Array.isArray(value) ? value.join(", ") : value}
                            </p>
                          </div>
                          {(type === "email" || type === "tel") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(value, `${type}-${i}`)}
                            >
                              {copiedField === `${type}-${i}` ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No contact information available</AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  const renderTechnicalTab = () => {
    return (
      <div className="space-y-4">
        {/* Nameservers */}
        {data.nameservers && data.nameservers.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Server className="w-5 h-5" />
                Nameservers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.nameservers.map((ns, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
                  >
                    <span className="font-mono text-sm">{ns.ldhName}</span>
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

        {/* DNSSEC */}
        {data.secureDNS && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5" />
                DNSSEC Configuration
              </h3>
              <div
                className={`p-4 rounded-lg border ${
                  data.secureDNS.delegationSigned
                    ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                    : "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  {data.secureDNS.delegationSigned ? (
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-orange-600" />
                  )}
                  <div>
                    <p className="font-medium">
                      {data.secureDNS.delegationSigned
                        ? "DNSSEC is Enabled"
                        : "DNSSEC is Not Enabled"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {data.secureDNS.delegationSigned
                        ? "Domain is cryptographically signed and validated"
                        : "Domain is not protected by DNSSEC"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Email Security */}
        {data.emailSecurity && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5" />
                Email Security Configuration
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {data.emailSecurity.spf && data.emailSecurity.spf !== "Not found" && (
                  <AccordionItem value="spf">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Badge variant="success">SPF</Badge>
                        <span className="text-sm">Sender Policy Framework</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                        {data.emailSecurity.spf}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                )}
                
                {data.emailSecurity.dmarc && data.emailSecurity.dmarc !== "Not found" && (
                  <AccordionItem value="dmarc">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Badge variant="success">DMARC</Badge>
                        <span className="text-sm">Domain-based Message Authentication</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                        {data.emailSecurity.dmarc}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                )}
                
                {data.emailSecurity.dkim && data.emailSecurity.dkim !== "Not found" && (
                  <AccordionItem value="dkim">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Badge variant="success">DKIM</Badge>
                        <span className="text-sm">DomainKeys Identified Mail</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                        {data.emailSecurity.dkim}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* SSL Certificate */}
        {data.ssl && !data.ssl.error && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5" />
                SSL/TLS Certificate
              </h3>
              <div className="space-y-3">
                <InfoRow
                  label="Subject"
                  value={data.ssl.subject?.CN}
                  icon={Globe}
                />
                <InfoRow
                  label="Issuer"
                  value={data.ssl.issuer?.CN}
                  icon={Shield}
                />
                <InfoRow
                  label="Valid From"
                  value={formatDate(data.ssl.valid_from).formatted}
                  icon={Calendar}
                />
                <InfoRow
                  label="Valid Until"
                  value={formatDate(data.ssl.valid_to).formatted}
                  icon={Clock}
                />
                <InfoRow
                  label="Fingerprint"
                  value={data.ssl.fingerprint}
                  icon={Key}
                  mono
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* RBL Status for IP */}
        {data.rbl && !data.rbl.error && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5" />
                Blacklist Status
              </h3>
              <div className="space-y-2">
                {Object.entries(data.rbl).map(([provider, result]) => (
                  <div
                    key={provider}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      result.status === "Listed"
                        ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                        : "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                    }`}
                  >
                    <span className="text-sm font-medium">{provider}</span>
                    <Badge
                      variant={result.status === "Listed" ? "destructive" : "success"}
                    >
                      {result.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderRawDataTab = () => {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Raw RDAP Response</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `rdap-${data.ldhName || data.handle || "result"}.json`;
                  a.click();
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(JSON.stringify(data, null, 2), "raw")}
              >
                {copiedField === "raw" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                Copy
              </Button>
            </div>
          </div>
          <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-[600px]">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            <Zap className="w-4 h-4 mr-1 hidden sm:inline" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs sm:text-sm">
            <Clock className="w-4 h-4 mr-1 hidden sm:inline" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="contacts" className="text-xs sm:text-sm">
            <User className="w-4 h-4 mr-1 hidden sm:inline" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="technical" className="text-xs sm:text-sm">
            <Server className="w-4 h-4 mr-1 hidden sm:inline" />
            Technical
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm">
            <Shield className="w-4 h-4 mr-1 hidden sm:inline" />
            Security
          </TabsTrigger>
          <TabsTrigger value="raw" className="text-xs sm:text-sm">
            <Database className="w-4 h-4 mr-1 hidden sm:inline" />
            Raw
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {renderOverviewTab()}
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4">
          {renderTimelineTab()}
        </TabsContent>
        
        <TabsContent value="contacts" className="mt-4">
          {renderContactsTab()}
        </TabsContent>
        
        <TabsContent value="technical" className="mt-4">
          {renderTechnicalTab()}
        </TabsContent>
        
        <TabsContent value="security" className="mt-4">
          {renderTechnicalTab()}
        </TabsContent>
        
        <TabsContent value="raw" className="mt-4">
          {renderRawDataTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value, icon: Icon, onCopy, copied, mono = false }) {
  if (!value) return null;
  
  return (
    <div className="flex items-center justify-between py-2 group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={`text-sm ${mono ? "font-mono" : ""} truncate`}>{value}</p>
        </div>
      </div>
      {onCopy && (
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onCopy}
        >
          {copied ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  );
}