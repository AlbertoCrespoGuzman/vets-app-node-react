import os
stream = os.popen('sudo service jenkins stop')
output = stream.read()

path = "/home/ubuntu/vets-app-node-react/"

stream = os.popen('pgrep -f serve | wc -l')
if stream.read() < 1:   
    os.popen('cd '+path).read()
    os.popen('cd frontend-react').read()
    os.popen('serve  -s build -l 3000 &').read()
    print('react stopped, starting it')
else:
    print('react running')
    
stream = os.popen('pgrep -f app | wc -l')
if stream.read() < 3:   
    os.popen('cd '+path).read()
    os.popen('node app &').read()
    print('server stopped, starting it')
else:
    print('server running')

os.popen('sudo iptables -A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-ports 3000').read()
os.popen('sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 3000').read()



