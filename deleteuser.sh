#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the username to be deleted

ssh access_server@$1 "sudo killall --user $2 ; sudo userdel -f $2" 

