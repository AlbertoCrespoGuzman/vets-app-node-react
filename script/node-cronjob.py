import os


path = "/home/ubuntu/vets-app-node-react/"

app_processes = int(os.popen('pgrep -f app | wc -l').read())
print('app_processes')
print(app_processes)
if app_processes < 3:   
    os.popen('cd /home/ubuntu/vets-app-node-react/ && node app &').read()
    print('server stopped, starting it')
else:
    print('server running')
    


