# Logging Middleware

This folder contains the reusable `Log(stack, level, package, message)` function used by other components.

Usage

```bash
cd stage1/logging_middleware
npm install
```

Set `LOG_TOKEN` env var with your bearer token and call programmatically:

```js
const { Log } = require('./index');
await Log('backend', 'info', 'service', 'Started processing notifications');
```
