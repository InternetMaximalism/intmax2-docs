---
sidebar_position: 2
description: INTMAX enables high-frequency, low-cost transactions with native privacy and scalability. This makes it ideal for use cases where traditional Ethereum transactions are economically infeasible—such as micropayments, in-app rewards, and automated cashback systems.
---

# Microtransactions & Cashback Systems

INTMAX enables **high-frequency, low-cost transactions** with native privacy and scalability. This makes it ideal for use cases where traditional Ethereum transactions are economically infeasible—such as micropayments, in-app rewards, and automated cashback systems.

## What You Can Build

- **Pay-per-view content**
- **Streaming payments (e.g., pay-per-second)**
- **In-app purchases under $0.01**
- **Loyalty programs and reward points**
- **Automatic cashback for users or agents**
- **AI agent-based economic flows**

## Why INTMAX?

Traditional L1 and even most rollups struggle with microtransactions due to:

- High fixed gas costs per transaction
- Privacy concerns (every payment is public)
- Centralized sequencer bottlenecks
- Need to maintain shared state or smart contracts

INTMAX avoids these with a **stateless, proof-based protocol** that minimizes on-chain data (\~5 bytes onchain ), while shifting computation and storage to the user level.

## Architecture Overview

1. **User Deposits** to the rollup with a one-time setup.
2. **Microtransactions** happen off-chain via hashed commitments and private ZK proofs shared peer-to-peer.
3. **Aggregators** bundle transaction roots with signatures; on-chain posting cost is amortized over thousands of transactions.
4. **Cashback** or rewards can be issued off-chain or on a periodic basis using batched transactions.

No on-chain cost is incurred per individual microtransaction, enabling economic viability even at **sub-cent levels**.

## Developer Advantages

| Feature                 | Advantage                                        |
| ----------------------- | ------------------------------------------------ |
| Near-zero on-chain cost | Send thousands of txs with no cost increase      |
| Privacy-native          | Users can’t be linked across payments            |
| No sequencer bottleneck | Any app or user can act as aggregator            |
| Flexible token support  | Supports ETH, stablecoins, and reward points     |
| Fully client-side state | No backend or smart contract management required |

## Sample Applications

| Project Name          | Use Case                                      |
| --------------------- | --------------------------------------------- |
| Pay-per-Click Network | Publishers earn a few cents per valid click   |
| Streaming Payments    | Users pay per second for audio/video access   |
| Cashback Wallet       | Earn % back on every INTMAX-based transaction |
| AI Agent Payments     | Agents auto-transact in small denominations   |

## Integration Path

Use the [intmax-client-sdk](../intmax-client-sdk) to:

- Construct small-denomination transactions and batch rewards
- Automate Merkle proof generation and propagation
- Handle periodic cashback issuance through off-chain logic

For cashback, design your aggregator or platform to include cashback transactions in user batches or as separate off-chain incentives.

## Key Takeaway

INTMAX unlocks **sub-cent economic design** for dApps—no longer bottlenecked by gas or privacy. If your users act frequently, pay small amounts, or earn tiny rewards, this is the infrastructure you’ve been waiting for.
