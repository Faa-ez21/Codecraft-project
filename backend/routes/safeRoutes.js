const express = require("express");
const xss = require("xss");

const router = express.Router();

// Helpers
const isPlainObject = (o) => o && typeof o === "object" && !Array.isArray(o);

const hasForbiddenKeys = (obj) => {
  if (!isPlainObject(obj)) return false;
  for (const k of Object.keys(obj)) {
    if (
      k.startsWith("$") ||
      k.includes(".") ||
      k === "__proto__" ||
      k === "prototype" ||
      k === "constructor"
    ) {
      return true;
    }
    const v = obj[k];
    if (isPlainObject(v) && hasForbiddenKeys(v)) return true;
    if (Array.isArray(v) && v.some((item) => isPlainObject(item) && hasForbiddenKeys(item))) return true;
  }
  return false;
};

const clean = (input) => {
  if (typeof input === "string") {
    return xss(input, {
      whiteList: {},              // strip all tags by default
      stripIgnoreTag: true,       // remove unrecognized tags
      stripIgnoreTagBody: ["script", "iframe", "style"],
    }).trim();
  }
  if (Array.isArray(input)) return input.map(clean);
  if (isPlainObject(input)) {
    const out = {};
    for (const [k, v] of Object.entries(input)) out[k] = clean(v);
    return out;
  }
  return input;
};

const validate = (body) => {
  const errs = [];
  const { name, email, age } = body;

  if (typeof name !== "string" || name.trim().length < 1 || name.length > 100) errs.push("name");
  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) errs.push("email");

  if (age !== undefined) {
    if (
      typeof age !== "number" ||
      !Number.isInteger(age) ||
      age < 13 ||
      age > 120
    ) errs.push("age");
  }

  return errs;
};

// POST /api/safe/submit
router.post("/submit", (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Body must be a JSON object." });
  }

  if (hasForbiddenKeys(req.body)) {
    return res.status(400).json({ error: "Forbidden keys detected in payload." });
  }

  const errors = validate(req.body);
  if (errors.length) {
    return res.status(400).json({ error: "Invalid input.", fields: errors });
  }

  const sanitized = clean(req.body);
  return res.status(200).json({ ok: true, data: sanitized });
});

// Lightweight GET for quick checks
router.get("/echo", (req, res) => {
  const msg = typeof req.query.msg === "string" ? clean(req.query.msg) : "ok";
  res.json({ ok: true, message: msg });
});

module.exports = router;
