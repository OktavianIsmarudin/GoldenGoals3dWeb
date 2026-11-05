#!/bin/sh
set -eu

cd /var/www/html

# Render generates and retains this 256-bit base64 secret in its environment.
# Prefix it for Laravel; never generate a different key on every cold start.
if [ -z "${APP_KEY:-}" ]; then
    if [ -z "${LARAVEL_APP_SECRET:-}" ]; then
        echo "Set LARAVEL_APP_SECRET in Render, or provide a valid Laravel APP_KEY." >&2
        exit 1
    fi
    export APP_KEY="base64:${LARAVEL_APP_SECRET}"
fi

export APP_URL="${RENDER_EXTERNAL_URL:-${APP_URL:-http://localhost}}"
export ASSET_URL="${ASSET_URL:-$APP_URL}"

mkdir -p bootstrap/cache storage/app/private storage/app/public \
    storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs

php artisan config:cache --no-ansi
php artisan view:cache --no-ansi
chown -R www-data:www-data storage bootstrap/cache

exec "$@"
