# time-study

## Requirements
- NodeJS 8
- Docker

## Project setup
Simply run the following scripts, they will do all the hard work for you !

#### Cleaning Up Your Database
This will clean up all data so that you can start the app with a fresh new database !
```
sh run-clean.sh
```
### General Deployment (minified)
This will deploy *dockerized* versions of both the service **and** the app.
```
sh run.sh
```
This will refresh your database (not required when running this application for the first time):
``` 
sh run-clean.sh
```

### Local Development

The following script will start the service in the docker container, but will run the app from your local machine so that you can hot-reload changes.
```
sh run-dev.sh
```
This will refresh your database:
``` 
sh run-clean-dev.sh
```

#### Making changes to service
Once you've made your changes to the service run the following script:
``` 
sh build-and-run-server.sh
```

***NOTE***
If you want to make any changes to the initial migration files you will need to remove your dockerized database and re-initialise it.

You can do this by simply running the following script:

``` 
sh run-clean-server.sh
``` 


### Run your tests

#### App
```
yarn run test
```

#### Service
```
cd ./server
yarn run test
```
