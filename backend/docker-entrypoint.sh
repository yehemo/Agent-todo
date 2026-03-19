#!/bin/sh
set -e

# Generate .env from environment variables (supports both local Docker and Railway)
cat > .env <<EOF
APP_NAME=TaskFlow
APP_ENV=${APP_ENV:-production}
APP_KEY=
APP_DEBUG=${APP_DEBUG:-false}
APP_URL=${APP_URL:-http://localhost:8000}

LOG_CHANNEL=stderr

DB_CONNECTION=mysql
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-3306}
DB_DATABASE=${DB_DATABASE:-todoapp}
DB_USERNAME=${DB_USERNAME:-todo}
DB_PASSWORD=${DB_PASSWORD:-secret}

SANCTUM_STATEFUL_DOMAINS=${SANCTUM_STATEFUL_DOMAINS:-localhost:5173}
SESSION_DRIVER=database
CACHE_STORE=database
EOF

# Generate app key
php artisan key:generate --no-interaction

echo "Waiting for MySQL to be ready..."
until php -r "new PDO('mysql:host=${DB_HOST:-db};port=${DB_PORT:-3306};dbname=${DB_DATABASE:-todoapp}', '${DB_USERNAME:-todo}', '${DB_PASSWORD:-secret}');" > /dev/null 2>&1; do
  sleep 2
done

echo "Running migrations..."
php artisan migrate --force --no-interaction

echo "Seeding demo data..."
php artisan db:seed --class=DemoUserSeeder --force --no-interaction

echo "Starting Laravel server..."
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
