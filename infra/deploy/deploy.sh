#!/bin/bash

# Migrates DB
cd app
git pull origin master

cd backend

export NVM_DIR="/home/ubuntu/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

npx prisma migrate deploy

cd ~

# Login to Docker Hub
echo "$DOCKER_HUB_PASSWORD" | docker login --username "$DOCKER_HUB_USERNAME" --password-stdin

# Pull the latest images
docker pull vcarp/photoscorer:latest
docker pull vcarp/photoscorer-nginx:latest

# Use Docker Compose to restart the services
docker-compose down
docker-compose up -d

echo "Update complete."