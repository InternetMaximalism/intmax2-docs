---
sidebar_position: 2
description: The Intmax network is a Layer-2 solution built on top of the Ethereum network. Liquidity remains on Ethereum, while block data storage utilizes the Scroll network—a type of ZK-rollup—allowing Intmax to benefit from lower costs and enhanced security. Smart contracts deployed on these two networks form the foundation of the Intmax network.
---

# Smart Contracts

### Abstract

The Intmax network is a Layer-2 solution built on top of the Ethereum network. Liquidity remains on Ethereum, while block data storage utilizes the Scroll network—a type of ZK-rollup—allowing Intmax to benefit from lower costs and enhanced security. Smart contracts deployed on these two networks form the foundation of the Intmax network.

This document explains the roles of smart contracts associated with Intmax.

### Rollup

A smart contract responsible for handling operations related to Intmax blocks. It is deployed on Scroll.

- **Block Posting:** Allows posting blocks.
- **Deposit Processing:** Integrates deposits from the liquidity contract into the Rollup state.
- **Penalty Fee Management:** Enables withdrawal and adjustment of penalty fees associated with rate limiting.

### Liquidity

This contract manages asset transfers between the Ethereum and Intmax networks. It handles user deposit and withdrawal operations and maintains asset states. It is deployed on Ethereum.

- **Asset Deposits** Users can deposit tokens (native tokens, ERC20, ERC721, ERC1155) from Ethereum into Intmax.
- **AML Check** This contract performs AML checks upon deposits and rejects deposits from addresses that do not meet compliance standards.
- **Asset Withdrawals** Sends tokens withdrawn from Intmax to users on Ethereum.
- **Deposit Management** Deposited tokens are stored in a queue. A Deposit Relayer communicates this information collectively to the Intmax network.
- **Contribution Recording** Records addresses that execute transactions (such as withdrawals) necessary for maintaining the network.

### Withdrawal

This contract manages withdrawal processes from the Intmax network to Ethereum, handles the verification of withdrawal proofs, and manages token indices eligible for direct withdrawals. It is deployed on Scroll.

- **Withdrawal Request Submission** Allows submission and verification of withdrawal proofs from the Intmax network.
- **Token Management for Direct Withdrawals** Manages the token indices that are eligible for direct withdrawal processing.

### Claim

This contract is used to claim rewards from privacy mining. It distributes ITX tokens on Ethereum following the same procedures as the Withdrawal contract. It is deployed on Scroll.

- **Claim Proof Submission** Submit claim proof from Intmax network.
- **Token Management for Direct Withdrawals** Manages the tokens eligible for direct withdrawals.

### Block Builder Registry

This contract maintains a registry of active block builders by emitting heartbeat signals with associated URLs. It allows block builders to publicly indicate their operational status. It is deployed on Scroll.

- **Heartbeat Emission** Enables block builders to periodically signal that they are active.

### L1/L2 Contribution

This contract manages contributions made by users and tracks their respective allocations and weights. It is used to calculate and distribute rewards based on user contributions. It is deployed on Ethereum and Scroll.

- **Contribution Recording** Records contributions made by users with associated tags for specific periods.
- **Period Management** Manages the periodic increment and resets for recording contributions.
- **Weight Management** Assigns and manages weights for various tags in each period.

### Permitter Contract

This contract uses a service called Predicate to verify AML checks and to determine whether the transaction originates from valid mining activities. It is invoked by the Liquidity contract whenever a user deposits funds. Deposits from addresses that do not comply with predetermined policies will be rejected. It is deployed on Ethereum.

- **Policy Verification** Deposits from addresses that do not comply with predetermined policies will not be permitted. This involves two types of checks: AML verification and validation of legitimate mining activity.
