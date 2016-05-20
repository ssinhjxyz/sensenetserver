#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the password
# third input is the username to be created at the BBB.
ssh access_server@$1 "if id $3 >/dev/null 2>&1
then 
	sudo usermod --expiredate "" $3
	sudo passwd -u $3 
	echo -e "$2\n$2" | passwd $3
else
	sudo /usr/sbin/useradd -m -p $2 $3

	if sudo grep -q '$3 ALL=ALL' </etc/sudoers;
	then 
		echo 'user exists in sudoers list'
	else 
		echo '$3 ALL=ALL' | sudo tee -a /etc/sudoers  
		echo 'user added to sudoers list'
	fi
fi" 

