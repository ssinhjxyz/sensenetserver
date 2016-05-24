#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the username to be created at the BBB
# third input is the enrypted password.
# fourth input is the unencrypted password

ssh access_server@$1 "
if id $2 >/dev/null 2>&1
then 
	sudo usermod --expiredate '' $2
	sudo passwd -u $2
	echo  '$2:$4' | sudo chpasswd
	echo 'enabling login'
else
	sudo /usr/sbin/useradd -m -p $3 $2
	if sudo grep -q '$2 ALL=ALL' </etc/sudoers;
	then 
		echo 'user exists in sudoers list'
	else 
		echo '$2 ALL=ALL' | sudo tee -a /etc/sudoers  
		echo 'user added to sudoers list'
	fi
	echo 'creating user'
fi" 
