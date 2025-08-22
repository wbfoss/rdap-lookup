"use client";

import { Star, ExternalLink, TrendingUp } from "lucide-react";
import { useGitHubStars, formatStarCount } from "../hooks/useGitHubStars";

export default function GitHubBadge({ owner = "gensecaihq", repo = "rdap-lookup" }) {
  const { stars, loading, error } = useGitHubStars(owner, repo);

  const displayStars = loading ? (
    <div className="animate-pulse">...</div>
  ) : error ? (
    <div className="flex items-center gap-1">
      <span>⭐</span>
    </div>
  ) : stars === null ? (
    <div className="flex items-center gap-1">
      <span>⭐</span>
    </div>
  ) : (
    formatStarCount(stars)
  );

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-center">
          <a
            href={`https://github.com/${owner}/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Content */}
            <div className="relative flex items-center gap-3">
              {/* GitHub Icon Section */}
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="font-semibold">Star on GitHub</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              
              {/* Star Count Badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-lg text-sm font-bold shadow-inner group-hover:from-yellow-300 group-hover:to-orange-300 transition-all duration-200">
                <Star className="w-4 h-4 fill-current group-hover:scale-110 transition-transform duration-200" />
                <span className="min-w-[24px] text-center">
                  {displayStars}
                </span>
                {!loading && !error && typeof stars === 'number' && (
                  <span className="text-xs opacity-80 hidden sm:inline ml-1">
                    {stars === 1 ? 'star' : 'stars'}
                  </span>
                )}
              </div>

              {/* Trending indicator for popular repos */}
              {!loading && !error && typeof stars === 'number' && stars > 10 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-xs border border-green-500/30">
                  <TrendingUp className="w-3 h-3" />
                  <span className="hidden sm:inline">Popular</span>
                </div>
              )}
            </div>
          </a>
        </div>
        
        {/* Subtitle with enhanced styling */}
        <div className="text-center mt-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            🚀 Open source RDAP lookup tool • Built with{" "}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Next.js</span>
          </p>
        </div>
      </div>
    </div>
  );
}