import subprocess
p = subprocess.Popen(["systemctl is-active --quiet jenkins"], stdout=subprocess.PIPE)
out = p.stdout.read()
print out