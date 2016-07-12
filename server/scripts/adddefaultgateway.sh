#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the IP address of the access server's interface nearest to the BBB
# third input is the ethernet interface name of the BBB nearest to the above access server's interface
# delete any existing default route and then add the new default route to avoid duplicate routes

ssh root@$1 "route add default gw $2 $3"