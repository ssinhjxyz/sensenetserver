#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the username to be created at the BBB
# third input is the enrypted password.

ssh root@$1 "
if id $2 >/dev/null 2>&1
then 
	echo 'user exists'
else
	/usr/sbin/useradd -m -p $3 $2
	if grep -q '$2 ALL=(ALL) NOPASSWD:ALL' </etc/sudoers;
	then 
		echo 'user exists in sudoers list'
	else 
		echo '$2 ALL=(ALL) NOPASSWD:ALL' | tee -a /etc/sudoers  
		echo 'user added to sudoers list'
	fi
	echo 'creating user'
fi" 
