FROM node:18.17-alpine3.17 as builder

WORKDIR /backend

COPY backend/package*.json .
RUN npm ci

COPY ./shared ../shared
COPY ./backend .

RUN npx prisma generate

RUN npm run build


FROM node:18.17-alpine3.17

WORKDIR /app

COPY --from=builder /backend/build/ .
COPY --from=builder /backend/prisma/ ./prisma
COPY --from=builder /backend/package*.json .
COPY --from=builder /backend/.env .env

RUN npx prisma generate
RUN npm ci --production


RUN apk add nginx

COPY ./infra/https/nginx.crt /etc/nginx/ssl/nginx.crt
COPY ./infra/https/nginx.key /etc/nginx/ssl/nginx.key

COPY ./infra/api.photoscorer.com /etc/nginx/sites-available/api.photoscorer.com
RUN mkdir -p /etc/nginx/sites-enabled/
RUN ln -s /etc/nginx/sites-available/api.photoscorer.com /etc/nginx/sites-enabled/

RUN npm install -g pm2

EXPOSE 8000

COPY ./scripts/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]