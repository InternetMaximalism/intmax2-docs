# Block Validity Prover specification

## Version

**Version Number**: v0.2.0

**Update Date**: 16.06.2024

## Purpose

The purpose of this document is to clarify the detailed specifications of the Block Validity Prover node (formerly known as Aggregator), which stores and provides Merkle trees and ZKPs commonly used in the INTMAX network upon user request. This node manages the process of securely and efficiently storing the generated Merkle trees and ZKPs and providing them to users as needed. This node also serves the role of the Block Fraud Prover (formerly known as Watcher).

### Decentralization

This node is decentralized and deployed across the network. While users can set up their own nodes, no economic incentives are provided by the protocol. Each Block Validity Prover node operates independently and does not need to synchronize with other Block Validity Prover nodes.

### Main Functions

Specifically, the node implements the following functions:

1. **Storage of Merkle trees and ZKPs**:
    - Each time a new INTMAX block is posted to the Rollup contract, various data are added to the Merkle tree, and ZKPs are generated.
    - The generated Merkle tree proofs and ZKPs are stored in the database and updated as needed.
    - Perform necessary validations to ensure data accuracy.
2. **Provision of Data**:
    - When there is a request from a user to retrieve data, the node provides the Merkle tree or ZKP from the database.

## Scope

- Node program written in Rust
- Dockerfile and docker-compose.yml for node startup
- Documentation for usage (README.md)

## Requirements Specification

### Functional Requirements

- The node reflects new block posts from the Rollup Contract on Scroll to the block validity proof.
    
    **Procedure**
    
    1. Retrieve blocks not yet reflected in the block validity proof
        - Periodically retrieve events from the Rollup contract (specify the latest scroll block number that has not yet been obtained to prevent reorg).
        - Check if there are any blocks not yet reflected in the block validity proof in the Rollup contract. If there are, trigger the following processes.
    2. Validate block format
        - There are two ways to specify the transaction sender:
            - **Direct specification of public key**: Directly specify the sender's public key. Once a transaction is executed using the public key, an account ID is assigned.
            - **Specify registered account ID**: Specify an already registered account ID. Subsequent transactions using the public key must be specified by the account ID.
        - **The method of specifying the transaction sender within a block must be unified as either the public key or the account ID. They cannot be mixed within the same block. That is, Block A contains only transactions where the sender is specified by the public key, and Block B contains only transactions where the sender is specified by the account ID.**
    3. Update the account tree
        
        The sender can be specified by a public key or an account ID.
        
        - If the sender is specified by a public key:
            - If there is no leaf containing the sender's public key in the account tree, assign the smallest unused account ID and include the public key and block number in the leaf indexed by that account ID.
            - If there is a leaf containing the sender's public key in the account tree, create an inclusion proof for the account tree and submit a fraud proof to the Rollup contract.
                - If the submission of the fraud proof is successful or if another node has already submitted a fraud proof, proceed to step 4.
                - Otherwise, terminate abnormally.
        - If the sender is specified by an account ID:
            - Update the block number of the leaf indexed by the account ID in the account tree to the block number to be reflected this time and recalculate the Merkle tree.
            - If there is no leaf indexed by that account ID in the account tree, create a non-inclusion proof for the account tree and submit a fraud proof to the Rollup contract.
                - If the submission of the fraud proof is successful or if another node has already submitted a fraud proof, proceed to step 4.
                - Otherwise, terminate abnormally.
    4. Update the block info tree
        - Add the block hash, tx root, and valid senders to the block info tree leaf and recalculate the root hash.
    5. Calculate the aggregated public key
        - Obtain the public keys of each sender included in the block and calculate the aggregated public key. If it differs from what was submitted to the Rollup contract, submit a fraud proof.
            - If the submission of the fraud proof is successful or if another node has already submitted a fraud proof, proceed to step 6.
            - Otherwise, terminate abnormally.
    6. Generate the block validity proof
        - Prove that the above update processes were correctly performed using Plonky2.
    7. Save the block numbers that have been reflected
        - Save the following data along with the generated ZKP in the database:
            - `lastSeenBlockNumber`: The largest block number among the confirmed blocks.
            - `blockValidityProof`: The latest block validity proof.
            - Leaves and roots of `accountTree`.
            - Leaves and roots of `depositTree`.
            - Leaves and roots of `blockHashTree`.
        - Update to reflect all the processed data at the end. If the process is interrupted, the last seen block number and ZKP are not updated, and the process is restarted from step 1.
- The node provides block validity proofs to users.
    
    **Procedure**
    
    1. The user specifies a block number to retrieve the block validity proof from the Block Validity Prover.
        - Block validity proofs are stored in the database.
        - If no block number is specified, the latest block validity proof is returned.
        - A non-latest block validity proof is used when the sender of a transaction updates the balance proof.
            - For other cases where it is necessary to update the balance proof, the latest balance proof can be used.
- The node provides the Merkle proof of the account tree to users.
    
    Retrieve the Merkle proof of the account tree for the specified public key.
    
    **Procedure**
    
    1. Return the Merkle proof of the account tree for the public key specified by the user.
        - The account tree is stored in the database.
- The node provides the Merkle proof of the block info tree to users.
    
    Retrieve the Merkle proof of the block info tree for the specified block hash.
    
    **Procedure**
    
    1. Return the Merkle proof of the block info tree for the specified block number from the user.
        - The block info tree is stored in the database.

### Non-Functional Requirements

- **Availability**: The node maintains a high uptime and minimizes downtime.
- **Scalability**: The node can scale up and out to handle increased requests.
- **Response Time**: The node responds promptly to user requests within 500 milliseconds.
- **Process Recovery**: The node can resume operations if it goes down during processing.
- **Program Updates**: The node can be safely patched when program modifications occur.
- **ZKP Generation Cost**: Calculating the block validity proof for each block takes about one minute, so ZKP generation should be parallelized across multiple instances. ⇒ To avoid being affected by sudden increases in requests and other external factors, the node's functions should be separated.

## System Configuration

Explanation of the overall system configuration and components.

- Hardware Configuration
    - Server
        - High CPU performance capable of generating ZKPs
        - Large memory capacity for generating ZKPs
        - Large storage capacity for managing Merkle trees
    - Network
        - Sufficient bandwidth
        - High speed and reliability
- Software Configuration
    - Runtime environment: Docker, Docker Compose
    - Programming language: Rust

## Interface

### User Interface

Explanation of the user interface and its requirements.

- CLI
    - Start the node
        - Launch the container using docker-compose
        - Command: `docker-compose up -d block-validity-prover`
    - Stop the node
        - Stop the container using docker-compose
        - Command: `docker-compose down block-validity-prover`
- REST API
    - Health Check
        - **Endpoint**: `/`
        - **Method**: GET
        - **Description**: Check the operational status of the node.
        - **Request Format**: None
        - **Response Format**:
            
            ```json
            {
                "success": true
            }
            ```
            
        - **Response Description**:
            - `success` (boolean): Indicates whether the node is operating normally.
    - API to provide block validity proof to users
        - **Endpoint**: `/block-validity-proof`
        - **Method**: GET
        - **Description**: Retrieve the latest block validity proof.
        - **Request Format**: None
        - **Response Format**:
            
            ```json
            {
                "success": true,
                "data": {
                    "blockValidityProof": "0xabc...",
                    "blockValidityPublicInputs": {
                        "blockHash": "0xabc...",
                        "blockNumber": 1000,
                        "blockInfoTreeRoot": "0xabc...",
                        "nextAccountId": 5,
                        "accountTreeRoot": "0xabc..."
                    }
                }
            }
            ```
            
        - **Response Description**:
            - `blockValidityProof` (string): The latest block validity proof.
            - `blockValidityPublicInputs`: Public inputs of the block validity proof.
                - `blockNumber` (number): The largest block number among the confirmed blocks.
                - `blockHash` (string): Block hash corresponding to the block number.
                - `blockInfoTreeRoot` (string): The latest block info tree root hash.
                - `nextAccountId` (number): The next account ID to be assigned.
                - `accountTreeRoot` (string): The latest account tree root hash.
    - API to provide the Merkle proof of the account tree to users
        - **Endpoint**: `/account-tree-proof`
        - **Method**: GET
        - **Description**: Retrieve the Merkle proof for the specified account ID.
        - **Request Format**:
            
            ```json
            {
                "publicKey": "0xabc...def"
            }
            ```
            
        - **Request Description**:
            - `publicKey` (string): Public key associated with the account.
        - **Response Format**:
            
            ```json
            {
                "success": true,
                "data": {
                    "accountId": 5,
                    "publicKey": "0xabc...def",
                    "lastSeenBlockNumber": 1000,
                    "merkleProof": [
                        "0xabc...def",
                        ...
                    ]
                }
            }
            ```
            
        - **Response Description**:
            - `accountId` (number): The retrieved account ID.
            - `publicKey` (string): Public key.
            - `lastSeenBlockNumber` (number): The last block number in which a transaction was performed.
            - `merkleProof` (string[]): Array of Merkle proof.
    - API to provide the Merkle proof of the block info tree to users
        - **Endpoint**: `/block-info-tree-proof`
        - **Method**: GET
        - **Description**: Retrieve the Merkle proof for the specified block hash.
        - **Request Format**:
            
            ```json
            {
                "blockHash": "0xabc...def"
            }
            ```
            
        - **Request Description**:
            - `blockHash` (string): Block hash for which the Merkle proof is to be retrieved.
        - **Response Format**:
            
            ```json
            {
                "success": true,
                "data": {
                    "blockNumber": 1000,
                    "merkleProof": [
                        "0xabc...def",
                        ...
                    ]
                }
            }
            ```
            
        - **Response Description**:
            - `blockNumber` (number): Block number.
            - `merkleProof` (string[]): Array of Merkle proof.

### System Interface

Explanation of the interaction and interface with other systems.

- Scroll Network:
    - Connect to the Scroll network using the [reth](https://github.com/paradigmxyz/reth) library.
    - Rollup contract: Monitor the `PostedBlock` event and collect block data.
- External Services:
    - [1rpc.io](https://www.1rpc.io/)
        - Provides RPC services on the Scroll network through a monthly subscription.

## Data

### Data Requirements

- block_number: Block number
    - Used to indicate the block to which the block validity proof has been reflected.
- block_hash: Block hash
- block_validity_proof: The latest block validity proof
- account_tree_root: The latest account tree root hash
- block_info_tree_root: The latest block info tree root hash
- next_account_id: The next account ID to be assigned

### Database

Explanation of the types and structure of the databases used.

- PostgreSQL
    - block_validity_proofs table
        
        
        | Column Name | Data Type | PK | NotNull | Default |
        | --- | --- | --- | --- | --- |
        | id | Integer | PK | Yes |  |
        | block_number | Integer |  | Yes |  |
        | block_hash | String |  | Yes |  |
        | block_validity_proof | String |  | Yes |  |
        | prev_account_tree_root | String |  | Yes |  |
        | block_info_tree_root | String |  | Yes |  |
        | next_account_id | Integer |  | Yes |  |
        | created_at | Timestamp |  | Yes | NOW() |
        - id: Unique identifier
        - block_number: The block number that this record's block_validity_proof targets
        - block_hash: Block hash corresponding to the block number
        - block_validity_proof: The latest block validity proof
        - prev_account_tree_root: The previous account tree root hash before the latest
        - block_info_tree_root: The latest block info tree root hash
        - next_account_id: The next account ID to be assigned
        - created_at: Record creation time
    - account_tree_leaves table
        
        Stores the latest leaves of the account tree.
        
        | Column Name | Data Type | PK | NotNull | Default |
        | --- | --- | --- | --- | --- |
        | id | Integer | PK | Yes |  |
        | account_id | Integer |  | Yes |  |
        | public_key | String |  | Yes |  |
        | last_seen_block_number | Integer |  | Yes |  |
        | created_at | Timestamp |  | Yes | NOW() |
        - id: Unique identifier
        - account_id: Account ID
        - public_key: Public key
        - last_seen_block_number: The last block number in which a transaction was performed
        - created_at: Record creation time
    - block_info_tree_leaves table
        
        Stores the latest leaves of the block info tree.
        
        | Column Name | Data Type | PK | NotNull | Default |
        | --- | --- | --- | --- | --- |
        | id | Integer | PK | Yes |  |
        | block_hash | String |  | Yes |  |
        | valid_senders | String[] |  | Yes |  |
        | tx_root | String |  | Yes |  |
        | block_number | Integer |  | Yes |  |
        | created_at | Timestamp |  | Yes | NOW() |
        - id: Unique identifier
        - block_hash: Block hash
        - valid_senders: List of senders who returned signatures
        - tx_root: The transaction root of this block
        - block_number: Block number
        - created_at: Record creation time
    - preimages table
        
        Stores internal nodes of the Merkle tree. To consider reversion, all internal nodes that have ever been added to the Merkle tree are kept along with the history of the Merkle tree's root hash to enable the restoration of any state of the Merkle tree.
        
        | Column Name | Data Type | PK | NotNull | Default |
        | --- | --- | --- | --- | --- |
        | hash | String | PK | Yes |  |
        | preimage | String |  | Yes |  |
        - hash: Hash
        - preimage: Preimage of the hash

## Security

Describe the system security requirements and measures.

- **Data Encryption**: Encrypt the communication path with external services using SSL/TLS.
- **Log Monitoring**: Monitor logs in real-time to detect unauthorized access and abnormal activities.
