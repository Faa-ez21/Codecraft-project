// middleware/api-key.js
const crypto = require('crypto');

/**
 * Parse API keys from the .env file.
 * Example .env:
 * API_KEYS=key1,key2,key3
 */
function parseKeysFromEnv() {
  const raw = (process.env.API_KEYS || '').trim();
  if (!raw) return [];
  return raw
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);
}

/**
 * Constant-time equality check for two strings.
 * Prevents timing attacks.
 */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/**
 * Middleware factory for requiring an API key.
 *
 * Options:
 * - headerName: custom header (default: x-api-key)
 * - allowQuery: allow api_key in query string (default: false)
 * - logFn: optional function to log failed attempts
 */
function requireApiKey(options = {}) {
  const headerName = options.headerName || 'x-api-key';
  const allowQuery = options.allowQuery || false;
  const keys = parseKeysFromEnv();

  return (req, res, next) => {
    try {
      if (!keys.length) {
        return res
          .status(500)
          .json({ error: 'API key configuration missing on server.' });
      }

      let provided;

      // 1️⃣ Authorization header: "ApiKey <key>"
      const authHeader = req.get('authorization');
      if (authHeader && authHeader.startsWith('ApiKey ')) {
        provided = authHeader.slice('ApiKey '.length).trim();
      }
      // 2️⃣ Custom header (default: x-api-key)
      else if (req.get(headerName)) {
        provided = req.get(headerName).trim();
      }
      // 3️⃣ Optional query param (?api_key=...)
      else if (allowQuery && req.query && req.query.api_key) {
        provided = String(req.query.api_key);
      }

      if (!provided) {
        return res.status(401).json({ error: 'API key required.' });
      }

      // ✅ Validate against allowed keys
      const valid = keys.some(k => safeEqual(k, provided));
      if (!valid) {
        if (options.logFn) {
          options.logFn({
            ip: req.ip,
            path: req.path,
            provided: provided.length > 6 ? provided.slice(0, 6) + '...' : provided
          });
        }
        return res.status(401).json({ error: 'Invalid API key.' });
      }

      // ✅ Attach flag so routes know this request is authenticated
      req.authenticatedWithApiKey = true;
      next();
    } catch (err) {
      console.error('API key middleware error:', err);
      return res.status(500).json({ error: 'API key middleware error' });
    }
  };
}

module.exports = { requireApiKey, parseKeysFromEnv };
