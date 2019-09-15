#!/usr/local/bin/bash

# if you get the following error from executing this script:
# Error response from daemon: Pool overlaps with other one on this address space
# Then run this command before executing this script and type Y
# docker network prune

docker network create --subnet=172.7.0.0/16 time-study 2>/dev/null

docker build -t tf/time-study-app .

docker-compose up -d