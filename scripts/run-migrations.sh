#!/bin/bash
set -e

echo "Running database migrations..."
npm run db:migrate

echo "Verifying migrations..."
npm run db:check

echo "Migrations completed successfully!"
