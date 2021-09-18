#!/bin/bash

function get_to_docker_container(){
    docker exec -it spotterbot_node-app_1 /bin/bash
}


get_to_docker_container