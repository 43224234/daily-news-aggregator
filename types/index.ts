export interface NewsItem {
    id: string;
    title: string;
    link: string;
    pubDate: string;
    content: string;
    source: string;
    category?: string;
    fetchedAt: string;
    isImportant: boolean;
}
