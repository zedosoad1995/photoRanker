server {
    listen 80;
    server_name api.photoscorer.com;

    client_max_body_size 10M;

    listen 443 ssl;
    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    location / {
        proxy_pass http://app:8000;
    }
}