# create IP network         docker network create --subnet=172.18.0.0/16 tfnet1
# build using :             docker build -t isopharm/account-api .
# run using (if not using docker compose):               docker run -it -p 8888:8888 -p 5858:5858 -v ~/git/isopharm-account-api/src:/usr/src/src --name isopharm-account-api isopharm/account-api

FROM node:8

RUN mkdir -p /usr/src

WORKDIR /usr/src

#RUN rm -rf node_modules

RUN npm install -g \
    gulp \
    yarn \
    pm2 \
    express-validator

COPY package.json /usr/src/

RUN npm install

RUN npm install --save-dev express-validator

COPY . /usr/src/

RUN gulp

EXPOSE 7788
EXPOSE 5757
EXPOSE 5454

CMD ["pm2-docker", "process.yml"]