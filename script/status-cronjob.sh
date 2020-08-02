#!/bin/bash

SERVICE="jenkins"
if systemctl is-active --quiet "$SERVICE" >/dev/null
then
    echo "$SERVICE is running, let's stop it"
    sudo service jenkins stop
    pgrep -x "$SERVICE" >/dev/null && echo "$SERVICE still running" || echo "$SERVICE is stopped successfully"
else
    echo "$SERVICE stopped"
    node ../app
    # uncomment to start nginx if stopped
    # systemctl start nginx
    # mail  
fi


SERVICE2="npx"
if pgrep -x "$SERVICE2" >/dev/null
then
    echo "$SERVICE2 is running"
else
    echo "$SERVICE2 stopped"
    serve  -s build -l 3000
    # uncomment to start nginx if stopped
    # systemctl start nginx
    # mail  
fi

SERVICE3="node"
if pgrep -x "$SERVICE3" >/dev/null
then
    echo "$SERVICE3 is running"
else
    echo "$SERVICE3 stopped"
    node ../app
    # uncomment to start nginx if stopped
    # systemctl start nginx
    # mail  
fi

sudo iptables -A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-ports 4444
sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 4444