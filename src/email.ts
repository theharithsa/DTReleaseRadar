import { ReleaseNote } from './types';

export function createReleaseEmail(note: ReleaseNote, summary: string, images: string[]): string {
  const mainImage = images[0] || '';
  return `
    <div style="font-family: Arial, sans-serif; background: #f7f8fa; padding: 32px;">
      <div style="background: #fff; border-radius: 12px; padding: 24px; max-width: 600px; margin: auto; box-shadow: 0 2px 8px #e3e3e3;">
        ${mainImage ? `<img src="${mainImage}" style="max-width: 100%; border-radius: 8px; margin-bottom: 16px;" alt="Release Image"/>` : ''}
        <h2 style="color: #1565c0;">${note.title}</h2>
        <p style="color: #888;">Published: <strong>${note.pubDate}</strong></p>
        <p style="color: #222; font-size: 16px; line-height: 1.7;">${summary}</p>
        <hr>
        <div style="color: #222; font-size: 16px; line-height: 1.7;">
          ${note.content}
        </div>
        <hr>
        <p>
          <a href="${note.link}" style="color: #1565c0;">Read more online</a>
        </p>
        <footer style="font-size: 12px; color: #888; margin-top: 32px;">
          You're receiving this because you're subscribed to release updates.<br>
          <em>Automated message. Do not reply.</em>
        </footer>
      </div>
    </div>
  `;
}
