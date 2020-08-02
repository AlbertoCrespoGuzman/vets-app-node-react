#!/bin/bash

SERVICE="jenkins"
if systemctl is-active --quiet "$SERVICE" >/dev/null
then
    echo "$SERVICE is running, let's stop it"
    service jenkins stop
    pgrep -x "$SERVICE" >/dev/null && echo "$SERVICE still running" || echo "$SERVICE is stopped successfully"
else
    echo "$SERVICE stopped"
    node ../app
    # uncomment to start nginx if stopped
    # systemctl start nginx
    # mail  
fi
