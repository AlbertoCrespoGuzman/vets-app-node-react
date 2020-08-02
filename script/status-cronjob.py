import os
stream = os.popen('systemctl is-active --quiet jenkins')
output = stream.read()
print(output)
stream = os.popen('pgrep -f node | wc -l')
output = stream.read()


print(int(output))