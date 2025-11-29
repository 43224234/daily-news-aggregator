"use client";

import { useState, useEffect } from 'react';
import { NewsItem } from '@/types';

interface NewsCardProps {
    item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('savedNews');
        if (saved) {
            const savedItems = JSON.parse(saved);
            setIsSaved(savedItems.some((i: NewsItem) => i.id === item.id));
        }
    }, [item.id]);

    const toggleSave = () => {
        const saved = localStorage.getItem('savedNews');
        let savedItems: NewsItem[] = saved ? JSON.parse(saved) : [];

        if (isSaved) {
            savedItems = savedItems.filter((i) => i.id !== item.id);
        } else {
            savedItems.push(item);
        }

        localStorage.setItem('savedNews', JSON.stringify(savedItems));
        setIsSaved(!isSaved);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">
                        {item.title}
                    </a>
                </h3>
                <button
                    onClick={toggleSave}
                    className={`ml-4 p-2 rounded-full transition-colors duration-200 ${isSaved
                            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                        }`}
                    aria-label={isSaved ? "Unsave" : "Save"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {new Date(item.pubDate).toLocaleDateString()} • {item.source}
            </p>
            <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                {item.content}
            </p>
        </div>
    );
}
