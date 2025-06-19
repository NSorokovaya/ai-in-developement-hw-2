#!/bin/sh
set -e

# Maximum time to wait for database (in seconds)
MAX_WAIT=30
WAIT_COUNT=0

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! nc -z db 5432; do
  sleep 0.1
  WAIT_COUNT=$((WAIT_COUNT + 1))
  if [ $WAIT_COUNT -gt $MAX_WAIT ]; then
    echo "Error: Database connection timeout after ${MAX_WAIT} seconds"
    exit 1
  fi
done
echo "Database is ready!"

# Generate Prisma client
echo "Generating Prisma client..."
if ! npx prisma generate; then
  echo "Error: Failed to generate Prisma client"
  exit 1
fi

# Create initial migration if none exists
echo "Checking for migrations..."
if [ ! -d "prisma/migrations" ] || [ -z "$(ls -A prisma/migrations)" ]; then
  echo "Creating initial migration..."
  if ! npx prisma migrate dev --name init; then
    echo "Error: Failed to create initial migration"
    exit 1
  fi
else
  echo "Applying existing migrations..."
  if ! yarn prisma migrate deploy; then
    echo "Error: Failed to apply migrations"
    exit 1
  fi
fi

# Check if database is empty using Prisma
echo "Checking if database needs seeding..."
USER_COUNT=$(npx prisma db execute --stdin << EOF
SELECT COUNT(*) as count FROM "User"
EOF
)
if [ "$USER_COUNT" = "0" ]; then
  echo "Seeding database..."
  if ! npx prisma db seed; then
    echo "Error: Failed to seed database"
    exit 1
  fi
else
  echo "Database already seeded"
fi

# Start the application
echo "Starting application..."
exec yarn start:prod 