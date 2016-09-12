#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the username at the BBB. Login using RSA keys will be enabled for this user at the BBB.
# third input is the public key to be kept at the BBB

# create a .ssh folder for the user at the BBB if it does not exist
ssh access_server@$1 "
if sudo [  ! -d /home/$2/.ssh ];
then sudo mkdir /home/$2/.ssh   
echo 'created new .ssh folder'
else echo '.ssh folder exists'
fi"

ssh access_server@$1 "if [ ! -e /home/$2/.ssh/authorized_keys ];
then sudo touch /home/$2/.ssh/authorized_keys   
echo 'created authorized_key file'
else echo 'authorized_keys file exists'
fi"

#if the same public key is also present in "authorized_keys", do not add again.
ssh access_server@$1 "if sudo grep -q $3 </home/$2/.ssh/authorized_keys;
then echo 'public key already exists'
else echo $3 | sudo tee -a /home/$2/.ssh/authorized_keys  
echo 'added public key'
fi"

