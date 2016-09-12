	#!/usr/bin/env bash
	# first input is the ip address of BBB
	# second input is the username
	# third input is the public key

	echo $3 | ssh access_server@1 "cat > /home/access_server/key"
	ssh access_server@$1 "sudo sh -c '> /home/$2/.ssh/authorized_keys;grep -v -f /home/access_server/key  /home/$2/.ssh/authorized_keys; > /home/$2/.ssh/authorized_keys; rm /home/access_server/key'";
	