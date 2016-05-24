#!/bin/bash

target=$1

count=$( ping -c 1 $target | grep icmp* | grep bytes | wc -l )

if [ $count -eq 0 ]
then

    return 1;

else

    return 0;

fi