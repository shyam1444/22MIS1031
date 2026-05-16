Small reusable logging helper that posts structured logs to the test server.

Usage

1. Install dependencies:

```bash
npm install
```

2. Set your bearer token (the one you received after registration) in the environment:

Windows PowerShell:

```powershell
$env:LOG_TOKEN = "<your-token-here>"
npm run test
```

Linux/macOS:

```bash
export LOG_TOKEN="<your-token-here>"
npm run test
```

3. Programmatic usage:

```js
const { Log } = require('afford-logger');

(async () => {
  const data = await Log('backend', 'info', 'service', 'Service started', { token: process.env.LOG_TOKEN });
  console.log(data);
})();
```

Constraints

- `stack` must be `backend` or `frontend` (lowercase).
- `level` must be one of `debug`, `info`, `warn`, `error`, `fatal`.
- `package` must be one of the allowed package names (see `index.js` VALID_PACKAGES list).
- The API endpoint is `http://4.224.186.213/evaluation-service/logs` by default.

Security

Do not commit your token. Provide it at runtime using `LOG_TOKEN` env var or pass `opts.token` to `Log`.
