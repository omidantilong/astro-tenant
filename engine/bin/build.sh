#!/bin/bash

docker buildx build --tag tenant-image .

# These shell scripts for running and building should be made available
# on an `engine` cli where we could also expose other useful tools,
# common commands, etc