---
id: developers-hub-overview
title: Developers Hub Overview
slug: /
sidebar_position: 1
description: Welcome to the INTMAX Developers Hub - a comprehensive resource for developers building on the INTMAX Network, a privacy-focused Layer 2 solution built on zk-Rollup technology.
---

# Developers Hub Overview

Welcome to the INTMAX Network Developers Hub. These guides are designed to help developers build, integrate, and deploy applications on the INTMAX Network effectively. Whether you're developing dApps, building wallets, or setting up infrastructure, you'll find comprehensive resources and step-by-step instructions here.

## Quick Start

### Getting Started

- **[Core Concepts](./core-concepts/rollup-architecture.md)** - Understand INTMAX's stateless, privacy-first Layer 2 architecture
- **[Payment Lifecycle](./payment-lifecycle.md)** - Learn the flow of deposits, transfers, and withdrawals with zk proofs
- **[INTMAX Nodes](/developers-hub/intmax-nodes)** - Learn about different node types and their roles in the network

### Development Tools

- **[INTMAX Client SDK](/developers-hub/intmax-client-sdk)** - Built with WebAssembly for high-performance cryptographic operations
- **[INTMAX CLI](./intmax-cli.md)** - Run batch operations with CSV support for up to 63 transfers
- **[INTMAX Wallet SDK](/developers-hub/intmax-wallet-sdk)** - Protocol & SDK for wallet ↔ dApp integration
- **[Code Repository](./code-repository.md)** - Explore official GitHub repositories for INTMAX components

### Integration Paths

- **[For dApp Developers](#for-dapp-developers)** - Start building applications on INTMAX
- **[For Wallet Developers](#for-wallet-developers)** - Integrate INTMAX support into wallets
- **[For Infrastructure Providers](#for-infrastructure-providers)** - Deploy and operate network nodes

## Network Infrastructure

### Core Nodes

- **[Node Reference](./intmax-nodes/node-reference.md)** - Complete guide to all INTMAX node types and deployment
- **[Block Builder](./intmax-nodes/block-builder.md)** - Aggregate transactions into blocks and earn rewards
- **[Validity Prover](./intmax-nodes/validity-prover.md)** - Host Merkle trees and generate zero-knowledge proofs
- **[Withdrawal Server](./intmax-nodes/withdrawal-server.md)** - Process withdrawal requests and sync with Layer 1
- **[Provers](./intmax-nodes/provers.md)** - Generate cryptographic proofs for network validation

### Bridging Infrastructure

- **[Deposit Relayer](./intmax-nodes/deposit-relayer.md)** - Bridge assets from Ethereum to INTMAX
- **[Withdrawal Relayer](./intmax-nodes/withdrawal-relayer.md)** - Synchronize withdrawals on-chain
- **[Withdrawal Aggregator](./intmax-nodes/withdrawal-aggregator.md)** - Bundle L2→L1 withdrawal claims
- **[Claim Aggregator](./intmax-nodes/claim-aggregator.md)** - Bundle and verify mining reward claims

### Supporting Services

- **[Store Vault Server](./intmax-nodes/store-vault-server.md)** - Backup and restore private data
- **[Indexer](./intmax-nodes/indexer.md)** - Provide node discovery and data feeds
- **[Smart Contracts](./intmax-nodes/smart-contracts.md)** - INTMAX's Layer 1 contract suite

## Use Cases & Applications

### Real-World Applications

- **[Payments](./use-cases/payments.md)** - Fast, cost-effective token transfers
- **[Microtransactions & Cashback](./use-cases/microtransactions-and-cashback-systems.md)** - Scalable rewards and incentive systems
- **[Privacy-Preserving Applications](./use-cases/privacy-preserving-applications.md)** - Anonymous applications and services

### Business Opportunities

- **[Block Builder Business Guide](./intmax-block-builder/business-guide.md)** - Operational insights for infrastructure providers
- **[Network Participation](/developers-hub/intmax-block-builder)** - Earn rewards through block validation

## Security & Performance

### Security Features

- **[Security and Privacy](/developers-hub/security-and-privacy)** - Formally verified with Lean theorem prover
- **Zero-Leakage**: No transaction data posted on-chain
- **Resilient Design**: Protected against replay, delay, and censorship attacks

### Performance Metrics

- **[Performance Overview](./performance.md)** - ~7,500 TPS today, 320,000+ TPS with EIP-4844
- **Efficiency**: Only ~5 bytes per sender (vs. 200–300 bytes in other rollups)

## Key Features of INTMAX

- **Privacy by Design**: No transaction data is posted on-chain for maximum privacy
- **Batch Transfers**: Send tokens to up to 63 recipients in a single transaction
- **Stateless Architecture**: Client-driven design with no centralized state storage
- **Decentralized Operation**: No single sequencer; permissionless aggregation
- **EVM Compatibility**: Focused on transfers but compatible where needed
- **Low Fees**: Minimal on-chain data requirements for maximum cost efficiency

## Integration Guides

### For dApp Developers

1. **Start with the [Client SDK](/developers-hub/intmax-client-sdk)** - High-performance WebAssembly-based SDK
2. **Explore [Use Cases](/developers-hub/use-cases)** - Real-world implementation examples
3. **Review Transaction Lifecycle** - Understand create → sign → broadcast flow

### For Wallet Developers

1. **Implement [Wallet SDK](/developers-hub/intmax-wallet-sdk)** - EIP-1193 style communication protocol

### For Infrastructure Providers

1. **Deploy a [Block Builder](/developers-hub/intmax-block-builder)** - Core infrastructure component
2. **Read the [Business Guide](./intmax-block-builder/business-guide.md)** - Operational and economic insights
