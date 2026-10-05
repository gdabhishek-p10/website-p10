#!/bin/sh
# Container entrypoint: create tables, load the starter content on first boot, then serve.
set -e

mkdir -p "${MEDIA_DIR:-media}"

node_modules/.bin/payload migrate
npm run seed
if [ -n "$RESET_ADMIN_PASSWORD" ]; then npm run reset-password; fi
exec node_modules/.bin/next start -p "${PORT:-3000}"
