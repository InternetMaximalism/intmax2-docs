---
id: payment-lifecycle
title: Payment Lifecycle
slug: /payment-lifecycle
sidebar_position: 3
description: Overview of the INTMAX payment lifecycle, detailing how deposits, transfers, and withdrawals are handled securely and privately.
---

# Payment Lifecycle

The INTMAX rollup architecture employs a fully decentralized and client-driven approach to state transitions. All operations—deposits, transfers, and withdrawals—are mediated through cryptographic commitments and zero-knowledge proofs, with minimal reliance on on-chain computation or state.

### Deposit: L1 → L2 Entry

Deposits are the only operation where on-chain data includes value and recipient identity in plaintext. This is necessary to bootstrap user balances on Layer 2.

#### Mechanism

- A user invokes the rollup contract’s `deposit()` method with:
  - Token value (ETH or ERC-20)
  - Target L2 address (a BLS public key)
- The contract appends this action as a **deposit block** to its internal log.
- This entry serves as the root of provenance for all subsequent L2 balance computations.

**Key property**: No global state mapping is updated. The contract simply logs the event; balance tracking is fully offloaded to the client layer.

### Transfer: L2 → L2 Private Payments

Transfers are the primary means of moving value between users on L2. The protocol enforces strict separation of concerns: **aggregators coordinate**, but only **users compute and verify**.

#### Phase 1: Merkle Commitments

1. **Hash submission**: Each user computes a salted hash of their transaction batch and sends only this hash to a chosen aggregator.
2. **Merkle construction**: The aggregator builds a Merkle tree over all received hashes and sends each user their inclusion proof.
3. **Signature**: Each user signs the Merkle root with their BLS key, asserting inclusion and authorizing the batch.
4. **Aggregation**: Aggregator collects all signatures and computes a BLS aggregate signature.

#### Phase 2: Contract Interaction

The aggregator submits a **transfer block** to the INTMAX contract containing:

- Merkle root (commitment to the batch of transaction hashes)
- BLS aggregated signature
- List of public keys of signers

The contract validates the aggregate signature and appends the block to the rollup’s history.

#### Phase 3: Peer-to-Peer Proof Propagation

- Each sender transmits:
  - The Merkle inclusion proof
  - The original transaction batch
  - A balance proof (constructed from prior receipts and ZKPs)
- Each recipient verifies the ZK proof and updates their own client-side state.

**Notably**: the contract does not learn who sent what to whom, nor any amounts—this data is never published on-chain.

### Withdrawal: L2 → L1 Exit

Withdrawals are executed when a user wants to materialize their balance from L2 onto Ethereum.

#### Mechanism

1. The user computes a **ZK-proof** that:
   - At a specific history root `r`
   - Their public key received at least value `v`
2. They submit:
   - History root `r`
   - Claimed value `v`
   - ZK-proof of valid receipt
3. The contract:
   - Verifies that `r` is a valid block root in its state history
   - Validates the proof
   - Subtracts any previous withdrawals
   - Transfers the remaining claimable balance to the L1 address

The rollup contract maintains a cumulative withdrawal map to prevent double-spending, even under partial knowledge assumptions.

---

### Summary of Data Flow

| Step       | Actor                 | Data Shared                | Publicly Verifiable?  |
| ---------- | --------------------- | -------------------------- | --------------------- |
| Deposit    | User → Contract       | (Recipient L2 key, Amount) | ✅                    |
| Transfer   | User ↔ Aggregator    | Transaction hash only      | ❌ (fully private)    |
| Transfer   | Aggregator → Contract | Merkle root + signature    | ✅                    |
| Transfer   | Sender → Recipient    | ZK proof + Merkle path     | ❌ (off-chain only)   |
| Withdrawal | User → Contract       | ZK proof of balance        | ✅ (verifiable proof) |
