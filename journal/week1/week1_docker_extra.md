# Docker 
  Docker is vertulization of the OS

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
## 
