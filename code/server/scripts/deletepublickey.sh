	#!/usr/bin/env bash
	# first input is the ip address of BBB
	# second input is the username
	# third input is the filename of the public key
	scp /home/ssingh28/sensenetserver/code/server/uploads/$3 access_server@$1:/home/access_server/$3;
	ssh access_server@$1 "sudo sh -c '> /home/$2/.ssh/authorized_keys;grep -v -f /home/access_server/$3  /home/$2/.ssh/authorized_keys; > /home/$2/.ssh/authorized_keys'";
