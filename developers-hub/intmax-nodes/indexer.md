---
sidebar_position: 10
description: A Withdrawal Relayer is a decentralized node responsible for securely processing withdrawals from the INTMAX network to the Ethereum network. It executes the withdrawal of tokens such as ETH, ERC20, ERC721, and ERC1155 based on user requests sent through the Rollup contract.
---

# Indexer

### What is an Indexer?

An Indexer is a decentralized node on the INTMAX network responsible for providing users with up-to-date information about active Block Builder nodes. It maintains an accurate and current list of these nodes and suggests optimal connections for users.

### Main Roles

- **Maintaining Active Node Lists**
  - Keeps track of active Block Builder nodes.
  - Regularly performs health checks to ensure node availability.
- **Recommending Nodes**
  - Provides users with recommendations for active and reliable Block Builders.

### How it Works

- The Indexer node regularly checks an Block Builder Registry contract on the Scroll network for updates on active Block Builder nodes.
- When changes occur, the Indexer updates its records and verifies each node’s status by performing health checks.
- Nodes that don't respond within a certain timeframe (more than a day) are marked inactive and excluded from the active list.
- Users can request a list of recommended Block Builders through a REST API.

### Features

- **Decentralized Operation**
  - Each Indexer node operates independently and does not require synchronization with other Indexers.
  - Users can deploy their own Indexer nodes, although there are no economic rewards for doing so.

### What Users Can Do

The user executes transactions with the Block Builder recommended by this node.
