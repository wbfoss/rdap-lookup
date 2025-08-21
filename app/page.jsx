"use client";

import { useState, useRef, useEffect } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { 
  Card, 
  CardBody, 
  CardHeader,
  Input,
  Button,
  Select,
  SelectItem,
  Chip,
  Divider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Switch,
  Spinner,
  Code,
  Link,
  Avatar,
  Badge,
  Progress,
  Tooltip,
  Tabs,
  Tab,
  ScrollShadow,
  Snippet,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
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
  Sun,
  Moon,
  Github,
  Star,
  TrendingUp,
  Info,
  Mail,
  Lock,
  Building,
  MapPin,
  Phone,
  Key,
  ShieldCheck,
  ShieldAlert,
  Network,
  Zap
} from "lucide-react";

export default function HomePage() {
  const [type, setType] = useState("domain");
  const [objectValue, setObjectValue] = useState("");
  const [dkimSelector, setDkimSelector] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [captchaKey, setCaptchaKey] = useState(Date.now());
  const [isResetting, setIsResetting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const captchaRef = useRef(null);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [copiedField, setCopiedField] = useState(null);

  // Apply dark mode by default on component mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

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
      setActiveTab("overview");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function resetForm() {
    setIsResetting(true);
    setType("domain");
    setObjectValue("");
    setDkimSelector("");
    setResult(null);
    setError(null);
    setCaptchaToken("");
    setCaptchaKey(Date.now());
    
    if (captchaRef.current) {
      try {
        captchaRef.current.reset();
      } catch (error) {
        console.error('Error resetting hCaptcha:', error);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    setIsResetting(false);
  }

  const formatDate = (dateString) => {
    if (!dateString) return null;
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
      diffDays: diffDays
    };
  };

  const renderQuickStats = () => {
    if (!result) return null;

    const stats = [
      {
        label: "Status",
        value: result.status?.[0] || "Active",
        icon: <Activity className="w-4 h-4" />,
        color: "success"
      },
      {
        label: "DNSSEC",
        value: result.secureDNS?.delegationSigned ? "Enabled" : "Disabled",
        icon: <Shield className="w-4 h-4" />,
        color: result.secureDNS?.delegationSigned ? "success" : "warning"
      },
      {
        label: "Nameservers",
        value: result.nameservers?.length || 0,
        icon: <Server className="w-4 h-4" />,
        color: "primary"
      },
      {
        label: "Registry",
        value: result.port43 || "RDAP",
        icon: <Database className="w-4 h-4" />,
        color: "secondary"
      }
    ];

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="bg-default-50 dark:bg-default-100/10">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Chip 
                  variant="flat" 
                  color={stat.color}
                  size="sm"
                  startContent={stat.icon}
                >
                  {stat.label}
                </Chip>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  };

  const renderOverviewTab = () => {
    if (!result) return null;

    return (
      <div className="space-y-4">
        {/* Domain Info Card */}
        <Card>
          <CardHeader className="flex justify-between">
            <div className="flex gap-3">
              <Avatar 
                icon={<Globe className="w-5 h-5" />} 
                className="bg-primary/10 text-primary"
              />
              <div>
                <p className="text-md font-semibold">Domain Information</p>
                <p className="text-small text-default-500">{result.ldhName}</p>
              </div>
            </div>
            <Button
              isIconOnly
              variant="light"
              onPress={() => copyToClipboard(result.ldhName, "domain")}
            >
              {copiedField === "domain" ? 
                <CheckCircle className="w-4 h-4 text-success" /> : 
                <Copy className="w-4 h-4" />
              }
            </Button>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-small text-default-500 mb-1">Handle</p>
                  <Code size="sm">{result.handle}</Code>
                </div>
                <div>
                  <p className="text-small text-default-500 mb-1">Object Type</p>
                  <Chip variant="flat" size="sm">{result.objectClassName}</Chip>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-small text-default-500 mb-1">Status</p>
                  <div className="flex flex-wrap gap-1">
                    {result.status?.map((s, i) => (
                      <Chip key={i} size="sm" variant="dot" color="success">
                        {s.replace(/([A-Z])/g, ' $1').trim()}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Dates Card */}
        {result.events && (
          <Card>
            <CardHeader>
              <div className="flex gap-3">
                <Avatar 
                  icon={<Calendar className="w-5 h-5" />} 
                  className="bg-warning/10 text-warning"
                />
                <div>
                  <p className="text-md font-semibold">Important Dates</p>
                  <p className="text-small text-default-500">Registration lifecycle</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {result.events.map((event, idx) => {
                  const dateInfo = formatDate(event.eventDate);
                  if (!dateInfo) return null;
                  
                  return (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-default-100/50">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-default-400" />
                        <div>
                          <p className="text-sm font-medium capitalize">
                            {event.eventAction.replace('registration', 'Registered')}
                          </p>
                          <p className="text-xs text-default-500">{dateInfo.formatted}</p>
                        </div>
                      </div>
                      <Chip 
                        size="sm"
                        variant="flat"
                        color={
                          dateInfo.isExpired ? "danger" : 
                          dateInfo.isExpiringSoon ? "warning" : 
                          "success"
                        }
                      >
                        {dateInfo.relative}
                      </Chip>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Nameservers Card */}
        {result.nameservers && (
          <Card>
            <CardHeader>
              <div className="flex gap-3">
                <Avatar 
                  icon={<Server className="w-5 h-5" />} 
                  className="bg-secondary/10 text-secondary"
                />
                <div>
                  <p className="text-md font-semibold">Nameservers</p>
                  <p className="text-small text-default-500">{result.nameservers.length} servers</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.nameservers.map((ns, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-default-100/50">
                    <Code size="sm">{ns.ldhName}</Code>
                    <Button
                      size="sm"
                      isIconOnly
                      variant="light"
                      onPress={() => copyToClipboard(ns.ldhName, `ns-${idx}`)}
                    >
                      {copiedField === `ns-${idx}` ? 
                        <CheckCircle className="w-3 h-3 text-success" /> : 
                        <Copy className="w-3 h-3" />
                      }
                    </Button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    );
  };

  const renderSecurityTab = () => {
    if (!result) return null;

    return (
      <div className="space-y-4">
        {/* DNSSEC Status */}
        <Card>
          <CardHeader>
            <div className="flex gap-3">
              <Avatar 
                icon={result.secureDNS?.delegationSigned ? 
                  <ShieldCheck className="w-5 h-5" /> : 
                  <ShieldAlert className="w-5 h-5" />
                } 
                className={result.secureDNS?.delegationSigned ? 
                  "bg-success/10 text-success" : 
                  "bg-warning/10 text-warning"
                }
              />
              <div>
                <p className="text-md font-semibold">DNSSEC Status</p>
                <p className="text-small text-default-500">
                  {result.secureDNS?.delegationSigned ? "Protected" : "Not Protected"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Delegation Signed</span>
                <Chip 
                  size="sm" 
                  color={result.secureDNS?.delegationSigned ? "success" : "warning"}
                  variant="flat"
                >
                  {result.secureDNS?.delegationSigned ? "Yes" : "No"}
                </Chip>
              </div>
              {result.secureDNS?.dsData && (
                <div>
                  <p className="text-sm text-default-500 mb-2">DS Records</p>
                  <ScrollShadow className="max-h-40">
                    {result.secureDNS.dsData.map((ds, idx) => (
                      <div key={idx} className="mb-2 p-2 bg-default-100/50 rounded">
                        <Code size="sm" className="text-xs">
                          {`KeyTag: ${ds.keyTag}, Algorithm: ${ds.algorithm}, DigestType: ${ds.digestType}`}
                        </Code>
                      </div>
                    ))}
                  </ScrollShadow>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Email Security */}
        {result.emailSecurity && (
          <Card>
            <CardHeader>
              <div className="flex gap-3">
                <Avatar 
                  icon={<Mail className="w-5 h-5" />} 
                  className="bg-primary/10 text-primary"
                />
                <div>
                  <p className="text-md font-semibold">Email Security</p>
                  <p className="text-small text-default-500">SPF, DMARC, DKIM Configuration</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {result.emailSecurity.spf && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">SPF Record</span>
                      <Chip 
                        size="sm" 
                        color={result.emailSecurity.spf !== "Not found" ? "success" : "warning"}
                        variant="dot"
                      >
                        {result.emailSecurity.spf !== "Not found" ? "Configured" : "Missing"}
                      </Chip>
                    </div>
                    {result.emailSecurity.spf !== "Not found" && (
                      <Code size="sm" className="text-xs block">
                        {result.emailSecurity.spf}
                      </Code>
                    )}
                  </div>
                )}

                {result.emailSecurity.dmarc && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">DMARC Policy</span>
                      <Chip 
                        size="sm" 
                        color={result.emailSecurity.dmarc !== "Not found" ? "success" : "warning"}
                        variant="dot"
                      >
                        {result.emailSecurity.dmarc !== "Not found" ? "Configured" : "Missing"}
                      </Chip>
                    </div>
                    {result.emailSecurity.dmarc !== "Not found" && (
                      <Code size="sm" className="text-xs block">
                        {result.emailSecurity.dmarc}
                      </Code>
                    )}
                  </div>
                )}

                {result.emailSecurity.dkim && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">DKIM</span>
                      <Chip 
                        size="sm" 
                        color={result.emailSecurity.dkim !== "Not found" ? "success" : "warning"}
                        variant="dot"
                      >
                        {result.emailSecurity.dkim !== "Not found" ? "Configured" : "Missing"}
                      </Chip>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* SSL Certificate */}
        {result.ssl && (
          <Card>
            <CardHeader>
              <div className="flex gap-3">
                <Avatar 
                  icon={<Lock className="w-5 h-5" />} 
                  className={result.ssl.error ? 
                    "bg-danger/10 text-danger" : 
                    "bg-success/10 text-success"
                  }
                />
                <div>
                  <p className="text-md font-semibold">SSL Certificate</p>
                  <p className="text-small text-default-500">
                    {result.ssl.error ? "Issues Detected" : "Valid Certificate"}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              {result.ssl.error ? (
                <Chip color="danger" variant="flat">
                  {result.ssl.error}
                </Chip>
              ) : (
                <div className="space-y-2">
                  {result.ssl.issuer && (
                    <div className="flex justify-between">
                      <span className="text-sm text-default-500">Issuer</span>
                      <span className="text-sm">{result.ssl.issuer}</span>
                    </div>
                  )}
                  {result.ssl.validFrom && (
                    <div className="flex justify-between">
                      <span className="text-sm text-default-500">Valid From</span>
                      <span className="text-sm">{new Date(result.ssl.validFrom).toLocaleDateString()}</span>
                    </div>
                  )}
                  {result.ssl.validTo && (
                    <div className="flex justify-between">
                      <span className="text-sm text-default-500">Valid To</span>
                      <span className="text-sm">{new Date(result.ssl.validTo).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    );
  };

  const renderContactsTab = () => {
    if (!result?.entities) return null;

    return (
      <div className="space-y-4">
        {result.entities.map((entity, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex gap-3">
                <Avatar 
                  icon={<User className="w-5 h-5" />} 
                  className="bg-default-100 text-default-600"
                />
                <div className="flex-1">
                  <p className="text-md font-semibold">
                    {entity.roles?.join(", ") || "Contact"}
                  </p>
                  <p className="text-small text-default-500">Handle: {entity.handle}</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              {entity.vcardArray && (
                <div className="space-y-2">
                  {entity.vcardArray[1]?.map((item, i) => {
                    const [type, , , value] = item;
                    if (!value || !type) return null;
                    
                    const iconMap = {
                      fn: <User className="w-4 h-4" />,
                      org: <Building className="w-4 h-4" />,
                      email: <Mail className="w-4 h-4" />,
                      tel: <Phone className="w-4 h-4" />,
                      adr: <MapPin className="w-4 h-4" />,
                    };
                    
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-default-400">
                          {iconMap[type] || <Info className="w-4 h-4" />}
                        </span>
                        <span className="text-sm">
                          {Array.isArray(value) ? value.join(", ") : value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    );
  };

  const renderRawDataTab = () => {
    if (!result) return null;

    return (
      <Card>
        <CardHeader className="flex justify-between">
          <div className="flex gap-3">
            <Avatar 
              icon={<Database className="w-5 h-5" />} 
              className="bg-default-100 text-default-600"
            />
            <div>
              <p className="text-md font-semibold">Raw RDAP Response</p>
              <p className="text-small text-default-500">Complete JSON data</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="flat"
              onPress={() => copyToClipboard(JSON.stringify(result, null, 2), "raw")}
              startContent={copiedField === "raw" ? 
                <CheckCircle className="w-4 h-4" /> : 
                <Copy className="w-4 h-4" />
              }
            >
              Copy
            </Button>
            <Button
              size="sm"
              variant="flat"
              color="primary"
              onPress={() => {
                const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `rdap-${result.ldhName || result.handle || "result"}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              startContent={<Download className="w-4 h-4" />}
            >
              Export
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <ScrollShadow className="max-h-[500px]">
            <Code className="text-xs">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </Code>
          </ScrollShadow>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar maxWidth="full" className="border-b border-divider">
        <NavbarBrand>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-lg">RDAP Lookup</p>
              <p className="text-tiny text-default-500">Modern Domain Intelligence</p>
            </div>
          </div>
        </NavbarBrand>
        
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              as={Link}
              isExternal
              href="https://github.com/gensecaihq/rdap-lookup"
              variant="flat"
              size="sm"
              startContent={<Github className="w-4 h-4" />}
            >
              Star on GitHub
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Switch
              defaultSelected={isDarkMode}
              size="sm"
              color="secondary"
              onValueChange={toggleDarkMode}
              thumbIcon={({ isSelected }) =>
                isSelected ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />
              }
            />
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Search Form */}
          <div className="lg:col-span-4">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex gap-3 items-center">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-md font-semibold">RDAP Query</p>
                    <p className="text-small text-default-500">Enter domain, IP, or ASN</p>
                  </div>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select
                    label="Query Type"
                    placeholder="Select type"
                    selectedKeys={[type]}
                    onSelectionChange={(keys) => setType(Array.from(keys)[0])}
                    startContent={<Globe className="w-4 h-4 text-default-400" />}
                    isDisabled={result !== null}
                  >
                    <SelectItem key="domain" value="domain">Domain</SelectItem>
                    <SelectItem key="ip" value="ip">IP Address</SelectItem>
                    <SelectItem key="autnum" value="autnum">ASN (Autonomous System)</SelectItem>
                    <SelectItem key="entity" value="entity">Entity</SelectItem>
                  </Select>

                  <Input
                    label="Query Value"
                    placeholder={
                      type === "domain" ? "example.com" :
                      type === "ip" ? "8.8.8.8" :
                      type === "autnum" ? "AS15169" :
                      "HANDLE"
                    }
                    value={objectValue}
                    onValueChange={setObjectValue}
                    startContent={
                      type === "domain" ? <Globe className="w-4 h-4 text-default-400" /> :
                      type === "ip" ? <Network className="w-4 h-4 text-default-400" /> :
                      type === "autnum" ? <Database className="w-4 h-4 text-default-400" /> :
                      <Key className="w-4 h-4 text-default-400" />
                    }
                    isRequired
                    isDisabled={result !== null}
                    errorMessage={error}
                  />

                  {type === "domain" && (
                    <Input
                      label="DKIM Selector"
                      placeholder="Optional (e.g., google)"
                      value={dkimSelector}
                      onValueChange={setDkimSelector}
                      startContent={<Mail className="w-4 h-4 text-default-400" />}
                      isDisabled={result !== null}
                    />
                  )}

                  <div className="flex justify-center py-2">
                    <HCaptcha
                      key={captchaKey}
                      sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
                      onVerify={(token) => setCaptchaToken(token)}
                      onExpire={() => setCaptchaToken("")}
                      onError={() => setCaptchaToken("")}
                      ref={captchaRef}
                      theme={isDarkMode ? "dark" : "light"}
                    />
                  </div>

                  {!result ? (
                    <Button
                      type="submit"
                      color="primary"
                      variant="shadow"
                      className="w-full"
                      isLoading={isLoading}
                      isDisabled={!captchaToken || !objectValue}
                      startContent={!isLoading && <Search className="w-4 h-4" />}
                    >
                      {isLoading ? "Analyzing..." : "Lookup RDAP Data"}
                    </Button>
                  ) : (
                    <Button
                      color="secondary"
                      variant="flat"
                      className="w-full"
                      onPress={resetForm}
                      isLoading={isResetting}
                      startContent={!isResetting && <Search className="w-4 h-4" />}
                    >
                      New Query
                    </Button>
                  )}
                </form>

                {error && (
                  <Card className="mt-4 bg-danger-50 dark:bg-danger-100/10">
                    <CardBody>
                      <div className="flex gap-2 items-center">
                        <AlertCircle className="w-4 h-4 text-danger" />
                        <p className="text-sm text-danger">{error}</p>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </CardBody>
            </Card>

            {/* Info Card */}
            {!result && (
              <Card className="mt-4">
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">What is RDAP?</p>
                        <p className="text-xs text-default-500 mt-1">
                          RDAP (Registration Data Access Protocol) is the modern replacement for WHOIS, 
                          providing structured, standardized domain registration data with better privacy controls.
                        </p>
                      </div>
                    </div>
                    <Divider />
                    <div className="space-y-1">
                      <p className="text-xs text-default-500">✓ Structured JSON responses</p>
                      <p className="text-xs text-default-500">✓ Internationalization support</p>
                      <p className="text-xs text-default-500">✓ Built-in access controls</p>
                      <p className="text-xs text-default-500">✓ RESTful API design</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {result ? (
              <div className="space-y-6">
                {/* Quick Stats */}
                {renderQuickStats()}

                {/* Tabbed Content */}
                <Card>
                  <CardBody className="p-0">
                    <Tabs 
                      aria-label="RDAP Data" 
                      color="primary"
                      variant="underlined"
                      selectedKey={activeTab}
                      onSelectionChange={setActiveTab}
                      classNames={{
                        tabList: "gap-6 w-full relative rounded-none p-4 border-b border-divider",
                        cursor: "w-full bg-primary",
                        tab: "max-w-fit px-4 h-12",
                        tabContent: "group-data-[selected=true]:text-primary"
                      }}
                    >
                      <Tab
                        key="overview"
                        title={
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>Overview</span>
                          </div>
                        }
                      >
                        <div className="p-4">
                          {renderOverviewTab()}
                        </div>
                      </Tab>
                      <Tab
                        key="security"
                        title={
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>Security</span>
                          </div>
                        }
                      >
                        <div className="p-4">
                          {renderSecurityTab()}
                        </div>
                      </Tab>
                      <Tab
                        key="contacts"
                        title={
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Contacts</span>
                          </div>
                        }
                      >
                        <div className="p-4">
                          {renderContactsTab()}
                        </div>
                      </Tab>
                      <Tab
                        key="raw"
                        title={
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            <span>Raw Data</span>
                          </div>
                        }
                      >
                        <div className="p-4">
                          {renderRawDataTab()}
                        </div>
                      </Tab>
                    </Tabs>
                  </CardBody>
                </Card>
              </div>
            ) : (
              /* Welcome Screen */
              <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
                <div className="bg-primary/10 p-6 rounded-full mb-6">
                  <Search className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Ready to Query</h2>
                <p className="text-default-500 max-w-md mb-6">
                  Enter a domain, IP address, or ASN to get comprehensive RDAP information 
                  including registration details, security status, and technical data.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-default-50 dark:bg-default-100/10">
                    <CardBody className="p-4 text-center">
                      <Globe className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-xs font-medium">Domain Lookup</p>
                    </CardBody>
                  </Card>
                  <Card className="bg-default-50 dark:bg-default-100/10">
                    <CardBody className="p-4 text-center">
                      <Shield className="w-6 h-6 text-success mx-auto mb-2" />
                      <p className="text-xs font-medium">Security Check</p>
                    </CardBody>
                  </Card>
                  <Card className="bg-default-50 dark:bg-default-100/10">
                    <CardBody className="p-4 text-center">
                      <Server className="w-6 h-6 text-warning mx-auto mb-2" />
                      <p className="text-xs font-medium">DNS Analysis</p>
                    </CardBody>
                  </Card>
                  <Card className="bg-default-50 dark:bg-default-100/10">
                    <CardBody className="p-4 text-center">
                      <Database className="w-6 h-6 text-secondary mx-auto mb-2" />
                      <p className="text-xs font-medium">Raw Data</p>
                    </CardBody>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}