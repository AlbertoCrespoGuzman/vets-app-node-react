import commands
batcmd = "systemctl is-active --quiet jenkins"
result = commands.getoutput(batcmd)
print (result)