import subprocess
batcmd="systemctl is-active --quiet jenkins"
result = subprocess.check_output([batcmd], stderr=subprocess.STDOUT)
print result