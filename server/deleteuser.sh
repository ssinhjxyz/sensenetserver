#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the username to be deleted
# third input is the filename of the public key ( if the user has selected RSA key as login method ). Otherwise, it is empty

ssh access_server@$1 "sudo killall --user $2 ; sudo usermod --expiredate 1 $2 ; sudo passwd -l $2"
# if [ ! -z "$3" ]
# then 
# 	echo "Deleting public key";
# 	scp server/uploads/$3 access_server@$1:/home/access_server/$3;
# 	ssh access_server@$1 "grep -v -f /home/access_server/$3  /home/$2/.ssh/authorized_keys > /home/access_server/$3auth;
# 			      sudo mv /home/access_server/$3auth /home/$2/.ssh/authorized_keys;
# 			      rm /home/access_server/$3;"
	
# fi
