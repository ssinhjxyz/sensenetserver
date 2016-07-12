#!/bin/bash

target=$1

count=$( ping -c 1 $target | grep icmp* | grep bytes | wc -l )

if [ $count -eq 0 ]
then
    echo "down";
else
    echo "up";
fi