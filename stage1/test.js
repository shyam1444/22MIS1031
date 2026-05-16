const { Log } = require('./index');

async function main() {
  try {
    const token = process.env.LOG_TOKEN;
    if (!token) {
      console.error('Please set LOG_TOKEN environment variable with your Bearer token.');
      process.exit(1);
    }

    const res = await Log('backend', 'error', 'handler', 'received string, expected bool', { token });
    console.log('Server response:', res);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

main();
