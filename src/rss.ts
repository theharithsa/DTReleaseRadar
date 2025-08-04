import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { ReleaseNote } from './types';
import { extractImagesFromHtml } from './utils';
import { summarizeHtmlContent } from './utils';


export async function fetchLatestRelease(rssUrl: string): Promise<ReleaseNote | null> {
  const { data: xml } = await axios.get(rssUrl);
  const parser = new XMLParser({ ignoreAttributes: false });
  const feed = parser.parse(xml);

  // Support RSS (rss.channel.item) and Atom (feed.entry)
  const items = feed.rss?.channel?.item || feed.feed?.entry;
  if (!items) return null;
  
  const itemList = Array.isArray(items) ? items : [items];
  const latest = itemList[0];
  const result = {
    title: latest.title,
    link: latest.link,
    pubDate: latest.pubDate || latest.updated,
    content: latest['content:encoded'] || latest.content || latest.description,
    guid: latest.guid || latest.id,
  }
  const images = extractImagesFromHtml(result.content || '');
  const summary = summarizeHtmlContent(result.content || '');
  return result;
}


