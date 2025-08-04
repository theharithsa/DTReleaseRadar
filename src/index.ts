import express from 'express';
import { fetchLatestRelease } from './rss';
import { extractImagesFromHtml, summarizeHtmlContent } from './utils';
import { createReleaseEmail } from './email';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/latest-release', async (req, res) => {
  const rssUrl = req.headers['x-rss-url'] as string;
  if (!rssUrl) {
    return res.status(400).json({ error: 'Missing x-rss-url header' });
  }

  try {
    const latest = await fetchLatestRelease(rssUrl);
    if (!latest) return res.status(404).json({ error: 'No items found' });

    const images = extractImagesFromHtml(latest.content || '');
    const summary = summarizeHtmlContent(latest.content || '');
    const htmlEmail = createReleaseEmail(latest, summary, images);

    res.json({ ...latest, summary, images, htmlEmail }); // Return everything, or just htmlEmail if you want
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => {
  res.send('🚀 ReleaseRadar is running!');
});

export default app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 ReleaseRadar (TypeScript) running on port ${PORT}`);
  });
}
