/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');
const data = require('./data.json');
const fs = require('fs');



const candidates = [];


class BLOCK_VOTE extends Contract {

  async InitLedger(ctx) {
    console.log('=================== Chaincode Instantiating ... ===================');

    // load candidates from data.json and update state
    for (const candidate of data.candidates) {
      let new_candidate = {
        "name": candidate.name,
        "votes": candidate.votes
      }
      candidates.push(new_candidate);
      await ctx.stub.putState(candidate.name, Buffer.from(stringify(sortKeysRecursive(candidate))));
    }

    console.log('============= Chaincode Instantiated Successfully ===========');
  }

  // RegisterVoter registers a new voter
  async RegisterVoter(ctx, voterID) {
    console.log(`============= START : Register Voter ${voterID} ===========`);

    // check if voter already exists
    const voterAsBytes = await ctx.stub.getState(voterID);
    if (voterAsBytes.toString()) {
      throw new Error('Voter already exists');
    }


    let new_voter = {
      "voterID": voterID,
      "voted_for": null
    }
    console.log(new_voter);
    // update state with new voter
    await ctx.stub.putState(voterID, Buffer.from(stringify(sortKeysRecursive(new_voter))));
    console.log('============= END : Register Voter ===========');
  }

  // cast vote
  async CastVote(ctx, voterID, candidateName) {
    console.log('============= START : Cast Vote ===========');

    // check if voter exists
    const voterAsBytes = await ctx.stub.getState(voterID);
    if (!voterAsBytes.toString()) {
      throw new Error('Voter does not exist');
    }

    // check if voter has already voted
    const voter = JSON.parse(voterAsBytes.toString());
    if (voter.voted_for) {
      throw new Error('Voter has already voted! A voter may only vote once ...');
    }
    console.log(candidateName);
    // log candidates array
    console.log(candidates);
    // check if candidate exists from candidates array global variable
    let candidateExists = false;
    for (const candidate of data.candidates) {
      if (candidate.name === candidateName) {
        candidateExists = true;
        break;
      }
    }
    if (!candidateExists) {
      throw new Error('Candidate does not exist!');
    }

    // update voter object
    voter.voted_for = candidateName;

    // update candidate object in state
    for (const candidate of data.candidates) {
      if (candidate.name === candidateName) {
        candidate.votes += 1;
        await ctx.stub.putState(candidate.name, Buffer.from(stringify(sortKeysRecursive(candidate))));
        console.log(candidate);
        break;
      }
    }
    console.log(voter);
    // update state
    await ctx.stub.putState(voterID, Buffer.from(stringify(sortKeysRecursive(voter))));
    // TODO: Update DB with new Candidates Array (for vote counting)
    console.log('============= END : Cast Vote ===========');
  }

  // count votes for each candidate
  async CountVotes(ctx) {
    console.log('============= START : Count Votes ===========');

    // make an object of vote_counter for each candidate
    const vote_counter = {};
    for (const candidate of candidates) {
      vote_counter[candidate.name] = 0;
    }
    // update vote_counter object with votes from candidates state
    for (const candidate of candidates) {
      const candidateAsBytes = await ctx.stub.getState(candidate.name);
      if (candidateAsBytes.toString()) {
        const candidateObj = JSON.parse(candidateAsBytes.toString());
        vote_counter[candidateObj.name] = candidateObj.votes;
      }
    }
    // Sort vote_counter object by votes
    const sortedVoteCounter = {};
    Object.keys(vote_counter).sort().forEach(function (key) {
      sortedVoteCounter[key] = vote_counter[key];
    });
    console.log(sortedVoteCounter);

    console.log('============= END : Count Votes ===========');

    // return vote_counter object
    return stringify(sortKeysRecursive(sortedVoteCounter));
  }


}

module.exports = BLOCK_VOTE;