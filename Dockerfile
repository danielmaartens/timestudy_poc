FROM node:8

RUN mkdir -p /app

WORKDIR /app

RUN npm install -g http-server

COPY package.json ./

RUN npm install

COPY . .

RUN rm -rf ./server

RUN npm run build

EXPOSE 7777
EXPOSE 8080

CMD [ "http-server", "dist" ]