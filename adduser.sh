#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the password
# third input is the username to be created at the BBB.

ssh access_server@$1 "sudo /usr/sbin/useradd -m -p $2 $3" 

