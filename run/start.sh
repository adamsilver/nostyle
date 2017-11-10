#!/bin/bash

if [ -f node.log ]; then
	rm node.log
fi

if [ ! -d ../node_modules ]; then
	cd ../
	NODE_ENV=production npm install
	cd -
fi

cd ../
NODE_ENV=production nohup node server.js > run/node.log 2>&1 &
echo $! > run/node.pid
echo "Node process started."
