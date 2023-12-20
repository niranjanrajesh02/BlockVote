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
const FabricCAServices = require('fabric-ca-client');

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
    // process.exit(1);
  }
});

// vote transaction
app.post('/vote', async (req, res) => {
  try {
    // load the network configuration
    const ccp = buildCCPOrg1();

    const wallet = await buildWallet(Wallets, walletPath);

    let voterName = req.body.voterID; // Specify the identity label created during user registration
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
    console.log('\n--> Cast Vote:\n');
    try {
      await contract.submitTransaction('CastVote', identityLabel, req.body.candidateName);
      res.send("Transaction has been submitted.")
      console.log('*** Result: Vote has been cast');
      await gateway.disconnect();
    } catch (error) {
      throw new Error(error);
    }

  } catch (error) {
    res.send("Transaction failed: " + error)
  }
});

// register voter transaction
app.post('/register', async (req, res) => {
  try {
    let userName = req.body.userName;
    const ccp = buildCCPOrg1();
    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);

    // in a real application this would be done on an administrative flow, and only once
    await enrollAdmin(caClient, wallet, mspOrg1);

    // remove user from wallet if exists

    // userID is the SHA256 hash of the user's name
    let userID;
    userID = crypto.createHash('sha1').update(userName).digest('hex');

    const userIdentity = await wallet.get(userID);
    if (userIdentity) {
      console.log(`An identity for the user ${userID} already exists in the wallet`);
      throw new error(`An identity for the user ${userID} already exists in the wallet`);
    }

    // Must use an admin to register a new user
    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
      console.log('An identity for the admin user "admin" does not exist in the wallet');
      console.log('Run the enrollAdmin.js application before retrying');
      return;
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    const secret = await caClient.register({
      enrollmentID: userID,
      role: 'client'
    }, adminUser);
    const enrollment = await caClient.enroll({
      enrollmentID: userID,
      enrollmentSecret: secret
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: mspOrg1,
      type: 'X.509',
    };
    await wallet.put(userID, x509Identity);
    console.log(`Successfully registered and enrolled user ${userID} and imported it into the wallet`);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: userID,
      discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
    });
    console.log('Connected to Fabric gateway.');
    const network = await gateway.getNetwork('mychannel');

    const contract = network.getContract('block-vote');

    // RegisterVoter
    console.log('\n--> Register Voter:\n');
    await contract.submitTransaction('RegisterVoter', userID);
    console.log('*** Result: Voter Registered');
    // disconnect from the gateway
    await gateway.disconnect();
    // send response
    res.send("Voter Registered")

  } catch (error) {
    res.send("Transaction failed: " + error)
  }


});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});