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
const voters = [];


class BLOCK_VOTE extends Contract {

  async InitLedger(ctx) {
    console.log('=================== Chaincode Instantiating ... ===================');

    // load candidates from data.json and update state
    for (const candidate of data.candidates) {
      let new_candidate = {
        "name": candidate.name,
        "votes": candidate.votes,
        "info": candidate.info || ""
      }
      candidates.push(new_candidate);
      await ctx.stub.putState(candidate.name, Buffer.from(stringify(sortKeysRecursive(candidate))));
    }

    console.log('============= Chaincode Instantiated Successfully ===========');
  }

  // Get Candidates
  async GetCandidates(ctx) {
    console.log('============= START : Get Candidates ===========');
    console.log(candidates);
    console.log('============= END : Get Candidates ===========');
    return stringify(sortKeysRecursive(candidates));
  }


  // RegisterVoter registers a new voter
  async RegisterVoter(ctx, voterID) {
    console.log(`============= START : Register Voter ${voterID} ===========`);
    try {
      // check if voter already exists
      const voterAsBytes = await ctx.stub.getState(voterID);
      if (voterAsBytes.toString()) {
        throw new Error('Voter already exists');
      }
      let new_voter = {
        "voterID": voterID,
        "voted_for": null
      }
      voters.push(new_voter);
      await ctx.stub.putState(voterID, Buffer.from(stringify(sortKeysRecursive(new_voter))));

    } catch (error) {
      throw new Error('Error in RegisterVoter: ' + error);
    }
    console.log('============= END : Register Voter ===========');
  }

  // cast vote
  async CastVote(ctx, voterID, candidateName) {
    console.log('============= START : Cast Vote ===========');
    try {
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

      console.log('============= END : Cast Vote ===========');
    } catch (error) {
      throw new Error('Error in CastVote: ' + error);
    }
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

  // return candidates
  async GetCandidates(ctx) {
    console.log('============= START : Get Candidates ===========');
    console.log(candidates);
    console.log('============= END : Get Candidates ===========');
    return stringify(sortKeysRecursive(candidates));
  }

  // audit election
  async AuditElection(ctx) {
    console.log('============= START : Audit Election ===========');
    // get all voters by iterating through the voterIDs in the voter array global variable
    const allVotersArray = [];
    for (const voter of voters) {
      const voterAsBytes = await ctx.stub.getState(voter.voterID);
      if (voterAsBytes.toString()) {
        const voterObj = JSON.parse(voterAsBytes.toString());
        allVotersArray.push(voterObj);
      }
    }
    console.log(allVotersArray);
    console.log('============= END : Audit Election ===========');
    return stringify(sortKeysRecursive(allVotersArray));
  }

}

module.exports = BLOCK_VOTE;