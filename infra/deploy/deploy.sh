#!/bin/bash

cd app
git pull origin master

cd backend

export NVM_DIR="/home/ubuntu/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

if npx prisma migrate deploy; then
    cd ~

    # Login to Docker Hub
    echo "$DOCKER_HUB_PASSWORD" | docker login --username "$DOCKER_HUB_USERNAME" --password-stdin

    docker container prune -f
    docker image prune -f

    # Pull the latest images
    docker pull vcarp/photoscorer:latest
    docker pull vcarp/photoscorer-nginx:latest

    # Use Docker Compose to restart the services
    docker-compose down
    docker-compose up -d

    echo "Update complete."
else
    # Migration failed, handle the error as needed
    # You can log the error, send notifications, or take other actions
    echo "Database migration failed. Check logs for details."

    # Optionally, you can exit the script to prevent further execution
    exit 1
fi