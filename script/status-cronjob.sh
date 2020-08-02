#!/bin/bash

SERVICE="jenkins"
SERVICE2="serve"
SERVICE3="app"

if systemctl is-active --quiet "$SERVICE" >/dev/null
then
    echo "$SERVICE is running, let's stop it"
    sudo service jenkins stop
    pgrep -x "$SERVICE" >/dev/null && echo "$SERVICE still running" || echo "$SERVICE is stopped successfully"
    
    cd ..
    cd frontend-react
    serve  -s build -l 3000 &
    sudo iptables -A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-ports 3000
    sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 3000

fi


if pgrep -f "$SERVICE3" >/dev/null
then
    echo "$SERVICE3 is running"
else
    echo "$SERVICE3 stopped"
    cd ..
    node app &
    # uncomment to start nginx if stopped
    # systemctl start nginx
    # mail  
fi

