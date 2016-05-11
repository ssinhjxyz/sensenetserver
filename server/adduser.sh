#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the password
# third input is the username to be created at the BBB.

ssh access_server@$1 "sudo /usr/sbin/useradd -m -p $2 $3; if sudo grep -q '$3 ALL=ALL' </etc/sudoers;
then echo 'user exists in sudoers list'
else echo '$3 ALL=ALL' | sudo tee -a /etc/sudoers  
echo 'user added to sudoers list'
fi" 

