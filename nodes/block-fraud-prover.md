# Block Fraud Prover specification

## Version

**Version Number**: v0.2.0

**Update Date**: 16.06.2024

## Purpose

This document aims to clarify the role and operation of the Block Fraud Prover node (formerly known as the watcher) that operates on the INTMAX network. The Block Fraud Prover node is responsible for verifying the validity of blocks and submitting fraud proofs to the rollup contract if errors are found.

### Decentralization

Block Fraud Prover nodes are **decentralized** and deployed across the network. Users can set up their own nodes and receive rewards according to the protocol. Each Block Fraud Prover node operates independently without needing to synchronize with other Block Fraud Prover nodes, enhancing the system's fault tolerance and scalability.

### Key Functions

This node performs the following functions:

1. **Subscribe to New Block Submissions**:
    - Subscribe to contract event logs and verify the validity of blocks each time a block is posted.
2. **Validate Block Validity**:
    - Retrieve the public keys of each sender within the block, calculate the aggregate public key, and compare it with the one submitted to the rollup contract.
3. **Create Fraud Proofs**:
    - If an error is found, create a fraud proof, convert it into a format that can be verified by Solidity, and submit it.

## Scope

- Node program written in Rust
- Dockerfile and docker-compose.yml for launching the node
- Documentation detailing usage (README.md)

## Requirements Specification

### Functional Requirements

- **Block Validity Verification Job**:
    1. Retrieve blocks not yet reflected in the block validity proof:
        - Check if there are blocks not reflected in the block validity proof against the rollup contract. If there are, the following processes are triggered.
    2. Verify that fraud proof has not already been submitted by other nodes:
        - If not yet submitted, proceed to step 3.
        - If already submitted, terminate the job normally.
    3. Validate the block's validity:
        - If the sender is specified by a public key:
            - Assign the smallest unallocated account ID and include the public key and block number in the account tree's leaf indexed by the account ID.
            - If the leaf containing the public key exists in the account tree, submit fraud proof based on the inclusion proof and proceed to step 4.
        - If the sender is specified by an account ID:
            - Update the block number in the leaf indexed by the account ID in the account tree and recalculate the Merkle tree.
                - If the leaf indexed by the account ID does not exist in the account tree, submit fraud proof based on the non-inclusion proof and proceed to step 4.
        - If the aggregate public key calculated from each sender's public key in the block differs from the one submitted to the rollup contract, proceed to step 4.
        - If all the above criteria are passed, terminate the job normally.
    4. Create fraud proof:
        - Create fraud proof to demonstrate the error.
    5. Convert Plonky2 proof into a format that can be verified by Solidity.
    6. Re-verify that fraud proof has not already been submitted by other nodes:
        - If not yet submitted, proceed to step 7.
        - If already submitted, terminate the job normally.
    7. Submit evidence to the rollup contract:
        - If a valid proof is submitted, receive 0.05 ETH as a reward from the block builder's stake and burn an additional 0.05 ETH.
        - If the proof is incorrect, the block fraud prover receives nothing.

### Non-functional Requirements

- **Performance**: High CPU performance and large memory capacity are required for ZKP calculations.
- **Availability**: High uptime is not required. The node helps prevent spam by block builders but does not impact overall network security if not operational.
- **Conflict Resolution**:
    - **Submission of block fraud proof**: Only the first transaction accepted by the Scroll network receives a reward.
- **Process Resumption**: Ensure the process can be resumed if the node goes down.
- **Program Updates**: Safe application of patches when the program is updated.

## System Architecture

This section explains the overall structure and components of the system.

- Hardware Configuration:
    - Servers:
        - High CPU performance
        - Large memory capacity
        - Minimum storage capacity
    - Network:
        - Minimum required bandwidth
        - High speed and reliability
- Software Configuration:
    - Runtime Environment: Docker, Docker Compose
    - Programming Language: Rust

## Interfaces

### User Interface

This section explains the overview and requirements of the user interface.

- Node Startup:
    - Launch the container using docker-compose
    - Startup command: `docker-compose up -d block-fraud-prover`
- Node Shutdown:
    - Stop the container using docker-compose
    - Shutdown command: `docker-compose down block-fraud-prover`

### System Interface

This section explains the integration and interface with other systems.

- Scroll Network:
    - Connection method: Connect to the Scroll network using the go-ethereum library.
    - Rollup Contract:
        - Monitor `PostedBlock` events and collect block data.
        - Submit evidence (block fraud proof) if necessary to show a block is invalid.
- External Services:
    - [1rpc.io](https://www.1rpc.io/):
        - Use RPC services on the Scroll network with a monthly subscription.

## Data

Will be added soon.

## Security

This section explains the security requirements and measures for the system.

- **Data Encryption**: Encrypt communication paths with external services using SSL/TLS.
- **Access Control**: Restrict access to the node to authenticated users only.
- **Log Monitoring**: Monitor logs in real-time to detect unauthorized access or abnormal behavior.
- **Private Keys**:
    - **Access Control**: Strictly control permissions to access private keys, allowing only the minimum required users or processes.
    - **Secure Storage**: Store private keys in a secure location, such as physically protected secure places or encrypted databases, to prevent unauthorized access.

## References

### Fraud Proof Items

- Account ID not yet assigned
    - The account tree does not contain a leaf with that account ID as the key
- Retrieve the public keys of each sender in the block, compute the aggregate public key, and find it differs from the one submitted to the Rollup contract
    - Verify the Merkle proof from the block hash tree root concerning the relevant block number
    - Validate that the block hash can be calculated from the content of the relevant block
    - The sender list in the block contains either account IDs or public keys
    - In the case of account IDs, obtain the public key by examining the leaf with the account ID as the key in the account tree
    - With the list of senders' public keys, compute the aggregate public key
    - Validate the block's aggregate signature using the block's transaction tree root and the computed aggregate public key
        - The transaction tree root is the message of the signature