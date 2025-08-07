---
sidebar_position: 11
description: A Withdrawal Relayer is a decentralized node responsible for securely processing withdrawals from the INTMAX network to the Ethereum network. It executes the withdrawal of tokens such as ETH, ERC20, ERC721, and ERC1155 based on user requests sent through the Rollup contract.
---

# Validity Prover

### What is a Validity Prover?

A Validity Prover is a decentralized node on the Intmax network responsible for securely storing and providing Merkle trees and ZKPs related to Intmax blocks. These proofs verify the validity of transactions and blocks, ensuring the integrity of network operations.

### Main Roles

- **Storing Merkle Trees and ZKPs**
  - Each time a new Intmax block is created, the Validity Prover generates Merkle tree proofs and ZKPs.
  - Stores and securely maintains these proofs and updates them as needed.
- **Providing Proofs to Users**
  - Offers stored Merkle trees and ZKPs to users upon request.

### How it Works

- When blocks are created and posted to the Rollup contract, the Validity Prover generates and verifies Merkle proofs and ZKPs, storing them securely.
- Users can request specific proofs to validate transactions or check account details.

### Features

Each Validity Prover node functions independently. Users can deploy their own nodes, although no protocol rewards are provided.

### What Users Can Do

Users can check the current state of the Intmax network via the Validity Prover. Primarily, they can retrieve the necessary data for generating balance proofs through a REST API.
