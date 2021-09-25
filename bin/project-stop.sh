#!/bin/bash
function stop_docker_compose() {
    DOCKER_COMPOSE_FILE=$1
    MY_UID=$(id -u)
    MY_GID=$(id -g)
    MY_UID="${MY_UID}" MY_GID="${MY_GID}" docker-compose -f $DOCKER_COMPOSE_FILE down --remove-orphans
}

DOCKER_COMPOSE_FILE="./docker-compose.yml"
stop_docker_compose $DOCKER_COMPOSE_FILE
