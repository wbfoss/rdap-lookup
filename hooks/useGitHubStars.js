import { useState, useEffect } from 'react';

// Simple in-memory cache for GitHub API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useGitHubStars(owner, repo) {
  const [stars, setStars] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStars() {
      const cacheKey = `${owner}/${repo}`;
      const cached = cache.get(cacheKey);
      
      // Check if we have valid cached data
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setStars(cached.stars);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from GitHub API
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
          // Add cache control
          cache: 'no-cache',
        });

        if (!response.ok) {
          // Handle rate limiting specifically
          if (response.status === 403) {
            throw new Error('Rate limited');
          }
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        const starCount = data.stargazers_count;
        
        // Cache the result
        cache.set(cacheKey, {
          stars: starCount,
          timestamp: Date.now(),
        });
        
        setStars(starCount);
      } catch (err) {
        console.error('Error fetching GitHub stars:', err);
        setError(err.message);
        
        // Try to use stale cache data as fallback
        if (cached) {
          setStars(cached.stars);
        } else {
          // Ultimate fallback - show a placeholder
          setStars(null);
        }
      } finally {
        setLoading(false);
      }
    }

    if (owner && repo) {
      fetchStars();
    }
  }, [owner, repo]);

  return { stars, loading, error };
}

export function formatStarCount(count) {
  if (typeof count !== 'number') return count;
  
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  } else {
    return count.toString();
  }
}