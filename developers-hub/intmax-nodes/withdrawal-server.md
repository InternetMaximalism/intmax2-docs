---
sidebar_position: 6
description: A Withdrawal Server is a node responsible for processing user withdrawal and claim requests on the Intmax network. It manages accepting requests, verifying proofs, executing transfers, and providing users with transaction details.
---

# Withdrawal Server

### What is a Withdrawal Server?

A Withdrawal Server is a node responsible for processing user withdrawal and claim requests on the Intmax network. It manages accepting requests, verifying proofs, executing transfers, and providing users with transaction details.

### Main Roles

- **Withdrawal Requests:**
  - Accepts withdrawal requests, verifies proofs, and transfers the requested amounts.
- **Claim Requests:**
  - Processes claim requests, verifies proofs, and transfers the claimed amounts.
- **Fee Calculation:**
  - Calculates fees associated with withdrawals and claims and provides this information to users.
- **Information Retrieval:**
  - Provides authenticated users with details about their withdrawals and claims.

### How it Works

- Users submit withdrawal or claim requests to the Withdrawal Server.
- The Withdrawal Server verifies transaction proofs and, if valid, processes transactions accordingly.
- After processing, the funds are transferred to the recipients, and users can retrieve transaction details and fee information.

### Features

- **Decentralized:**
  - Operates independently through multiple nodes across the network without a central authority.
  - Users can run their own Withdrawal Server nodes and receive rewards according to the protocol.

### What Users Can Do

- Users can deploy their own Withdrawal Server nodes, participate in network operations, and earn rewards based on the protocol.
- Users can request withdrawals and claims, retrieve transaction details, and check current fee structures via provided APIs.
