import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import NewsCard from '@/components/NewsCard';
import { NewsItem } from '@/types';

async function getNews() {
  const filePath = path.join(process.cwd(), 'data/news.json');
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent) as NewsItem[];
}

export default async function Home() {
  const news = await getNews();
  const importantNews = news.filter((item) => item.isImportant);
  const otherNews = news.filter((item) => !item.isImportant);

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
          <div className="grid gap-6">
            {otherNews.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
