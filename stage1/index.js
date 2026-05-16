const axios = require('axios');

const DEFAULT_ENDPOINT = 'http://4.224.186.213/evaluation-service/logs';

const VALID_STACK = new Set(['backend', 'frontend']);
const VALID_LEVEL = new Set(['debug', 'info', 'warn', 'error', 'fatal']);
const VALID_PACKAGES = new Set([
  // backend-only
  'cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service',
  // frontend-only
  'api', 'component', 'hook', 'page', 'state', 'style',
  // both
  'auth', 'config', 'middleware', 'utils'
]);

/**
 * Send a structured log to the test server.
 * @param {string} stack - 'backend' or 'frontend' (lowercase)
 * @param {string} level - one of 'debug','info','warn','error','fatal'
 * @param {string} packageName - package name (see README for allowed values)
 * @param {string} message - log message
 * @param {object} [opts]
 * @param {string} [opts.endpoint] - override endpoint
 * @param {string} [opts.token] - bearer token for Authorization header
 * @returns {Promise<object>} response data from server
 */
async function Log(stack, level, packageName, message, opts = {}) {
  const endpoint = opts.endpoint || DEFAULT_ENDPOINT;
  const token = opts.token || process.env.LOG_TOKEN;

  if (!token) throw new Error('Missing bearer token. Provide opts.token or set LOG_TOKEN env var.');

  if (typeof stack !== 'string' || typeof level !== 'string' || typeof packageName !== 'string') {
    throw new TypeError('stack, level and packageName must be strings');
  }

  const s = stack.toLowerCase();
  const l = level.toLowerCase();
  const p = packageName.toLowerCase();

  if (!VALID_STACK.has(s)) throw new Error(`Invalid stack. Allowed: ${Array.from(VALID_STACK).join(', ')}`);
  if (!VALID_LEVEL.has(l)) throw new Error(`Invalid level. Allowed: ${Array.from(VALID_LEVEL).join(', ')}`);
  if (!VALID_PACKAGES.has(p)) throw new Error(`Invalid package. See README for allowed package names.`);

  const payload = {
    stack: s,
    level: l,
    package: p,
    message: message
  };

  try {
    const res = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    return res.data;
  } catch (err) {
    if (err.response) {
      // server responded with error
      const data = err.response.data;
      throw new Error(`Server responded ${err.response.status}: ${JSON.stringify(data)}`);
    }
    throw err;
  }
}

module.exports = { Log };
