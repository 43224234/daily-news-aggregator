"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NewsCard from '@/components/NewsCard';
import { NewsItem } from '@/types';

export default function SavedNews() {
    const [savedNews, setSavedNews] = useState<NewsItem[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('savedNews');
        if (saved) {
            setSavedNews(JSON.parse(saved));
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved News</h1>
                    <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        Back to Feed
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {savedNews.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500 dark:text-gray-400">You haven't saved any news yet.</p>
                        <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
                            Browse News
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {savedNews.map((item) => (
                            <NewsCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
