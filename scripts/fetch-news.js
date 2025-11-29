const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();
const NEWS_FILE = path.join(__dirname, '../data/news.json');
const FEED_URL = 'https://feeds.bbci.co.uk/news/world/rss.xml'; // Example feed

async function fetchNews() {
  try {
    const feed = await parser.parseURL(FEED_URL);
    console.log(`Fetched ${feed.items.length} items from ${feed.title}`);

    let existingNews = [];
    if (fs.existsSync(NEWS_FILE)) {
      const fileContent = fs.readFileSync(NEWS_FILE, 'utf-8');
      existingNews = JSON.parse(fileContent || '[]');
    }

    const newItems = feed.items.map(item => ({
      id: item.guid || item.link,
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      content: item.contentSnippet || item.content,
      source: 'BBC News', // Hardcoded for now
      fetchedAt: new Date().toISOString(),
      isImportant: false // Default, logic to determine importance can be added
    }));

    // Filter out duplicates
    const uniqueNewItems = newItems.filter(newItem => 
      !existingNews.some(existing => existing.id === newItem.id)
    );

    if (uniqueNewItems.length === 0) {
      console.log('No new news found.');
      return;
    }

    // Mark top 3 new items as important for demo purposes
    uniqueNewItems.slice(0, 3).forEach(item => item.isImportant = true);

    const updatedNews = [...uniqueNewItems, ...existingNews];

    // Optional: Limit total stored news to avoid infinite growth (e.g., 100 items)
    const trimmedNews = updatedNews.slice(0, 100);

    fs.writeFileSync(NEWS_FILE, JSON.stringify(trimmedNews, null, 2));
    console.log(`Added ${uniqueNewItems.length} new items. Total: ${trimmedNews.length}`);

  } catch (error) {
    console.error('Error fetching news:', error);
    process.exit(1);
  }
}

fetchNews();
