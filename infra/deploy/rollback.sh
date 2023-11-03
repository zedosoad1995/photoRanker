#!/bin/bash

set -e

docker pull vcarp/photoscorer:previous
docker pull vcarp/photoscorer-nginx:previous
docker-compose -f "./docker-compose.yml" down
docker-compose -f "./docker-compose-rollback.yml" up -d

echo "Rollback to previous docker image completed."