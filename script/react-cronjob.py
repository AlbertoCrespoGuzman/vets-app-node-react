import os

path = "/home/ubuntu/vets-app-node-react/"

serve_processes = int(os.popen('pgrep -f serve | wc -l').read())
print('serve_processes')
print(os.popen('pgrep -f serve | wc -l').read())
if serve_processes < 1:   
    os.popen('cd '+path + 'frontend-react/ && serve  -s build -l 3000 &').read()
    print('react stopped, starting it')
else:
    print('react running')
    
os.popen('sudo iptables -A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-ports 3000').read()
os.popen('sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 3000').read()


