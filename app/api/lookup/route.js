import { NextResponse } from "next/server";

// In-memory store for rate limiting:
const rateLimitStore = {};

/**
 * Verify hCaptcha token with hCaptcha's verification endpoint
 */
async function verifyHCaptcha(token) {
  const verifyUrl = "https://api.hcaptcha.com/siteverify";
  const response = await fetch(verifyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      response: token,
      secret: process.env.HCAPTCHA_SECRET_KEY,
    }),
  });

  const data = await response.json();
  return data.success;
}

/**
 * Enforce:
 *  - max 100 queries per IP
 *  - at least 15 seconds between queries
 */
function checkRateLimit(ip) {
  const now = Date.now();
  const userEntry = rateLimitStore[ip] || { count: 0, lastRequest: 0 };

  // Exceed total queries?
  if (userEntry.count >= 100) {
    return {
      allowed: false,
      reason:
        "You have reached the maximum of 100 queries for your IP address.",
    };
  }

  // Too frequent?
  const timeSinceLastRequest = now - userEntry.lastRequest;
  if (timeSinceLastRequest < 15 * 1000) {
    return {
      allowed: false,
      reason: "Please wait at least 15 seconds before making another query.",
    };
  }

  return { allowed: true, reason: "" };
}

function updateRateLimit(ip) {
  const now = Date.now();
  const userEntry = rateLimitStore[ip] || { count: 0, lastRequest: 0 };
  userEntry.count += 1;
  userEntry.lastRequest = now;
  rateLimitStore[ip] = userEntry;
}

export async function POST(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1"; // fallback in dev

    // Rate-limit check
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json({ message: rateCheck.reason }, { status: 429 });
    }

    const { type, object, captchaToken } = await request.json();

    // Validate required fields
    if (!type || !object) {
      return NextResponse.json(
        { message: 'Please provide both "type" and "object".' },
        { status: 400 }
      );
    }

    // Verify hCaptcha token
    if (!captchaToken) {
      return NextResponse.json(
        { message: "Captcha token is required." },
        { status: 400 }
      );
    }

    const isValidCaptcha = await verifyHCaptcha(captchaToken);
    if (!isValidCaptcha) {
      return NextResponse.json(
        { message: "Invalid captcha token. Please try again." },
        { status: 400 }
      );
    }

    // Primary RDAP request
    const rdapUrl = `https://rdap.org/${type}/${object}`;
    const response = await fetch(rdapUrl);

    // If rdap.org fails & type=domain => fallback
    if (!response.ok) {
      if (type === "domain") {
        const fallbackUrl = `https://rdap.iana.org/domain/${object}`;
        const fallbackResponse = await fetch(fallbackUrl);

        if (!fallbackResponse.ok) {
          return NextResponse.json(
            {
              message: `Unable to fetch RDAP data for ${object}. Fallback also failed: ${fallbackResponse.statusText}`,
            },
            { status: fallbackResponse.status }
          );
        }

        const fallbackData = await fallbackResponse.json();
        updateRateLimit(ip);
        return NextResponse.json(fallbackData, { status: 200 });
      } else {
        // No fallback for IP, autnum, entity
        return NextResponse.json(
          {
            message: `Unable to fetch RDAP data for ${type}/${object}: ${response.statusText}`,
          },
          { status: response.status }
        );
      }
    }

    // If primary request succeeded
    const data = await response.json();
    updateRateLimit(ip);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `An unexpected error occurred: ${error.message}` },
      { status: 500 }
    );
  }
}
