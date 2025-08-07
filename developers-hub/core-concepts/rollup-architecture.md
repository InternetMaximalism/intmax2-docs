---
sidebar_position: 1
description: The INTMAX rollup departs fundamentally from traditional zk-rollup designs by minimizing on-chain state commitments and computation.
---

# Rollup Architecture

The INTMAX rollup departs fundamentally from traditional zk-rollup designs by minimizing on-chain state commitments and computation. It is a **stateless**, **aggregator-permissionless**, and **client-driven** architecture that optimizes for privacy and scalability, particularly in the context of payment use cases.

### System Design

The core flow of the protocol is as follows:

#### L1 → L2 Deposit

Users initiate participation by depositing assets (e.g., ETH, ERC-20 tokens) into the rollup contract. A deposit block is committed on-chain, assigning L2 ownership to the specified public key.

#### Transaction Construction (Off-chain)

Users construct their own transaction batches locally. These batches consist of arbitrary mappings from recipients to token amounts and are **not revealed to aggregators**. Each transaction batch is salted and hashed. Only these hashes are submitted to the aggregator, preserving privacy

#### Merkle Aggregation

The aggregator constructs a Merkle tree of the hashed transaction batches. For each sender, a Merkle inclusion proof is returned. The sender then signs the root of the Merkle tree with their BLS key, binding themselves to inclusion.

#### Commitment Publication

The aggregator aggregates all BLS signatures and submits a transfer block to the rollup contract. The block contains:

- The Merkle root
- The aggregate signature
- The list of participant public keys\
  The contract verifies the BLS aggregate signature and records the Merkle root as a commitment. Notably, the contract **does not know the contents** of the transactions.

#### ZK Proof Propagation (P2P)

After the transfer block is published, users are responsible for proving the receipt of funds. Each sender provides recipients with:

- A transaction validity ZK proof
- The relevant Merkle path
- Their local balance proof

_Recipients verify these and update their state accordingly. All balance state is maintained client-side._

### Properties

Aggregators are not required to maintain or understand the global state. They simply collect commitments and signatures. This enables:

- Permissionless block production
- Horizontal scalability (multiple aggregators can act in parallel)

#### Minimal On-Chain Data

Each transfer block adds only:

- 1 Merkle root (32 bytes)
- 1 aggregated signature (48 bytes)
- n public keys (96 \* n bytes)

This leads to an **asymptotically sublinear on-chain data footprint**, regardless of the number of recipients.

#### Privacy

- No transaction data appears on-chain.
- Aggregators never see actual transaction contents.
- Only the recipient learns about a transfer.
- Balance proofs are ZK and do not reveal history.

### Withdrawals

Withdrawals from L2 to L1 require the user to submit a ZK proof of balance at a known commitment root. This root must exist in the contract’s on-chain history. The proof is verified on-chain, and funds are released. The contract tracks cumulative withdrawals to prevent double spends.

### Implications

INTMAX achieves **asynchronous, decentralized block production** without requiring a global shared state or sequencing. The model is optimal for payment-heavy workloads where privacy and scalability are primary concerns. It reflects a design philosophy more similar to **Plasma** and **UTXO sharding**, but with modern zk-rollup guarantees and no trusted data availability assumptions.
