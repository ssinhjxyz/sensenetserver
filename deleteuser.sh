#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the username to be deleted

ssh sensenetserver@$1 "sudo killall --user $2 ; userdel -f $2" 

