#!/bin/bash
set -e

if [ "$1" = 'bot' ]; then
    exec node /var/service/index.js "$@"
fi

exec "$@"
