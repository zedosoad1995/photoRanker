FROM node:18.17-alpine3.17 as builder

WORKDIR /backend

COPY backend/package*.json .
RUN npm ci

COPY ./shared ../shared
COPY ./backend .

RUN npm run build


FROM node:18.17-alpine3.17

WORKDIR /app

COPY --from=builder /backend/build/ .
COPY --from=builder /backend/prisma/ ./prisma
COPY --from=builder /backend/package*.json .

RUN npx prisma generate
RUN npm ci --production

EXPOSE 8000

RUN npm install -g pm2
CMD ["pm2-runtime", "start", "backend/src/index.js"]
