#!/usr/bin/env bash
ssh root@192.168.1.12 'if [ ! -d /home/ssingh28/.ssh ];
then mkdir /home/ssingh28/.ssh && echo "created"
fi'
scp top_block.py root@192.168.1.12:~/received.py 
