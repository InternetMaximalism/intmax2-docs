---
sidebar_position: 1
description: INTMAX's core protocol logic has been mechanically verified using the Lean theorem prover, under the guidance of the Nethermind Formal Verification team. The verification covers
---

# Architecture and Principles

INTMAX is a Layer-2 ZK Rollup designed for strong security and privacy. Its core logic has been formally verified using the Lean theorem prover with support from Nethermind. This ensures the correctness of balance updates, withdrawal logic, and proof validity.

## Formal Verification

INTMAX's core protocol logic has been **mechanically verified** using the Lean theorem prover, under the guidance of the Nethermind Formal Verification team. The verification covers:

- Correctness of the balance computation model
- Soundness of the withdrawal logic (no double spend)
- Validity of Merkle-based inclusion proofs
- BLS signature aggregation consistency

**Implication**: A successful withdrawal implies a valid proof, and an invalid proof will always be rejected—regardless of aggregator or L1 adversarial behavior.

## Replay and Delay Protection (Optional but Recommended)

While the core protocol assumes minimal trust and coordination, adversarial aggregators may attempt:

- **Replay attacks**: Re-submitting previously accepted transfer blocks
- **Delay attacks**: Withholding valid blocks to stall inclusion

To mitigate these attacks without sacrificing decentralization, the protocol allows **optional relayer contracts** to enforce:

- **Monotonic timestamps** on transfer blocks
- **Finality deadlines**, requiring a block to be published within a bounded time window
- **Whitelisting**, where only known aggregator keys may submit blocks during a session

This functionality is out-of-protocol and permissionless; users can opt in by coordinating through social or market incentives.

## Privacy Guarantees

INTMAX is designed to maximize privacy **without reliance on mixers, encrypted mempools, or shielded pools**.

## Core Properties

- **No transaction data is ever posted on-chain**: No sender, recipient, or amount is revealed.
- **Aggregators do not know transaction contents**: They receive only salted hashes.
- **Only recipients gain access to transaction details**, via direct peer-to-peer message from the sender.
- **Balance proofs and transfers are locally maintained**, and only revealed to the contract at the point of withdrawal via ZK proofs.

This yields a privacy model in which:

- Observers (including L1 validators) learn only who deposited and withdrew, but **nothing in between**.
- Aggregators cannot front-run or censor based on transaction content—they are blind to it.
- Users may selectively disclose their balance history off-chain, but there is **no protocol-level linkage** unless voluntarily revealed.

## Summary Table

| Attack Vector        | Defense Mechanism                                    | On by Default? |
| -------------------- | ---------------------------------------------------- | -------------- |
| State corruption     | Formal verification of balance logic                 | ✅             |
| Transaction replay   | Optional relayer with monotonic checks               | ⚠️ Optional    |
| Inclusion censorship | Permissionless aggregation (no leader required)      | ✅             |
| Transaction leakage  | Off-chain transaction construction and proof sharing | ✅             |
| Aggregator leakage   | Hash-based commitment, no plaintext access           | ✅             |

🔒 **For more details:**\
For a comprehensive overview of Intmax's security testing, audits, and privacy architecture, please refer to the following report:

[View the Security and Testing Report](./security-and-testing-report.md)
