---
sidebar_position: 4
description: The Block Builder is a key component of the INTMAX network, responsible for constructing and proposing new L2 blocks. Its primary role is to collect transactions submitted by users who wish to transfer assets or interact with the network, and then record those transactions in valid blocks.
---

# Business Guide

## Introduction

The **Block Builder** is a key component of the INTMAX network, responsible for constructing and proposing new L2 blocks. Its primary role is to collect transactions submitted by users who wish to transfer assets or interact with the network, and then record those transactions in valid blocks.

Operating as a permissionless node, the Block Builder allows **anyone** to participate in block production without needing approval from a centralized authority. This open participation model makes the system **unstoppable** and resistant to censorship.

By playing a crucial role in finalizing on-chain data, the Block Builder ensures the network remains decentralized, resilient, and continuously updated with user activity. It is not merely a technical component, but a foundation that upholds one of the network’s core values: **trustlessness**—the ability to operate securely without relying on any central authority or trusted third party.

Whether you’re an individual enthusiast or an infrastructure provider, running a Block Builder enables you to actively support the network while earning rewards for your contribution.

### Intended Audience

This document is intended for:

- Engineers who wish to operate nodes and participate in INTMAX
- Web3 infrastructure providers (e.g., Alchemy, Infura)

## Architecture Overview

From startup to reward distribution, the Block Builder operates in the following sequence:

1. **Transaction Collection**

   Gathers user transactions submitted through the INTMAX network.

2. **Block Construction**

   Builds a block based on either time intervals or transaction volume.

3. **Submission to Scroll**

   Submits the finalized block to a smart contract on the Scroll network.

4. **Reward Collection**
   - **Transaction Fees (ETH)** → Claimable immediately after block submission
   - **Protocol Incentives (sITX)** → Calculated weekly and claimable from a Scroll smart contract

## Rewards & Incentives

### Types of Rewards

| **Type**                   | **Description**                            | **Timing**                           |
| -------------------------- | ------------------------------------------ | ------------------------------------ |
| Transaction Fees (ETH)     | Collected from users included in the block | Immediately after submission         |
| Protocol Incentives (sITX) | 1:1 claimable for ITX, distributed weekly  | Calculated every Monday at 00:00 UTC |

### Reward Calculation

- **Reward Cycle**: Every week from **Monday 00:00 UTC**
- **Distribution**: Proportional to the number of blocks submitted during the cycle

### Reward Schedule

Until **December 16, 2025**, the total amount of protocol incentives allocated per reward cycle is fixed at **350,000 ITX**.

This corresponds to an average of **50,000 ITX per day**.

The reward schedule beyond this date will be announced in a future update.

**Example**

Let’s assume the following conditions during a weekly reward cycle:

- Reward cycle period: From **2025/12/08 00:00 UTC** to **2025/12/15 00:00 UTC**
- Total number of blocks submitted across the network: **10,000**
- Number of blocks submitted by you: **100**

In this case, your ITX reward would be calculated as follows:

```
350,000 ITX / 10,000 blocks × 100 blocks = 3,500 ITX
```

Thus, you would receive **3,500 ITX** as your protocol incentive for that week.

### Fee Revenue (Per Sender)

In addition to protocol incentives, you also earn transaction fees from senders included in your blocks. The average fee per sender is approximately **$0.005 USD.**

These fees are immediately available upon successful block submission and are paid directly in ETH on the INTMAX network.

### Gas Consumption

The estimated cost per block submission is as follows:

- **Mainnet**: 0.0000045 – 0.0000065 ETH (approximately $0.01 – $0.02)
- **Testnet**: 0.000003 – 0.003 ETH

> ⚠️ Since a high gas limit is set for block submission transactions, it is recommended to hold a balance approximately **1.5 times** the estimated transaction fee to ensure successful execution.

**Example**

Suppose the Block Builder submits **12 blocks per day** on Mainnet.

When the Mainnet gas price is **1 Gwei**, the gas cost for each block submission is approximately **0.000005 ETH**.

- **Daily Gas Cost:** 0.000005 ETH × 12 = 0.00006 ETH

If penalty fees are **disabled**, it is recommended to maintain a balance of approximately **0.000066 ETH** (approximately $0.2) to ensure smooth operation.

## How to Participate

Follow this guide to set up your Block Builder:

[Block Builder Setup: Full Network Mode →](./full-netwrok.md)

[Block Builder Setup: Standalone →](./standalone.md)

## FAQ

### Q. I submitted a block, but did not receive any rewards

A. Common reasons include:

- Incorrect Block Builder address configuration
- Reverted transaction when submitting the block
- Reward cycle not yet completed (before Monday 00:00 UTC)

### Q. How can I check my received ITX rewards?

A. Rewards are issued as **sITX tokens** on the Scroll network:

- 🔍 Viewable on any compatible block explorer
- ⛓ Token contract address: _(Link to be added after deployment)_
- ⚠ Currently non-transferable and non-bridgeable. Unlock schedule to be announced

### Q. Can I run multiple Block Builders on a single machine?

A. Running multiple Block Builder nodes on different port numbers simultaneously is technically possible, but generally not recommended.
This is because it is more efficient in terms of fee collection and block generation costs to aggregate as many user transactions as possible into a single block submitted by one Block Builder.

## Support

For technical assistance, operational issues, or troubleshooting, please contact:

👉 [Submit a Support Request](https://intmaxhelp.zendesk.com/hc/en-gb/requests/new)

Kindly select **Support form for Block Builders** from the options below, enter the required details including your email address and name, and proceed to submit the form.
