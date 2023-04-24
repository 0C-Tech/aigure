#!/bin/bash

SHELL_PATH=$(dirname $0)

echo "[deploy] starting deployment..."

sh ${SHELL_PATH}/fetch.sh
sh ${SHELL_PATH}/install.sh
sh ${SHELL_PATH}/build.sh

echo "[deploy] All done. ^_-"
