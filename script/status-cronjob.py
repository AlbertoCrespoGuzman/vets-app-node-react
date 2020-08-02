import subprocess
p = subprocess.check_output(["systemctl is-active --quiet jenkins"],shell=False) 
out = p.stdout.read()
print out