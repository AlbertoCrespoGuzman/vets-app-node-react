import os
stream = os.popen('sudo service jenkins stop')
output = stream.read()
print(output)
stream = os.popen('pgrep -f node | wc -l')
output = stream.read()


print(int(output))