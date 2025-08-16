const crypto = require('crypto');

function parseKeysFromEnv() {
  const raw = (process.env.API_KEYS || '').trim();
  if (!raw) return [];
  return raw.split(',').map(k => k.trim()).filter(Boolean);
}

// constant-time equality check for two strings
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

// middleware factory: options = { headerName, allowQuery, logFn }
function requireApiKey(options = {}) {
  const headerName = options.headerName || 'x-api-key';
  const allowQuery = options.allowQuery || false; // not recommended for prod
  const keys = parseKeysFromEnv();

  return (req, res, next) => {
    try {
      if (!keys.length) {
        return res.status(500).json({ error: 'API key configuration missing on server.' });
      }

      let provided;
      // prefer Authorization header with `ApiKey <key>`
      const authHeader = req.get('authorization');
      if (authHeader && authHeader.startsWith('ApiKey ')) {
        provided = authHeader.slice('ApiKey '.length).trim();
      } else if (req.get(headerName)) {
        provided = req.get(headerName).trim();
      } else if (allowQuery && req.query && req.query.api_key) {
        provided = String(req.query.api_key);
      }

      if (!provided) {
        return res.status(401).json({ error: 'API key required.' });
      }

      let match = false;
      for (const k of keys) {
        if (safeEqual(k, provided)) {
          match = true;
          break;
        }
      }

      if (!match) {
        if (options.logFn) {
          options.logFn({
            ip: req.ip,
            path: req.path,
            provided: provided.slice(0, 6) + '...'
          });
        }
        return res.status(401).json({ error: 'Invalid API key.' });
      }

      req.authenticatedWithApiKey = true;
      next();
    } catch (err) {
      return res.status(500).json({ error: 'API key middleware error' });
    }
  };
}

module.exports = { requireApiKey, parseKeysFromEnv };
