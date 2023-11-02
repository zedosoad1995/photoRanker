#!/bin/bash

set -e # Exit on any error

log_and_exit() {
    echo "$1" >&2
    exit 1
}

echo "Starting deployment..."

if [ "$1" == "migrate" ]; then
    ./migrate.sh
fi

cd ~

# Login to Docker Hub
echo "$DOCKER_HUB_PASSWORD" | docker login --username "$DOCKER_HUB_USERNAME" --password-stdin

# Clean current image/container to free up space
docker container prune -f
docker image prune -f

# Pull the latest images
docker pull vcarp/photoscorer:latest
docker pull vcarp/photoscorer-nginx:latest

# Use Docker Compose to restart the services
docker-compose down
docker-compose up -d

echo "Update complete."