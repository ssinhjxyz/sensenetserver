#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the port number

# check for existing entry
#result = "$(sudo iptables -t nat -C PREROUTING -d sensenet-01.csc.ncsu.edu -p tcp --dport $2 -j DNAT --to-destination $1:22)"
#echo "${result}"

if $(sudo iptables -t nat -C PREROUTING -d sn-access.csc.ncsu.edu -p tcp --dport $2 -j DNAT --to-destination $1:22)
then
	#rule exists
	echo "Rule already exists"
else
	sudo iptables -t nat -A PREROUTING -d sn-access.csc.ncsu.edu -p tcp --dport $2 -j DNAT --to-destination $1:22
	echo "rule added"
fi
#expr length + "$(readlink -f /etc/fstab)"
