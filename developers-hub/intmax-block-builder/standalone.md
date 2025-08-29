---
sidebar_position: 3
description: The Block Builder node is a critical component responsible for submitting blocks to the INTMAX Network.
---

# Standalone

The Block Builder node is a critical component responsible for submitting blocks to the INTMAX Network.

This document provides detailed instructions for setting up and operating the Block Builder efficiently in **Standalone Mode**. In this mode, you are responsible for configuring network access to the Block Builder from the internet as needed, such as setting up firewalls, ports, or load balancers. Despite being standalone, this mode supports deploying multiple Block Builder instances in cloud environments, enabling scalable and redundant setups.

**Standalone Mode also offers greater flexibility and customizability**, allowing operators to tailor their setup according to their infrastructure and operational needs.

**Note**: We offer two versions: **Mainnet** and **Testnet**. Please make sure not to confuse them.

## Key Features

The Block Builder posts blocks to **Scroll** from the Ethereum account specified by the private key. It is a core component that interacts with the Scroll network. To support future enhancements, the Block Builder is designed to accept external transactions.

To ensure stable operation in the mainnet environment, the Block Builder should run continuously.

- **Transaction Submission:**
  - The Block Builder collects transactions from external sources and submits them to the Scroll network as blocks. This enables efficient interaction with the broader network and ensures seamless block submission.
- **Fee Collection:**
  - The Block Builder collects a fee of $0.005 per user per transaction.
  - For each block, it can accumulate up to $0.005 × 128 in fees, supporting scalable and incentivized operation.
- **Online Status Announcement:**
  - The Block Builder sends a transaction to the [**Block Builder Registry Contract**](/developers-hub/intmax-nodes/smart-contracts#block-builder-registry) once a day to notify the [**Indexer**](/developers-hub/intmax-nodes/indexer) that it is online.
  - The indexer plays a critical role in distributing the most suitable Block Builder URL to users, ensuring efficient and reliable network interaction.

## Requirements

- **Recommended Configuration:**
  - 2 vCPU
  - 4 GB RAM
  - 10 GB SSD
- **Minimum Configuration:**
  - 1 vCPU
  - 1 GB RAM
  - 4 GB SSD

## Getting Started

### Setting Up Environment Variables

Create a `.env` file and configure it with the following settings.

Replace the placeholders with your actual credentials and URLs:

- `BLOCK_BUILDER_PRIVATE_KEY=<private-key>`: The Ethereum private key of an account that holds ETH on Scroll Network.
- `BLOCK_BUILDER_URL=<your-block-builder-url>`: The URL of your BlockBuilder that is **accessible from the internet**. If there is a port number, be sure to include it.

  ⚠️ **Note:** Always use `https://` instead of `http://` to ensure secure communication.

- `L2_RPC_URL=<your-scroll-rpc-url>`: The RPC endpoint for Scroll Network Ensure that the Scroll network is enabled in your Alchemy dashboard.

**Important:** Never expose or share your private key (`<private-key>`). Keep it secure to prevent unauthorized access to your account. To ensure stable operation, it is **recommended that the Block Builder always maintains a minimum balance of 0.1 ETH on the Scroll Network**.

**NOTE:** If you are using the **Testnet** environment, please replace the RPC URL with the Scroll Sepolia RPC endpoint and use an account that holds ETH on the Scroll Sepolia Network instead. Also, ensure that the Scroll network is enabled in your Alchemy dashboard.

**Do not use quotation marks** when specifying values in the `.env` file.

```bash
# Setup .env
vim .env
```

#### [Mainnet]

```bash
#######
# Contents of .env for mainnet
#######

# app settings
PORT=8080
BLOCK_BUILDER_PRIVATE_KEY=<private-key>

# builder settings
ETH_ALLOWANCE_FOR_BLOCK=0.001
TX_TIMEOUT=80
ACCEPTING_TX_INTERVAL=30
PROPOSING_BLOCK_INTERVAL=30
INITIAL_HEART_BEAT_DELAY=180
HEART_BEAT_INTERVAL=85800
GAS_LIMIT_FOR_BLOCK_POST=400000
CLUSTER_ID=1
BLOCK_BUILDER_URL=<your-block-builder-url>

# fee settings
REGISTRATION_FEE=0:2500000000000
NON_REGISTRATION_FEE=0:2000000000000

# external settings
ENV=prod
STORE_VAULT_SERVER_BASE_URL=https://api.node.intmax.io/store-vault-server
USE_S3=true
VALIDITY_PROVER_BASE_URL=https://api.node.intmax.io/validity-prover
L2_RPC_URL=<your-scroll-rpc-url>
ROLLUP_CONTRACT_ADDRESS=0x1c88459D014e571c332BF9199aD2D35C93219A2e
BLOCK_BUILDER_REGISTRY_CONTRACT_ADDRESS=0x79dA6F756D26c50bA74bF9634bd3543645058b5B
```

#### [Testnet β]

```bash
#######
# Contents of .env for testnet
#######

# app settings
PORT=8080
BLOCK_BUILDER_PRIVATE_KEY=<private-key>

# builder settings
ETH_ALLOWANCE_FOR_BLOCK=0.001
TX_TIMEOUT=80
ACCEPTING_TX_INTERVAL=30
PROPOSING_BLOCK_INTERVAL=30
INITIAL_HEART_BEAT_DELAY=180
HEART_BEAT_INTERVAL=85800
GAS_LIMIT_FOR_BLOCK_POST=400000
CLUSTER_ID=1
BLOCK_BUILDER_URL=<your-block-builder-url>

# fee settings
REGISTRATION_FEE=0:2500000000000
NON_REGISTRATION_FEE=0:2000000000000

# external settings
ENV=staging
STORE_VAULT_SERVER_BASE_URL=https://stage.api.node.intmax.io/store-vault-server
USE_S3=true
VALIDITY_PROVER_BASE_URL=https://stage.api.node.intmax.io/validity-prover
L2_RPC_URL=<your-scroll-sepolia-rpc-url>
ROLLUP_CONTRACT_ADDRESS=0xcEC03800074d0ac0854bF1f34153cc4c8bAEeB1E
BLOCK_BUILDER_REGISTRY_CONTRACT_ADDRESS=0x93a41F47ed161AB2bc58801F07055f2f05dfc74E
```

### Running with Docker(Linux)

Before running the following command, **please replace `<release-version>`** with the latest version available from the official release page:

**Note:** Do not include the `v` prefix in the release version.

👉 **Check the latest release [here:](https://github.com/InternetMaximalism/intmax2/pkgs/container/intmax2)**

Before running the command, make sure to set up the `.env` file or configure the necessary environment variables.

**x86-64 Architecture**

```bash
docker pull ghcr.io/internetmaximalism/intmax2:**<release-version>**
docker run -d --rm \
    --env-file ./.env \
    --name block-builder \
    -p 8080:8080 \
     ghcr.io/internetmaximalism/intmax2:**<release-version>** /app/block-builder

##########
# example
##########
docker pull ghcr.io/internetmaximalism/intmax2:0.1.34
docker run -d --rm \
    --env-file ./.env \
    --name block-builder \
    -p 8080:8080 \
     ghcr.io/internetmaximalism/intmax2:0.1.34 /app/block-builder
```

**arm-64 Architecture**

```bash
docker pull ghcr.io/internetmaximalism/intmax2:**<release-version>**-arm64
docker run -d --rm \
    --env-file ./.env \
    --name block-builder \
    -p 8080:8080 \
     ghcr.io/internetmaximalism/intmax2:**<release-version>**-arm64 /app/block-builder

##########
# example
##########
docker pull ghcr.io/internetmaximalism/intmax2:0.1.34-arm64
docker run -d --rm \
    --env-file ./.env \
    --name block-builder \
    -p 8080:8080 \
     ghcr.io/internetmaximalism/intmax2:0.1.34-arm64 /app/block-builder
```

### Running as a Binary(Linux)

Before running the following command, **please replace `<release-version>`** with the latest version available from the official release page:

**Note:** Make sure to add the `v` prefix to the release version.

👉 **Check the latest release [here:](https://github.com/InternetMaximalism/intmax2/releases)**

Before running the command, make sure to set up the `.env` file or configure the necessary environment variables.

**x86-64 Architecture**

```bash
curl -L https://github.com/InternetMaximalism/intmax2/releases/download/**<release-version>**/intmax2-x86_64-unknown-linux-gnu.tar.gz \
| tar -xzv
chmod +x block-builder
./block-builder

##########
# example
##########
curl -L https://github.com/InternetMaximalism/intmax2/releases/download/v0.1.34/intmax2-x86_64-unknown-linux-gnu.tar.gz \
| tar -xzv
chmod +x block-builder
./block-builder
```

**arm-64 Architecture**

```bash
curl -L https://github.com/InternetMaximalism/intmax2/releases/download/<release-version>/intmax2-aarch64-unknown-linux-gnu.tar.gz \
| tar -xzv
chmod +x block-builder
./block-builder

##########
# example
##########
curl -L https://github.com/InternetMaximalism/intmax2/releases/download/v0.1.34/intmax2-aarch64-unknown-linux-gnu.tar.gz \
| tar -xzv
chmod +x block-builder
./block-builder
```

## Health check

### Q. How to Check if the Block Builder is Working Correctly?

These endpoints provide essential insights into the health, operational status, and fee details of the Block Builder. After confirming that it works locally, **you must also verify that the endpoint is accessible from external sources** This ensures that network participants can communicate with your Block Builder. Make sure any firewall settings or reverse proxies allow external access to the appropriate ports.

**Local Check**

First, confirm the Block Builder is running locally:

```bash
curl http://localhost:8080/health-check

# response
{"name":"block-builder","version":"0.1.34"}
```

**External Check**

After confirming local functionality, make sure the health-check endpoint is accessible from external sources as well. Replace `<your-domain>` with your actual domain or IP address:

```bash
curl https://<your-domain>/health-check

# response
{"name":"block-builder","version":"0.1.34"}
```

> ⚠️ Ensure that firewall rules, reverse proxy (e.g., Nginx), or any cloud service settings allow external HTTP/HTTPS access to the endpoint.

### Q: How can I check if my Block Builder is registered and ready?

You can verify the registration status of your Block Builder by calling the following API:

```bash
# Mainnet
curl https://api.indexer.intmax.io/v1/indexer/builders/registration/<your-block-builder-address>

# Testnet
curl https://stage.api.indexer.intmax.io/v1/indexer/builders/registration/<your-block-builder-address>
```

Replace `<your-block-builder-address>` with your actual Block Builder address.

The response will look like this:

```json
{
  "ready": true,
  "registered": true
}
```

- `registered`: Indicates whether your Block Builder has already been registered with the indexer.
- `ready`: Indicates whether your Block Builder has passed the fee and balance checks and is now included in the active list of builders.

This API allows you to confirm the current status of your Block Builder in the indexer.

### Fee Information

#### Local Check

Check the fee-related data for the Block Builder locally:

```bash
curl http://localhost:8080/fee-info

# Expected response
{
    "beneficiary": "i9ewLfwvXpw9LY1dW5NmbZKmTkUdW6U8feffTigEyc5QaTofZnzcA8pCu18tYDA8EX736gkEkU7Tj5CCDGogaBbFQQbc5Wv",
    "blockBuilderAddress": "0x9ac5289697c0fae66a31337c0447bea38bffa5ee",
    "nonRegistrationCollateralFee": null,
    "nonRegistrationFee": [
        {
            "amount": "2000000000000",
            "token_index": 0
        }
    ],
    "registrationCollateralFee": null,
    "registrationFee": [
        {
            "amount": "2500000000000",
            "token_index": 0
        }
    ],
    "version": "0.1.34"
}

```

#### External Check

After confirming local functionality, make sure the fee-info endpoint is accessible from external sources. Replace `<your-domain>` with your actual domain or IP address:

```bash
curl https://<your-domain>/fee-info

# Expected response
{
    "beneficiary": "i9ewLfwvXpw9LY1dW5NmbZKmTkUdW6U8feffTigEyc5QaTofZnzcA8pCu18tYDA8EX736gkEkU7Tj5CCDGogaBbFQQbc5Wv",
    "blockBuilderAddress": "0x9ac5289697c0fae66a31337c0447bea38bffa5ee",
    "nonRegistrationCollateralFee": null,
    "nonRegistrationFee": [
        {
            "amount": "2000000000000",
            "token_index": 0
        }
    ],
    "registrationCollateralFee": null,
    "registrationFee": [
        {
            "amount": "2500000000000",
            "token_index": 0
        }
    ],
    "version": "0.1.34"
}

```

## FAQ

### Q: Overview of the Indexer Component and BlockBuilder Requirements

An **Indexer** is a component that manages the URLs of multiple valid **BlockBuilders** and returns an appropriate BlockBuilder URL to the user.

The Indexer only returns BlockBuilders that meet all of the following conditions:

- **They regularly send HeartBeat signals.**
- **Their registered URL is accessible.**
- **Their balance is at least 0.001 ETH.**

BlockBuilders must be configured to meet these conditions.

### Q: Verifying Block Submission by Your Block Builder

A block is considered submitted by your Block Builder if the minter address in the block matches the address your Block Builder is configured to use.

You can verify the submitted blocks via the Explorer at:

- [Mainnet Explorer](https://explorer.intmax.io/)
- [Testnet Explorer](https://beta.testnet.explorer.intmax.io/)

### Q: Where is the synchronized data stored inside the Docker container?

A: The Block Builder does not store any data persistently. It only receives transaction data and submits it as a block. While transaction data is temporarily held in memory, it is not written to disk or stored permanently inside the container. Therefore, there is no specific directory where synchronized data is stored.

### Q: Resolving `libssl.so.1.1` Missing Library Error on `ubuntu`

If you encounter an error related to `libssl.so.1.1` missing on Ubuntu, you can manually install the required package using the following steps:

```bash
wget http://security.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.23_amd64.deb
sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2.23_amd64.deb
```

### Q: Can I use an RPC URL other than Alchemy for `L2_RPC_URL`?

A: Yes, you can use an RPC provider other than Alchemy for `L2_RPC_URL`. Some examples of alternative providers include:

- **Infura**
- **Ankr**
- **Custom RPC**: Your own self-hosted node's RPC URL

The performance and stability may vary depending on the RPC provider, so please choose the one that best suits your environment and use case.

### Q: What `BLOCK_BUILDER_URL` should I set?

Please set the `BLOCK_BUILDER_URL` that allows access to your Block Builder. Users will send transactions to your Block Builder through this URL. If the URL is not accessible, your Block Builder will not be able to submit blocks.

You can verify it by accessing $`${BLOCK_BUILDER_URL}/health-check` . If the URL is accessible, you will receive a health check response like the one below.

```bash
{ "name":"block-builder","version":"0.1.34" }
```

### Q: How much is the gas fee for one block builder submission on the mainnet?

Block Builder requires approximately **0.000016 ETH** in gas fees to submit a block. To ensure stable operation, it's recommended to keep a bit more than this amount. Please note that gas fees may fluctuate depending on the congestion of the Mainnet and Scroll networks.

### Q. How can we check if our indexer is registered

Please send a request to the URL below. Three addresses registered as indexers will be returned at random. Repeat the request several times. This will give you the current list of active indexers.

```bash
# Mainnet
curl https://api.indexer.intmax.io/v1/indexer/builders

[
  {
    "address": "0x9ac5289697c0fae66a31337c0447bea38bffa5ee",
    "url": "https://api.node.intmax.io/block-builder"
  },
  {
    "address": "0xa5de22aef9770067cc5284d94dab623c3cefa049",
    "url": "https://api.node.intmax.io/secondary-block-builder"
  }
]

# Testnet
curl https://stage.api.indexer.intmax.io/v1/indexer/builders

[
    {
        "address": "0x9ac5289697c0fae66a31337c0447bea38bffa5ee",
        "url": "https://api.node.intmax.io/block-builder"
    },
    {
        "address": "0xa5de22aef9770067cc5284d94dab623c3cefa049",
        "url": "https://api.node.intmax.io/secondary-block-builder"
    }
]
```

### Q. When will the URL of my BlockBuilder be registered with the indexer?

After the block builder starts running, it registers its URL to the Block Builder Registry Contract once the time set in `INITIAL_HEART_BEAT_DELAY` has passed.
**If the URL is valid, it will be registered by the indexer 10 to 15 minutes later.**
To be registered, the URL must be accessible from the indexer's side.

### Q: What is the minimum amount of ETH required to deposit? (How much ETH should I keep for stable operation?)

To ensure stable operation of the Block Builder, **please deposit at least 0.01 ETH**.

Submitting one block typically requires approximately **0.000016 ETH** in gas fees, but gas fees may fluctuate depending on network congestion. If your balance falls below **0.001 ETH**, you will no longer be able to submit blocks.

**Recommended balance management:**

- **Always keep more than 0.01 ETH** in your account as a guideline.
- **If your balance drops below 0.002 ETH,** please top up as soon as possible.
- **If your balance drops below 0.001 ETH,** block submission will fail, so regular balance checks and timely top-ups are strongly recommended.

### Q. Can the Block Builder set custom fees?

Yes, the Block Builder can set custom fees. The supported tokens are `ETH`, `~~USDC`, and `WBTC`,~~ each identified by a `tokenIndex` as follows:

- `tokenIndex: 0` → ETH
- ~~`tokenIndex: 1` → ITX~~
- ~~`tokenIndex: 2` → WBTC~~
- ~~`tokenIndex: 3` → USDC~~

For example, specifying `0:2500000000000` sets a fee of 0.0000025 ETH.

You can define multiple fees for different tokens at the same time.

Example:

`REGISTRATION_FEE=0:2500000000000~~,1:100000~~`

This sets the fee as 0.0000025 ETH ~~and 1 USDC.~~

## References

Here are essential resources for developers working with the INTMAX2 network:

### INTMAX2 Block Builder

Access the source code and implementation details on GitHub.

[View Block Builder Repository](https://github.com/InternetMaximalism/intmax2/tree/main/block-builder)

### INTMAX Mainnet

- App Frontend:
  [Open Mainnet App](https://app.intmax.io/)
- Explorer:
  [Open Mainnet Explorer](https://explorer.intmax.io/)

### INTMAX Testnet

- App Frontend:
  [Open Testnet App](https://testnet.app.intmax.io/)
- Explorer:
  [Open Testnet Explorer](https://beta.testnet.explorer.intmax.io/)

### Smart Contracts

View the documentation for deployed smart contracts and their usage.

[View Smart Contracts Documentation](../intmax-nodes/smart-contracts.md)
