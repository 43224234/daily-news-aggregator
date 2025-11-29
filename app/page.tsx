"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NewsCard from '@/components/NewsCard';
import { NewsItem } from '@/types';

// We need to fetch data client-side or pass it from server component. 
// For simplicity in this "static" app, we'll import the JSON directly if possible, 
// or fetch it via an API route. But since we are using app dir, let's keep the server component 
// fetching and pass data to a client component wrapper, OR just make the whole page a client component 
// for the filter interaction (easier for this scale).
// Actually, let's make a client component for the list and filter.

import newsData from '@/data/news.json';

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // In a real app, we might fetch this from an API. 
    // Here we just load the imported JSON.
    setNews(newsData as NewsItem[]);
  }, []);

  const categories = ['All', '国际', '商业', '体育', '股市', '人工智能']; // Hardcoded for simplicity based on our script

  const filteredNews = news.filter(item => {
    if (filter === 'All') return true;
    return item.category === filter;
  });

  const importantNews = filteredNews.filter((item) => item.isImportant);
  const otherNews = filteredNews.filter((item) => !item.isImportant);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily News</h1>
          <Link href="/saved" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            View Saved
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {importantNews.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-white border-b-2 border-blue-500 pb-2 inline-block">
              Today's Highlights
            </h2>
            <div className="grid gap-6">
              {importantNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            Recent News
          </h2>
          {otherNews.length > 0 ? (
            <div className="grid gap-6">
              {otherNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No news found for this category.</p>
          )}
        </section>
      </main>
    </div>
  );
}
