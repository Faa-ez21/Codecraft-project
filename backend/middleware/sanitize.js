// middleware/sanitize.js
const xss = require('xss');

/**
 * Recursively remove dangerous keys and sanitize string values
 */
function stripDangerousKeys(obj) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const key of Object.keys(obj)) {
      const val = obj[key];

      // Drop keys that start with $ or contain a dot
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
        continue;
      }

      // Recurse into objects and arrays
      if (typeof val === 'object' && val !== null) {
        stripDangerousKeys(val);
      } else if (typeof val === 'string') {
        // Basic XSS filter on strings
        obj[key] = xss(val);
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      if (typeof v === 'object' && v !== null) stripDangerousKeys(v);
      else if (typeof v === 'string') obj[i] = xss(v);
    });
  }
  return obj;
}

/**
 * Express middleware to sanitize incoming requests
 */
function sanitizeRequest(req, _res, next) {
  if (req.body) stripDangerousKeys(req.body);
  if (req.query) stripDangerousKeys(req.query);
  if (req.params) stripDangerousKeys(req.params);
  next();
}

module.exports = { sanitizeRequest, stripDangerousKeys };
