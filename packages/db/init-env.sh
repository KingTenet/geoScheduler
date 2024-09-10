#!/usr/bin/env bash

ENV_EXAMPLE_FILE=$1
ENV_FILE=$2

if [ ! -f "$ENV_EXAMPLE_FILE" ]; then
    echo -e "Example file $ENV_EXAMPLE_FILE does not exist"
    exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
    cp $ENV_EXAMPLE_FILE $ENV_FILE
fi

source $ENV_FILE

DB_PASSWORD=$(echo "$DATABASE_URL" | awk -F':' '{print $3}' | awk -F'@' '{print $1}')

if [ "$DB_PASSWORD" = "password" ]; then
    echo "Generating a url safe DB password"
    # Generate a random URL-safe password
    DB_PASSWORD=$(openssl rand -base64 12 | tr '+/' '-_')
    sed -i -e "s#:password@#:$DB_PASSWORD@#" $ENV_FILE
fi
