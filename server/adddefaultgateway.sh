#!/usr/bin/env bash
# first input is the IP address of the BBB
# second input is the IP address of the access server's interface nearest to the BBB
# third input is the ethernet interface name of the BBB nearest to the above access server's interface

ssh access_server@$1 "
route add default gw $2 $3
"