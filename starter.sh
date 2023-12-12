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
node register.js niranjan
node vote.js niranjan "Nishtha Das"
node countVotes.js niranjan

popd