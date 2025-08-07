---
sidebar_position: 5
description: A Deposit Relayer is a node responsible for reflecting user deposits made on the Ethereum network (ETH, ERC20, ERC721, ERC1155 tokens) into the Intmax network.
---

# Deposit Relayer

### What is a Deposit Relayer?

A Deposit Relayer is a node responsible for reflecting user deposits made on the Ethereum network (ETH, ERC20, ERC721, ERC1155 tokens) into the Intmax network.

### Main Roles

- **Transmitting Deposit Information**
  - Periodically transmits deposit data from the Ethereum network to the Intmax network.

### How it Works

- The Deposit Relayer periodically transmits users' deposit transactions to the Rollup contract on the Scroll network.
  - Data is delivered to the Rollup contract via the [Scroll Messenger](https://docs.scroll.io/en/developers/l1-and-l2-bridging/the-scroll-messenger/).
  - Once delivered to the Rollup contract, the deposits are reflected in the user's balance after Intmax blocks are generated.

### Features

This node operates independently through multiple nodes without relying on a centralized entity. Users can also run their own Deposit Relayer nodes, though no rewards are provided for doing so.

### What Users Can Do

Users can build and operate their own Deposit Relayer nodes to participate in the protocol. However, there are no rewards provided for this participation.
