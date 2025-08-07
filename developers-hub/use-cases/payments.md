---
sidebar_position: 1
description: INTMAX enables developers to build high-throughput, privacy-preserving payment systems without the typical tradeoffs of rollups or L1 constraints. Whether you're building a wallet, a merchant gateway, or peer-to-peer payment apps, INTMAX offers a unique stateless architecture ideal for scaling financial interactions.
---

# Payments

## Scalable, Private Payments

INTMAX enables developers to build **high-throughput, privacy-preserving payment systems** without the typical tradeoffs of rollups or L1 constraints. Whether you're building a wallet, a merchant gateway, or peer-to-peer payment apps, INTMAX offers a unique stateless architecture ideal for scaling financial interactions.

## What You Can Build

- **Retail & E-commerce checkout**
- **Crypto-native payroll**
- **Micropayments for content or streaming**
- **Cross-border settlement rails**
- **Wallet-to-wallet transfers with full unlinkability**

## How It Works

### 1. User Deposit (L1 → L2)

- Users deposit ETH or tokens to the rollup contract, specifying their L2 public key.

### 2. Off-chain Payment

- Users generate a transaction batch (e.g. “send 5 USDC to Bob”) and share a salted hash with an aggregator.
- Aggregators build Merkle trees and submit signed roots to the contract.
- Transaction data is sent directly and privately to the recipient, along with a ZK-proof of validity.

### 3. Withdrawal (L2 → L1)

- Users can exit at any time by proving—via ZK—that they received a certain balance.

## Developer Benefits

| Feature               | Benefit                                                           |
| --------------------- | ----------------------------------------------------------------- |
| Stateless Protocol    | No need to sync or manage global rollup state                     |
| Privacy-by-default    | No on-chain sender/recipient/amount data                          |
| Low On-chain Overhead | \~5 bytes onchain; unlimited recipients per batch                 |
| Easy Aggregation      | Any app or user can act as an aggregator; no sequencer dependency |
| Future-Proof Scaling  | Compatible with EIP-4844 and other L1 throughput upgrades         |

## Integration Tips

- Use the INTMAX SDK to:
  - Generate deposit transactions
  - Construct and hash payment batches
  - Interact with aggregators
  - Create/verify zero-knowledge proofs
- Use relayer contracts for guaranteed timing and replay protection if your app handles batching.

## Example Apps

| Project Idea           | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| Venmo for Crypto       | Wallet-to-wallet instant transfers with no on-chain trace  |
| Subscription Manager   | Periodic payments with local state and ZK receipt tracking |
| Local Merchant Toolkit | POS app using INTMAX for gasless, instant retail checkout  |

## Key Takeaway

INTMAX lets you build **Ethereum-native payments** that feel more like Web2: instant, private, cheap—and user-controlled. No gas fatigue, no address leaks, no sequencer trust.
