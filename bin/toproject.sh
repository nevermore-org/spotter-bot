#!/bin/bash

function to_project(){
    docker-compose exec -u node node-env bash || docker-compose exec -u node node-app bash
}

to_project
