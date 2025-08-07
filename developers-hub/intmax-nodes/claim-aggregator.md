---
sidebar_position: 8
description: A Claim Aggregator is a decentralized node responsible for processing mining reward claims generated on the Intmax network. It verifies and processes reward claims submitted by users and ensures these claims are accurately reflected on the blockchain.
---

# Claim Aggregator

### What is a Claim Aggregator?

A Claim Aggregator is a decentralized node responsible for processing mining reward claims generated on the Intmax network. It verifies and processes reward claims submitted by users and ensures these claims are accurately reflected on the blockchain.

### Main Roles

- **Aggregating Claim Requests**
  - Collects and validates users' mining reward claims.
  - Generates Zero-Knowledge Proofs (ZKPs) to securely verify these claims on-chain.
- **Submitting Claim Proofs**
  - Submits the validated claim proofs to the Claim contract on the Scroll network.
- **Transmitting Rewards to Ethereum**
  - Aggregates daily rewards and securely transmits them from the Scroll network to the Ethereum network.

### How it Works

- Users submit mining reward claim requests to the Claim Aggregator.
- The Claim Aggregator validates these requests and generates necessary ZKPs.
- Once validated, proofs are submitted to the Claim contract on the Scroll network.
- Daily aggregated rewards are transmitted securely to users' addresses on the Ethereum network.

### Features

- **Decentralized**
  - Claim Aggregator nodes operate independently across the network.
  - Users can deploy their own nodes and earn economic rewards provided by the protocol.

### Security Measures

- **Real-time Log Monitoring**
  - Continuously monitors logs to quickly detect and respond to unauthorized activities or abnormal behaviors.
- **Private Key Protection**
  - Access strictly controlled and limited to essential users.
  - Secure storage of private keys in physically secured or encrypted locations.

### What Users Can Do

- Users can deploy and manage their own Claim Aggregator nodes to participate in network operations and receive rewards.
- Users submit claim requests and benefit from reliable and transparent handling of their mining reward claims.
