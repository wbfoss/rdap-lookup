![GitHub stars](https://img.shields.io/github/stars/alokemajumder/rdap-lookup?style=social)
![GitHub forks](https://img.shields.io/github/forks/alokemajumder/rdap-lookup?style=social)
![GitHub issues](https://img.shields.io/github/issues/alokemajumder/rdap-lookup)
![GitHub pull requests](https://img.shields.io/github/issues-pr/alokemajumder/rdap-lookup)
![GitHub](https://img.shields.io/github/license/alokemajumder/rdap-lookup)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/alokemajumder/rdap-lookup)
![GitHub contributors](https://img.shields.io/github/contributors/alokemajumder/rdap-lookup)
![GitHub last commit](https://img.shields.io/github/last-commit/alokemajumder/rdap-lookup)
![GitHub top language](https://img.shields.io/github/languages/top/alokemajumder/rdap-lookup)
![Dependencies](https://img.shields.io/librariesio/github/alokemajumder/rdap-lookup)
![Code size](https://img.shields.io/github/languages/code-size/alokemajumder/rdap-lookup)
![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.png?v=103)

# RDAP Lookup & Security Tool (Next.js App Router + shadcn/ui)

A production-level **RDAP Lookup** and security tool built using **Next.js App Router**, **Tailwind CSS**, and **shadcn/ui** components.
It queries [rdap.org](https://rdap.org) for the given object and, if that fails (for domains), automatically falls back to [rdap.iana.org](https://rdap.iana.org). This application enforces **rate limiting**, returns **user-friendly** errors, and displays **structured** RDAP data by default, with a toggle to show raw JSON.

This tool also includes several security-related checks:
*   **Email Security:** Checks for SPF and DMARC records for domains.
*   **DKIM Record Lookup:** Allows for checking a specific DKIM selector for a domain.
*   **SSL/TLS Certificate Checker:** Fetches and displays SSL certificate information for a domain.
*   **RBL/DNSBL Checker:** Checks an IP address against a list of Real-time Blackhole Lists.

----------

## Why RDAP Instead of WHOIS?

**RDAP (Registration Data Access Protocol)** is the modern, standardized replacement for the legacy WHOIS protocol. It provides:

1.  **Structured Responses**: JSON output that is easier to parse.
2.  **Internationalization**: Better support for IDNs and non-ASCII data.
3.  **Security & Access Control**: Designed to meet modern privacy requirements.
4.  **RESTful / Web-Friendly**: Utilizes HTTPS endpoints, making integration simpler than raw WHOIS text.

Overall, RDAP is **more robust and future-proof** for domain/IP registration data than WHOIS.

----------

## Features

-   **Next.js 13 App Router**
-   **shadcn/ui** for modern UI components
-   **Tailwind CSS** for styling
-   **Rate limiting**: Configurable via environment variables.
-   **Fallback** for domains**: `rdap.iana.org/domain/<domain>` if primary lookup fails
-   **Structured** result display + **raw JSON** toggle button
-   **User-friendly** error messages
-   **Email Security Checks:** SPF and DMARC record lookups.
-   **DKIM Record Lookup:** Optional DKIM selector for domain lookups.
-   **SSL/TLS Certificate Checker:** Displays SSL certificate details.
-   **RBL/DNSBL Checker:** Checks IP addresses against Spamhaus, Barracuda, and SpamCop.

----------

## Getting Started

1.  **Clone or Download** this repository:
    ```
    git clone https://github.com/wbfoss/rdap-lookup.git
    cd rdap-lookup
    ```
2.  **Install Dependencies**:
    ```
    npm install
    ```
    or
    ```
    yarn
    ```
3.  **Environment Variables**:
    Create a `.env.local` file in the root of the project and add the following environment variables:
    ```
    # hCaptcha secret key
    HCAPTCHA_SECRET_KEY=your_hcaptcha_secret_key

    # Optional: Rate limiting configuration
    RDAP_LOOKUP_MAX_QUERIES=100
    RDAP_LOOKUP_RATE_LIMIT_SECONDS=15
    ```
4.  **Run in Development**:
    ```
    npm run dev
    ```
    By default, the app runs at http://localhost:3000.

5.  **Build for Production**:
    ```
    npm run build
    npm run start
    ```
    By default, runs at http://localhost:3000.

----------

## Usage

1.  **Select** the RDAP type (domain, IP, ASN, or entity).
2.  **Enter** the object (e.g., `google.com` or `8.8.8.8`).
3.  If you selected "domain", you can optionally enter a **DKIM selector**.
4.  **Click** **Lookup**.
    -   If **rdap.org** fails and it's a **domain**, fallback queries **rdap.iana.org/domain/<domain>**.
5.  By default, you see a **structured** representation of key RDAP fields and security information.
6.  Click **Show JSON** to toggle the raw JSON output.

### Rate Limiting

-   The number of queries per IP and the time between queries can be configured using the `RDAP_LOOKUP_MAX_QUERIES` and `RDAP_LOOKUP_RATE_LIMIT_SECONDS` environment variables.
-   Exceeding these results in a **429** (Too Many Requests) error.

----------

## Contributing

1.  **Fork or Clone** the repository.
2.  **Create** a new feature branch (e.g., `feature/improve-structured-output`).
3.  **Commit and Push** your changes.
4.  **Open a Pull Request** explaining what you’ve changed and why.

We welcome enhancements for deeper RDAP parsing, improved UI, or integration with a persistent rate-limiting store (e.g., Redis).

----------

## Live Website

[RDAP Lookup](https://rdap.vercel.app)

## License

This project is licensed under the [MIT License](LICENSE).

You’re free to fork, modify, and redistribute under the terms of the MIT license.
We appreciate contributions and feedback!