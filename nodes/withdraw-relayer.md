# Withdraw Relayer specification

## Version

**Version Number**: v0.2.0

**Update Date**: 16.06.2024

## Purpose

The purpose of this document is to clarify the detailed specifications of the node responsible for processing withdrawal requests from the INTMAX network to the Ethereum network. This node manages the process of executing withdrawals on the Ethereum network based on withdrawal requests sent from the Rollup contract, ensuring the proper transfer of ETH, ERC20, and ERC721 tokens.

### Decentralization

This node is **decentralized** and deployed across the network. Users can also set up their own nodes and are rewarded by the protocol. Each Withdraw Relayer node operates independently and does not need to synchronize with other Withdraw Relayer nodes.

### Key Functions

Specifically, the node implements the following functions:

1. **Execution of Withdrawals**:
    - Use the Scroll network's message bridge functionality to transmit the root hash of the withdraw tree to the Liquidity contract on the Ethereum network.
        - Multiple root hashes can be transmitted together.
    - Execute withdrawals on the Ethereum network's Liquidity contract and send tokens to users.
2. **Cancellation and Retrying of Withdrawals**:
    - Provide an API for users to cancel withdrawal requests if necessary.
    - Implement a retry mechanism for failed withdrawal processes.

## Scope

- Node program written in Go
- Dockerfile and docker-compose.yml for starting the node
- Documentation (README.md) detailing usage

## Requirements Specification

### Functional Requirements

- Execution of Withdrawals
    
    **Procedure**
    
    1. The Withdraw Relayer executes the `relayWithdrawals` method of the Liquidity contract.
        - This function includes all the leaves of the withdraw tree in the calldata.
        - The provided leaves are used to calculate the root of the withdraw tree, which must match the messaged value.
            - **NOTE**: It is demonstrated on the Scroll network that such leaves exist.
        - Tokens are sent as specified in the leaves.
            - For ETH withdrawals, the amount is sent directly to the user without needing a claim.
            - For ERC20 or ERC721 withdrawals, the user needs to claim the tokens.

### Non-Functional Requirements

- **Availability**: At least one Withdraw Relayer node must be operational across the network.
- **Conflict Resolution**: Design a mechanism to resolve conflicts when multiple nodes attempt the same action simultaneously. For example, determine processing timing based on the node's Ethereum address to resolve conflicts appropriately.
- **Recovery**: The node should be able to resume processing if it goes down.
- **Program Updates**: Ensure safe patching of the program when there are fixes or updates.

## System Configuration

Describe the overall system and its components.

- Hardware Configuration
    - Server
        - Minimum required CPU performance
        - Minimum required memory capacity
        - Minimum required storage capacity
    - Network
        - Sufficient bandwidth
        - High speed and reliability
- Software Configuration
    - Runtime Environment: Docker, Docker Compose
    - Programming Language: Go

## Interface

### User Interface

Describe the user interface overview and requirements.

- CLI
    - Starting the Node
        - Launching the container with docker-compose
        - Command: `docker-compose up -d withdraw-relayer`
    - Stopping the Node
        - Stopping the container with docker-compose
        - Command: `docker-compose down withdraw-relayer`
- REST API
    - Health Check
        
        **Endpoint**: `/`
        
        **Method**: GET
        
        **Description**: Performs a health check.
        
        **Request Format**: None
        
        **Response Format**:
        
        ```json
        {
            "success": true
        }
        ```
        

### System Interface

- Rollup Contract
    - Obtain details of withdrawal requests submitted by the withdraw aggregator
    - Transmit withdrawal requests to Ethereum

## Data

### Data Requirements

- **Private Key**: The private key owning ETH on the Ethereum network

### Database

None

## Security

This section describes the system security requirements and measures.

- **Log Monitoring**: Monitor logs in real-time to detect unauthorized access or abnormal behavior.
- **Private Key Management**
    - **Access Control**: Strictly control permissions to access the private key, allowing only necessary users or processes to access it.
    - **Secure Storage**: The private key should be stored in a secure location. This could be a physically protected secure location or an encrypted database to prevent unauthorized access.