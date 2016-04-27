#!/usr/bin/env bash

# create a .ssh folder for the user at the BBB if it does not exist
ssh root@192.168.1.12 'if [ ! -d /home/ssingh0/.ssh ];
then sudo mkdir /home/ssingh0/.ssh   
echo "created new .ssh folder"
else echo ".ssh folder exists"
fi' 

ssh root@192.168.1.12 'if [ ! -e /home/ssingh0/.ssh/authorized_keys ];
then sudo touch /home/ssingh0/.ssh/authorized_keys   
echo "created authorized_key file"
else echo "authorized_keys file exists"
fi'


#if the same public key is also present in "authorized_keys", do not add again.
publickey=$(cat "uploads/publickey") 
ssh root@192.168.1.12 "if sudo grep -q '$publickey' </home/ssingh0/.ssh/authorized_keys;
then echo 'public key already exists'
else echo '$publickey' | sudo tee -a /home/ssingh0/.ssh/authorized_keys  
echo 'added public key'
fi"

