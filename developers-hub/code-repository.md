---
id: code-repository
title: Code Repository
slug: /code-repository
sidebar_position: 11
description: Explore the official GitHub repositories for the INTMAX Network and related projects.
---

# Code Repository

Welcome to the official GitHub repositories of the INTMAX Network. Below is a list of core components, tools, and cryptographic libraries maintained by the INTMAX team and community. These repositories provide everything from smart contracts and SDKs to API servers and zero-knowledge proof systems.

## Core INTMAX Network Repositories

- [`intmax2`](https://github.com/InternetMaximalism/intmax2): The core logic and infrastructure of the INTMAX Layer 2 network.
- [`intmax2-function`](https://github.com/InternetMaximalism/intmax2-function): Serverless backend functions to support INTMAX operations (e.g. claims, rewards).
- [`intmax2-withdrawal-aggregator`](https://github.com/InternetMaximalism/intmax2-withdrawal-aggregator): Aggregator service for withdrawal requests back to Ethereum.
- [`intmax2-claim-aggregator`](https://github.com/InternetMaximalism/intmax2-claim-aggregator): Service to aggregate and verify claim requests from users.
- [`intmax2-explorer-api`](https://github.com/InternetMaximalism/intmax2-explorer-api): API backend used by the INTMAX Block Explorer for fetching transaction and block data.

## Smart Contracts

- [`intmax2-contract`](https://github.com/InternetMaximalism/intmax2-contract): Main set of L1 smart contracts for the INTMAX zk-Rollup bridge and network management.
- [`intmax2-reward-contract`](https://github.com/InternetMaximalism/intmax2-reward-contract): Contracts responsible for privacy mining reward distribution on L1.

## Zero-Knowledge Proof (ZKP) Libraries

- [`intmax2-zkp`](https://github.com/InternetMaximalism/intmax2-zkp): Custom ZK circuits and logic used within the INTMAX network.
- [`plonky2-u32`](https://github.com/InternetMaximalism/plonky2-u32): Integer-based extension for Plonky2 to support 32-bit operations.
- [`plonky2_bn254`](https://github.com/InternetMaximalism/plonky2_bn254): Adaptation of Plonky2 using the BN254 elliptic curve, compatible with Ethereum.
- [`plonky2_keccak`](https://github.com/InternetMaximalism/plonky2_keccak): ZK-friendly implementation of the Keccak (SHA-3) hash function.
- [`polygon-plonky2`](https://github.com/InternetMaximalism/polygon-plonky2): Fork of Polygon’s Plonky2 library with INTMAX-specific modifications.

## SDKs

- [`intmax2-client-sdk`](https://github.com/InternetMaximalism/intmax2-client-sdk): TypeScript SDK for interacting with the INTMAX network (used by dApps).
- [`intmax2-e2e`](https://github.com/InternetMaximalism/intmax2-e2e): End-to-end testing for the INTMAX network using TypeScript and Rust.
- [`intmax-walletsdk`](https://github.com/InternetMaximalism/intmax-walletsdk): SDK for wallet providers to integrate with INTMAX using the WalletSDK protocol.

## Documents

- [`intmax2-docs`](https://github.com/InternetMaximalism/intmax2-docs): Official documentation for the INTMAX Network, including developer guides and API references.

---

## Contributing

We welcome contributions! If you’re interested in building on top of INTMAX or contributing directly to the protocol, check the README and [CONTRIBUTING.md](https://github.com/InternetMaximalism/intmax2/CONTRIBUTING.md) files in each repository.

For questions or support, join our [Discord Community](https://discord.gg/TGMctchPR6) or reach out via the [Support Portal](https://intmaxhelp.zendesk.com/hc/en-gb/requests/new).
