docker-compose --file="infra/dockers/docker-compose-postgres.yml" -p photo_ranker up -d
cd /d .\backend
npx prisma migrate deploy