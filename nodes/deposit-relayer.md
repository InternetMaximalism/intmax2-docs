# Deposit Relayer specification

## Version

**Version Number**: v0.2.0

**Update Date**: 16.06.2024

## Purpose

The purpose of this document is to clarify the detailed specifications of the node responsible for reflecting user deposits from the Ethereum network into the INTMAX network. Specifically, it manages the process of properly reflecting tokens (ETH, ERC20, ERC721) deposited by users into the INTMAX network.

### Decentralization

This node is **decentralized** and deployed across the network. Users can also set up their own nodes and are rewarded by the protocol. Each Deposit Relayer node operates independently and does not need to synchronize with other Deposit Relayer nodes.

### Terminology

**Deposit Request:** Refers to a request to deposit tokens from the Ethereum network to the INTMAX network.

**Deposit Transmission:** Reflecting the deposit in the network.

### Key Functions

This node implements the following functions:

1. **Transmission of Deposit Requests**:
    - Periodically transmit the deposit root from the Liquidity contract to the Rollup contract.
    - Implement fee management and processing methods.

## Scope

- Node program written in Go
- Dockerfile and docker-compose.yml for starting the node
- Documentation (README.md) detailing usage

## Requirements Specification

### Functional Requirements

- Transmission of Deposits
    
    Reflecting user deposits from the Ethereum network into the INTMAX network
    
    **Procedure**
    
    1. The Deposit Relayer periodically (after **1 hour from an unprocessed deposit or when 128 unprocessed deposits accumulate**) uses the Scroll message bridge function to transmit the deposit root to the Rollup contract on Scroll.
        - Specifically, it calls the `submitDepositRoot()` function of the Liquidity contract.
        - At this time, the Deposit Relayer receives a reward from the Liquidity contract.

### Non-Functional Requirements

- **Availability**: At least one Deposit Relayer node must be operational across the network.
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
        - Command: `docker-compose up -d deposit-relayer`
    - Stopping the Node
        - Stopping the container with docker-compose
        - Command: `docker-compose down deposit-relayer`
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

- Liquidity Contract
    - Transmit deposit requests from the liquidity contract to the rollup contract:
        - `submitDepositRoot()`

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
