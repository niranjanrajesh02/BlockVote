#!/bin/bash

pushd ../test-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn block-vote -ccp ../block-vote/chaincode/ -ccl javascript
# initledger
./network.sh deployCC -ccn block-vote -ccp ../block-vote/chaincode/ -ccl javascript -ccv 1 -cci InitLedger
popd

pushd ./application-javascript
rm -rf wallet #remove wallet if exists
node register.js voter1
node register.js voter2
node register.js voter3
node register.js voter4
node register.js voter5
node register.js voter6
node register.js voter7
node vote.js voter1 "Adit Dhawan"
node vote.js voter2 "Adit Dhawan"
node vote.js voter3 "Adit Dhawan"
node vote.js voter4 "Chanchal Bajoria"
node vote.js voter5 "Chanchal Bajoria"
node vote.js voter6 "Chanchal Bajoria"
node vote.js voter7 "Chanchal Bajoria"


popd