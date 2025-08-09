---
sidebar_position: 1
description: The INTMAX Block Builder is the node responsible for aggregating user transactions and submitting new L2 blocks to the network.
---

# Block Builder Reference

The INTMAX Block Builder is the node responsible for aggregating user transactions and submitting new L2 blocks to the network.

Running a builder lets you:

- **Earn rewards by helping finalize blocks.**
- **Strengthen decentralization by contributing new permissionless capacity.**

| Guide                 | When to use                                                                                                         | Key points                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Full-Network Mode** | When the Builder cannot be accessed publicly (behind NAT or firewall). Traffic is relayed through the INTMAX proxy. | Quick, one-command installation without domain or load balancer setup.                                                       |
| **Standalone Mode**   | When the Builder can be made publicly accessible using your own domain or load balancer.                            | Minimal or customizable installation, best for production-grade and flexible setups, supports multiple independent Builders. |

---

## Quick Links

### Block Builder Setup – Full-Network

A step-by-step guide for setting up and running an INTMAX2 Block Builder using the automated setup script in **Full Network Mode**.

[View Full-Network Setup Guide](./full-netwrok.md)

### Block Builder Setup – Standalone

Designed for advanced use cases requiring flexible server-side management or deployment across multiple environments, this guide offers a lightweight and modular Block Builder setup in Standalone Mode.

[View Standalone Setup Guide](./standalone.md)

### Block Builder Business Guide

This guide supports business development as a Block Builder. It covers reward design, best practices for contributing to the network, and operational considerations.

[View Business Guide](./business-guide.md)

### Block Builder Receive Rewards

A reward claiming guide for INTMAX Block Builders. It explains how to receive two types of rewards: **user fees** and **ITX tokens**, from setup to final claiming.

[View Receive Reward Guide](./receive-rewards.md)
