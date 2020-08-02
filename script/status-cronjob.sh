#!/bin/bash

SERVICE="jenkins"
SERVICE2="serve"
SERVICE3="app"
PATH="/home/ubuntu/vets-app-node-react/"


if sudo systemctl is-active --quiet "$SERVICE" >/dev/null
then
    echo "$SERVICE is running, let's stop it"
    sudo service jenkins stop
    sudo pgrep -x "$SERVICE" >/dev/null && echo "$SERVICE still running" || echo "$SERVICE is stopped successfully"

fi



if (sudo pgrep -f "$SERVICE2" | wc -l) < 1
then
    echo "$SERVICE2 is running"
    > /var/log/log.log
else
    echo "$SERVICE2 stopped"
    cd "$PATH"
    cd frontend-react
    sudo serve  -s build -l 3000 &
    # uncomment to start nginx if stopped
    # systemctl start nginx
    # mail  
fi


if (sudo pgrep -f "$SERVICE3" | wc -l) < 3
then
    echo "$SERVICE3 is running"
    > /var/log/log.log
else
    echo "$SERVICE3 stopped"
    cd "$PATH"
    sudo node app &
    # uncomment to start nginx if stopped
    # systemctl start nginx
    # mail  
fi

sudo iptables -A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-ports 3000
sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 3000