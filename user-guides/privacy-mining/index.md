---
sidebar_position: 1
id: privacy-mining
title: Privacy Mining
---

# Privacy Mining

> Quick Explanation: [Privacy Mining v2 - TL;DR](https://hackmd.io/@lionfeeder/HkNOuv9Ege)

## Introduction

Privacy mining aims to enhance and sustain the anonymity set of the privacy protocol. In INTMAX, this process involves making deposits to the network, which strengthens privacy while allowing participants to earn ITX tokens as rewards. 

## How it works

To start mining, users first connect their wallets on the INTMAX mining website. They then sign a transaction with the connected wallet to generate a unique INTMAX address for mining. Once the address is created, they can begin mining immediately.
Mining involves depositing a specified amount and staying on the INTMAX network for a designated period. Additionally, to ensure that withdrawn tokens are not directly linked to the deposit, they must be withdrawn to a different address. The INTMAX website simplifies address management, allowing users to handle deposits and withdrawals seamlessly without worrying about complex address configurations.

**Please Note:**
Do not link the deposit address with the withdrawal address.
It is recommended to use multiple automatically managed addresses via the website for better security and efficiency.

## Token Distribution

The token name is `INTMAX`.
The token symbol is `ITX`.
The maximum supply is **1,001,000,000** tokens (1.001 billion).
The issuance period spans **2,032 days** (16 + 32 + 64 + 128 + 256 + 512 + 1024 days) with **6 halving events**.
The daily issuance amount is predetermined. Rewards are distributed based on:
(Daily Issuance) \* (Individual Contribution) / (Total Contribution)
Details on how contributions are calculated are explained [below](https://docs.network.intmax.io/privacy-mining#mining-contribution).
ITX is currently **non-transferable**, but will become transferable and usable across various platforms in the near future.

## Mining Contribution

Based on your deposit amount, you will be assigned points used to calculate your share of the rewards. The table below shows how these points are allocated:

| Mining Amount  | Points |
|----------------|--------|
| 0.1 ETH        | 1      |
| 1 ETH          | 4      |
| 10 ETH         | 9      |
| 100 ETH        | 16     |


Your total rewards are proportional to the number of points you have relative to everyone else.

**Example:** Suppose that on March 14, Person A requests a mining reward of 0.1 ETH, and Person B requests 1 ETH. Assume that no one else has made a request. According to the table, the contribution for 0.1 ETH is 1 point, while the contribution for 1 ETH is 4 points. This means the total points for the day is 5 points. If the total reward distributed per day is 10,000 ITX, then Person A will receive 10,000 * 1 / 5 = 2,000 ITX, and Person B will receive 10,000 * 4 / 5 = 8,000 ITX. The reward will be sent to the user's Ethereum address on March 15.

## Reward Schedule

Rewards will be distributed to users participating in privacy mining, based on their level of contribution. The daily reward amounts will be distributed according to the schedule below:

- **From mainnet release until December 16, 2025**
  558,593.75 ITX per day
- **From December 16, 2025 to May 12, 2027**
  279,296.875 ITX per day
- **From May 12, 2027 to March 1, 2030**
  139,648.4375 ITX per day

**Important Things to Note:**
If there is a day on which no mining activity occurs, all tokens scheduled for distribution on that day will be burned.
Any fractional amounts resulting from token distribution will also be burned.

## ⚠️ New Privacy Mining Rules

### Reward Distribution Rules

Once the **2–5 day lock period** ends and the user’s status changes to **"Claimable,"** they can claim their rewards.
If a user violates the mining rules, the associated deposit will be **ineligible** for rewards. 

### Rule of Mining and Lock Period

- Deposit amounts must be exactly 0.1, 1, 10, or 100 ETH.
- All deposits are screened for AML compliance upon entry. Deposits that fail to meet AML standards cannot be accepted into the INTMAX network.
- After depositing, you must maintain your funds in place for the entire duration of the specified lock period. This lock period is uniquely determined by the hash of the INTMAX block containing your deposit and the random value determined at the time of deposit.
- There are no restrictions on the amount of tokens that can be withdrawn.
- Even if you breach the above rules, you can still withdraw your deposited funds. Using the official UI is recommended, as it is specifically designed to prevent common rule violations.

## AML Rules 

- Money deposits from high-risk addresses (e.g., sanctioned addresses) undergo AML (Anti-Money Laundering) verification and may be rejected into the system.
- A "Proof of Innocence" mechanism is available if needed, allowing users to prove their funds are not illicitly mixed.
- The initial deposit limit is 100 ETH, which will be raised every six months, reaching 10,000 ETH after two years. It remains fixed thereafter. This rule applies only to regular deposits, and the mining limit remains unchanged at 100 ETH.

## Key Differences Between the Old and New Rules

- **Network:** It operates on the Ethereum Mainnet.
- **Lock Period:** Previously, rewards were distributed in two stages—after 2 weeks and 3 months. Under the new rules, funds are locked for a shorter period of 2–5 days, and users can claim all rewards at once when the lock is lifted.
- **New User Interface:** Previously, mining was only available via CLI. Now, you can use a web interface, making it easier for more users to participate.

## Comparison With the Old Rules

| Rule | Old Version | New Version |
| --- | --- | --- |
| Partial reward distribution | After 2 weeks (1/3), then after 3 months(2/3) | All rewards claimed 2–5 days after deposit |
| Circulation slashing        | Reduce mining rewards                         | None                                       |
| Rushy Deposit               | Reduce mining rewards                         | None                                       |
| 10/10 Deposit Cycle         | Reduce mining rewards                         | None                                       |
| Mining cycle                | Deposit to a new address                      | UI supports starting new cycles            |

## The History of This Mining

- **June 8, 2024**: Mining begins
- **September 5, 2024**: Mining page pinned
- **September 14, 2024**: The ERC20 contract is deployed by LappsNet in El Salvador
- **September 28, 2024**: Deposit contract upgraded
- **October 19, 2024**: Migration to Base Mainnet
- **Q2 2025**: Migration to Ethereum Mainnet; old CLI-based mining will be discontinued

**NOTE**: Access from heavily regulated regions such as the United States may be partially blocked. Please use the service at your own risk, adhering to all local laws and regulations.
