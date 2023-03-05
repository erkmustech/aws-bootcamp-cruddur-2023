# Docker 
  Docker is virtualization of the OS like EC2 is virtualization of the server.

### install python, flask  and crete database 
  1. install pythong 
     ``` sh
     brew install python
    ```
  2.  install pip 
    ``` sh
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
    sudo python get-pip.py
    pip --version //check if it is installedd
    ```
  3. seperate the python project from local evn we install pythong virtualevn
    ``` sh
      pip install virtualenv
      virtualenv --python=python3 myenv
      source myenv/bin/activate
      cd virtualenv
    ```   
  4.  install `flask` framework to pythonevn directory
     ``` sh
     pip install flask
     ```
  5. create database scheme 
    ``` sh
    vi schema.sql
    ```
  6. edit the database table 
   ``` sh
   drop table if exists posts;
        create table posts (
            id integer primary key autoincrement,
            name text not null,
            content text not null
        );
    ```
  7. create sqllite3 to generate sql database file  
    ``` sh
    sqlite3 database.db < schema.sql
    ```
  8. create aap.py file and game started :)

  

## common docker commands
  1.  run docker ->   [ docker run redis ]
  2.  Tegging - > [ docker run redis:4.0 ]
  3.  Port mapping- > [ docker run -p <38282:8080>  <webapp>:<tagname> ] 
  4.  Into docker image -> [docker run -i <imagename>]

### run – Volume mapping 
  ```sh
      docker run mysql
      docker stop mysql
      docker rm mysql
      docker run –v /opt/datadir:/var/lib/mysql mysql
```
### inspect docker 
```sh  
    docker inspect blissful_hopper
```
### container logs
```sh
    Container Logs
```

## how to create my own image
    1. choose a image as sourse 
       OS - ubunto
    2. update soure repo wit "apt" command
       Update apt repo
    3. install dependencies using "apt" command
    4. install pythong dependency using "pip"command
    5. copy source code to the location like "opt"folder
    6. spesify the entrypoint and run the webserver using "flask"command

## docker file
```dockerfile
        FROM Ubuntu
        RUN apt-get update
        RUN apt-get install python
        RUN pip install flask
        RUN pip install flask-mysql
        COPY . /opt/source-code
        ENTRYPOINT FLASK_APP=/opt/source-code/app.py flask run
```

![docker build leyer](_docs/assets/built_leyer.jpg)
## run docker file 
```sh
    docker build Dockerfile –t erkmustech/my-app
    docker push erkmustech/my-app
```

##Send Curl to Test Server
curl -X GET http://localhost:4567/api/activities/home -H "Accept: application/json" -H "Content-Type: application/json"
Check Container Logs
docker logs [OPTIONS] CONTAINER  
docker logs webserver  //to view the logs of a container named "webserver"
docker logs CONTAINER_ID -f //If you want to see the logs as they are generated in real-time
docker logs backend-flask -f
docker logs $CONTAINER_ID -f
Debugging adjacent containers with other containers
docker run --rm -it curlimages/curl "-X GET http://localhost:4567/api/activities/home -H \"Accept: application/json\" -H \"Content-Type: application/json\""
busybosy is often used for debugging since it install a bunch of thing

docker run --rm -it busybosy
Gain Access to a Container
docker exec CONTAINER_ID -it /bin/bash
You can just right click a container and see logs in VSCode with Docker extension

Delete an Image
docker image rm backend-flask --force
docker rmi backend-flask is the legacy syntax, you might see this is old docker tutorials and articles.

There are some cases where you need to use the --force

Overriding Ports
FLASK_ENV=production PORT=8080 docker run -p 4567:4567 -it backend-flask
Look at Dockerfile to see how ${PORT} is interpolated

Containerize Frontend
Run NPM Install
We have to run NPM Install before building the container since it needs to copy the contents of node_modules

cd frontend-react-js
npm i
Create Docker File
Create a file here: frontend-react-js/Dockerfile

FROM node:16.18

ENV PORT=3000

COPY . /frontend-react-js
WORKDIR /frontend-react-js
RUN npm install
EXPOSE ${PORT}
CMD ["npm", "start"]
Build Container
docker build -t frontend-react-js ./frontend-react-js
Run Container
docker run -p 3000:3000 -d frontend-react-js
Multiple Containers
Create a docker-compose file
Create docker-compose.yml at the root of your project.

version: "3.8"
services:
  backend-flask:
    environment:
      FRONTEND_URL: "https://3000-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
      BACKEND_URL: "https://4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
    build: ./backend-flask
    ports:
      - "4567:4567" //we can change the port 
    volumes:   #it is container directory that we gonna map
      - ./backend-flask:/backend-flask
  frontend-react-js:
    environment:
      REACT_APP_BACKEND_URL: "https://4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
    build: ./frontend-react-js
    ports:
      - "3000:3000"
    volumes:
      - ./frontend-react-js:/frontend-react-js

# the name flag is a hack to change the default prepend folder
# name when outputting the image names
networks: 
  internal-network:
    driver: bridge
    name: cruddur
## Adding DynamoDB Local and Postgres

We are going to use Postgres and DynamoDB local in future labs
We can bring them in as containers and reference them externally

Lets integrate the following into our existing docker compose file:

### Postgres

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

To install the postgres client into Gitpod

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

Example of using DynamoDB local
https://github.com/100DaysOfCloud/challenge-dynamodb-local

## Volumes

directory volume mapping

```yaml
volumes: 
- "./docker/dynamodb:/home/dynamodblocal/data"
```

named volume mapping

```yaml
volumes: 
  - db:/var/lib/postgresql/data

volumes:
  db:
    driver: local
```

