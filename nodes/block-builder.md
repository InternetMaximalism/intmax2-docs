# Block Builder specification

## Version

**Version Number**: v0.2.0

**Update Date**: 16.06.2024

## Purpose

The purpose of this document is to clarify the role and operation of the Block Builder node within the INTMAX network. This node is responsible for aggregating transaction requests from users, creating blocks, and reflecting them on the network.

### Decentralization

This node operates in a **decentralized** manner across the network. Users can set up their own nodes and are rewarded according to the protocol. Each Block Builder node operates independently and does not need to synchronize with other Block Builder nodes. This enhances the overall fault tolerance and scalability of the system.

### Key Functions

The node performs the following functions:

1. **Aggregation of Transaction Requests:**
    - Accepts transaction requests from users and efficiently aggregates them.
    - Validates each transaction request.
2. **Block Creation:**
    - Creates new blocks based on the aggregated transaction requests and obtains approval from the users.
    - Performs integrity checks on the created blocks.
3. **Reflection of Blocks on the Network:**
    - Sends the completed block to the Scroll network to finalize the current state of the network.
    - Confirms that the block has been properly added.

**Overall Flow**

![2024-06-16_11.06.15.png](/assets/2024-06-16_11.06.15.png)

## Scope

- Node program written in Go
- Dockerfile and docker-compose.yml for starting the node
- Documentation (README.md) on how to use the node

## Requirements Specification

### Functional Requirements

- Initialization of the Block Builder
    
    The block builder performs initialization during the node startup.
    
    **Procedure**
    
    1. When the block builder starts, it accesses the rollup contract and checks if its own address and URL are registered on the Scroll network.
    2. If the address and URL are registered, the node starts operating as a block builder.
    3. If not registered, it displays a message on the console asking the operator to input a private key with a sufficient ETH balance on Scroll.
        - The private key input should be stored in an ENV file or entered interactively via CLI to avoid exposure via history.
    4. If the block builder’s Scroll address does not have a sufficient stake (less than 0.1 ETH), a message indicating insufficient balance is displayed.
    5. The block builder calls the `updateBuilder(string memory url)` method on the rollup contract with the value needed to make the stake 0.1 ETH and inputs the URL as a function argument, outputting the event log `BuilderUpdate(address builder, string url)`.
        - **NOTE**: Higher stakes are allowed to ensure continuity even after a penalty.
        - **NOTE**: Multiple URLs cannot be registered from the same Scroll address. If `updateBuilder` is called when already registered, the previous URL is overwritten, and the stake amount is added.
    6. The block builder starts accepting user requests.
- Changing the Block Builder’s URL
    
    Used when the block builder changes its URL while retaining the same Scroll address.
    
    **Procedure**
    
    1. To change the URL, the operator sets up the node following the same procedure as initialization.
    2. The operator executes the URL change API.
        - The rollup contract’s block builder information change function is called.
- Deregistering the Block Builder
    
    Used when the block builder wants to withdraw the entire stake amount.
    
    **Procedure**
    
    1. The block builder calls the deregister function on the rollup contract.
    2. After a certain period, the block builder can call the function to withdraw the stake, controlled by the contract.
        - If the blocks posted by the block builder are no longer at risk of being reverted, the stake can be reclaimed, controlled by the contract.
    3. The operator executes the deregistration API.
        - Upon execution, the block builder begins the deregistration process.
            - During health checks, the node returns a status message indicating the deregistration process.
        - If transactions remain, they are either processed or discarded. If discarded, the client receives a status code (message) indicating deregistration.
            - Clients continuously request the transaction status from the block builder until the transaction’s expiration time (1 minute) passes.
        - Official deregistration can occur one day after the last block was posted by the block builder (after the fraud proof challenge period ends). The deregistration status is obtained during each initialization status request.
- Accepting Transaction Requests from Users
    
    [Send Transaction](/others/transfer-flow.md#Send-Transaction) 
    
- Users Retrieve Blocks Containing Their Transactions
    
    [Approve proposed block](/others/transfer-flow.md#Approve-proposed-block) - Request proposing block
    
- Users Send Signatures to Approve the Proposed Block
    
    [Approve proposed block](/others/transfer-flow.md#Approve-proposed-block) - Send signature
    
- Block Builder Posts Blocks to the Rollup Contract
    
    [Post block](/others/transfer-flow.md#Post-block) 
    
- Retrieve Block Builder Information
    
    Returns the Scroll address used by the block builder when posting blocks and the required difficulty.
    
    - The Scroll address used for posting blocks.
    - The PoW difficulty value set when the node was started.

### Non-functional Requirements

- **Availability**: The node should maintain high uptime and minimize downtime.
- **Scalability**: The node should be capable of scaling up and out to handle increased requests.
    - INTMAX: Expected to scale out
    - User: Expected to scale up or out, depending on expertise
- **Response Time**: The node should respond promptly to user requests.
    - API endpoints for receiving transaction requests, retrieving proposed blocks, and accepting signatures must respond within 1 second to ensure good user experience.
- **Resumption of Processing**: The node should be able to resume from the point of interruption in case of a shutdown.
- **Program Updates**: Safe application of patches and updates should be ensured.
- **Handling Malicious Builders**: There should be mechanisms to handle malicious builders.

## System Configuration

Description of the overall system and its components.

- Hardware Configuration
    - Server
        - Sufficient CPU performance to handle requests
        - Enough memory to construct Merkle trees
        - Ample storage space
    - Network
        - Adequate bandwidth
        - High speed and reliability
- Software Configuration
    - Runtime Environment: Docker, Docker Compose
    - Programming Language: Go

## Interface

### User Interface

Overview and requirements of the user interface.

- CLI
    - Node Startup
        - Start the container using docker-compose
        - Command: `docker-compose up -d block-builder`
    - Node Shutdown
        - Stop the container using docker-compose
        - Command: `docker-compose down block-builder`
- REST API
    - Health Check
        
        **Endpoint**: `/`
        
        **Method**: GET
        
        **Overview**: Performs a health check.
        
        **Request Format**: None
        
        **Response Format**:
        
        ```json
        {
            "success": true
        }
        ```
        
    - Send Transaction Request
        
        **Endpoint**: `/transaction`
        
        **Method**: POST
        
        **Overview**: Accepts transaction requests from users.
        
        **Request Format**:
        
        ```json
        {
          "feeTransferHash": "0x123...456",
          "transfersHash": "0x123...456",
          "nonce": 1,
          "powNonce": "0xabc...def"
        }
        ```
        
        **Request Description**:
        
        - `feeTransferHash` (string): Hash of the fee transfer request sent to the block builder
        - `transfersHash`: Poseidon hash of transfer tree root and token index
        - `nonce` (number): The number of transactions executed with this public key
        - `powNonce` (string): PoW nonce
        
        **Response Format**:
        
        ```json
        {
          "success": true,
          "data": {
            "message": "Transaction accepted and verified."
          }
        }
        ```
        
        **Response Description**:
        
        - 200: OK
            - `message` (string): Message indicating successful acceptance and verification.
        - 400: Bad Request
            - Transaction format error
            - PoW verification failure
        - 500: Internal Server Error
            - Block builder is unauthorized
                - Insufficient stake amount
    - Retrieve Proposed Block
        
        **Endpoint**: `/block/proposed`
        
        **Method**: GET
        
        **Overview**: Requests and retrieves the Merkle proof of a block containing the user's transaction, if available.
        
        **Request Format**:
        
        ```json
        {
          "txHash": "0xabc...def"
        }
        ```
        
        **Request Description**:
        
        - `txHash` (string): Transaction hash.
        
        **Response Format**:
        
        ```json
        {
          "success": true,
          "data": {
            "txRoot": "0xabc...def",
            "txTreeMerkleProof": [
              "0xabc...def"
            ],
          }
        }
        ```
        
        **Response Description**:
        
        - 200: OK
            - `txRoot` (string): Transaction tree root hash.
            - `txTreeMerkleProof` (string[]): Merkle proof from the tx tree for the specified txHash.
        - 404: Not Found
            - No matching transaction found
            - Matching transaction found, but the block has not been posted
    - Send Signature
        
        **Endpoint**: `/block/signature`
        
        **Method**: POST
        
        **Overview**: Sends the signature to approve the proposed block by signing the tx tree root.
        
        **Request Format**:
        
        ```json
        {
          "txRoot": "0xabc...def",
          "signature": "0xabc...def",
          "enoughBalanceProof": "0xabc...def",
        }
        ```
        
        **Request Description**:
        
        - `txRoot` (string): Transaction tree root hash.
        - `signature` (string): User's signature.
        - `enoughBalanceProof` (string): Proof of sufficient balance after sending
        
        **Response Format**:
        
        ```json
        {
          "success": true,
          "data": {
            "message": "Signature accepted."
          }
        }
        ```
        
        **Response Description**:
        
        - 200: OK
            - `message` (string): Message indicating the signature was accepted.
        - 400: Bad Request
            - Signature verification failure
    - Retrieve Block Builder Information
        
        **Endpoint**: `/info`
        
        **Method**: GET
        
        **Overview**: Retrieves the block builder's Scroll address, transaction fee, and difficulty.
        
        **Request Format**: None
        
        **Response Format**:
        
        ```json
        {
          "success": true,
          "data": {
            "scrollAddress": "0x123...456",
            "transferFee": {
              "0": "300000000000000",
              "1": "50000"
            },
            "difficulty": 0
          }
        }
        ```
        
        **Response Description**:
        
        - 200: OK
            - `scrollAddress` (string): Block builder's Scroll address.
            - `transferFee` (Map<string, string>): Mapping of token addresses in INTMAX to fees payable in those tokens. For example,
                
                ```json
                {
                  "0": "300000000000000"
                }
                ```
                
                indicates a fee of 0.0003 ETH (3e14 wei).
                
            - `difficulty` (integer): PoW difficulty value.

### System Interface

Explanation of interactions and interfaces with other systems.

- Scroll Network:
    - Connects to the Scroll network using the go-ethereum library.
    - Rollup Contract: Posts blocks.
    - Indexer Contract: Updates self-related data.
- External Services:
    - [1rpc.io](https://www.1rpc.io/)
        - Provides RPC services for the Scroll network through a monthly subscription.

## Data

### Data Requirements

- **Transaction Information**
    - `recipient`: Recipient's public key or Ethereum address
    - `amount`: Amount to be transferred
    - `salt`: Salt for the transaction data
    - `transferData`: Content of the transfer request consisting of `recipient`, `amount`, and `salt`.
    - `transferHash`: Hash of the transfer data
- **Transaction Information**
    - `senderPublicKey`: Sender's INTMAX public key
    - `tokenAddress`: Address of the ERC20 or ERC721 token on Ethereum
    - `tokenId`: ERC721 token ID
    - `txHash`: Transaction hash
    - `powNonce`: PoW nonce
    - `status`: Current status (e.g., pending, signature received, confirmed, failed)
- **Block Information**
    - `builderPublicKey`: INTMAX public key of the builder who created the block
    - `txRoot`: Transaction tree root hash
    - `blockHash`: Block hash
    - `blockNumber`: Block number
    - `signature`: User's signature
    - `aggregatedSignature`: Aggregated signatures from responding users
    - `aggregatedPublicKey`: Public key created from valid user public keys
    - `senderPublicKeys`: Concatenated string of sender public keys included in the block.
    - `senderAccountIds`: Concatenated string of sender account IDs included in the block.
    - `messagePoint`: `txRoot` mapped to a point on G2
    - `contentHash`: Hash of all information known before posting to the rollup contract
- **Merkle Proof Information**
    - `senderPublicKey`: Sender's public key
    - `txHash`: Related transaction hash
    - `txTreeIndex`: Index within the tx tree
    - `txMerkleProof`: Merkle proof within the tx tree
    - `transferTreeIndex`: Index within the transfer tree
    - `transferMerkleProof`: Merkle proof within the transfer tree

### Database

- Configuration File
    - `PRIVATE_KEY`: Private key for the Scroll account
    - `DIFFICULTY`: Difficulty level required for user transactions. Specifies the number of leading bits that must be zero.
- PostgreSQL
    - transactions table
        
        
        | Column Name | Data Type | PK | FK | NotNull | Default |
        | --- | --- | --- | --- | --- | --- |
        | tx_hash | String | PK |  | Yes |  |
        | sender_public_key | String |  |  | Yes |  |
        | signature_id | Integer |  | signatures.signature_id |  | NULL |
        | status | String |  |  | Yes | Pending |
        | created_at | Timestamp |  |  | Yes | NOW() |
        - tx_hash: Transaction hash
        - sender_public_key: Sender's public key
        - signature_id: Reference to signature information
        - status: Current status
            - Possible values:
                - Pending: Transaction posted to the Scroll network but pending
                - Committed: Transaction posted to the Scroll network
                - Confirmed: Transaction posted to the Ethereum network
                - Failed: Transaction posting to the Scroll network failed
        - created_at: Record creation time
    - tx_merkle_proofs table
        
        
        | Column Name | Data Type | PK | FK | NotNull | Default |
        | --- | --- | --- | --- | --- | --- |
        | id | Integer | PK |  | Yes |  |
        | sender_public_key | String |  |  | Yes |  |
        | tx_hash | String |  | transactions.tx_hash | Yes |  |
        | tx_tree_index | Integer |  |  | Yes |  |
        | tx_merkle_proof | String |  |  | Yes |  |
        | created_at | Timestamp |  |  | Yes | NOW() |
        - id: Identifier
        - sender_public_key: Sender's public key
        - tx_hash: Related transaction hash (used as an identifier)
        - tx_tree_index: Index within the tx tree
        - tx_merkle_proof: Merkle proof within the tx tree for the tx_tree_index
        - created_at: Record creation time
        - Combination of sender_public_key and tx_hash is unique
    - signatures table
        
        
        | Column Name | Data Type | PK | FK | NotNull | Default | Constraints |
        | --- | --- | --- | --- | --- | --- | --- |
        | signature_id | Integer | PK |  | Yes |  |  |
        | signature | String |  |  | Yes |  |  |
        | proposal_block_id | Integer |  |  | Yes |  |  |
        | created_at | Timestamp |  |  | Yes | NOW() |  |
        - signature_id: Identifier
        - signature: User's signature
        - proposal_block_id: proposed block ID that included this transaction
        - created_at: Record creation time
    - blocks table
        
        
        | Column Name | Data Type | PK | FK | NotNull | Default |
        | --- | --- | --- | --- | --- | --- |
        | proposal_block_id | Integer | PK |  | Yes |  |
        | builder_public_key | String |  |  | Yes |  |
        | tx_root | String |  |  | Yes |  |
        | block_hash | String |  |  | Yes |  |
        | aggregated_signature | String |  |  | Yes |  |
        | aggregated_public_key | String |  |  |  | NULL |
        | status | String |  |  |  | Pending |
        | created_at | Timestamp |  |  | Yes | NOW() |
        | posted_at | Timestamp |  |  |  | NULL |
        - proposal_block_id: Identifier
        - builder_public_key: INTMAX public key of the builder who created the block
        - tx_root: Root hash of the transaction tree
        - block_hash: Block hash
        - aggregated_signature: Aggregated signature from the responding users
        - aggregated_public_key: Public key created from valid user public keys
        - status: Posting status of the block
            - One of the following values: Pending, Committed, Confirmed or Failed
        - created_at: Record creation time
        - posted_at: Time when the block was posted
    - tokens table
        
        
        | Column Name | Data Type | PK | FK | NotNull | Default |
        | --- | --- | --- | --- | --- | --- |
        | token_index | Integer | PK |  | Yes |  |
        | token_address | String |  |  |  | NULL |
        | token_id | String |  |  |  | NULL |
        | created_at | Timestamp |  |  | Yes | NOW() |
        - token_index: Token address on INTMAX
        - token_address: ERC20 or ERC721 token address on Ethereum, NULL if representing ETH
        - token_id: ERC721 token ID
        - created_at: Record creation time

## Security

This section describes the system security requirements and measures.

- **Data Encryption**: Encrypt communication channels with external services using SSL/TLS.
- **Log Monitoring**: Monitor logs in real-time to detect unauthorized access or abnormal behavior.
- **Access Control for Node Private Keys**
    - **Access Control**: Strictly control access to private keys, limiting access to the minimum necessary users or processes.
    - **Secure Storage**: Store private keys in a secure location, such as a physically protected area or an encrypted database, to prevent unauthorized access.
