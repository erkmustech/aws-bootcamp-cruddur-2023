# Docker 
  Docker is virtualization of the OS like EC2 which is virtualization of the server.

## install prerequested dependencies (python, flask  and crete database )
``` sh
brew install python    
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
sudo python get-pip.py
```
## seperate the python project from local evn we install pythong virtualevn
``` sh
pip install virtualenv
virtualenv --python=python3 myenv
source myenv/bin/activate
cd virtualenv
pip install flask
```   
## docker commands
  1.  create docker ->  `docker build Dockerfile –t erkmustech/my-app`
  2.  run docker ->  `docker run`
  2.  Tegging - > `docker run redis:4.0`
  3.  Port mapping- > `docker run -p <38282:8080>  <webapp>:<tagname>`
  4.  Into docker image -> `docker run -i <imagename>`
  5.  run – Volume mapping-> `docker run –v /opt/datadir:/var/lib/mysql mysql`
  6.  inspect docker -> `docker inspect blissful_hopper`
  7.  container logs -> `Container Logs`
  9.  Delete an Image-> `docker image rm backend-flask --force`

## Containerize BackEnd 
### run python
```sh
cd backend-flask
export FRONTEND_URL="*"
export BACKEND_URL="*"
python3 -m flask run --host=0.0.0.0 --port=4567
cd ..
```
 - make sure to unlock the port on the poort tab
 - append to the url '/api/activities/home' 

## create docker file
``` dockerfile
FROM python:3.10-slim-buster 
WORKDIR /backend-flask
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .
ENV FLASK_ENV=development
EXPOSE ${PORT}
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=4567"]
```
## Built Container 
 ``` sh 
 docker build -t backend-flask ./backend-flask
 ``` 
## Run docker container 
  ``` dockerfile
docker run --rm -p 4567:4567 -it -e FRONTEND_URL='*' -e BACKEND_URL='*' backend-flask
export FRONTEND_URL="*"
unset BACKEND_URL="*"
  ``` 

## Run in background
```sh
docker container run --rm -p 4567:4567 -d backend-flask
```
## Return the container id into an Env Vat
``` sh
CONTAINER_ID=$(docker run --rm -p 4567:4567 -d backend-flask)
```

## Send Curl to Test Server
``` sh
curl -X GET http://localhost:4567/api/activities/home -H "Accept: application/json" -H "Content-Type: application/json"
``` 
## Check Container Logs
```dockerfile
docker logs [OPTIONS] CONTAINER  
docker logs webserver  //to view the logs of a container named "webserver"
docker logs CONTAINER_ID -f //If you want to see the logs as they are generated in real-time
docker logs backend-flask -f
docker logs $CONTAINER_ID -f
``` 

## Debugging adjacent containers with other containers
```sh
docker run --rm -it curlimages/curl "-X GET http://localhost:4567/api/activities/home -H \"Accept: application/json\" -H \"Content-Type: application/json\""
``` 
## busybosy is often used for debugging since it install a bunch of thing
``` sh
docker run --rm -it busybosy
Gain Access to a Container
docker exec CONTAINER_ID -it /bin/bash
``` 
You can just right click a container and see logs in VSCode with Docker extension

## Gain Access to a Container
``` sh 
docker exec CONTAINER_ID -it /bin/bash
``` 

## Overriding Ports
``` sh
FLASK_ENV=production PORT=8080 docker run -p 4567:4567 -it backend-flask
``` 
Look at Dockerfile to see how ${PORT} is interpolated

## Delete an Image
``` sh 
docker image rm backend-flask --force
``` 

# Containerize Frontend
## install NPM 
``` sh
cd frontend-react-js
NPM install
```

## Create Docker File for frontEnd
Create a file here: frontend-react-js/Dockerfile
```sh
FROM node:16.18
ENV PORT=3000
COPY . /frontend-react-js
WORKDIR /frontend-react-js
RUN npm install
EXPOSE ${PORT}
CMD ["npm", "start"]
```

## Build Container
```sh
docker build -t frontend-react-js ./frontend-react-js
```

## Run Container
```sh
docker run -p 3000:3000 -d frontend-react-js
```
# Multiple Containers by Create a docker-compose file
## Create `docker-compose.yml` at the root of your project.
## run docker-compose fiel by clicking `compose up` or intering `docker-compose up` command into console
## check the docker contanies by cling the docker extension in the sidebar 
## check the port and make sure it is unlocked
## go to browser and check the server if it works normal

NOTES: We are going to use Postgres and DynamoDB local in future labs We can bring them in as containers and reference them externally
Lets integrate the following into our existing docker compose file:

# Adding DynamoDB and Postgres local
## adding Postgres

```yaml
services:
  db:
    image: postgres:13-alpine
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - '5432:5432'
    volumes: 
      - db:/var/lib/postgresql/data
volumes:
  db:
    driver: local
```

## To install the postgres client into Gitpod
```sh
  - name: postgres
    init: |
      curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc|sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
      echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
      sudo apt update
      sudo apt install -y postgresql-client-13 libpq-dev
```

### DynamoDB Local

```yaml
services:
  dynamodb-local:
    # https://stackoverflow.com/questions/67533058/persist-local-dynamodb-data-in-volumes-lack-permission-unable-to-open-databa
    # We needed to add user:root to get this working.
    user: root
    command: "-jar DynamoDBLocal.jar -sharedDb -dbPath ./data"
    image: "amazon/dynamodb-local:latest"
    container_name: dynamodb-local
    ports:
      - "8000:8000"
    volumes:
      - "./docker/dynamodb:/home/dynamodblocal/data"
    working_dir: /home/dynamodblocal
```

## Volumes
### directory volume mapping

```yaml
volumes: 
- "./docker/dynamodb:/home/dynamodblocal/data"
```

### named volume mapping
```yaml
volumes: 
  - db:/var/lib/postgresql/data
volumes:
  db:
    driver: local
```
