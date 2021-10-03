#!/bin/bash

function create_volumes(){
    MY_UID=$1
    MY_GID=$2
    docker volume create node-16
    docker run --rm -it -v node-16:/node-16 busybox su -s /bin/sh -c "chown $MY_UID:$MY_GID /node-16"
}

function start_docker_compose(){
    ONLY_ENV=$1
    DOCKER_COMPOSE_FILE=$2
    MY_UID=$3
    MY_GID=$4

    MY_UID="${MY_UID}" MY_GID="${MY_GID}" docker-compose down --remove-orphans
    SERVICES=""
    echo "Running docker-compose"
    docker image pull node:16
    if [ "$ONLY_ENV" -eq 1 ]; then
        SERVICES="${SERVICES} node-env"
    else
        SERVICES="${SERVICES} node-app"
    fi

    MY_UID="${MY_UID}" MY_GID="${MY_GID}" docker-compose -f $DOCKER_COMPOSE_FILE up -d --remove-orphans $SERVICES
    echo "docker-compose started"
    if [ "$ONLY_ENV" -eq 0 ]; then
        MY_UID="${MY_UID}" MY_GID="${MY_GID}" docker-compose logs -f
    fi
}

# Params
ONLY_ENV=0
DOCKER_COMPOSE_FILE="docker-compose.yml"
MY_UID=$(id -u)
MY_GID=$(id -g)
for i in "$@"
do
    case $i in
        -e|--only-env)
        ONLY_ENV=1
        shift
        ;;
    esac
    case $i in
        -f=*|--file=*)
        DOCKER_COMPOSE_FILE="${1#*=}"
        shift
        ;;
    esac
done

create_volumes $MY_UID $MY_GID
start_docker_compose $ONLY_ENV $DOCKER_COMPOSE_FILE $MY_UID $MY_GID
