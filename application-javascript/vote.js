'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

let voterName, candidateName;
process.argv.forEach(function (val, index, array) {
  voterName = array[2];
  candidateName = array[3];
});

async function main() {
  try {
    let voterID = crypto.createHash('sha1').update(voterName).digest('hex');

    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(voterID);
    if (!identity) {
      console.log(`An identity for the user ${voterID} does not exist in the wallet`);
      console.log('Run the registerUser.js application before retrying');
      return;
    }

    const gateway = new Gateway();

    try {
      // setup the gateway instance
      // The user will now be able to create connections to the fabric network and be able to
      // submit transactions and query. All transactions submitted by this gateway will be
      // signed by this user using the credentials stored in the wallet.
      await gateway.connect(ccp, {
        wallet,
        identity: voterID,
        discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
      });

      // Build a network instance based on the channel where the smart contract is deployed
      const network = await gateway.getNetwork('mychannel');

      // Get the contract from the network.
      const contract = network.getContract('block-vote');

      //Cast Vote
      console.log('\n--> Cast Vote:\n');
      let voteResponse = await contract.submitTransaction('CastVote', voterID, candidateName);
      console.log('*** Result: Vote has been cast');


    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`******** FAILED to run the application: ${error}`);
    process.exit(1);
  }
}

main();
