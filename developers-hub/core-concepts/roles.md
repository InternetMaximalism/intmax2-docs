---
sidebar_position: 2
description: INTMAX introduces a novel role architecture within rollup systems that decentralizes responsibilities typically associated with state management and block production.
---

# Roles

INTMAX introduces a novel role architecture within rollup systems that decentralizes responsibilities typically associated with state management and block production. The protocol separates concerns in a way that enables scalability, parallelism, and censorship resistance—while minimizing on-chain trust and coordination overhead.

### Users (L2 Participants)

Users are first-class agents who fully own and maintain their own state. They are responsible for:

- Constructing their own transaction batches (recipient → amount)
- Generating Merkle hash preimages and signing commitment roots
- Receiving and storing ZK proofs for incoming transactions
- Constructing and submitting balance proofs for withdrawals

Importantly, users do **not** rely on any central coordinator to update or verify their balance. All state transitions are **client-executed**, with on-chain interaction limited to deposits, signature aggregation, and withdrawals.

This effectively reverts the account model into a **self-contained state machine**, where the global state is not globally available but instead reconstructed locally through authenticated data and zero-knowledge proofs.

### Aggregators

Aggregators are **stateless data bundlers**. Their role is sharply restricted to:

- Receiving transaction hash commitments from users
- Constructing a Merkle tree of these commitments
- Returning inclusion proofs to users
- Collecting user signatures over the Merkle root
- Posting the Merkle root + aggregated signature + public key list to the rollup contract

They **do not**:

- See any transaction content
- Execute state transitions
- Sequence or reorder transactions
- Know balances or maintain state history

This makes the aggregator role **completely trustless and permissionless**. Anyone can become an aggregator; the only constraint is that their Merkle root must be signed by the included users. Aggregators are thus more akin to **message relayers** than traditional block producers.

### Recipients

A recipient is any actor (user or smart contract) that receives a transaction. Their responsibilities include:

- Verifying transaction validity ZK proofs
- Updating their local balance proofs with each new incoming transaction
- Optionally merging state with other users for recursive balance proofs

Recipients act passively but require the correct off-chain data (ZK proof + Merkle path) from the sender to validate inclusion. This interaction is purely peer-to-peer and **does not involve the rollup contract**.

### Relayer Contracts (Optional)

To mitigate timing and replay attacks in adversarial conditions, aggregators can delegate posting of transfer blocks to **L1 relayer contracts**, which enforce:

- Deadlines for block publication (prevents delayed inclusion)
- Monotonicity of block timestamps (prevents replay attacks)
- Signature verification and sender authorization

These contracts act as neutral **liveness and ordering enforcers**, especially useful in highly adversarial or latency-sensitive environments. However, they are not strictly required for correctness.

### Design Implication

This separation of roles leads to a system where:

- **Users** hold private state
- **Aggregators** relay commitment metadata
- **Smart contracts** verify aggregate proofs, but not transaction logic
- **No actor** has unilateral authority to halt or censor the rollup

In contrast to monolithic rollups where the sequencer is a trusted actor or protocol bottleneck, INTMAX enables **parallel, decentralized, and private computation** across a large set of loosely coordinated actors.
