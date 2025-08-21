"use client";

import { Github, Star, ExternalLink, TrendingUp } from "lucide-react";
import { useGitHubStars, formatStarCount } from "@/hooks/useGitHubStars";

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
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
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
          {!loading && !error && typeof stars === 'number' && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Join <span className="font-semibold text-gray-700 dark:text-gray-300">{stars}</span> developers who starred this project
            </p>
          )}
        </div>
      </div>
    </div>
  );
}