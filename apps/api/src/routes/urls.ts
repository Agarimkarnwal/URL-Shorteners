import { Request, Response } from 'express';
import { getDB } from '../config/database';

// Generate a random short code
const generateShortCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create a new short URL
export const createShortUrl = async (req: Request, res: Response) => {
  try {
    const { originalUrl, customAlias, description } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    // Validate URL
    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const db = getDB();
    let shortCode = customAlias;

    // If no custom alias provided, generate one
    if (!shortCode) {
      let isUnique = false;
      while (!isUnique) {
        shortCode = generateShortCode();
        const existing = await db.get('SELECT id FROM urls WHERE shortCode = ?', [shortCode]);
        if (!existing) {
          isUnique = true;
        }
      }
    } else {
      // Check if custom alias is already taken
      const existing = await db.get('SELECT id FROM urls WHERE shortCode = ?', [shortCode]);
      if (existing) {
        return res.status(409).json({ error: 'Custom alias already exists' });
      }
    }

    // Insert new URL
    const result = await db.run(
      'INSERT INTO urls (shortCode, originalUrl, description) VALUES (?, ?, ?)',
      [shortCode, originalUrl, description]
    );

    const newUrl = await db.get('SELECT * FROM urls WHERE id = ?', [result.lastID]);

    res.status(201).json({
      id: newUrl.id,
      shortCode: newUrl.shortCode,
      shortUrl: `${req.protocol}://${req.get('host')}/${newUrl.shortCode}`,
      originalUrl: newUrl.originalUrl,
      description: newUrl.description,
      createdAt: newUrl.createdAt,
      clickCount: newUrl.clickCount,
      isActive: newUrl.isActive
    });
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Redirect to original URL
export const getShortUrl = async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;
    const db = getDB();

    const url = await db.get('SELECT * FROM urls WHERE shortCode = ? AND isActive = 1', [shortCode]);

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Record click
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const referrer = req.get('Referrer');

    await db.run(
      'INSERT INTO clicks (urlId, ipAddress, userAgent, referrer) VALUES (?, ?, ?, ?)',
      [url.id, ipAddress, userAgent, referrer]
    );

    // Update click count and last clicked
    await db.run(
      'UPDATE urls SET clickCount = clickCount + 1, lastClicked = CURRENT_TIMESTAMP WHERE id = ?',
      [url.id]
    );

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error redirecting URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get URL statistics
export const getUrlStats = async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;
    const db = getDB();

    const url = await db.get('SELECT * FROM urls WHERE shortCode = ?', [shortCode]);

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Get click statistics
    const clicks = await db.all('SELECT * FROM clicks WHERE urlId = ? ORDER BY clickedAt DESC', [url.id]);

    // Calculate unique clicks (by IP)
    const uniqueIPs = new Set(clicks.map(click => click.ipAddress)).size;

    // Get device types (simplified)
    const devices = clicks.reduce((acc: any, click: any) => {
      const device = click.userAgent?.includes('Mobile') ? 'Mobile' : 'Desktop';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    // Get referrers
    const referrers = clicks.reduce((acc: any, click: any) => {
      const referrer = click.referrer || 'Direct';
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {});

    res.json({
      id: url.id,
      shortCode: url.shortCode,
      shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
      originalUrl: url.originalUrl,
      description: url.description,
      createdAt: url.createdAt,
      clickCount: url.clickCount,
      uniqueClicks: uniqueIPs,
      lastClicked: url.lastClicked,
      isActive: url.isActive,
      devices,
      referrers,
      countries: { 'Unknown': clicks.length } // Simplified for demo
    });
  } catch (error) {
    console.error('Error getting URL stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
