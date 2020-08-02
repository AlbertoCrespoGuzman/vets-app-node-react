import os
stream = os.popen('sudo service jenkins stop')
output = stream.read()


