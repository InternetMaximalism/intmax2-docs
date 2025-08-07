---
sidebar_position: 3
description: The objective of this report is to evaluate the operational stability of the Intmax network under conditions of high CPU and memory resource consumption, clarifying performance challenges under heavy load.
---

# Load Testing Report

The objective of this report is to evaluate the operational stability of the Intmax network under conditions of high CPU and memory resource consumption, clarifying performance challenges under heavy load.

## Testing Policy

The evaluation focuses on determining whether Intmax nodes can efficiently process large numbers of transactions. Specific attention is given to the impacts of database inflation and increased ZKP (Zero-Knowledge Proof) generation times on the system.

## Testing Methodology

A load testing environment closely resembling the production environment was set up under the following conditions:

- Multiple users simultaneously requesting transactions.
- Users concurrently generating balance proofs.
- Gradual increase in the number of users, maintaining sustained load over extended periods.
- Incremental adjustments to node specifications to verify processing capacity limits.

## Metrics Monitored

A script was executed to repeatedly simulate transactions by adjusting the number of simultaneous users. The following metrics were measured and monitored through server logs:

- **Nodes**
  - Requests per second
  - Response times
  - CPU usage
  - Memory usage
- **Postgres**
  - Number of active connections
  - Memory usage
  - CPU usage
  - Data read/write speed per second
- **Redis**
  - Memory usage
  - Cache hit rate

## Nodes Under Evaluation

The following nodes were included in this test:

- **Block Builder**
  - Block generation node for the Intmax network.
- **Store Vault Server**
  - Node for transaction encryption and storage.
- **Withdrawal Server**
  - Node for ZKP verification and smart contract submission.
- **Validity Prover**
  - Node for verifying block validity.
  - CPU: 32 cores, Memory: 64Gi
  - 4 units
- **Balance Prover**
  - Node generating ZKP for balance proofs.
  - CPU: 32 cores, Memory: 64Gi
  - 4 units

## Test Results

- **Optimizing the DB Connection Pool**

  Stress tests involving heavy, concurrent access to encrypted transactions revealed that the default pool limit could be exceeded. Expanding the pool size and tuning related parameters resolved the issue promptly.

- **Node-Level Scalability Assessment**

  As user volume was gradually increased, the first component to hit its capacity ceiling was the ZKP proof-generation module. Adding CPU resources keeps block-production intervals stable, so horizontal scaling provides the required headroom.

- **Current Proof-Generation Times and Headroom for Improvement**

  With the present configuration, each worker produces a block-validity proof in roughly 65 seconds. We estimate that horizontal scaling could reduce this figure to about 20 seconds per block.

- **Balance-Proof Response Times**

  Balance proofs currently take about 5 seconds each, and during concentrated bursts of simultaneous requests we observed wait times exceeding 5 minutes. Increasing throughput via scale-out will shorten these queues.

- **Synchronization Under High Parallel Access**

  Balance synchronization—mandatory just before a transaction—is security-critical. Under extreme concurrency, it temporarily lowers overall throughput.

## Summary

These findings make it clear that expanding compute resources for the **Validity Prover and Balance Prover**, along with stronger load-distribution strategies, will yield the greatest impact as traffic grows. We are already progressing with scale-out architecture and optimization tasks, and staged upgrades will further boost overall network performance and user experience.
