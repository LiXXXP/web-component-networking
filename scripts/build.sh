#!/bin/sh

set -e

# clean
yarn clean:lib

# build
yarn build:comps
yarn build:theme

echo "Build completed"