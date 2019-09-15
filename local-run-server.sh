#!/usr/local/bin/bash

# npm install -g gulp
# npm install -g yarn
# npm install -g pm2

cd server

yarn install

npm run local-migrate
gulp
node -r dotenv/config ./dist/service.js