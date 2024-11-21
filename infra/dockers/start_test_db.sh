#!/bin/bash
set -e

docker-compose --file="infra/dockers/docker-compose-postgres-test.yml" -p photo_ranker_test  up -d
cd ./backend
npm run test:migrate
