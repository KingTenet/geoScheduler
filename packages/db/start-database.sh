#!/usr/bin/env bash
# Use this script to start a docker container for a local development database

# TO RUN ON WINDOWS:
# 1. Install WSL (Windows Subsystem for Linux) - https://learn.microsoft.com/en-us/windows/wsl/install
# 2. Install Docker Desktop for Windows - https://docs.docker.com/docker-for-windows/install/
# 3. Open WSL - `wsl`
# 4. Run this script - `./start-database.sh`

# On Linux and macOS you can run this script directly - `./start-database.sh`

set -a

DB_PASSWORD=$(echo "$DATABASE_URL" | awk -F':' '{print $3}' | awk -F'@' '{print $1}')
DB_PORT=$(echo "$DATABASE_URL" | awk -F':' '{print $4}' | awk -F'\/' '{print $1}')
DB_DATABASE=$(echo "$DATABASE_URL" | awk -F":${DB_PORT}/" '{print $2}')

DB_CONTAINER_NAME=$(echo "$DB_DATABASE" | tr -dC '[:alnum:]')

echo "Starting a new DB container for your project"

if ! [ -x "$(command -v docker)" ]; then
    echo -e "Docker is not installed. Please install docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"
    exit 1
fi

if [ "$(docker ps -q --no-trunc --filter name=^/$DB_CONTAINER_NAME$)" ]; then
    echo "Database container '$DB_CONTAINER_NAME' already running"
    exit 0
fi

if [ "$(docker ps -q -a --no-trunc --filter name=^/$DB_CONTAINER_NAME$)" ]; then
    docker start "$DB_CONTAINER_NAME"
    echo "Existing database container '$DB_CONTAINER_NAME' started"
    exit 0
fi

docker run \
    --name $DB_CONTAINER_NAME \
    -e POSTGRES_USER="postgres" \
    -e POSTGRES_PASSWORD="$DB_PASSWORD" \
    -e POSTGRES_DB="$DB_DATABASE" \
    -p "$DB_PORT":5432 \
    -d docker.io/postgres && echo "Database container '$DB_CONTAINER_NAME' was successfully created"

echo psql \"$DATABASE_URL\"

pnpm prisma migrate dev
