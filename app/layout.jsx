import '@/styles/globals.css';

export const metadata = {
  title: 'RDAP Lookup',
  description: 'A Next.js RDAP lookup tool with fallback and rate limiting',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
