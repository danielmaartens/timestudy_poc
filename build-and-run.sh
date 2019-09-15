#!/usr/local/bin/bash

# if you get the following error from executing this script:
# Error response from daemon: Pool overlaps with other one on this address space
# Then run this command before executing this script and type Y
# docker network prune

# Or if for some reason you get an error saying "database ... does not exist" then try:
# docker volume prune
# and run again.

# Or the above might be due to an incorrectly set up volume. Then do the following
# Get the relevant container - stop and remove it:
# docker ps
# docker container stop [id]
# docker container rm [id]
# docker volume rm isopharm-account-api_postgres-data
# Then run this script again AND the db-migration script !

docker network create --subnet=172.7.0.0/16 time-study 2>/dev/null

docker build -t tf/time-study-app .

cd ./server

docker build -t tf/time-study-service .

cd ..

docker-compose up -d

