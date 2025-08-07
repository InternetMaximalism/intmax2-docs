---
sidebar_position: 9
description: A Withdrawal Relayer is a decentralized node responsible for securely processing withdrawals from the INTMAX network to the Ethereum network. It executes the withdrawal of tokens such as ETH, ERC20, ERC721, and ERC1155 based on user requests sent through the Rollup contract.
---

# Withdrawal Relayer

### What is a Withdrawal Relayer?

A Withdrawal Relayer is a decentralized node responsible for securely processing withdrawals from the INTMAX network to the Ethereum network. It executes the withdrawal of tokens such as ETH, ERC20, ERC721, and ERC1155 based on user requests sent through the Rollup contract.

### Main Role

- **Executing Withdrawals**
  - Processes withdrawal requests received from the Rollup contract via the Scroll Messenger.
  - Transfers tokens by invoking the `processWithdrawals` function on the Liquidity contract on Ethereum.

### How it Works

- The Withdrawal Relayer continuously monitors the Scroll Messenger API for withdrawal and claim requests.
- Upon receiving withdrawal instructions, it securely executes transactions on Ethereum to transfer the requested tokens to user addresses.
- If a direct transfer of ETH or specific ERC20 tokens fails, users must perform a claim transaction on the Liquidity contract to retrieve their tokens.
- Users must execute claim transactions manually on the Liquidity contract for other ERC20, ERC721 and ERC1155 tokens.

### Features

- **Decentralized**
  - Withdrawal Relayer nodes operate independently and are distributed throughout the network.
  - Users can deploy their own Withdrawal Relayer nodes and earn rewards as per the protocol.
- **High Availability**
  - At least one node is always operational within the network to ensure continuous availability.
- **Conflict Management**
  - Effectively handles potential conflicts when multiple nodes attempt simultaneous actions by using Ethereum node addresses for processing order.
- **Recovery Capability**
  - Automatically resumes operations after downtime or disruptions.
- **Safe Updates**
  - Safely and efficiently applies software patches and updates.

### Security Measures

- **Real-time Log Monitoring**
  - Continuously monitors logs to promptly identify and react to unauthorized access or unusual activities.
- **Private Key Security**
  - Access to private keys is strictly controlled and limited to necessary users or processes.
  - Securely stores private keys in encrypted databases or physically protected locations.

### What Users Can Do

- Users can set up and operate their own Withdrawal Relayer nodes to contribute to network operations and receive protocol-defined rewards.
- Users interact indirectly through the Liquidity contract when claiming their tokens, particularly if direct transfers encounter issues.
