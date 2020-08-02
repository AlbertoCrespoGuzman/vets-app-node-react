#!/bin/bash
SERVICE="node"
if pgrep -x "$SERVICE" >/dev/null
then
    echo "$SERVICE is running"
else
    echo "$SERVICE stopped"
    node ../app
    # uncomment to start nginx if stopped
    # systemctl start nginx
    # mail  
fi