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


SERVICE2="jenkins"
if pgrep -x "$SERVICE2" >/dev/null
then
    echo "$SERVICE2 is running, let's stop it"
    service jenkins stop
    pgrep -x "$SERVICE2" >/dev/null && echo "$SERVICE still running" || echo "$SERVICE is stopped successfully"
else
    echo "$SERVICE2 stopped"
    node ../app
    # uncomment to start nginx if stopped
    # systemctl start nginx
    # mail  
fi