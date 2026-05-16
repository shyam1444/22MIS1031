const axios = require('axios');
const minimist = require('minimist');
const { Log } = require('../logging_middleware/index');

const NOTIF_URL = 'http://4.224.186.213/evaluation-service/notifications';

function weightForType(type) {
  if (!type) return 0;
  const t = type.toLowerCase();
  if (t === 'placement') return 3;
  if (t === 'result') return 2;
  if (t === 'event') return 1;
  return 0;
}

function parseTimestamp(ts) {
  // Expecting format 'YYYY-MM-DD HH:MM:SS' or ISO; fallback to Date.parse
  const d = new Date(ts.replace(' ', 'T'));
  if (!isNaN(d)) return Math.floor(d.getTime() / 1000);
  return Math.floor(Date.now() / 1000);
}

async function fetchNotifications(token) {
  const res = await axios.get(NOTIF_URL, {
    headers: { Authorization: `Bearer ${token}` },
    timeout: 5000
  });
  return res.data.notifications || [];
}

async function topNNotifications(n = 10, token) {
  const notifs = await fetchNotifications(token);
  const scored = notifs.map(nf => {
    const w = weightForType(nf.Type);
    const t = parseTimestamp(nf.Timestamp || nf.Timestamp || '');
    const score = w * 1e12 + t; // weight dominates
    return { ...nf, _score: score };
  });
  scored.sort((a, b) => b._score - a._score);
  return scored.slice(0, n);
}

async function main() {
  const argv = minimist(process.argv.slice(2));
  const top = Number(argv.top || argv.t || 10);
  // Accept token from CLI (--token) or env vars NOTIF_TOKEN / LOG_TOKEN
  let token = argv.token || argv.k || process.env.NOTIF_TOKEN || process.env.LOG_TOKEN;
  if (!token) {
    console.error('Provide token via --token or set NOTIF_TOKEN / LOG_TOKEN env var');
    process.exit(1);
  }
  // Trim surrounding quotes/whitespace that PowerShell may add
  token = String(token).trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');

  try {
    await Log('backend', 'info', 'service', `Fetching notifications for top=${top}`, { token });
    const topList = await topNNotifications(top, token);
    console.log(JSON.stringify({ top: top, notifications: topList }, null, 2));
    await Log('backend', 'info', 'service', `Returning top ${topList.length} notifications`, { token });
  } catch (err) {
    if (err.response) {
      console.error('Error fetching notifications: status=', err.response.status);
      console.error('Response body:', JSON.stringify(err.response.data));
      console.error('Response headers:', JSON.stringify(err.response.headers));
      if (err.response.status === 401) {
        console.error('\n401 Unauthorized — token is invalid or expired.');
        console.error('Try passing the exact access token with --token or set NOTIF_TOKEN/LOG_TOKEN.');
      }
    } else {
      console.error('Error fetching notifications:', err.message || err);
    }

    try {
      await Log('backend', 'error', 'service', `Error fetching notifications: ${err.message || err}` , { token });
    } catch (e) {
      // ignore logging failure
    }
    process.exit(1);
  }
}

main();
