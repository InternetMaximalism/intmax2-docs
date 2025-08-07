---
id: smart-contracts
title: Smart Contracts
slug: /smart-contracts
sidebar_position: 13
description: This document describes the contracts used in the INTMAX protocol.
---

# Smart Contracts

This document describes the contracts used in the INTMAX protocol.

## Mainnet

Updated on June 21, 2025

### Ethereum Mainnet

**Liquidity**

This contract receives deposits to the INTMAX network and handles token withdrawals from the INTMAX network.

[0xF65e73aAc9182e353600a916a6c7681F810f79C3](https://etherscan.io/address/0xF65e73aAc9182e353600a916a6c7681F810f79C3)

### Scroll Mainnet

**Rollup**

This contract records blocks generated in the INTMAX network and finalizes transactions.

[0x1c88459D014e571c332BF9199aD2D35C93219A2e](https://scrollscan.com/address/0x1c88459D014e571c332BF9199aD2D35C93219A2e)

**Withdrawal**

This contract manages withdrawal processes from the INTMAX network to Ethereum, handles the verification of withdrawal proofs, and manages token indices eligible for direct withdrawals.

[0x86B06D2604D9A6f9760E8f691F86d5B2a7C9c449](https://scrollscan.com/address/0x86B06D2604D9A6f9760E8f691F86d5B2a7C9c449)

**Claim**

This contract is used to claim rewards from privacy mining. It distributes ITX tokens on Ethereum following the same procedures as the Withdrawal contract.

[0x22ac649b3229eC099C32D790e9e46FbA2CE6C9A5](https://scrollscan.com/address/0x22ac649b3229eC099C32D790e9e46FbA2CE6C9A5)

**Block Builder Registry**

This contract maintains a registry of active Block Builders by emitting heartbeat signals with associated URLs. It allows Block Builders to publicly indicate their operational status.

[0x79dA6F756D26c50bA74bF9634bd3543645058b5B](https://scrollscan.com/address/0x79dA6F756D26c50bA74bF9634bd3543645058b5B)

## Testnet β

Updated on May 24, 2025

### Ethereum Sepolia Network

**Liquidity**

This contract receives deposits to the INTMAX network and handles token withdrawals from the INTMAX network.

[0x81f3843aF1FBaB046B771f0d440C04EBB2b7513F](https://sepolia.etherscan.io/address/0x81f3843aF1FBaB046B771f0d440C04EBB2b7513F)

### Scroll Sepolia Network

**Rollup**

This contract records blocks generated in the INTMAX network and finalizes transactions.

[0xcEC03800074d0ac0854bF1f34153cc4c8bAEeB1E](https://sepolia.scrollscan.com/address/0xcEC03800074d0ac0854bF1f34153cc4c8bAEeB1E)

**Withdrawal**

This contract manages withdrawal processes from the INTMAX network to Ethereum, handles the verification of withdrawal proofs, and manages token indices eligible for direct withdrawals.

[0x914aBB5c7ea6352B618eb5FF61F42b96AD0325e7](https://sepolia.scrollscan.com/address/0x914aBB5c7ea6352B618eb5FF61F42b96AD0325e7)

**Claim**

This contract is used to claim rewards from privacy mining. It distributes ITX tokens on Ethereum following the same procedures as the Withdrawal contract.

[0xceAa521Cb45d265831cBaF39E00875B550861A68](https://sepolia.scrollscan.com/address/0xceAa521Cb45d265831cBaF39E00875B550861A68)

**Block Builder Registry**

This contract maintains a registry of active Block Builders by emitting heartbeat signals with associated URLs. It allows Block Builders to publicly indicate their operational status.

[0x93a41F47ed161AB2bc58801F07055f2f05dfc74E](https://sepolia.scrollscan.com/address/0x93a41F47ed161AB2bc58801F07055f2f05dfc74E)
