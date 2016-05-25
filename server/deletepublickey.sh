	# first input is the filename of the public key
	# echo "Deleting public key";
	# scp server/uploads/$3 access_server@$1:/home/access_server/$3;
	# ssh access_server@$1 "grep -v -f /home/access_server/$3  /home/$2/.ssh/authorized_keys > /home/access_server/$3auth;
	# sudo mv /home/access_server/$3auth /home/$2/.ssh/authorized_keys;
	# rm /home/access_server/$3;"

	#!/usr/bin/env bash
	# first input is the filename of the public key
	echo "Deleting public key";
	scp server/uploads/$3 access_server@$1:/home/access_server/$3;
	ssh access_server@$1 "newauthkeys=$(grep -v -f /home/access_server/$3  /home/$2/.ssh/authorized_keys);
	rm /home/access_server/$3;
	echo $newauthkeys;"
