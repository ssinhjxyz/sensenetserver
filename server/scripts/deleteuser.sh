#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the username to be deleted
# third input is the filename of the public key ( if the user has selected RSA key as login method ). Otherwise, it is empty

ssh access_server@$1 "sudo killall --user $2 ; sudo usermod --expiredate 1 $2 ; sudo passwd -l $2"
