#!/bin/bash

set -e

echo "Starting Migration..."

cd app
git fetch origin master
git reset --hard origin/master

cd backend

export NVM_DIR="/home/ubuntu/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

if npx prisma migrate deploy; then
        echo "Migrate successful"
else
        echo "Database migration failed." >&2
        exit 1
fi

echo "Migration completed!"