#!/bin/sh
pm2-runtime start backend/src/index.js &
nginx -g 'daemon off;'
