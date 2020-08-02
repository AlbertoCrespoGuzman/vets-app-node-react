import os
stream = os.popen('sudo service jenkins stop')
output = stream.read()

path = "/home/ubuntu/vets-app-node-react/"

stream = os.popen('pgrep -f serve | wc -l')
if stream.read() < 1:   
    os.popen('cd '+path).read()
    os.popen('cd frontend-react').read()
    os.popen('serve  -s build -l 3000 &').read()
    print('react running')
else:
    print('react stopped')
    
stream = os.popen('pgrep -f app | wc -l')
if stream.read() < 3:   
    os.popen('cd '+path).read()
    os.popen('node app &').read()
    print('server running')
else:
    print('server stopped')

