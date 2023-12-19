// set up express endpoints for transactions
const express = require('express');
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const { buildCAClient, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');
const crypto = require('crypto');
const { log } = require('console');
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// create a new transaction
app.get('/count', async (req, res) => {
  try {
    // load the network configuration
    const ccp = buildCCPOrg1();

    const wallet = await buildWallet(Wallets, walletPath);

    let voterName = 'niranjan'; // Specify the identity label created during user registration
    const identityLabel = crypto.createHash('sha1').update(voterName).digest('hex');
    const identity = await wallet.get(identityLabel);
    if (!identity) {
      console.log(`An identity for the user ${identityLabel} does not exist in the wallet.`);
      console.log('Run the registerUser.js application before retrying.');
      return;
    }

    // create a new gateway for connecting to our peer node
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: identityLabel,
      discovery: { enabled: true, asLocalhost: true }
    });

    // get the network (channel) our contract inods deployed to
    const network = await gateway.getNetwork('mychannel');

    // get the contract from the network
    const contract = network.getContract('block-vote');

    // create a new transaction
    console.log('\n--> Count Votes:\n');
    let result = await contract.submitTransaction('CountVotes');
    console.log('*** Result: Counted Votes');
    console.log(`Transaction result: ${result.toString()}`);
    // disconnect from the gateway
    await gateway.disconnect();

    // send response
    res.send('Transaction has been submitted.\nResult: ' + result.toString());

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }
});

// vote transaction
app.post('/vote', async (req, res) => {
  try {
    // load the network configuration
    const ccp = buildCCPOrg1();

    const wallet = await buildWallet(Wallets, walletPath);

    let voterName = 'niranjan'; // Specify the identity label created during user registration
    const identityLabel = crypto.createHash('sha1').update(voterName).digest('hex');
    const identity = await wallet.get(identityLabel);
    if (!identity) {
      console.log(`An identity for the user ${identityLabel} does not exist in the wallet.`);
      console.log('Run the registerUser.js application before retrying.');
      return;
    }

    // create a new gateway for connecting to our peer node
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: identityLabel,
      discovery: { enabled: true, asLocalhost: true }
    });

    // get the network (channel) our contract inods deployed to
    const network = await gateway.getNetwork('mychannel');

    // get the contract from the network
    const contract = network.getContract('block-vote');

    // create a new transaction
    console.log('\n--> Cast Vote:\n');
    let result = await contract.submitTransaction('CastVote', req.body.voterID, req.body.candidateName);
    console.log('*** Result: Vote has been cast');
    console.log(`Transaction result: ${result.toString()}`);
    // disconnect from the gateway
    await gateway.disconnect();

    // send response
    // res.send('Transaction has been submitted.\nResult: ' + result.toString());
    res.send("Transaction has been submitted.")
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});