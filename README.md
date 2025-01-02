

![GitHub stars](https://img.shields.io/github/stars/alokemajumder/Cc?style=social)
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



# RDAP Lookup (Next.js App Router + shadcn/ui)

A production-level **RDAP Lookup** tool built using **Next.js App Router**, **Tailwind CSS**, and **shadcn/ui** components.  
It queries [rdap.org](https://rdap.org) for the given object and, if that fails (for domains), automatically falls back to [rdap.iana.org](https://rdap.iana.org). This application enforces **rate limiting** (100 queries/IP, 15-second interval), returns **user-friendly** errors, and displays **structured** RDAP data by default, with a toggle to show raw JSON.

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
-   **Rate limiting**: 100 queries/IP & 15-second interval
-   **Fallback** for domains**: `rdap.iana.org/domain/<domain>` if primary lookup fails
-   **Structured** result display + **raw JSON** toggle button
-   **User-friendly** error messages

----------

## Getting Started

1.  **Clone or Download** this repository:
    
    
    `git clone https://github.com/<your-repo-url>/rdap-lookup.git
    cd rdap-lookup` 
    
2.  **Install Dependencies**:
    
    
    `npm install` 
    
    or
    
    
    `yarn` 
    
3.  **Run in Development**:
    
    
    `npm run dev` 
    
    By default, the app runs at http://localhost:3000.
    
4.  **Build for Production**:
    
    
    `npm run build
    npm run start` 
    
    By default, runs at http://localhost:3000.
    

----------

## Usage

1.  **Select** the RDAP type (domain, IP, ASN, or entity).
2.  **Enter** the object (e.g., `google.com` or `8.8.8.8`).
3.  **Click** **Lookup**.
    -   If **rdap.org** fails and it's a **domain**, fallback queries **rdap.iana.org/domain/<domain>**.
4.  By default, you see a **structured** representation of key RDAP fields (object class, handle, LDH name, etc.).
5.  Click **Show JSON** to toggle the raw JSON output.

### Rate Limiting

-   **100 queries** maximum per IP address.
-   **15 seconds** minimum interval between consecutive queries.
-   Exceeding these results in a **429** (Too Many Requests) error.

----------

## Contributing

1.  **Fork or Clone** the repository.
2.  **Create** a new feature branch (e.g., `feature/improve-structured-output`).
3.  **Commit and Push** your changes.
4.  **Open a Pull Request** explaining what you’ve changed and why.

We welcome enhancements for deeper RDAP parsing, improved UI, or integration with a persistent rate-limiting store (e.g., Redis).

----------

## License

This project is licensed under the [MIT License](LICENSE).

You’re free to fork, modify, and redistribute under the terms of the MIT license.  
We appreciate contributions and feedback!

