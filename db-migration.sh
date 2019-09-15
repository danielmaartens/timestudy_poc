#!/usr/local/bin/bash

docker exec -it time-study-service bash -ci "yarn run migrate && exit"

