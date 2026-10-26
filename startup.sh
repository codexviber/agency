#!/bin/sh
set -eu
cd /workspace
node scripts/preview.mjs stop || true
if [ -f /workspace/.grok/database-url ]; then
  DATABASE_URL=$(tr -d '\r\n' < /workspace/.grok/database-url)
  export DATABASE_URL
fi
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
