#!/bin/bash

if [ -f node.pid ]; then

	kill $(cat node.pid)
	rm node.pid
	echo "Node process killed."

else
	echo "No process found, unable to kill it."
fi
