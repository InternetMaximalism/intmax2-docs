---
sidebar_position: 2
description: The Block Builder node is a critical component responsible for submitting blocks to the INTMAX Network.
---

# Full Network

The Block Builder node is a critical component responsible for submitting blocks to the INTMAX Network.

This guide provides step-by-step instructions for setting up and running an INTMAX2 Block Builder using the automated setup script in **Full Network Mode.** If you are looking for more flexible server-side management or want to deploy multiple Block Builders across different environments, please refer to the **Standalone Mode** documentation instead.

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

#### ⚠️ Important Security Notice

> **Please be cautious when downloading and executing scripts from the internet.** Always verify the source and content of scripts before execution. Make sure you trust the source and understand what the script does before running it on your system.

> **Always download from the official INTMAX2 repository URL specified below** to ensure you're getting the legitimate script.

### Prerequisites

- Docker installed on your system
  - **[Windows Docker Link](https://docs.docker.com/desktop/install/windows-install)**
  - **[Mac Docker Link](https://docs.docker.com/desktop/install/mac-install)**
  - **[Linux Docker Link](https://docs.docker.com/desktop/install/linux-install)**

- A valid private key for the block builder with at least **0.01 ETH** on Scroll Sepolia testnet
- Access to an **L2 RPC URL**
- Linux/Windows/macOS environment with bash shell

### Quick Setup

#### 1. Download the Setup Script

⚠️ **Important:** Only download from the official [**INTMAX2 GitHub repository**](https://github.com/InternetMaximalism/intmax2) to ensure security and authenticity.

```bash
# Mainnet
curl -o builder.sh https://raw.githubusercontent.com/InternetMaximalism/intmax2/refs/heads/main/scripts/block-builder-mainnet.sh
chmod +x builder.sh

# Testnet
curl -o builder.sh https://raw.githubusercontent.com/InternetMaximalism/intmax2/refs/heads/main/scripts/block-builder-testnet.sh
chmod +x builder.sh
```

#### 2. Initialize Configuration

```bash
# Generate configuration files
./builder.sh setup
```

This command will create the following files:

- `frpc.toml` - FRP client configuration
- `nginx.conf` - Nginx proxy configuration
- `docker-compose.yml` - Docker services configuration
- `.env` - Environment variables

#### 3. Configure Environment Variables

**Critical Step**: Configure both L2 RPC URL and private key using the unified environment setup command.

```bash
# Configure environment variables interactively
./builder.sh setup-env
```

This interactive command will prompt you for:

1. **L2 RPC URL**: Your Scroll Sepolia RPC endpoint

   **Scroll Mainnet RPC Examples**
   - `https://rpc.ankr.com/scroll`
   - `https://scroll-mainnet.infura.io/v3/YOUR_PROJECT_ID`
   - `https://scroll-mainnet.g.alchemy.com/v2/YOUR_API_KEY`

   **Scroll Testnet RPC Examples**
   - `https://rpc.ankr.com/scroll_sepolia_testnet`
   - `https://scroll-sepolia.infura.io/v3/YOUR_PROJECT_ID`
   - `https://scroll-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

2. **Private Key**: Your wallet's private key (with or without 0x prefix)
   - Ensure the associated wallet has **at least 0.01 ETH on Scroll Sepolia testnet**
   - The private key is securely stored as a Docker secret

#### 4. Verify Configuration (Optional)

```bash
# Verify all configurations
./builder.sh verify-env
```

This command will:

- Validate L2 RPC URL format and accessibility
- Verify private key format and Docker secret storage
- Display configuration summary

#### 5. Final Check

```bash
# Comprehensive configuration check
./builder.sh check
```

This displays:

- All required files status
- Docker installation verification
- Environment variables validation
- Your block builder domain URL

#### 6. Start the Block Builder

```bash
# Start all services as Docker Stack
./builder.sh run
```

#### 7. Health Check

```bash
# Health check your block builder
./builder.sh health
```

#### 8. Monitor Services

```bash
# Monitor running services and view logs
./builder.sh monitor
```

### Available Commands

| Command                     | Description                                                      |
| --------------------------- | ---------------------------------------------------------------- |
| `./builder.sh setup`        | Create configuration files with unique UUID                      |
| `./builder.sh setup-env`    | Interactive environment configuration (L2_RPC_URL + private key) |
| `./builder.sh verify-env`   | Verify environment configuration                                 |
| `./builder.sh check`        | Validate configuration and show current settings                 |
| `./builder.sh run`          | Start Docker Stack with all services                             |
| `./builder.sh stop`         | Stop all Docker Stack services                                   |
| `./builder.sh health`       | Health check services                                            |
| `./builder.sh monitor`      | Monitor services status and view logs                            |
| `./builder.sh update`       | Update script to latest version                                  |
| `./builder.sh clean`        | Remove all configuration files and Docker resources              |
| `./builder.sh docker-clean` | Remove Docker containers, images, and networks                   |
| `./builder.sh version`      | Show version information                                         |

### Health check

#### How to Check if the Block Builder is Working Correctly?

This section explains how to verify that your Block Builder instance is operating correctly and how to retrieve status and fee information.

Your Block Builder endpoint (as an example):

- `https://proxy.builder.intmax.io/b7d899c2-6a77-4f7e-9c00-d970e9d6fb48`

**Health Check and Fee Information**

Check if the Block Builder is running properly:

```bash
./builder.sh health
```

## FAQ

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
        "address": "0xe5b4920e15587582e40c645c98b5d6c539ddb84f",
        "url": "https://stage.api.node.intmax.io/block-builder"
    },
    {
        "address": "0x9175f73999dacbdb1fd7b3cdafed331d29d1ed0b",
        "url": "https://stage.api.node.intmax.io/secondary-block-builder"
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

### Q. I want to run multiple Block Builders. How should I do it?

If you want to run multiple Block Builders (for example, for scaling or redundancy), please **use the Standalone Mode setup** described in the Standalone Block Builder documentation.

In Standalone Mode:

- Each Block Builder runs independently and can be deployed to different cloud environments.
- You are responsible for configuring network access (such as firewall rules, ports, or reverse proxies) to ensure each Block Builder is reachable from the indexer.
- The indexer will only register your Block Builder's URL if it is **publicly accessible**.

This mode is suitable for running multiple builders in parallel, and you can register each one with a different URL.

👉 Refer to the [Block Builder Setup: Standalone](./standalone.md) for setup instructions.

## Troubleshooting

### Common Issues

1. **Placeholder Values Not Updated**

   ```
   ⚠️ WARNING: BLOCK_BUILDER_PRIVATE_KEY is still set to placeholder value
   ```

   Solution: Edit `.env` file and replace placeholder values with actual values

2. **Docker Not Found**

   ```
   ❌ Docker not found
   ```

   Solution: Install Docker using the official installation guide

3. **Configuration Files Missing**

   ```
   ❌ Configuration files not found
   ```

   Solution: Run `./builder.sh setup` to generate configuration files

4. **Docker Swarm is not active**

   When running:

   ```bash
   ./builder.sh setup-env
   ```

   You may encounter the following error:

   ```
   ❌ Docker Swarm is not active
   💡 Run: docker swarm init
   ```

   This means **Docker Swarm mode has not been initialized** on your machine.
   - Docker Swarm is required to use `docker stack deploy` and manage services defined in a stack.

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
