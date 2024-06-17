# Node discovery flow

## Version

**Version Number**: v0.2.0

**Update Date**: 16.06.2024

## Overview

This document outlines the role and operation of the node indexer used to provide information for users to find active block builder nodes on the INTMAX network. The node indexer maintains a list of currently active builders and recommends a node to connect to from this list.

## Specifications

### Creating the Builder List

When a builder node is launched, its URL is registered on the smart contract. The indexer node periodically checks the smart contract for registered URLs and updates the builder list accordingly.

### Maintaining the List

Health checks are performed every hour, and URLs that do not respond for over a day are removed from the list. A registered but non-responsive block builder is considered offline.

There are no penalties for going offline voluntarily, but offline builders will be excluded from the indexer's search. To be re-listed by the indexer node, the URL update method must be called.

- Check the listed builder URLs every hour.
- Remove nodes from the list if they do not respond for a whole day.
- Offline builders will be re-listed if their URL is updated.

### Information Managed in the List

Essential information for identifying builder nodes:

- Builder node URL
- Public key used in the INTMAX network
- Scroll address used for block submission

Information to assess node health:

- Compliance with builder requirements:
    - Stake at least 0.1 ETH in the rollup contract.
    - If a block with incorrect signatures is posted, a fraud proof will be submitted by a watcher node, and 0.05 ETH will be paid from the staked ETH as a reward and an additional 0.05 ETH will be burned.
- Methods for finding block builders
    - Builder fee rates
    - Number of blocks posted so far
        - Aggregate blocks posted on the rollup contract
    - Response time

### Recommending a Builder from the List

Provide a method to recommend a single active node. Pre-determine the node to be recommended and perform frequent health checks. Recommending oneself is permissible.

### Taking a Builder Node Offline

No special notification to the indexer contract or the indexer node is required.

### Resigning as a Builder Node

Withdraw the staked ETH from the rollup contract.

### Considerations for Preparing the Indexer Contract

If URLs are managed via a smart contract, there's no need for nodes to synchronize with each other when multiple indexer nodes are operated.

Since this does not directly involve the protocol, it should be independent of the rollup contract. Whether or not there is a stake in the rollup contract is irrelevant to the contract.
