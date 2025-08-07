---
id: intmax-cli
title: INTMAX CLI
slug: /intmax-cli
sidebar_position: 10
description: INTMAX CLI is the official command-line interface designed for interacting seamlessly with the INTMAX Network, a Layer 2 solution built on zk-Rollup. This powerful tool provides comprehensive management capabilities, empowering users to handle digital assets with precision and ease.
---

# INTMAX CLI

## Overview

INTMAX CLI is the official command-line interface designed for interacting seamlessly with the INTMAX Network, a Layer 2 solution built on zk-Rollup. This powerful tool provides comprehensive management capabilities, empowering users to handle digital assets with precision and ease.

Key functionalities include sophisticated asset management through batch transfers, allowing users to efficiently process up to 63 transactions simultaneously from CSV files, significantly reducing transaction fees. Users can also effortlessly monitor transaction statuses, enhancing transparency and control over their assets.

Additionally, INTMAX CLI streamlines participation in privacy mining operations, providing intuitive commands to check mining statuses, claim rewards in ITX tokens, and manage mining-specific deposits.

Whether generating new rollup keys or deriving them securely from existing Ethereum private keys, INTMAX CLI prioritizes both convenience and security. Its user-centric design makes it an indispensable tool for anyone seeking reliable, secure, and efficient interactions within the INTMAX ecosystem.

[View on GitHub →](https://github.com/InternetMaximalism/intmax2/tree/main/cli)

## Key Features

- **Key Generation**: Generate new rollup keys or derive them from existing Ethereum private keys.
- **Deposit**: Transfer ETH or any desired ERC-20/721/1155 tokens into the rollup.
- **Withdrawal**: Execute withdrawals from the INTMAX network back to Ethereum via command-line, with progress tracking available.
- **Transfer**: Utilize batch transfer functionality to process up to 63 transactions from a CSV file in a single operation, reducing fees.
- **Mining & Reward Claims**: INTMAX network allocates ITX token rewards to participants of privacy mining. Check status and claim rewards directly via CLI.
- **Dedicated Mining Deposit Type**: Specifically checks and validates allowable deposit denominations for mining purposes (0.1 / 1 / 10 / 100 ETH).
