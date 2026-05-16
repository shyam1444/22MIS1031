# Logging Middleware

Inside this folder you'll find a small helper: `Log(stack, level, package, message)`.
It posts structured logs to the evaluation-service logging endpoint and is intended to be
required by other scripts (for example, the notification backend).

Quick start

```bash
cd stage1/logging_middleware
npm install
```

Auth

Provide a bearer token using the `LOG_TOKEN` environment variable, or pass the token
explicitly when calling `Log` using the `opts.token` option.

Example

```js
const { Log } = require('./index')
await Log('backend', 'info', 'service', 'Started processing notifications', { token: process.env.LOG_TOKEN })
```

If you see a network or authorization error, confirm the token is valid and not expired.
