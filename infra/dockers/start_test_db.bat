docker-compose --file="infra/dockers/docker-compose-postgres-test.yml" -p photo_ranker_test  up -d
cd /d .\backend
npm run test:migrate