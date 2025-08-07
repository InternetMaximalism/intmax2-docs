---
sidebar_position: 3
description: A Block Builder is a type of node in the Intmax network that collects transaction requests from users, creates blocks, and reflects them on the network.
---

# Block Builder

### What is a Block Builder?

A Block Builder is a type of node in the Intmax network that collects transaction requests from users, creates blocks, and reflects them on the network.

### Main Roles

1. **Transaction Aggregation**
   - Receives transaction requests from users, validates them, and efficiently aggregates them.
2. **Block Creation**
   - Creates new blocks from the aggregated transaction data and obtains user approval.
   - Performs integrity checks on the created blocks.
3. **Reflecting Blocks on the Network**
   - Sends completed blocks to the Scroll network to update the network state.
   - Confirms that the block has been successfully added.

### How it Works

1. The user prepares transaction data and generates proof demonstrating that their balance is sufficient for the transfer made.
2. The generated proof is stored.
3. The user sends transaction requests to the Block Builder.
4. The Block Builder aggregates transactions and returns a proof (Merkle Proof).
5. The user verifies the proof, sign the transaction, and sends the signature to the Block Builder.
6. The Block Builder finalizes the block and submits it to the network.

### Features

This node operates in a **decentralized** manner across the network. Users can set up their own nodes and are rewarded according to the protocol. Each Block Builder node operates independently and does not need to synchronize with other Block Builder nodes

### What Users Can Do

- **Send Transaction Requests**: Users can send transaction data to the Block Builder when making transactions.
- **Review and Approve Transactions**: Users can check the proposed block containing their transactions and approve it by signing.
- **Track Transactions**: Users can check which block includes their transaction.
