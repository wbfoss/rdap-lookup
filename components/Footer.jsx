
import { Link } from "@heroui/react";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-default-100/50 dark:bg-default-100/10 mt-12">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-default-600">
              &copy; {new Date().getFullYear()} RDAP Lookup. All Rights Reserved.
            </p>
            <p className="text-xs text-default-500 mt-1">
              Built with <Heart className="inline w-4 h-4 text-danger" /> by the open-source community.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/about" size="sm" className="text-default-600 hover:text-primary">About</Link>
            <Link href="/what-is-rdap" size="sm" className="text-default-600 hover:text-primary">What is RDAP?</Link>
            <Link isExternal href="https://github.com/gensecaihq/rdap-lookup" size="sm" className="text-default-600 hover:text-primary">GitHub</Link>
          </div>
        </div>

        <div className="text-center mt-6 pt-6 border-t border-divider">
          <p className="text-xs text-default-500">
            Special thanks to the following organizations for their services:
          </p>
          <div className="flex justify-center items-center gap-4 mt-2">
            <Link isExternal href="https://data.iana.org/rdap/" size="sm" className="text-default-600 hover:text-primary">
              IANA RDAP Data
            </Link>
            <span className="text-default-400">|</span>
            <Link isExternal href="https://about.rdap.org/" size="sm" className="text-default-600 hover:text-primary">
              About RDAP
            </Link>
            <span className="text-default-400">|</span>
            <Link isExternal href="https://vercel.com" size="sm" className="text-default-600 hover:text-primary">
              Vercel Hosting
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
