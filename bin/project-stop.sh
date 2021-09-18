#!/bin/sh
function stop_docker_container(){
    docker-compose down
}

stop_docker_container