"use client";

import { useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

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

/**
 * Displays structured RDAP data in a comprehensive, user-friendly format.
 */
function StructuredRdapData({ data }) {
  const {
    objectClassName,
    handle,
    ldhName,
    startAddress,
    endAddress,
    entities,
    events,
    status,
    nameservers,
    secureDNS,
    emailSecurity,
    ssl,
    rbl,
  } = data;

  // Helper to render a table row
  const renderRow = (label, value) =>
    value && (
      <tr>
        <td className="p-2 font-medium bg-gray-50 w-1/3">{label}</td>
        <td className="p-2">{value}</td>
      </tr>
    );

  // Helper to format dates
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleString() : "N/A";

  return (
    <div className="space-y-6">
      {/* General Information */}
      <div>
        <h4 className="text-md font-semibold mb-2">General Information</h4>
        <div className="overflow-auto">
          <table className="w-full border border-gray-200 text-sm">
            <tbody>
              {renderRow("Object Class", objectClassName)}
              {renderRow("Handle", handle)}
              {renderRow("Domain Name (LDH)", ldhName)}
              {renderRow("Start Address", startAddress)}
              {renderRow("End Address", endAddress)}
              {renderRow("Status", status?.join(", "))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Important Dates */}
      {Array.isArray(events) && events.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2">Important Dates</h4>
          <div className="overflow-auto">
            <table className="w-full border border-gray-200 text-sm">
              <tbody>
                {events.map((event, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-medium bg-gray-50 w-1/3 capitalize">
                      {event.eventAction}
                    </td>
                    <td className="p-2">{formatDate(event.eventDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Entities (Contacts) */}
      {Array.isArray(entities) && entities.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2">Entities / Contacts</h4>
          <div className="space-y-4">
            {entities.map((entity, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded p-3 text-sm"
              >
                <p className="font-semibold capitalize">
                  {entity.roles?.join(", ") || "Entity"}
                </p>
                <p>
                  <strong>Handle:</strong> {entity.handle || "N/A"}
                </p>
                {entity.vcardArray && (
                  <p>
                    <strong>Name:</strong>{" "}
                    {entity.vcardArray[1].find((item) => item[0] === "fn")?.[3] ||
                      "N/A"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nameservers */}
      {Array.isArray(nameservers) && nameservers.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2">Nameservers</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {nameservers.map((ns, idx) => (
              <li key={idx}>{ns.ldhName}</li>
            ))}
          </ul>
        </div>
      )}

      {/* DNSSEC */}
      {secureDNS && (
        <div>
          <h4 className="text-md font-semibold mb-2">DNSSEC</h4>
          <p className="text-sm">
            {secureDNS.delegationSigned
              ? "Signed (Secure)"
              : "Not Signed (Insecure)"}
          </p>
        </div>
      )}

      {/* Email Security */}
      {emailSecurity && (
        <div>
          <h4 className="text-md font-semibold mb-2">Email Security</h4>
          <div className="overflow-auto">
            <table className="w-full border border-gray-200 text-sm">
              <tbody>
                {renderRow("SPF", emailSecurity.spf)}
                {renderRow("DMARC", emailSecurity.dmarc)}
                {renderRow("DKIM", emailSecurity.dkim)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SSL/TLS Certificate */}
      {ssl && (
        <div>
          <h4 className="text-md font-semibold mb-2">SSL/TLS Certificate</h4>
          {ssl.error ? (
            <p className="text-sm text-red-600">{ssl.error}</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full border border-gray-200 text-sm">
                <tbody>
                  {renderRow("Subject", ssl.subject?.CN)}
                  {renderRow("Issuer", ssl.issuer?.CN)}
                  {renderRow("Valid From", formatDate(ssl.valid_from))}
                  {renderRow("Valid To", formatDate(ssl.valid_to))}
                  {renderRow("Fingerprint", ssl.fingerprint)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* RBL Status */}
      {rbl && (
        <div>
          <h4 className="text-md font-semibold mb-2">RBL Status</h4>
          {rbl.error ? (
            <p className="text-sm text-red-600">{rbl.error}</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full border border-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="p-2 font-medium bg-gray-50 text-left">RBL Provider</th>
                    <th className="p-2 font-medium bg-gray-50 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(rbl).map(([provider, result]) => (
                    <tr key={provider}>
                      <td className="p-2">{provider}</td>
                      <td
                        className={`p-2 ${result.status === "Listed" ? "text-red-600 font-bold" : ""}`}>
                        {result.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [type, setType] = useState("domain");
  const [objectValue, setObjectValue] = useState("");
  const [dkimSelector, setDkimSelector] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    setShowJson(false);

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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setType("domain");
    setObjectValue("");
    setResult(null);
    setError(null);
    setShowJson(false);
    setCaptchaToken("");
    // Reset hCaptcha if it exists
    const hcaptchaElement = document.querySelector(
      "iframe[data-hcaptcha-widget-id]"
    );
    if (hcaptchaElement) {
      hcaptchaElement.contentWindow.postMessage('{"event":"reset"}', "*");
    }
  }

  return (
    <main className="container mx-auto p-4 max-w-xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex justify-between items-center">
            <span>RDAP Lookup Tool v1.0</span>
            <Button variant="outline" onClick={toggleDarkMode}>
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* RDAP Type */}
            <div>
              <Label htmlFor="type" className="mb-2 block text-sm font-medium">
                Object Type
              </Label>
              <Select value={type} onValueChange={(val) => setType(val)}>
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
                />
              </div>
            )}

            {/* hCaptcha */}
            <div className="flex justify-center">
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken("")}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="default"
                type="submit"
                disabled={!type || !objectValue || isLoading || !captchaToken}
              >
                {isLoading ? "Checking..." : "Lookup"}
              </Button>
              {result && (
                <Button variant="outline" type="button" onClick={resetForm}>
                  Make Another Query
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="mb-4">
          <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold flex justify-between">
              <span>Lookup Result</span>
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowJson((prev) => !prev)}
              >
                {showJson ? "Hide JSON" : "Show JSON"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : showJson ? (
              <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            ) : (
              <StructuredRdapData data={result} />
            )}
          </CardContent>
        </Card>
      )}

      {/* Footer Section */}
      <div className="mt-6 text-xs text-gray-600">
        Special Thanks to{" "}
        <a
          href="https://rdap.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          rdap.org
        </a>{" "}
        and{" "}
        <a
          href="https://iana.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          iana.org
        </a>{" "}
        | Hosted on{" "}
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {" "}
          vercel.com{" "}
        </a>{" "}
        | This is an open-source project |{" "}
        <a
          href="https://github.com/alokemajumder/rdap-lookup"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Contribute at GitHub
        </a>
      </div>
    </main>
  );
}
