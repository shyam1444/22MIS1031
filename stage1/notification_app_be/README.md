# Notification Backend (Stage 1)

This Node script fetches notifications from the test API and returns the top-N priority notifications.

Run

```bash
cd stage1/notification_app_be
npm install
```

Then set token and run:

PowerShell:

```powershell
$env:NOTIF_TOKEN = "<your-bearer-token>"
node app.js --top=10
```

Linux/macOS:

```bash
export NOTIF_TOKEN="<your-bearer-token>"
node app.js --top=10
```

The script logs operations to the logging middleware (it will reuse `LOG_TOKEN` if `NOTIF_TOKEN` is not set).
