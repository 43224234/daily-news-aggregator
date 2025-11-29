const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const parser = new Parser();
const NEWS_FILE = path.join(__dirname, '../data/news.json');

const FEEDS = [
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'World', categoryZh: '国际' },
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', category: 'Business', categoryZh: '商业' },
  { url: 'https://feeds.bbci.co.uk/sport/rss.xml', category: 'Sport', categoryZh: '体育' },
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', category: 'Stocks', categoryZh: '股市' },
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'AI', categoryZh: '人工智能' }
];

async function fetchNews() {
  try {
    let existingNews = [];
    if (fs.existsSync(NEWS_FILE)) {
      const fileContent = fs.readFileSync(NEWS_FILE, 'utf-8');
      existingNews = JSON.parse(fileContent || '[]');
    }

    const newItems = [];

    for (const feedInfo of FEEDS) {
      console.log(`Fetching ${feedInfo.category} news...`);
      const feed = await parser.parseURL(feedInfo.url);

      for (const item of feed.items) {
        // Check if already exists
        const exists = existingNews.some(existing => existing.id === (item.guid || item.link));
        if (exists) continue;

        let title = item.title;
        let content = item.contentSnippet || item.content;

        try {
          // Translate Title
          const titleRes = await translate(title, { to: 'zh-CN' });
          title = titleRes.text;

          // Translate Content (if available)
          if (content) {
            const contentRes = await translate(content, { to: 'zh-CN' });
            content = contentRes.text;
          }
        } catch (err) {
          console.error(`Translation failed for item: ${item.title}`, err.message);
        }

        newItems.push({
          id: item.guid || item.link,
          title: title,
          link: item.link,
          pubDate: item.pubDate,
          content: content,
          source: 'BBC News',
          category: feedInfo.categoryZh, // Store Chinese category directly
          fetchedAt: new Date().toISOString(),
          isImportant: false
        });

        // Add a small delay
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    if (newItems.length === 0) {
      console.log('No new news found.');
      return;
    }

    // Mark top 1 item from each category as important
    const categories = [...new Set(newItems.map(i => i.category))];
    categories.forEach(cat => {
      const firstItem = newItems.find(i => i.category === cat);
      if (firstItem) firstItem.isImportant = true;
    });

    const updatedNews = [...newItems, ...existingNews];
    // Limit to 150 items
    const trimmedNews = updatedNews.slice(0, 150);

    fs.writeFileSync(NEWS_FILE, JSON.stringify(trimmedNews, null, 2));
    console.log(`Added ${newItems.length} new items. Total: ${trimmedNews.length}`);

  } catch (error) {
    console.error('Error fetching news:', error);
    process.exit(1);
  }
}

fetchNews();
