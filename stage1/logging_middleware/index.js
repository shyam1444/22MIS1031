const axios = require('axios');

const DEFAULT_ENDPOINT = 'http://4.224.186.213/evaluation-service/logs';

const VALID_STACK = new Set(['backend', 'frontend']);
const VALID_LEVEL = new Set(['debug', 'info', 'warn', 'error', 'fatal']);
const VALID_PACKAGES = new Set([
  'cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service',
  'api', 'component', 'hook', 'page', 'state', 'style',
  'auth', 'config', 'middleware', 'utils'
]);

async function Log(stack, level, packageName, message, opts = {}) {
  const endpoint = opts.endpoint || DEFAULT_ENDPOINT;
  const token = opts.token || process.env.LOG_TOKEN;

  if (!token) throw new Error('Missing bearer token. Provide opts.token or set LOG_TOKEN env var.');

  const s = (stack || '').toLowerCase();
  const l = (level || '').toLowerCase();
  const p = (packageName || '').toLowerCase();

  if (!VALID_STACK.has(s)) throw new Error('Invalid stack');
  if (!VALID_LEVEL.has(l)) throw new Error('Invalid level');
  if (!VALID_PACKAGES.has(p)) throw new Error('Invalid package');

  const payload = { stack: s, level: l, package: p, message };

  const res = await axios.post(endpoint, payload, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    timeout: 5000
  });
  return res.data;
}

module.exports = { Log };
