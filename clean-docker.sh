#!/usr/local/bin/bash

docker stop time-study-service >/dev/null
docker stop time-study-app >/dev/null
docker rm time-study-service >/dev/null
docker rm time-study-app >/dev/null
docker stop time-study-db >/dev/null
docker rm time-study-db >/dev/null
docker volume rm time-study_postgres-data

