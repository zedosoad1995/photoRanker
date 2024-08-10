FROM nginx:alpine

COPY ./infra/https/nginx.crt /etc/nginx/ssl/nginx.crt
COPY ./infra/https/nginx.key /etc/nginx/ssl/nginx.key

COPY ./infra/nginx/api.photoscorer.com /etc/nginx/conf.d/api2.photoscorer.com.conf