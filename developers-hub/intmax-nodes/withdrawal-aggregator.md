---
sidebar_position: 7
description: A Withdrawal Aggregator is a decentralized node responsible for processing withdrawal requests from the INTMAX network to the Ethereum network. It handles validating user withdrawal requests, preparing them, and reflecting these transactions securely on the Ethereum blockchain.
---

# Withdrawal Aggregator

### What is a Withdrawal Aggregator?

A Withdrawal Aggregator is a decentralized node responsible for processing withdrawal requests from the INTMAX network to the Ethereum network. It handles validating user withdrawal requests, preparing them, and reflecting these transactions securely on the Ethereum blockchain.

### Main Roles

- **Processing Withdrawal Requests:**
  - Receives withdrawal requests from users, validates them, and securely stores the information.
- **Aggregation and Submission of Withdrawals:**
  - Generates Zero-Knowledge Proofs (ZKPs) based on user requests, aggregates them, and submits withdrawal data to the Ethereum network.
- **Providing Withdrawal Proofs:**
  - Offers Merkle proofs to users for their withdrawal requests, enabling secure and verifiable withdrawals.

### How it Works

- Users submit withdrawal requests containing transfer details and necessary proofs.
- The Withdrawal Aggregator verifies each request, including proofs and balances, and securely stores the data.
- Once sufficient requests accumulate or after a designated time interval, the Aggregator creates ZKPs and sends the aggregated withdrawal information through the Scroll network to Ethereum.
- After submission, users receive Merkle proofs to finalize their withdrawals.

### Features

- **Decentralized:**
  - Nodes operate independently across the network without central coordination. Users can run their nodes, although no protocol rewards are provided.
- **High Availability:**
  - Ensures continuous service with minimal downtime.
- **Scalable:**
  - Capable of efficiently handling an increasing number of requests.
- **Fault-Tolerant:**
  - Able to resume operations seamlessly after failures or outages.
- **Rapid Response:**
  - Quickly responds to user requests.

### What Users Can Do

- Users can set up and operate their own Withdrawal Aggregator nodes.
- Users submit withdrawal requests and receive proofs needed for claiming funds on Ethereum.
