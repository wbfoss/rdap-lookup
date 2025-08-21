"use client";

import { useState, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import RdapResultDisplay from "@/components/RdapResultDisplay";

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasQueryResult, setHasQueryResult] = useState(false); // New state for query result presence
  const captchaRef = useRef(null);

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

  function resetForm() {
    setType("domain");
    setObjectValue("");
    setDkimSelector(""); // Clear DKIM selector on reset
    setResult(null);
    setError(null);
    setCaptchaToken("");
    setHasQueryResult(false); // Reset to false
    if (captchaRef.current) {
      captchaRef.current.reset(); // Reset hCaptcha
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
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken("")}
                ref={captchaRef}
              />
            </div>

            <div className="flex items-center gap-2">
              {!hasQueryResult ? (
                <Button
                  type="submit"
                  disabled={!type || !objectValue || isLoading || !captchaToken}
                  className="w-full"
                >
                  {isLoading ? "Checking..." : "Lookup"}
                </Button>
              ) : (
                <Button type="button" onClick={resetForm} className="w-full">
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
          <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md dark:border-red-700 dark:bg-red-900 dark:text-red-300">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <RdapResultDisplay data={result} objectType={type} />
      )}

      {/* Footer Section */}
      <div className="mt-6 text-xs text-gray-600 dark:text-gray-400">
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
