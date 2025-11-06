---
sidebar_position: 5
description: This guide provides step-by-step instructions for INTMAX Block Builders to claim their earned rewards. As a Block Builder participant in the INTMAX network, you can receive two types of rewards user fees collected from transactions processed in your blocks, and ITX tokens distributed through the reward program.
---

# Receive Rewards

## Introduction

This guide provides step-by-step instructions for INTMAX Block Builders to claim their earned rewards. As a Block Builder participant in the INTMAX network, you can receive two types of rewards: user fees collected from transactions processed in your blocks, and ITX tokens distributed through the reward program.

This document covers the complete process from initial setup to reward claiming, including how to:

- Set up the command-line tools and environment
- Generate INTMAX keys from your Ethereum private key
- Check your accumulated balances and withdraw user fees
- Claim ITX token rewards earned through block building activities

**NOTE:** When receiving rewards, you need to clone the CLI and execute the command, but this does not have to be done on the server running the Block Builder.

**NOTE:** The environment in which this operation is executed requires a **minimum of 1 GB of memory**.

## How to Receive Rewards

### Preparation

You can claim your rewards using the command-line tool. Below is an explanation of how to claim rewards on the **mainnet**.

```bash
git clone git@github.com:InternetMaximalism/intmax2.git -b main
cd intmax2/cli
```

Next, set up your environment variables for the CLI. Specifically, you'll need an RPC URL, which you can obtain by creating an account with providers such as [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/) and generating an API key.

⚠️ **Important:** `L1_RPC_URL` and `L2_RPC_URL` should be set to the RPC URLs of the Ethereum and Scroll networks, respectively.

```bash
cat <<EOF > .env
ENV=prod
IS_FASTER_MINING=false
INDEXER_BASE_URL=https://api.indexer.intmax.io
STORE_VAULT_SERVER_BASE_URL=https://api.node.intmax.io/store-vault-server
LOCAL_BACKUP_PATH=data/mainnet
STORE_VAULT_TYPE=remote_with_backup
BALANCE_PROVER_BASE_URL=https://api.private.zkp.intmax.io
USE_PRIVATE_ZKP_SERVER=true
VALIDITY_PROVER_BASE_URL=https://api.node.intmax.io/validity-prover
WITHDRAWAL_SERVER_BASE_URL=https://api.node.intmax.io/withdrawal-server
WALLET_KEY_VAULT_BASE_URL=https://api.keyvault.intmax.io/v1
DEPOSIT_TIMEOUT=180
TX_TIMEOUT=80
BLOCK_BUILDER_QUERY_WAIT_TIME=5
BLOCK_BUILDER_QUERY_INTERVAL=5
BLOCK_BUILDER_QUERY_LIMIT=20
STORE_VAULT_MAX_RPS=5.0
VALIDITY_PROVER_MAX_RPS=5.0
BAD_GATEWAY_RETRY_LIMIT=3
LIQUIDITY_CONTRACT_ADDRESS=0xF65e73aAc9182e353600a916a6c7681F810f79C3
ROLLUP_CONTRACT_ADDRESS=0x1c88459D014e571c332BF9199aD2D35C93219A2e
WITHDRAWAL_CONTRACT_ADDRESS=0x86B06D2604D9A6f9760E8f691F86d5B2a7C9c449
REWARD_CONTRACT_ADDRESS=0xFe9Fca6e5AE58E6F06873D2beFB658424Ae07109
L1_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your_api_key # !!! CHANGE YOUR API KEY !!!
L2_RPC_URL=https://scroll-mainnet.g.alchemy.com/v2/your_api_key # !!! CHANGE YOUR API KEY !!!
EOF
```

### User Fees

Once you've completed these setup steps, execute the following commands step-by-step. Please run the following command in the **cli** directory of the **intmax2** repository.

⚠️ Note: If the `rustup` command is not available on your system, please install Rust and Cargo by following the instructions at the [official Rust installation page](https://rust-lang.org/tools/install/).

**Step 0: Update the intmax2 repository**

Before running any commands, make sure your intmax2 repository is up to date.
Open your terminal, navigate to the repository directory, and pull the latest changes:

```bash
cd /path/to/intmax2
git pull origin main
```

⚠️ Note: Please replace `/path/to/intmax2` with the actual directory path before executing the command.

**Step 1: Generate INTMAX keys from your Scroll private key**

```bash
cargo run -r -- key-from-backup-key --backup-key <scroll-private-key>
```

Expected output:

```
Address: i9eW...
View Only Key: viewpair/0x49c1...
Spend Key: 0x9821...
Key Pair: keypair/0x49c1...
```

**:warning: Important Notice**: **Never share your View Only Key, Spend Key, or Key Pair with anyone.**
Especially if your Spend Key or Key Pair becomes known to others, they could move your assets on the INTMAX network, putting them at serious risk.

**Step 2: Check your balance using your INTMAX private key**

**Important:** For `<spend-key>`, copy and paste the `Private key` starting with `0x` from the output log generated in Step 1.

```bash
cargo run -r -- balance --private-key <spend-key>
```

> Note: This command may take a significant amount of time to complete. If you have previously submitted a large number of blocks, this command may take over **24 hours** to complete.

During command execution, logs like the following will be displayed. The longer your node has been running, the more logs will be displayed.

```
[2025-10-17T06:00:00Z INFO  intmax2_client_sdk::external_api::local_backup_store_vault::local_store_vault] local_save_data_batch: topic: v1/ra_wo/transfer, pubkey: 0x0e9e...42cf, digest: 0xfb26...d381
[2025-10-17T06:00:00Z INFO  intmax2_client_sdk::external_api::local_backup_store_vault::local_store_vault] local_save_data_batch: topic: v1/ra_wo/transfer, pubkey: 0x0e9e...42cf, digest: 0x5408...fc00
```

> Note: If you continue to see synchronization logs like the following, it is safe to stop the command and rerun it later—the sync will resume from where it left off.

```
sync_transfer: MetaDataWithBlockNumber { meta: MetaData { timestamp: 1752000000, digest: 0x951d5ad4 }, block_number: 2000 }
```

When the balance synchronization is complete, logs like the following will be displayed.

```
Balances:
	Token #0:
		Amount: 2342400000000000
		Type: NATIVE
```

If the following log appears and execution stops, please run the **balance** command again.

```
Client error: Server client error: Invalid response: Failed to read response: reqwest::Error { kind: Decode, source: reqwest::Error { kind: Body, source: TimedOut } }
```

**Step 3: Withdraw your funds**

```bash
cargo run -r -- withdrawal --private-key <spend-key> --to <ethereum-address> --amount <amount> --token-index 0
cargo run -r -- sync-withdrawals --private-key <spend-key>
```

> Note: Executing this command may take at least **2 minutes**.

Ensure you replace placeholders such as `<scroll-private-key>`, `<spend-key>`, `<ethereum-address>`, and `<amount>` with your actual values. Please specify in `<amount>` the value displayed in your balance **minus 35,000,000,000,000**. For example, if your balance is **2,342,400,000,000,000 wei**,
please specify `2307400000000000` (= 2,342,400,000,000,000 − 35,000,000,000,000).

```
cargo run -r -- withdrawal --private-key <spend-key> --to <ethereum-address> --amount 2307400000000000 --token-index 0
```


### ITX Token

Please execute the following command to claim your rewards. Replace `<scroll-private-key>` with your actual Scroll private key:

```bash
cargo run -r -- claim-builder-reward --eth-private-key <scroll-private-key>
```

To execute the command, you'll need sufficient ETH to pay the gas fee (approximately **0.00001 ETH**) on the Scroll address corresponding to your Ethereum address.

**Expected Response**

If there are rewards available for you to claim, you'll see logs similar to the following output:

```
[2025-06-01T00:00:00Z INFO  intmax2_cli::cli::claim] Claiming block builder reward for user address: 0x...
[2025-06-01T00:00:00Z INFO  intmax2_cli::cli::claim] Current reward period: 3
[2025-06-01T00:00:00Z INFO  intmax2_cli::cli::claim] Claiming block builder reward for period 0: 105365126676602086438152
[2025-06-01T00:00:00Z INFO  intmax2_cli::cli::claim] Claiming block builder reward for period 1: 120149253731343283582089
[2025-06-01T00:00:00Z INFO  intmax2_cli::cli::claim] Claiming block builder reward for period 2: 118140794223826714801444
[2025-06-01T00:00:00Z INFO  intmax2_cli::cli::claim] Claiming block builder rewards for periods: [0, 1, 2]
[2025-06-01T00:00:00Z INFO  intmax2_client_sdk::external_api::contract::handlers] Sending transaction: batch_claim_reward with nonce 2368, gas limit 213439, value 0, max fee per gas 31360116, max priority fee per gas 100
[2025-06-01T00:00:00Z INFO  intmax2_client_sdk::external_api::contract::handlers] Transaction sent: "batch_claim_reward" with tx hash: 0x...
```

## Testnet

When running the Block Builder on the **testnet**, the reward claiming process will also take place on the **testnet**.
Please execute the following command.

```bash
git clone git@github.com:InternetMaximalism/intmax2.git -b dev
cd intmax2/cli
```

⚠️ **Important:** `L1_RPC_URL` and `L2_RPC_URL` should be set to the RPC URLs of the Ethereum and Scroll networks, respectively.

```bash
cat <<EOF > .env
ENV=staging
IS_FASTER_MINING=false
INDEXER_BASE_URL=https://stage.api.indexer.intmax.io
STORE_VAULT_SERVER_BASE_URL=https://stage.api.node.intmax.io/store-vault-server
LOCAL_BACKUP_PATH=data/testnet_beta
STORE_VAULT_TYPE=remote_with_backup
BALANCE_PROVER_BASE_URL=https://stage.api.private.zkp.intmax.io
USE_PRIVATE_ZKP_SERVER=true
VALIDITY_PROVER_BASE_URL=https://stage.api.node.intmax.io/validity-prover
WITHDRAWAL_SERVER_BASE_URL=https://stage.api.node.intmax.io/withdrawal-server
WALLET_KEY_VAULT_BASE_URL=https://slxcnfhgxpfokwtathje.supabase.co/functions/v1/keyvault
DEPOSIT_TIMEOUT=180
TX_TIMEOUT=80
BLOCK_BUILDER_QUERY_WAIT_TIME=5
BLOCK_BUILDER_QUERY_INTERVAL=5
BLOCK_BUILDER_QUERY_LIMIT=20
LIQUIDITY_CONTRACT_ADDRESS=0x81f3843aF1FBaB046B771f0d440C04EBB2b7513F
ROLLUP_CONTRACT_ADDRESS=0xcEC03800074d0ac0854bF1f34153cc4c8bAEeB1E
WITHDRAWAL_CONTRACT_ADDRESS=0x914aBB5c7ea6352B618eb5FF61F42b96AD0325e7
REWARD_CONTRACT_ADDRESS=0x7f7a7734f74970bf8c5ca0ee0b6073f2e8dc5e30
L1_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_api_key # !!! CHANGE YOUR API KEY !!!
L2_RPC_URL=https://scroll-sepolia.g.alchemy.com/v2/your_api_key # !!! CHANGE YOUR API KEY !!!
EOF
```

## Troubleshooting

### OpenSSL Build Error

When running the CLI in a Debian-based Linux environment, you may encounter the following error:

```
Could not find directory of OpenSSL installation, and this `-sys` crate cannot
proceed without this knowledge. If OpenSSL is installed and this crate had
trouble finding it,  you can set the `OPENSSL_DIR` environment variable for the
compilation process.

Make sure you also have the development packages of openssl installed.
For example, `libssl-dev` on Ubuntu or `openssl-devel` on Fedora.

If you're in a situation where you think the directory *should* be found
automatically, please open a bug at https://github.com/sfackler/rust-openssl
and include information about your system as well as this message.

$HOST = aarch64-unknown-linux-gnu
$TARGET = aarch64-unknown-linux-gnu
openssl-sys = 0.9.108
```

This issue occurs because the OpenSSL development libraries are missing.
Please execute the following commands to install the required packages.

```
apt update
apt install -y build-essential pkg-config libssl-dev
```

### Using Rustup Instead of the `apt` Package

When Rust is installed via `apt install cargo rustc`, you cannot use the **nightly version** of Rust.
To enable nightly and other toolchains, please install Rust through **Rustup** instead.

Run the following command:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

When prompted during installation, **enter `1`** and press **Enter** to proceed with the default installation.

To make the Rustup-managed Rust toolchain available in your shell, add the following line to your `~/.bashrc`:

```bash
export PATH="$HOME/.cargo/bin:$PATH"
```

Then apply the changes:

```bash
source ~/.bashrc
```

Run the following command to confirm that the Rust compiler being used is the one installed via Rustup:

```bash
which rustc
```

If the output shows:

```
/home/<username>/.cargo/bin/rustc
```

then your configuration is complete and Rustup is now managing your Rust toolchain.

### How to Fix Environment Variable Loading Errors

When you run the following command:

```sh
cargo run -r -- claim-builder-reward --eth-private-key <scroll-private-key>
```

you may encounter an error like this:

```
Envy error: unknown variant `production`, expected one of `local`, `dev`, `staging`, `prod`
```

If you have correctly set the environment variables in your `.env` file but this error still occurs, please try running the following command instead. Make sure to replace `<scroll-private-key>` with your actual Scroll private key.

```sh
( set -a; source .env; set +a; cargo run -r -- claim-builder-reward --eth-private-key <scroll-private-key> )
```
