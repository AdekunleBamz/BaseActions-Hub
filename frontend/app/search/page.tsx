'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatAddress } from '@/lib/utils';

// ============================================================================
// SEARCH PAGE - Advanced Search with Filters
// ============================================================================

interface SearchResult {
  id: string;
  type: 'address' | 'signature' | 'message';
  title: string;
  subtitle?: string;
  timestamp?: number;
  address?: string;
  emoji?: string;
  matchScore?: number;
}

const RECENT_SEARCHES = [
  '0x1234567890abcdef1234567890abcdef12345678',
  'GM',
  'Based builder',
  '0xabcdef',
];

const TRENDING_SEARCHES = [
  { term: 'Based', count: 234 },
  { term: 'GM', count: 189 },
  { term: 'Web3', count: 156 },
  { term: 'Builder', count: 134 },
  { term: 'Onchain', count: 98 },
];

const MOCK_RESULTS: SearchResult[] = [
  { id: '1', type: 'address', title: '0x742d35Cc6634C0532925a3b844Bc9e7595f3dBc7', subtitle: '45 signatures', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f3dBc7', emoji: '👤' },
  { id: '2', type: 'signature', title: 'GM! Great project 🚀', subtitle: 'by 0x1234...5678', timestamp: Date.now() - 3600000, emoji: '✍️' },
  { id: '3', type: 'signature', title: 'Love the vibes here 💙', subtitle: 'by 0xabcd...ef01', timestamp: Date.now() - 7200000, emoji: '💙' },
  { id: '4', type: 'address', title: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', subtitle: '89 signatures', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', emoji: '👤' },
  { id: '5', type: 'message', title: 'Based builder from Denver', subtitle: 'Appears in 12 signatures', emoji: '💬' },
  { id: '6', type: 'signature', title: 'Excited to be part of this community', subtitle: 'by 0x5678...9abc', timestamp: Date.now() - 10800000, emoji: '✍️' },
];

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Results', icon: '🔍' },
  { id: 'address', label: 'Addresses', icon: '👤' },
  { id: 'signature', label: 'Signatures', icon: '✍️' },
  { id: 'message', label: 'Messages', icon: '💬' },
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<'all' | 'address' | 'signature' | 'message'>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsSearching(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = MOCK_RESULTS.filter(r => {
          const matchesQuery = r.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            r.subtitle?.toLowerCase().includes(debouncedQuery.toLowerCase());
          const matchesFilter = filter === 'all' || r.type === filter;
          return matchesQuery && matchesFilter;
        });
        setResults(filtered);
        setIsSearching(false);
      }, 500);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, filter]);

  // Update URL with search query
  useEffect(() => {
    if (debouncedQuery) {
      const params = new URLSearchParams();
      params.set('q', debouncedQuery);
      if (filter !== 'all') params.set('filter', filter);
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }
  }, [debouncedQuery, filter, router]);

  const handleSearch = useCallback((term: string) => {
    setQuery(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches([term, ...recentSearches.slice(0, 4)]);
    }
  }, [recentSearches]);

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const isAddressSearch = query.startsWith('0x') && query.length >= 10;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Search Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-4">
          {/* Search Input */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search addresses, signatures, or messages..."
              className="w-full pl-12 pr-12 py-4 text-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-4 flex items-center"
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-2 mt-4">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.id as typeof filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === option.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Loading State */}
        {isSearching && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-gray-500 dark:text-gray-400">Searching...</span>
          </div>
        )}

        {/* Search Results */}
        {!isSearching && results.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{debouncedQuery}"
            </h2>
            {results.map((result) => (
              <SearchResultCard key={result.id} result={result} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isSearching && debouncedQuery.length >= 2 && results.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No results found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Try adjusting your search or filter
            </p>
          </div>
        )}

        {/* Initial State - Recent & Trending */}
        {!isSearching && query.length < 2 && (
          <div className="space-y-8">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Searches</h2>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(term)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="truncate max-w-[200px]">
                        {term.startsWith('0x') ? formatAddress(term) : term}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trending Searches</h2>
              <div className="space-y-2">
                {TRENDING_SEARCHES.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(item.term)}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{item.term}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item.count} searches
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Tips */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Search Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  Enter a wallet address (0x...) to find their guestbook
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">•</span>
                  Search for keywords in signature messages
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">•</span>
                  Use filters to narrow down results by type
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchResultCard({ result }: { result: SearchResult }) {
  const router = useRouter();

  const handleClick = () => {
    if (result.type === 'address' && result.address) {
      router.push(`/guestbook/${result.address}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all text-left"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          result.type === 'address' 
            ? 'bg-blue-100 dark:bg-blue-900/30' 
            : result.type === 'signature'
            ? 'bg-purple-100 dark:bg-purple-900/30'
            : 'bg-green-100 dark:bg-green-900/30'
        }`}>
          {result.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {result.type === 'address' ? formatAddress(result.title) : result.title}
          </h3>
          {result.subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{result.subtitle}</p>
          )}
          {result.timestamp && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {new Date(result.timestamp).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
          result.type === 'address'
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            : result.type === 'signature'
            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
        }`}>
          {result.type}
        </div>
      </div>
    </button>
  );
}
