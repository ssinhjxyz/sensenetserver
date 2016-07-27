#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the username at the BBB. Login using RSA keys will be enabled for this user at the BBB.
# third input is the filename of the RSA key, kept under uploads folder.

# create a .ssh folder for the user at the BBB if it does not exist
ssh root@$1 "
if [  ! -d /home/$2/.ssh ];
then  mkdir /home/$2/.ssh   
echo 'created new .ssh folder'
else echo '.ssh folder exists'
fi"

ssh root@$1 "if [ ! -e /home/$2/.ssh/authorized_keys ];
then  touch /home/$2/.ssh/authorized_keys   
echo 'created authorized_key file'
else echo 'authorized_keys file exists'
fi"

#if the same public key is already present in "authorized_keys", do not add again.
publickey=$(cat "/home/ssingh28/sensenetserver/server/code/uploads/$3") 
ssh root@$1 "if  grep -q '$publickey' </home/$2/.ssh/authorized_keys;
then echo 'public key already exists'
else echo '$publickey' |  tee -a /home/$2/.ssh/authorized_keys  
echo 'added public key'
fi"

