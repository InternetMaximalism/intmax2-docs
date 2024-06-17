# Balance Validity Prover specification

## Version

**Version Number**: v0.2.0

**Update Date**: 16.06.2024

## Purpose

The purpose of this document is to clarify the detailed specifications required for the Balance Validity Prover node to manage the process of generating and providing proofs related to user balance updates and transfers. Specifically, the node is tasked with generating Plonky2 proofs, protecting the witness inputs while efficiently creating proofs, and returning them to users.

### Decentralization

The Block Validity Prover nodes are operated solely by the INTMAX team. Although users can set up their own nodes, no economic incentives are provided by the protocol. However, there is the benefit of enhanced privacy protection when proving their own balance. Each Block Validity Prover node operates independently and does not need to synchronize with other Block Validity Prover nodes.

### Key Functions

The node implements the following functions:

1. **Updating Balance Proofs**:
    - Accepts user requests to update balance proofs and collects the necessary data.
    - Accesses this process for deposit and transfer transactions.
    - Uses TEE to protect witness inputs while generating Plonky2 proofs.
    - Returns the generated proof to the user.
2. **Managing Block Validity Proofs**:
    - Manages the verification of block validity proofs and the necessary Merkle proofs.

## Scope

- Node program written in Rust
- Dockerfile and docker-compose.yml for node startup
- Documentation detailing usage (README.md)

## Requirements

### Functional Requirements

- Accept user requests to update balance proofs (without TEE)
    1. Users have their balance for all types of tokens, Plonky2 proof called balance proof, and merged tx nullifier tree.
        - Merged tx nullifier tree is a sparse Merkle tree containing all transfer hashes received so far as leaves.
    2. Users receive a Plonky2 proof called validity proof from the aggregator.
    3. Verify that the block hash included in the public inputs of the validity proof is from a block posted to the rollup contract.
    4. In a single request, users send 280 KB to 420 KB of data to the server and receive 140 KB of data in return.
        - Multiple transfer data can be batched together, increasing input by 140 KB per transaction.
    5. Users provide the ZKP prover with the following information:
        - Merkle proof of the token to be reflected in the asset tree (32 bytes * 2)
        - Public inputs of the balance proof (96 bytes)
            - Balance hash (32 bytes)
            - Root of the merged tx nullifier tree (32 bytes)
            - Block hash (32 bytes)
        - All leaves included in the merged tx nullifier tree (32 bytes * number of transfers)
            - Most users have about 5 transfers.
            - There's no upper limit, so it’s possible to handle up to 10,000 transfers.
        - Balance proof (140 KB)
        - Validity proof (140 KB)
        - Data required for updating balance (one of the following):
            - Deposit data (388 bytes)
                - Deposit tree siblings (320 bytes = 32 bytes * height 10)
                - Deposit data (68 bytes)
                    - Receiver (32 bytes)
                    - Token index (4 bytes)
                    - Amount (32 bytes)
            - Transfer batch details when the user is the sender (~9 KB)
                - Transfer batch (~9 KB)
                    - Nonce (4 bytes)
                    - Transfer data (~10 KB = 81 bytes * max 128 transactions)
                        - Sender (5 bytes)
                        - Receiver (32 bytes)
                        - Token index (4 bytes)
                        - Amount (32 bytes)
                        - Salt (8 bytes)
            - Transfer data when the user is the receiver (140 KB)
                - Sender's balance proof (140 KB)
                - Transfer data (68 bytes)
                    - Receiver (32 bytes)
                    - Token index (4 bytes)
                    - Amount (32 bytes)
    6. The user provides all this data to the prover to generate the Plonky2 proof.
    7. The prover returns the following information to the user:
        - Updated balance proof (140 KB)
        - Public inputs of the balance proof (96 bytes)
            - Balance hash (32 bytes)
            - Root of the merged tx nullifier tree (32 bytes)
            - Block hash (32 bytes)
    8. The user performs the following calculations:
        - Updates their balance for all types of tokens.
        - Adds the transfer hash to the merged tx nullifier tree when they are the receiver.
    9. Verifies that the returned balance proof is correct:
        - Valid as a Plonky2 proof.
        - The balance hash in the public inputs matches the user’s calculated hash.
        - The root of the merged tx nullifier tree in the public inputs matches the user’s calculated root.
        - The block hash in the public inputs matches the block hash in the validity proof’s public inputs.

### Non-Functional Requirements

- **Availability**: Maintain high uptime and minimize downtime.
- **Scalability**: Capable of scaling up and out to handle increasing requests.
- **Recovery**: Able to resume operations if the node goes down.
- **Updates**: Safely apply patches when program modifications are needed.

## System Configuration

Explanation of the overall system and its components.

- Hardware Configuration
    - Server
        - High CPU performance capable of calculating ZKP and ample memory space.
        - Sufficient storage space.
    - Network
        - Adequate bandwidth for sending and receiving ZKP.
        - High speed and reliability.
- Software Configuration
    - Runtime Environment: Docker, Docker Compose
    - Programming Language: Rust

## Interface

### User Interface

Overview and requirements for the user interface.

- CLI
    - Node startup
        - Start the container using docker-compose
        - Command: `docker-compose up -d balance-validity-prover`
    - Node shutdown
        - Stop the container using docker-compose
        - Command: `docker-compose down balance-validity-prover`
- REST API
    - Health Check
    - Accepting balance proof update requests from users

### System Interface

Explanation of interactions and interfaces with other systems.

- Block Validity Prover
    - Retrieve block validity proof

## Data

### Data Requirements

- enough balance proof: Data indicating the user's balance is non-negative
    - Transacted in the format of Plonky2 proof
- Transfer data
    - Necessary for reflecting received tokens in the balance
- Transaction data
    - Necessary for reflecting sent tokens in the balance
- Deposit data
    - Necessary for reflecting deposited tokens in the balance

### Database

Will be added soon.

## Security

Explanation of the system’s security requirements and measures.

- **Data Encryption**: Encrypt communication paths with external services using SSL/TLS.
- **Access Control**: Users can only access the ZKP calculation results they requested.
- **Log Monitoring**: Monitor logs in real-time to detect unauthorized access or abnormal behavior.
