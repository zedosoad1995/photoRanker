#!/bin/bash
set -e

docker-compose -f infra/dockers/docker-compose-postgres.yml -p photo_ranker up -d

cd ./backend

npx prisma migrate deploy
npx prisma generate