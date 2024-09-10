#!/usr/bin/env bash

if ! [ -x "$(command -v docker)" ]; then
    echo -e "Docker is not installed. Please install docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"
    exit 1
fi

if ! [ -x "$(command -v jq)" ]; then
    echo -e "jq is not installed. Please install jq and try again."
    exit 1
fi

if ! [ -x "$(command -v pnpm)" ]; then
    echo -e "pnpm is not installed. Please install pnpm and try again."
    exit 1
fi

if ! [ -x "$(command -v node)" ]; then
    echo -e "node is not installed. Please install node and try again."
    exit 1
fi

ROOT_PROJECT_NAME=$(jq -r .name package.json | sed 's/\/monorepo//g')

if [[ "$ROOT_PROJECT_NAME" != "@GeoScheduler" ]]; then
    echo "Warning: this project has already been initialised, re-running this command may have unintended consequences.."
    echo "Continue? (y/n)"
    read continue

    if [[ "$continue" != "y" ]]; then
        exit
    fi
fi

echo "What do you want to name your project? (default: $ROOT_PROJECT_NAME)"
projectName="$ROOT_PROJECT_NAME"
read updatedProjectName

if [[ "$updatedProjectName" != "" ]]; then
    projectName=$updatedProjectName
fi

npx turbo clean

if [[ "$ROOT_PROJECT_NAME" != $projectName ]]; then
    find . -type f ! -path '*node_modules*' ! -path '*init-repo.sh' ! -path './.*' ! -path '*.ico' -print0 | xargs -0 sed -i '' -e "s/$ROOT_PROJECT_NAME/$projectName/g"
fi

pnpm install

cd packages/db
pnpm run initdb

echo "Successfully initialised new project: $projectName"
printf "Get started by running the following command:\n   npx turbo dev\n"
