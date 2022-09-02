#!/bin/bash -x
docker-compose build  && docker-compose up -d && sleep 5 && ./rs-init.sh 
# && sleep 5 
# && cd ./docker-compose-stuff 
# && sleep 5 && mongorestore --host=127.0.0.1:27017 dump

