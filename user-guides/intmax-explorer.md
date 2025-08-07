---
id: intmax-explorer
title: INTMAX Explorer
slug: /intmax-explorer
sidebar_position: 12
description: Explore is a tool for visualizing various activities occurring on the INTMAX Network.
---

# INTMAX Explorer

## Introduction

**INTMAX Explorer** is a tool for visualizing various activities occurring on the INTMAX Network, such as deposits, withdrawals, and block submissions. It is primarily used for the following purposes:

- Monitoring the current state and historical activity of the INTMAX Network
- Tracking your own deposit and withdrawal history
- Checking the status and history of block submissions

### Key Use Cases

**From a User Perspective:**

- Confirm whether your deposit or withdrawal was successfully processed

**From a Block Builder Perspective:**

- Verify whether your submitted blocks have been accepted by the network
- View a list of successfully and unsuccessfully posted blocks

### Target Audience

**Users of the INTMAX Network:**

- Especially those who have made deposits, withdrawals, or transfers
- Users who want to understand how their actions are processed on the network

**Block Builders:**

- Developers or node operators who want to verify whether their generated and submitted blocks have been accepted by the network

### Prerequisites

This documentation assumes that the reader has a basic understanding of the following concepts:

- Core blockchain concepts such as transactions, blocks, and addresses
- The distinction between Layer 1 and Layer 2

### Privacy Limitations

Due to privacy considerations, the Explorer does not display the following information:

- **Address balances:** You cannot view how much ETH or token balance an address holds.
- **Transaction contents:** The full details of transfer transactions are not exposed.
- **INTMAX on‑chain addresses:**
  - Target addresses for deposits to INTMAX
  - Origin addresses for withdrawals from INTMAX

These restrictions ensure user privacy and align with INTMAX’s stateless, zero‑knowledge architecture.

## Home

You can access the INTMAX Explorer on:

- **Mainnet:** https://explorer.intmax.io/
- **Testnet:** https://beta.testnet.explorer.intmax.io/

<figure><img src="/img/user-guides/intmax_explorer_10.webp" style={{ maxHeight: "450px" }} alt="INTMAX Explorer Home" /></figure>

## Blocks

### Validity

- **Valid:** Indicates that the block contents have been verified and deemed correct according to protocol rules.
- **Invalid:** Indicates that the block contents violate protocol rules and are therefore rejected. All transactions within this block are considered invalid and will be dropped.
- **Empty:** Indicates that the block contains no transactions.

### Status

- **Proving:** The block has been submitted successfully and is currently undergoing verification to confirm its correctness.
- **Completed:** The block’s validity has been determined. If valid, it will be labeled as Valid under the “Validity” field; if not, it will be marked as Invalid.

### Block type

- **Type 0:** A block containing no user transactions. These blocks are typically executed to reflect deposit actions automatically.
- **Type 1:** A block that includes the first-ever transaction from a sender's address. This special block type is used for a sender’s initial on-chain activity.
- **Type 2:** A block that includes a subsequent transaction from a sender's address (i.e., not their first). Compared to Type 1, transactions in a Type 2 block are executed with lower fees, making repeated transactions more cost-efficient.

### Blocks List

Displays a real-time paginated list of blocks, including:

- Height (block number)
- Hash
- Timestamp
- Number of transactions
- Validity
- Status
- Block type

Filtering options are available by status and block type

<figure><img src="/img/user-guides/intmax_explorer_20.webp" alt="INTMAX Explorer Home" /></figure>

### Block Details

Provides detailed block-level information such as:

- Status and timestamp
- Block producer’s address
- Block validity proof (ZKP)

This helps users and Block Builders confirm whether a specific block was posted successfully.

<figure><img src="/img/user-guides/intmax_explorer_30.webp" alt="INTMAX Explorer Block Details" /></figure>

## Deposits

### Status

- **Relayed:** The request has been sent on-chain but is still being processed.
- **Rejected:** The deposit was rejected.
- **Completed:** The request has been successfully reflected. You can use the deposited funds on INTMAX network.

### Deposits List

Shows all deposit transactions, with columns including:

- Deposit ID
- Status
- Timestamp
- Token Type
- Amount
- TxHash

Users can filter by status or date to monitor deposit history effectively.

<figure><img src="/img/user-guides/intmax_explorer_40.webp" alt="INTMAX Explorer Deposits List" /></figure>

### Deposit Details

Detailed view for a specific deposit, showing:

- Status and timestamp
- Linked L1 transaction hash

Filtering options help users track their deposit flows.

<figure><img src="/img/user-guides/intmax_explorer_50.webp" alt="INTMAX Explorer Deposit Details" /></figure>

## Withdrawals

### Status

- **Relayed:** The request has been sent on-chain but is still being processed.
- **Rejected:** The withdrawal was rejected.
- **Completed:** The request has been successfully reflected. ETH and certain ERC‑20 tokens are automatically credited to the user’s specified address, meaning no additional action is needed. However, other ERC‑20 tokens and NFTs must be claimed manually via the web app’s transaction screen.

### Withdrawals List

Lists all withdrawal transactions with details:

- Withdrawal Hash
- Status
- Timestamp
- Token type
- Amount
- TxHash

Filtering options help users track their withdrawal flows.

<figure><img src="/img/user-guides/intmax_explorer_60.webp" alt="INTMAX Explorer Withdrawals List" /></figure>

### Withdrawal Details

Provides in-depth details on a withdrawal transaction:

- Status and timestamp
- Linked L1 transaction hash

<figure>
  <img src="/img/user-guides/intmax_explorer_70.webp" alt="INTMAX Explorer Withdrawal Details Relayed" />
  <img src="/img/user-guides/intmax_explorer_80.webp" alt="INTMAX Explorer Withdrawal Details Completed" />
</figure>

## Search Features

The Search function allows navigation by entering:

- Block height
- Block hash
- Deposit Hash
- Withdrawal Hash

This feature provides direct access to Block Details, Deposit Details, and Withdrawal Details.

<figure><img src="/img/user-guides/intmax_explorer_90.webp" alt="INTMAX Explorer Search" /></figure>
