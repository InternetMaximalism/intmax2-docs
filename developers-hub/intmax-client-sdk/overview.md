---
sidebar_position: 1
description: The INTMAX Client SDK provides a secure, high-performance interface for interacting with the INTMAX network. Built with WebAssembly for optimized cryptographic processing, the SDK abstracts complex blockchain operations into a developer-friendly API that handles the complete transaction lifecycle—from creation and signing to broadcasting.
---

# Overview

The INTMAX Client SDK provides a secure, high-performance interface for interacting with the INTMAX network. Built with WebAssembly for optimized cryptographic processing, the SDK abstracts complex blockchain operations into a developer-friendly API that handles the complete transaction lifecycle—from creation and signing to broadcasting.
This documentation covers the SDK's core functionality, available functions, and interface specifications to help developers build secure blockchain wallet integrations with confidence.

**Latest Version**: `1.5.2`

**Check out the INTMAX Client SDK on GitHub**

[View on GitHub](https://github.com/InternetMaximalism/intmax2-client-sdk)

**INTMAX Client SDK Examples**

[View Examples on GitHub](https://github.com/InternetMaximalism/intmax2-client-sdk/tree/main/examples)

[View E2E Examples on Github](https://github.com/InternetMaximalism/intmax2-e2e)

**INTMAX Client SDK Integration Guide**

[Open Integration Guide](./integration-guide.md)

## Architecture

This section outlines the core workflows supported by the INTMAX network: **Deposit**, **Transfer**, and **Withdrawal**. Each workflow is carefully designed to ensure security, scalability, and seamless interaction between Ethereum mainnet and INTMAX network.

### Deposit Workflow

Transfers assets from the Ethereum mainnet to INTMAX network. A Predicate contract blocks deposits originating from sanctioned addresses, preventing illicit funds from entering INTMAX network. Deposit data is then relayed to the Scroll network via the Scroll Messenger, preserving maximum security throughout the process.

```bash
Ethereum Mainnet
    │
    ▼
[Deposit Contract (Predicate AML)]
    │
    ▼
[Deposit Analyzer]
    │
    ▼
[L1 Scroll Messenger]
    │
    ▼
[Rollup Contract]
    │   └─ A new deposit block is submitted and verified by the block builder
    ▼
INTMAX Network
```

### Transfer Workflow

A user-signed transaction is packaged as a single transfer and submitted to the Rollup Contract by the Block Builder.

Enables instant, low-cost value transfers within the INTMAX network.

```bash
INTMAX Network
    │
    ▼
[Transfer]
    │
    ▼
[Block Builder]
    │
    ▼
[Rollup Contract]
    │   └─ A new transfer block is submitted and verified by the block builder
    ▼
INTMAX Network
```

### Withdrawal Workflow

Returns assets from INTMAX network to Ethereum mainnet without compromising security.
Withdrawal requests are batched by the Withdrawal Aggregator and proven on L2. The proof is sent through the L2 Scroll Messenger; the Withdrawal Messenger Relayer then submits it on Ethereum. For ERC-20 and other non-ETH tokens, the Liquidity Contract executes an additional claim step before releasing funds, ensuring smooth cross-chain exits with minimal gas overhead.

```bash
INTMAX Network
    │
    ▼
[Withdrawal]
    │
    ▼
[Withdrawal Aggregator]
    │
    ▼
[L2 Scroll Messenger]
    │
    ▼
[Withdrawal Messenger Relayer]
    │
    ▼
[Liquidity Contract]
    │   └─ For non-ETH tokens, an additional claim process is required
    ▼
Ethereum Mainnet
```

## Basic Concepts

### Account System

INTMAX uses a unique address format that differs from Ethereum.

- **Address derivation**

  An INTMAX address is deterministically derived from a given Ethereum address, but the resulting value differs because INTMAX uses its own encoding scheme.

- **Parameter usage**

  | **Operation**                         | **Address to supply** |
  | ------------------------------------- | --------------------- |
  | Deposit                               | INTMAX address        |
  | On-chain transaction (INTMAX network) | INTMAX address        |
  | Withdraw                              | Ethereum address      |

- **Environment scope**

  The derivation is environment-specific: the INTMAX address produced on Mainnet is different from the one produced on the network, even when starting from the same Ethereum address. Always double-check which network you are targeting before submitting transactions.

  **Mainnet**: A 95-character string starting with **i** (lowercase)
  - Example: `i9bX5qzARYR7geR35g4K9972DB8fcWqPjNNgQnoGFViZaTLaSiKUTEd7geR35g4K9972DB8fcWqPjNNgQnoGFViZPctJYmE`

  **Testnet**: A 95-character string starting with **T** (uppercase)
  - Example: `T6ubiG36LmNce6uzcJU3h5JR5FWa72jBBLUGmEPx5VXcFtvXnBB3bqice6uzcJU3h5JR5FWa72jBBLUGmEPx5VXcB3prnCZ`

  ️️
  **⚠️ Important:** Be careful not to mix them up. Always verify which type of address is required for the operation you're performing, and ensure you are using the correct environment (Mainnet or Testnet) when deriving and using your INTMAX address.

### Environment

INTMAX operates on two separate environments: **Mainnet** and **Testnet**.
Even if derived from the same Ethereum address, an INTMAX address will be different between environments.
Specify the environment explicitly when initializing the SDK.

```ts
IntMaxClient.init({ environment: "mainnet" });
IntMaxClient.init({ environment: "testnet" });
```

### Privacy Model

The INTMAX privacy model ensures that **only the wallet owner with the private key can view their balance and transaction history**.

- Unlike public blockchains, third parties cannot directly check an address's balance or history.
- Transfer data uses `salt` and `nullifier` values to hide recipient addresses and prevent linking transactions to each other.

### Batch Size Limits

The SDK enforces batch size limits for optimal performance:

- **Transaction broadcasting**: Maximum 63 transactions per `broadcastTransaction` call
- **Data fetching**: Maximum 64 items per internal API request. The SDK automatically handles pagination for high-level APIs like `fetchDeposits()`, `fetchTransfers()`, and `fetchTransactions()`.

For more details, see the [API Reference](./api-reference.md#batch-size-limits).

## Tips

### How to Run a Local Balance Prover

You can set up a local Balance Prover instance and send requests to it.

#### 1. Clone the Repository

Clone the `intmax2` repository (branch `main`) from GitHub to your local environment.

```bash
git clone git@github.com:InternetMaximalism/intmax2.git -b main
```

#### 2. Navigate to the Balance Prover Directory

Move into the `balance-prover` directory within the cloned repository.

```bash
cd intmax2/balance-prover
```

#### 3. Prepare Environment Configuration

Create an environment configuration file `.env` based on the provided `.example.env` template.

```bash
cp -n .example.env .env
```

#### 4. Start the Balance Prover

Run the Balance Prover in release mode (`-r`) using Cargo.

```bash
cargo run -r
```

#### 5. Change the SDK Config

Here's how to update the configuration for Browser and NodeJS, respectively.

**5-a. Browser**

To use the private ZKP server hosted at `http://localhost:9001`, you can use the following code:

```tsx
import { IntMaxClient } from "intmax2-client-sdk";

const intMaxClient = IntMaxClient.init({
  environment: "mainnet",
  urls: {
    balance_prover_url: "http://localhost:9001",
    use_private_zkp_server: false,
  },
});
```

Set `use_private_zkp_server` to `false` when running the balance prover locally.

**5-b. NodeJS**

To use the private ZKP server hosted at `http://localhost:9001`, you can use the following code:

```tsx
const intMaxClient = new IntMaxNodeClient({
  environment: "mainnet",
  eth_private_key: process.env.ETH_PRIVATE_KEY,
  l1_rpc_url: process.env.L1_RPC_URL,
  urls: {
    balance_prover_url: "http://localhost:9001",
    use_private_zkp_server: false,
  },
});
```

Set `use_private_zkp_server` to `false` when running the balance prover locally.

## Want to contribute or report an issue?

We welcome contributions and feedback!

Please feel free to open an [issue](https://github.com/InternetMaximalism/intmax2-client-sdk/issues) or submit a [pull request](https://github.com/InternetMaximalism/intmax2-client-sdk/pulls) on GitHub.

Your support helps improve the INTMAX ecosystem.

## References

You’ll find links to the Rust code and contract documentation below—please use them as reference material.

### Smart Contracts

Documentation for deployed contracts and how to interact with them.

[**View Smart Contracts Documentation**](../intmax-nodes/smart-contracts.md)

### Rust CLI

Command-line interface for interacting with the INTMAX network using Rust.

[**View INTMAX CLI on GitHub**](https://github.com/InternetMaximalism/intmax2/tree/main/cli)

### Rust SDK

The official Rust SDK for interacting with the INTMAX network externally.

[**View INTMAX Client SDK on GitHub**](https://github.com/InternetMaximalism/intmax2/tree/main/client-sdk)

> This SDK enables seamless external interaction with the INTMAX network using Rust.
