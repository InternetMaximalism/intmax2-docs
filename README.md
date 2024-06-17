# INTMAX2 Docs

## Version

**Version Number**: v0.2.0

**Update Date**: 16.06.2024

## Purpose

The purpose of this document is to define the components of the entire system, clarifying their roles and functions. By categorizing the elements into nodes, contracts, and user interfaces and providing detailed explanations for each, it aims to help stakeholders involved in the design and operation of the network understand its structure.

- **Definition and Function Description of Nodes**
    - Explain the roles of various nodes within the network and specify their specific functions.
    - This enables developers and operators to understand the role of each node and appropriately configure and manage them.
- **Definition and Function Description of Contracts**
    - Explain the roles of various contracts within the network and specify their specific functions.
- **Explanation of User Interfaces**
    - Define the interfaces through which users interact with the network.
    - Describe the role of the Command Line Interface (CLI) and its integration with the INTMAX wallet, clarifying how users can operate the network.
- **Dependencies Among Components**
    - Organize the dependencies among the components and clarify how they interoperate.

## Component Dependencies

### Conceptual diagram

![2024-06-11 14.08.53.png](/assets/2024-06-11_14.08.53.png)

## Contracts

### Rollup

The contract responsible for handling operations related to INTMAX blocks. It is deployed on Scroll to save gas costs.

- Make deposits to become a block builder.
- Post transfer blocks.
- Accept withdrawal requests.

### Liquidity

A contract for depositing into the INTMAX network from Ethereum. It is deployed on Ethereum.

- Accept user deposits.
    - Tokens deposited by users become usable on INTMAX.
- Provide withdrawable tokens to users.
    - Users can withdraw tokens If the request has already been accepted by the rollup contract.

### Indexer

A contract for registering URLs of block builders and block validity provers. It is deployed on Scroll.

- Register the URL of a block builder.
- Update the URL of a block builder.
    - Generate event logs so that the node indexer can find it again.
- Delete the URL of a block builder.
- Register the URL of a block validity prover.
- Update the URL of a block validity prover.
    - Generate event logs so that the node indexer can find it again.
- Delete the URL of a block validity prover.

## Nodes

### Block Builder

Defines the role and operation methods of the builder node operating on the INTMAX network. Builder nodes aggregate transfer requests from users, create blocks, and reflect these blocks on the network.

These nodes are **decentralized** and deployed across the network. Each node operates independently and does not need to synchronize with other builder nodes.

[Block Builder specification](/nodes/block-builder.md)

### Deposit Relayer

Communicates deposit requests from the liquidity contract to the rollup contract.

These nodes are **decentralized** and deployed across the network. Each node operates independently and does not need to synchronize with other deposit relayer nodes.

[Deposit Relayer specification](/nodes/deposit-relayer.md) 

### Withdraw Relayer

Reflects withdrawal information submitted to the rollup contract in the liquidity contract.

These nodes are **decentralized** and deployed across the network. Each withdraw relayer node operates independently and does not need to synchronize with other builder nodes.

[Withdraw Relayer specification](/nodes/withdraw-relayer.md) 

### Withdraw Aggregator

Processes withdrawal requests from the INTMAX network to Ethereum. This node accepts user withdrawal requests, performs necessary verifications and processes, and manages the process of reflecting these in the liquidity contract.

These nodes are **decentralized** and deployed across the network. Each node operates independently and does not need to synchronize with other withdrawer nodes.

[Withdraw Aggregator specification](nodes/withdraw-aggregator.md) 

### Node Indexer

Provides information to users for finding block builders and block validity provers. It lists currently active nodes and recommends one node to connect to.

This node is operated solely by the INTMAX team and is **not decentralized**.

[Node Indexer specification](/nodes/node-indexer.md) 

### Data Store Server

Backs up data that users must individually store and makes it accessible when using INTMAX wallet or CLI from multiple devices. This node securely and efficiently backs up user data and manages the process of restoring it when necessary.

This node is operated solely by the INTMAX team and is **not decentralized**.

[Data Store Vault specification](/nodes/data-store-vault.md) 

### Block Validity Prover

Stores Merkle trees and ZKPs (Zero-Knowledge Proofs) used commonly in the INTMAX network and provides them upon user request. This node securely and efficiently stores generated Merkle trees and ZKPs and manages the process of providing them to users as needed.

These nodes are **decentralized** and deployed across the network. Each node operates independently and does not need to synchronize with other block validity prover nodes.

[Block Validity Prover specification](nodes/block-validity-prover.md) 

### Block Fraud Prover

Submits evidence when a posted block is found to be fraudulent. If the evidence is accepted, all transactions in that block are invalidated, and rewards are paid from the block builder's stake.

These nodes are **decentralized** and deployed across the network. Each node operates independently and does not need to synchronize with other block fraud prover nodes.

[Block Fraud Prover specification](nodes/block-fraud-prover.md) 

### Balance Validity Prover

Creates enough balance proof.

These nodes are **decentralized** and deployed across the network. Each node operates independently and does not need to synchronize with other balance validity prover nodes.

[Balance Validity Prover specification](/nodes/block-validity-prover.md) 

## User Interface

### CLI

A command-line interface (CLI) program necessary for users to operate the INTMAX network from a terminal. The CLI program provides commands for users to create accounts on the INTMAX network, and perform operations such as depositing, transferring, and withdrawing tokens.

[CLI specification](/others/cli.md) 

### INTMAX Wallet

INTMAX wallet provides a UI for users to create accounts on the INTMAX network, and perform operations such as depositing, transferring, and withdrawing tokens.

INTMAX wallet is available as a website and a mobile application.

### Block Explorer

Will be added soon.

## Component Dependencies

### Interactions

- **From User to Liquidity Contract**
    - Deposit ETH into the INTMAX network
    - Deposit ERC20 tokens into the INTMAX network
    - Deposit ERC721 tokens into the INTMAX network
    - Claim ERC20 tokens withdrawn from the INTMAX network
    - Claim ERC721 tokens withdrawn from the INTMAX network
- **From User to Block Builder**
    - Check health
    - Request a transaction
    - Retrieve a block containing the user's transaction created by the block builder
    - Send a signature to approve a block proposed by the block builder
- **From User to Data Store Server**
    - Backup the enough balance proof
- **From User to Balance Validity Prover**
    - Request an update of the balance proof (enough balance proof)
- **From User to Withdraw Aggregator**
    - Submit a withdrawal request
- **From Block Builder to Rollup Contract**
    - Post a block
- **From Block Validity Prover to Rollup Contract**
    - Retrieve blocks posted to the rollup contract
- **From Balance Validity Prover to Block Validity Prover Contract**
    - Obtain the block validity proof
- **From Deposit Relayer to Liquidity Contract**
    - Transmit deposit requests to Scroll
- **From Withdraw Relayer to Rollup Contract**
    - Retrieve details of withdrawal requests submitted by the withdraw aggregator
    - Transmit withdrawal requests to Ethereum
- **From Withdraw Relayer to Liquidity Contract**
    - Send ETH to users based on withdrawal requests transmitted to Ethereum
- **From Block Fraud Prover to Rollup Contract**
    - Retrieve blocks posted to the rollup contract
    - Submit fraud proof if an invalid block is detected
- **From Withdraw Aggregator to Rollup Contract**
    - Submit withdrawal requests
- **From Withdraw Aggregator to Block Validity Prover**
    - Obtain the block validity proof