#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the password
# third input is the username to be created at the BBB.

ssh sensenetserver@$1 "sudo useradd -m -p $2 $3" 

