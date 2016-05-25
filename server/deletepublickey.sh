	# first input is the filename of the public key
	# echo "Deleting public key";
	# scp server/uploads/$3 access_server@$1:/home/access_server/$3;
	# ssh access_server@$1 "grep -v -f /home/access_server/$3  /home/$2/.ssh/authorized_keys > /home/access_server/$3auth;
	# sudo mv /home/access_server/$3auth /home/$2/.ssh/authorized_keys;
	# rm /home/access_server/$3;"

	#!/usr/bin/env bash
	# first input is the ip address of BBB
	# second input is the username
	# third input is the filename of the public key
	echo "Deleting public key";
	scp /home/ssingh28/sensenetserver/server/uploads/$3 access_server@$1:/home/access_server/$3;
	ssh access_server@$1 "sudo sh -c '> /home/$2/.ssh/authorized_keys;grep -v -f /home/access_server/$3  /home/$2/.ssh/authorized_keys; > /home/$2/.ssh/authorized_keys'";
