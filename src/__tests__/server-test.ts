import request from 'supertest';
import app from '../index';

const testFeed = 'https://www.dynatrace.com/news/category/release-notes/feed/';

describe('ReleaseRadar API', () => {
  it('should respond with 400 if x-rss-url header missing', async () => {
    const res = await request(app).get('/latest-release');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Missing x-rss-url/);
  });

  it('should respond with JSON including summary, images, and htmlEmail when x-rss-url is provided', async () => {
    const res = await request(app)
      .get('/latest-release')
      .set('x-rss-url', testFeed);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('link');
    expect(res.body).toHaveProperty('content');
    expect(res.body).toHaveProperty('summary');
    expect(res.body).toHaveProperty('images');
    expect(res.body.images).toBeInstanceOf(Array);
    expect(res.body).toHaveProperty('htmlEmail');
    expect(typeof res.body.htmlEmail).toBe('string');

    // If there are images, main image should appear in HTML
    if (res.body.images.length > 0) {
      expect(res.body.htmlEmail).toContain(res.body.images[0]);
    }

    // The summary should be present in the HTML email as well
    expect(res.body.htmlEmail).toContain(res.body.summary);

    // Optionally, check for main fields in HTML
    expect(res.body.htmlEmail).toContain(res.body.title);
    expect(res.body.htmlEmail).toContain(res.body.link);
  });
});
