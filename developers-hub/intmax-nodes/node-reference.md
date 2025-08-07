---
sidebar_position: 1
description: This document outlines the components of the entire system and describes their roles. These components are organized into three categories User Interface, Contracts, and Nodes.
---

# Node Reference

This document outlines the components of the entire system and describes their roles. These components are organized into three categories: User Interface, Contracts, and Nodes.

- **Explanation of User Interfaces**
  - Explain the interfaces through which users interact with the network. Describe the Command Line Interface (CLI) and the Intmax Web App, clarifying how users can operate the network.
- **Explanation of Smart Contracts**
  - Explain the roles of various contracts within the network.
  - This helps you understand how the network utilizes on-chain data.
- **Explanation of Nodes**
  - Explain the roles of various nodes within the network.
  - This helps you understand how the network is structured.

## Component Dependencies

### Conceptual diagram

<figure><img src="/img/developers-hub/node.webp" alt="Conceptual diagram" /></figure>

## Main Features

### Batch Transfers of Multiple Tokens

Intmax natively supports batch transfers of multiple tokens. Users can send tokens simultaneously to up to 63 different recipients without any additional costs. It's also possible to send different types of tokens to each recipient within a single batch transfer.

Transactions on the Intmax network do not reveal the recipient’s identity to external observers.

### Deposits and Withdrawals from the Ethereum Network

The Intmax network supports deposits and withdrawals from the Ethereum network. When funds are deposited, only the recipient knows which specific Intmax address received the funds. Similarly, when withdrawing, the Intmax address from which the funds originated remains undisclosed.

AML checks are performed upon deposits to prevent risky assets from circulating within the Intmax network.

### Privacy Mining

The goal of privacy mining is to expand and maintain the anonymity set of the privacy protocol. Privacy Mining allows users to earn rewards by contributing to privacy through depositing a specified amount of ETH for a designated period within the Intmax network.

## User Interface

### Intmax Web App (Recommended)

Intmax Web App provides a UI for users to create accounts on the Intmax network, and perform operations such as depositing, transferring, and withdrawing tokens.

It also supports privacy mining features. Intmax Web App is available as a website and a mobile application.

- [Open Mainnet App](https://app.intmax.io/)

- [Open Testnet App](https://beta.testnet.app.intmax.io/)

### CLI

A command-line interface (CLI) program necessary for users to operate the Intmax network from a terminal. The CLI program provides commands for users to create accounts on the Intmax network, and perform operations such as depositing, transferring, and withdrawing tokens.

You can access it from the source code provided here.

[View INTMAX CLI](../intmax-cli.md)

### Contracts

The Intmax network is a Layer-2 solution built on top of the Ethereum network. Liquidity remains on Ethereum, while block data storage utilizes the Scroll network—a type of ZK-rollup—allowing Intmax to benefit from lower costs and enhanced security. Smart contracts deployed on these two networks form the foundation of the Intmax network.

[View Smart Contracts](./smart-contracts)

## Nodes

### Block Builder

Builder nodes aggregate transfer requests from users, create blocks, and reflect these blocks on the network.

These nodes are **decentralized** and deployed across the network. Each node operates independently and does not need to synchronize with other builder nodes.

[View Block Builder](./block-builder)

### Store Vault Server

Backs up data that users must individually store and makes it accessible when using Intmax wallet or CLI from multiple devices. This node securely and efficiently backs up user data and manages the process of restoring it when necessary.

[View Store Vault Server](./store-vault-server)

### Deposit Relayer

Communicates deposit requests from the Liquidity contract to the Rollup contract.

[View Deposit Relayer](./deposit-relayer)

### Withdrawal Server

This node manages the progress of accepting withdrawal/claim requests, and providing information about withdrawals and claims to authenticated users.

[View Withdrawal Server](./withdrawal-server)

### Withdraw Aggregator

Processes withdrawal requests from the Intmax network to Ethereum. This node accepts user withdrawal requests, performs necessary verifications and processes, and manages the process of reflecting these in the liquidity contract.

[View Withdrawal Aggregator](./withdrawal-aggregator)

### Claim Aggregator

This node processes requests for mining rewards generated on the Intmax network. This node performs necessary validation and processing of mining reward requests received from users and manages the process of reflecting these requests on-chain.

[View Claim Aggregator](./claim-aggregator)

### Withdraw Relayer

Reflects withdrawal information submitted to the rollup contract in the liquidity contract.

[View Withdrawal Relayer](./withdrawal-relayer)

### Indexer

Provides information to users for finding block builders and block validity provers. It lists currently active nodes and recommends some nodes to connect to.

[View Indexer](./indexer)

### Validity Prover

A Validity Prover is a decentralized node on the Intmax network responsible for securely storing and providing Merkle trees and ZKPs related to Intmax blocks. These proofs verify the validity of transactions and blocks, ensuring the integrity of network operations.

[View Validity Prover](./validity-prover)

### Provers

In the Intmax network, user balances are verified using Zero-Knowledge Proofs (ZKPs) to ensure sufficient funds and validate withdrawal conditions.

[View Provers](./provers)
