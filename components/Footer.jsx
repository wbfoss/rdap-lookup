
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100/50 bg-gray-800/50 mt-12">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 text-gray-400">
              &copy; {new Date().getFullYear()} RDAP Lookup. All Rights Reserved.
            </p>
            <p className="text-xs text-gray-500 text-gray-500 mt-1">
              Built with <Heart className="inline w-4 h-4 text-red-500" /> by the open-source community.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/about" className="text-sm text-gray-600 text-gray-400 hover:text-blue-600 hover:text-blue-400">About</Link>
            <Link href="/what-is-rdap" className="text-sm text-gray-600 text-gray-400 hover:text-blue-600 hover:text-blue-400">What is RDAP?</Link>
            <a href="https://github.com/gensecaihq/rdap-lookup" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 text-gray-400 hover:text-blue-600 hover:text-blue-400">GitHub</a>
          </div>
        </div>

        <div className="text-center mt-6 pt-6 border-t border-gray-200 border-gray-700">
          <p className="text-xs text-gray-500 text-gray-500">
            Special thanks to the following organizations for their services:
          </p>
          <div className="flex justify-center items-center gap-4 mt-2">
            <a href="https://data.iana.org/rdap/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 text-gray-400 hover:text-blue-600 hover:text-blue-400">
              IANA RDAP Data
            </a>
            <span className="text-gray-400">|</span>
            <a href="https://about.rdap.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 text-gray-400 hover:text-blue-600 hover:text-blue-400">
              About RDAP
            </a>
            <span className="text-gray-400">|</span>
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 text-gray-400 hover:text-blue-600 hover:text-blue-400">
              Vercel Hosting
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
