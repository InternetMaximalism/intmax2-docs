# Node Indexer specification

## Version

**Version Number**: v0.2.0

**Update Date**: 16.06.2024

## Purpose

The purpose of this document is to clarify the role and operation of the node indexer operating on the INTMAX network. The node indexer provides information to help users find active block builder nodes. It maintains a list of currently active builders and recommends which nodes to connect to.

### Decentralization

This node is decentralized and distributed across the network. Users can set up their own nodes, but no economic incentives are provided by the protocol. Each node indexer operates independently and does not need to synchronize with other node indexer nodes.

### Key Functions

This node performs the following functions:

1. **Creating a Node List**
    
    Check the indexer contract and update the node URLs if there are any changes.
    
2. **Maintaining the Node List**
    
    Perform health checks on the nodes in the list, and exclude any nodes that have not responded for more than a day.
    

## Scope

- Node program
- Dockerfile and docker-compose.yml for starting the node
- Documentation (README.md) detailing usage instructions

## Requirements

### Functional Requirements

- Creation and Maintenance of Block Builder Node List
    
    Periodically check the indexer contract for updates to node URLs and reflect any changes. Perform health checks on nodes in the list and exclude any that have not responded for an extended period.
    
    **NOTE**: Nodes registered in the indexer contract but not responding are considered offline. There are no penalties for going offline, but the node will be removed from the node indexer search. To be re-indexed, the user must call the URL update method in the contract.
    
    **Procedure**
    
    The following process is carried out every hour:
    
    1. Check for updates to node information in the indexer contract.
        - Verify the maximum block number from which the `BuilderUpdate` event was retrieved from the DB.
            - `last_seen_builder_update_block_number`
    2. The node indexer retrieves updates or registrations of URLs from the indexer contract.
        - `BlockBuilderUpdated(address indexed blockBuilder, string url)` event
    3. If there are new URLs, obtain node information by calling the `GET /info` API on those nodes.
        - Successful requests will yield JSON representing block builder information (referred to as `builderInfo`).
        - Failed requests will result in the node information not being saved in the DB.
    4. Update the list of block builders stored in the DB.
        - If there is no existing data with the same Scroll address, simply add the new data.
            - Save the following in the `builder_nodes` table:
                - id: Auto-assigned primary key
                - url: Node URL obtained from the `BlockBuilderUpdated` event log.
                - scroll_address: Node Scroll address obtained from the `BlockBuilderUpdated` event log.
                - transaction_fee: Transaction fee in ETH set by the node, obtained from the `builderInfo` key `transferFee`.
                    - If a key representing the native token exists, save its value.
                    - Otherwise, set to NULL.
                - last_response_time: The time of the last response, saved at the end of step 3.
                - health_check_response_time: The time taken to execute step 3, saved in milliseconds.
                - status: Set to ACTIVE.
                - created_at: Record creation time is automatically recorded.
        - If the same Scroll address is already registered, update the URL and set the status to ACTIVE.
            - Update the `builder_nodes` table with the following:
                - url: Node URL obtained from the `BlockBuilderUpdated` event log.
                - transaction_fee: Transaction fee in ETH set by the node, obtained from the `builderInfo` key `transferFee`.
                    - If a key representing the native token exists, save its value.
                    - Otherwise, set to NULL.
                - last_response_time: The time of the last response, saved at the end of step 3.
                - health_check_response_time: The time taken to execute step 3, saved in milliseconds.
                - status: Set to ACTIVE.
    5. Save the maximum block number reflected in the `BuilderUpdate` event log in `last_seen_builder_update_block_number` in the DB.
    6. For nodes in the DB with a status of ACTIVE that were not updated in step 4, perform the following:
        - Obtain node information as in step 3.
        - Update the `builder_nodes` table with the following:
            - transaction_fee: Transaction fee in ETH set by the node, obtained from the `builderInfo` key `transferFee`.
                - If a key representing the native token exists, save its value.
                - Otherwise, set to NULL.
            - last_response_time: The time of the last response, saved at the end of step 3.
            - health_check_response_time: The time taken to execute step 3, saved in milliseconds.
- Returning a List of Active Block Builders
    
    Procedure
    
    1. Return a list of active Block Builders to the user.
        - The user calls the `GET /index/block-builder` API of the Node Indexer.
            - Request content:
                - `limit`: The maximum number of entries to retrieve.
        - Look up the `builder_nodes` table and return the specified number of Block Builders with a status of ACTIVE.
- Creating and Maintaining Block Validity Prover Node List
    
    Will be added soon.
    
- Returning a List of Active Block Validity Provers
    
    Procedure
    
    1. Return a list of active Block Validity Provers to the user
        - The user calls the `GET /index/validity-prover` API of the Node Indexer.
            - Request content:
                - `limit`: The maximum number of entries to retrieve.
        - Look up the `validity_prover_nodes` table and return the specified number of Block Validity Provers with a status of ACTIVE.
            - Response content:
                - `blockValidityProver`

### Non-Functional Requirements

- **Response Time**: Respond quickly to user requests.
    - The API response to recommend a block builder should be returned within one second to maintain the accuracy of the rapidly changing activity status of block builders.
- **Availability**: Maintain high uptime and minimize downtime.
- **Scalability**: Capable of scaling up and out to handle increased requests.
- **Resilience**: Able to restart and continue processing in case of node failure.
- **Software Updates**: Safely apply patches and updates to the program.

## System Architecture

- Hardware Configuration
    - Server
        - Sufficient CPU performance and memory to handle user requests.
        - Ample storage space.
    - Network
        - Sufficient bandwidth to handle user requests.
        - High-speed and reliable network.
- Software Configuration
    - Runtime Environment: Docker, Docker Compose
    - Programming Language: Go

## Interface

### User Interface

Explanation and requirements for the user interface.

- Node Startup
    - Start containers using docker-compose
    - Command: `docker-compose up -d node-indexer`
- Node Shutdown
    - Stop containers using docker-compose
    - Command: `docker-compose down node-indexer`

### System Interface

Explanation of interactions and interfaces with other systems.

- Scroll Network:
    - Connection Method: Connect to the Scroll network using the go-ethereum library.
    - Contracts Used:
        - Rollup contract: Monitor `PostedBlock` events and collect transaction data.
        - Indexer contract: Monitor `UpdatedNodeInfo` events and collect transaction data.
- [1rpc.io](https://www.1rpc.io/)
    - Monthly subscription to utilize RPC services on Scroll.

## Data

### Data Requirements

- **Private Key**: Private key owning ETH on Scroll.
- **Block Builder**
    - url: Node URL
    - scrollAddress: Node's Scroll address.
    - publicKey: Public key used in the INTMAX network.
    - transactionFee: Current transaction fee in ETH.
        - Primarily specified in ETH, but converted to ETH if other tokens are used.
        - Set to NULL if using tokens whose prices cannot be obtained.
    - lastResponseTime: Time of the last response.
    - healthCheckResponseTime: Response time of the node information retrieval API (milliseconds).
    - status: Activity status.
        - ACTIVE: Active
        - INACTIVE: Inactive
- **Block Validity Prover List**
    - url: Node URL
    - lastResponseTime: Time of the last response.
    - healthCheckResponseTime: Response time of the health check API (milliseconds).

### Database

- PostgreSQL
    - builder_nodes Table
        
        
        | Column Name | Data Type | PK | FK | NotNull | Default |
        | --- | --- | --- | --- | --- | --- |
        | id | Integer | PK |  | Yes |  |
        | url | String |  |  | Yes |  |
        | scroll_address | String |  |  | Yes |  |
        | public_key | String |  |  | Yes |  |
        | transaction_fee | String |  |  |  | NULL |
        | last_response_time | Timestamp |  |  | Yes | NOW() |
        | health_check_response_time | Integer |  |  | Yes |  |
        | status | String |  |  | Yes | ACTIVE |
        | created_at | Timestamp |  |  | Yes | NOW() |
        - id: Primary key
        - url: Node URL
        - scroll_address: Node's Scroll address.
        - public_key: Public key used in the INTMAX network.
        - transaction_fee: Current transaction fee in ETH.
            - Primarily specified in ETH, but converted to ETH if other tokens are used.
            - Set to NULL if using tokens whose prices cannot be obtained.
        - last_response_time: Time of the last response.
        - health_check_response_time: Response time of the node information retrieval API (milliseconds).
        - status: Activity status.
            - ACTIVE: Active
            - INACTIVE: Inactive
        - create_at: Record creation time.
    - validity_prover_nodes Table
        
        
        | Column Name | Data Type | PK | FK | NotNull | Default |
        | --- | --- | --- | --- | --- | --- |
        | id | Integer | PK |  | Yes |  |
        | url | String |  |  | Yes |  |
        | last_response_time | Timestamp |  |  | Yes | NOW() |
        | health_check_response_time | Integer |  |  | Yes |  |
        | status | String |  |  | Yes | Pending |
        | created_at | Timestamp |  |  | Yes | NOW() |
        - id: Primary key
        - url: Node URL
        - last_response_time: Time of the last response.
        - health_check_response_time: Response time of the health check API (milliseconds).
        - status: Activity status.
            - ACTIVE: Active
            - INACTIVE: Inactive
        - create_at: Record creation time.
    - last_seen_event Table
        
        
        | Column Name | Data Type | PK | FK | NotNull | Default |
        | --- | --- | --- | --- | --- | --- |
        | id | Integer | PK |  | Yes |  |
        | last_seen_builder_update_block_number | Integer |  |  | Yes | 0 |
        | last_seen_validity_prover_update_block_number | Integer |  |  | Yes | 0 |
        | created_at | Timestamp |  |  | Yes | NOW() |
        - id: Primary key
        - last_seen_builder_update_block_number: Verify the maximum block number from which the `BuilderUpdate` event was retrieved.
        - last_seen_validity_prover_update_block_number: Verify the maximum block number from which the `ValidityProverUpdate` event was retrieved.
        - create_at: Record creation time.

## Security

Explanation of the system's security requirements and measures.

- **Data Encryption**: Encrypt communication paths with external services using SSL/TLS.
- **Access Control**: Limit access to the node to authenticated users only.
- **Log Monitoring**: Monitor logs in real-time to detect unauthorized access or abnormal behavior.
- **Private Key**
    - **Access Control**: Strictly control access to the private key, allowing only necessary users or processes.
    - **Secure Storage**: Store the private key in a secure location, such as a physically protected secure area or an encrypted database, to prevent unauthorized access.
