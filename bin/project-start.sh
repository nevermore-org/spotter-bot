#!/bin/sh
function start_docker_container(){
    docker-compose up
}

stop_docker_container
start_docker_container