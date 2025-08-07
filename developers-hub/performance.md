---
id: performance
title: Performance
slug: /performance
sidebar_position: 5
description: INTMAX achieves high throughput and low on-chain cost through stateless, proof-based batching."
---

# Performance

INTMAX is designed to asymptotically minimize on-chain data requirements while supporting high-throughput off-chain activity. Its performance characteristics stem directly from its stateless, proof-based design, where **only aggregate commitments** are stored on-chain, and all computation and transaction details remain off-chain and user-controlled.

---

### On-Chain Data Efficiency

Each transaction batch requires approximately:

- **5 bytes per sender**, comprising:
  - 32 bytes: Merkle root commitment
  - 48 bytes: Aggregated BLS signature
  - \~96 bytes × _n_: List of BLS public keys (1 per sender)

Since transaction content is excluded from the chain, **block size scales with the number of participating senders**, not the number of transactions or recipients. A single sender can batch thousands of payments with no additional on-chain cost.

**Key asymmetry**:

> On-chain size ∝ O(number of _senders_)\
> Off-chain cost ∝ O(number of _transactions_)

---

### Current Throughput (Ethereum Today)

Assuming:

- 0.375 MB Ethereum block size (post-Calldata gas cost reduction)
- Average sender overhead ≈ 5 bytes

We achieve a theoretical throughput of:

- **\~7,500 senders per second**
- **Unlimited recipients per sender** (handled off-chain)

This already exceeds the throughput of existing rollups under realistic constraints, especially for payment use cases.

---

### Future Scaling (EIP-4844 and Beyond)

With EIP-4844 (Proto-Danksharding), Ethereum aims to increase data bandwidth to:

- **\~16 MB per block** (via blob space)

Under these conditions, INTMAX could support:

- **320,000+ senders per second**
- Again, with no increase in on-chain cost per recipient or transaction volume

This positions INTMAX as a **future-proof scalability layer**, where increasing L1 bandwidth immediately benefits L2 throughput—without redesign.

---

### Comparative Efficiency

| Metric                        | INTMAX                               | Traditional ZK-Rollups       |
| ----------------------------- | ------------------------------------ | ---------------------------- |
| On-chain data per transaction | \~5 bytes                            | \~200–300 bytes              |
| Transaction batching model    | Sender-centric, unlimited recipients | Flat per-transaction cost    |
| Sequencer bottleneck          | None (permissionless)                | Centralized or single leader |
| Withdraw proof size           | Constant (ZK-SNARK)                  | Similar                      |
