# BlockVote

BlockVote is a blockchain-based voting system that aims to provide a secure and transparent voting process for your election needs. BlockVote is an implementation for my final project for CS-2361: Blockchain and Cryptocurrencies

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Usage](#usage)

## Description

BlockVote is a blockchain-based voting system that aims to provide a secure and transparent voting process for your election needs.The application will be built on Hyperledger Fabric. BlockVote can be utilised by any organisation that is holding an election as a plug-and-play framework with minimal overhead. An administrator setting up the application needs to input the candidate profiles and respective campaign information to initialise the application. Once initialised, the application will allow users to authenticate and cast a singular, anonymous vote. The voting ends after a specified voting period and the election results are displayed.

## Features

The project will have the following features upon completion:
A fully-functional Frontend where users can:

- Authenticate (voter)
- View candidate profiles with their campaign information (voter)
- Add/Remove candidates from the election (admin)
- Candidate-wise votes can be inspected and audited (admin)
- Force-stop the election (admin)
- View the results of the election once voting time is over (everyone)

A Backend powered by Hyperledger Fabric where:

- Candidate profiles are stored
- Voter information is stored in a secure, untraceable manner
- Legitimate voting is verified before cast is ensured
- The voting system logic on the permissioned blockchain is handled
- The candidate database is updated every time the ledger is updated with a new cast vo

## Usage

Once the application is up and running, participants can access the voting system through a web interface.

### Start Server

`node application-javascript/app.js`
The above command starts a server at localhost:4000 which serves a conncection to the HyperLedger fabric backend of BlockVote. The backend is constructed using node.js and Express.

### Start Frontend

Navigate to `application-javascript/frontend` and run `npm start` to access the frontend. The frontend is constructed using React.js (Next.js). The frontend will run at localhost:3000.
