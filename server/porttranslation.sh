#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the port number

sudo iptables -t nat -A PREROUTING -d sensenet-01.csc.ncsu.edu -p tcp --dport $2 -j DNAT --to-destination $1:22