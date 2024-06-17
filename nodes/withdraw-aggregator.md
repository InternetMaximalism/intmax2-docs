# Withdraw Aggregator specification

## Version

**Version Number**: v0.2.0

**Update Date**: 16.06.2024

## Purpose

The purpose of this document is to clearly specify the details of the Withdraw Aggregator node, which processes withdrawal requests from the INTMAX network to the Ethereum network. This node manages the process of accepting withdrawal requests from users, performing necessary validations and processing, and reflecting these transactions on the Ethereum network.

### Decentralization

This node is **decentralized** and deployed across the network. Users can set up their own nodes, but they are not provided with economic incentives by the protocol. Each Withdraw Aggregator node operates independently and does not need to synchronize with other Withdraw Aggregator nodes.

### Definitions

**Withdrawal Request:** A request to withdraw from the INTMAX network to the Ethereum network using `tranferData` of INTMAX.

### Key Functions

The node implements the following functions:

1. **Processing Withdrawal Requests**:
    - Accepts withdrawal requests from users and collects the necessary information.
    - Validates and confirms the requests, and stores them in the database.
2. **Managing and Submitting Withdrawal Data**:
    - Creates ZKPs based on the withdrawal requests and stores them in the database.
    - Submits the requests to the Rollup contract once a certain number of requests are collected or a certain time has elapsed.

## Scope

- Node program written in Rust
- Dockerfile and docker-compose.yml for node deployment
- Usage documentation (README.md)

## Requirements Specification

### Functional Requirements

- Accept Withdrawal Requests
    
    ```mermaid
    sequenceDiagram
    %% participant
    %% participant DS as Data Store Server
    participant S as Sender (User)
    participant W as Withdrawer
    participant R as Rollup Contract
    participant L as Liquidity Contract
    %% communication
    S->>W: Send withdrawal request
    W-->>S: return OK
    W->>W: Make withdrawal proof
    W->>R: Submit withdrawal proof
    R-->>L: Relay withdraw root
    L->>L: Write withdraw root
    L-->>S: Return ETH
    S->>L: Claim ERC20 or ERC721
    L-->>S: Return token
    
    ```
    
    **Procedure**
    
    1. A withdrawal request is sent from the user to the Withdraw Aggregator.
        - Request details:
            - transferData
                - recipient
                    - String, 20 bytes
                    - Must be an Ethereum address
                - amount
                    - String, 32 bytes
                - salt
                    - String, 32 bytes
            - transferMerkleProof: Merkle proof from transfer tree root to transfer data
                - index
                    - Integer, 1 byte
                - siblings
                    - String[]
            - transaction: The transaction data that includes the above transferData and has already been sent to the Block Builder.
                - feeTransferHash: Hash of the fee transfer data
                    - String, 32 bytes
                - transferTreeRoot: Root hash of the transfer tree
                    - String, 32 bytes
                - tokenIndex
                    - Integer, 4 bytes
                    - Must be registered in the liquidity contract
                - nonce: Number of times the INTMAX account has executed transfer transactions
                    - Integer, 4 bytes
            - txMerkleProof: Merkle proof from tx tree root to transfer tree root
                - index
                    - Integer, 1 byte
                - siblings
                    - String[]
            - blockNumber: Number of the block where the transaction was included
                - Integer, 4 bytes
            - enoughBalanceProof: Plonky2 proof that there are sufficient funds after reflecting the withdrawal transaction
                - String, 140 KB
    2. Retrieve block content based on the block number
        - Check the `BlockPosted` event of the Rollup contract
    3. Withdraw Aggregator verifies the request contents
        
        Verification points:
        
        - Verify that the provided enough balance proof is correct
        - Retrieve tx root from the retrieved block content
        - Verify the correctness of the Merkle proof from tx root to transfer data.
    4. Store the withdrawal request in the database
        
        Storage contents:
        
        - withdraw_requests table
            - recipient
                - String, 20 bytes
            - token_index
                - Integer, 4 bytes
            - amount
                - String, 32 bytes
            - salt
                - String, 32 bytes
            - transfer_hash
                - Hash of the transfer data. Used to specify the withdrawal request
                - String, 32 bytes
            - transfer_merkle_proof
                - JSON
                    - transferMerkleProof
                        - index
                            - Integer, 1 byte
                        - siblings
                            - String[]
            - transaction
                - fee_transfer_hash: Hash of the fee transfer data
                    - String, 32 bytes
                - transfer_tree_root: Root hash of the transfer tree
                    - String, 32 bytes
                - token_index
                    - Integer, 4 bytes
                    - Must be registered in the liquidity contract
                - nonce: Number of times the INTMAX account has executed transfer transactions
                    - Integer, 4 bytes
            - tx_merkle_proof
                - index
                    - Integer, 1 byte
                - siblings
                    - String[]
            - block_number
                - Integer
            - enough_balance_proof
                - String
    5. Return a message "Withdrawal request accepted." to the user and end the process normally.
- Aggregate Withdrawal Data
    1. Check if there are new withdrawal requests in the database.
    2. Create ZKP for aggregating withdrawals and store it in the database. Verify the correctness of the new withdrawal requests while updating the withdraw tree with the newly created ZKP.
- Submit Withdrawal Data
    
    **Procedure**
    
    1. Withdraw Aggregator collects withdrawal requests until a sufficient number of requests (128) are received or a certain time has elapsed (1 hour after the first request).
        - **NOTE**: Determine the appropriate timing considering gas costs and ZKP creation time.
        - If a large number of requests arrive at once, process them in batches of 1024 in order.
            - When to start processing beyond the 1025th request? It is allowed to start processing in parallel without waiting for the submission of the 1024 requests.
    2. Store the ZKP proof of withdrawals in the database
        - withdraw tree leaves:
            - receiver (Ethereum address)
            - tokenAddress (160 bits)
            - amount (256 bits)
        - Verify:
            - Correctly updated the withdraw tree
            - The provided validity proof is correct
            - The withdraw tree leaves match the contents of the withdraw tx in the transfer tree of a certain block
                - Follow the Merkle path from the validity proof's block hash tree root to the withdraw tx
    3. Submit to the Rollup contract. Use the Scroll network's messaging bridge to transmit the withdraw tree root hash from the Rollup contract on the Scroll network to the Liquidity contract on the Ethereum network.
        
        ```solidity
        function sendMessage(
          address target,
          uint256 value,
          bytes calldata message,
          uint256 gasLimit,
          address refundAddress
        ) external payable;
        ```
        
        - target: Liquidity contract on the Ethereum network
        - value: 0
        - message: Specify the root hash
- Provide the user with the Merkle proof of the withdraw tree
    
    **Procedure**
    
    1. Provide the user with the Merkle proof of the withdraw tree upon request
        
        **NOTE**: If the Merkle proof disappears before providing it to the user, the withdrawal cannot proceed, but it can be retried multiple times
        
        - If the withdrawer does not respond indefinitely, the user cannot withdraw, but since the withdraw aggregator is permissionless, the user can withdraw by themselves as a last resort.

### Non-Functional Requirements

- **Availability**: The node should maintain high uptime and minimize downtime.
- **Scalability**: It should be able to scale up and out to handle increasing withdrawal requests.
- **Response Time**: It should respond quickly to user requests.
- **Fault Tolerance**: The node should be able to resume operations if it goes down.
- **Software Updates**: It should be possible to safely apply patches when the program is updated.

## System Architecture

This section explains the overall system architecture and components.

- Hardware Configuration
    - Server
        - High CPU performance to calculate ZKPs and sufficient memory
        - Adequate storage capacity
    - Network
        - Sufficient bandwidth
        - High speed and reliability
- Software Configuration
    - Runtime environment: Docker, Docker Compose
    - Programming Language: Rust

## Interfaces

### User Interface

This section explains the overview and requirements of the user interface.

- CLI
    - Node Startup
        - Start the container using docker-compose
        - Execution: `docker-compose up -d withdraw-aggregator`
    - Node Shutdown
        - Stop the container using docker-compose
        - Execution: `docker-compose down withdraw-aggregator`
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
        
    - Accept Withdrawal Requests
        
        **Endpoint**: `/withdrawal/request`
        
        **Method**: POST
        
        **Overview**: Accepts withdrawal requests from users.
        
        **Request Format**:
        
        ```json
        {
        	"transferData": {
            "recipient": "0xabc...def",
            "amount": "1000",
            "salt": "0x123...456"
          },
          "transferMerkleProof": {
        	  "index": 1,
        	  "siblings": [
        	    "0x123...456",
        	    "..."
        	  ],
        	},
        	"transaction": {
        		"feeTransferHash": "0x123...456",
        		"transferTreeRoot": "0x123...456",
            "tokenIndex": 1,
            "nonce": 1
          },
        	"txMerkleProof": {
        		"index": 1,
        	  "siblings": [
        	    "0x123...456",
        	    "..."
        	  ],
        	},
        	"txRoot": "0x123...456",
          "enoughBalanceProof": "0x123...456"
        }
        ```
        
        **Request Explanation**:
        
        - `transferData` : Withdrawal request
            - `recipient` (string): Recipient's Ethereum address
            - `amount` (string): Withdrawal amount
            - `salt` (string): Salt specified at the time of transfer
        - `transferMerkleProof` (Merkle proof): Merkle proof in the transfer tree
        - `transaction`
            - `feeTransferHash` (string): Hash of the fee transfer data (32 bytes)
            - `transferTreeRoot` (string): Root hash of the transfer tree (32 bytes)
            - `tokenIndex` (number): Token address in INTMAX (4 bytes)
            - `nonce` (number): Number of times the INTMAX account has executed transfer transactions
        - `txMerkleProof` (Merkle proof): Merkle proof in the transaction tree
        - `txRoot` (string): Root hash of the transaction tree
        - `enoughBalanceProof` (string): Balance proof
        
        **Response Format**:
        
        ```json
        {
          "success": true,
          "data": {
        	  "message": "Withdraw request accepted."
        	}
        }
        ```
        
        **Response Explanation**:
        
        - 200: OK
            - `message` (string): Message indicating that acceptance and validation are complete.
        - 400: Bad Request
            - Request format error
            - Request content validation failed
        - 500: Internal Server Error
            - Failed to retrieve block content
    - Provide the user with the Merkle proof of the withdraw tree
        
        **Endpoint**: `/withdrawal/proof`
        
        **Method**: GET
        
        **Overview**: Submits withdrawal data to the Rollup contract.
        
        **Request Format**:
        
        ```json
        {
          "transferHash": "0x123...456"
        }
        ```
        
        **Request Explanation**:
        
        - `transferHash` (string): Used to identify the withdrawal request.
            - 32 bytes hex string
        
        **Response Format**:
        
        ```json
        {
          "success": true,
          "data": {
            "merklerRoot": "0x123...456",
            "merkleProof": {
        	    "index": 0,
              "siblings": [
                "0x123...456",
                "..."
              ],
            },
            "recipient": "0xabc...def",
            "tokenIndex": 0,
            "amount": "1000000000000000000"
          }
        }
        ```
        
        **Response Explanation**:
        
        - 200: OK
            - `merkleProof`: Provided withdraw Merkle proof data.
                - `index` (number)
                - `siblings` (string[])
            - `recipient` (string): Recipient's Ethereum address
            - `tokenIndex` (number): Token to be withdrawn
            - `amount` (string): Withdrawal amount
        - 400: Bad Request
            - Format error of transfer hash
        - 404: Not Found
            - Withdraw Merkle proof does not exist
    - Provide the user with a list of withdraw requests

### System Interface

- Rollup Contract
    - `submitWithdrawals`
        
        Submits withdrawal requests to the Rollup contract.
        
    - `sendWithdrawalMessageToEthereum`
        
        Transmits withdrawal requests from the Rollup contract to the Ethereum network.
        

## Data

### Data Requirements

- **Private Key**: The private key that owns ETH on the Scroll network.

### Database

Explanation of the type and configuration of the database used.

- PostgreSQL
    - withdrawal_requests table
        
        
        | Column Name | Data Type | PK | FK | NotNull | Default |
        | --- | --- | --- | --- | --- | --- |
        | transfer_hash | String | PK |  | Yes |  |
        | recipient | String |  |  | Yes |  |
        | amount | String |  |  | Yes |  |
        | transfer_merkle_proof | JSON |  |  | Yes |  |
        | transaction | JSON |  |  | Yes |  |
        | tx_merkle_proof | JSON |  |  | Yes |  |
        | tx_root | String |  |  | Yes |  |
        | block_number | Integer |  |  | Yes |  |
        | withdrawal_proof_id | Integer |  | withdrawal_proofs.id |  | NULL |
        | status | String |  |  | Yes | Pending |
        | created_at | Timestamp |  |  | Yes | NOW() |
        - transfer_hash: The hash of the transfer data. Used to uniquely identify the withdrawal request.
        - recipient: The Ethereum address to which the withdrawal is sent.
        - amount: The withdrawal amount.
        - salt: The salt to distinguish the transfer data.
        - transfer_merkle_proof: Merkle proof related to the transfer tree.
            - index
            - siblings
        - transaction: The content of the transaction.
            - fee_transfer_hash: The hash of the fee transfer data.
            - transfer_tree_root: The root hash of the transfer tree.
            - token_index: The token address in INTMAX.
            - nonce: The number of times the INTMAX account has executed transfer transactions.
        - tx_merkle_proof: Merkle proof related to the tx tree.
            - index
            - siblings
        - tx_root: The tx root of the block that included the withdrawal request.
        - block_number: The block number that included the transfer data.
        - withdrawal_proof_id: Used to return the Merkle proof at the time of withdrawal corresponding to each request after the withdraw tree is created.
        - withdrawal_root: References which withdraw tree it was included in.
        - created_at: The timestamp when the record was created.
    - withdrawal_proofs table
        
        Data related to the withdraw tree.
        
        | Column Name | Data Type | PK | FK | NotNull | Default |
        | --- | --- | --- | --- | --- | --- |
        | id | Integer | PK |  | Yes |  |
        | transfer_hash | String |  |  | Yes |  |
        | merkle_proof | String |  |  | Yes |  |
        | withdraw_root | String |  |  | Yes |  |
        | created_at | Timestamp |  |  | Yes | NOW() |
        - id: Unique identifier.
        - transfer_hash: The hash of the related withdrawal request.
        - merkle_proof: Merkle proof of the withdraw tree.
        - withdraw_root: The root hash of the withdraw tree containing this data.
        - created_at: The timestamp when the record was created.
    - withdraw_commitments table
        
        
        | Column Name | Data Type | PK | FK | NotNull | Default |
        | --- | --- | --- | --- | --- | --- |
        | withdrawal_root | Integer | PK |  | Yes |  |
        | status | String |  |  | Yes |  |
        | created_at | Integer |  |  | Yes | NOW() |
        - withdrawal_root: The Merkle root of the withdraw tree.
        - status: Indicates whether it has been posted to the rollup contract.
            - One of the following values:
                - Pending: The transaction has been sent to the Scroll network but is pending.
                - Committed: The transaction has been posted to the Scroll network.
                - Confirmed: The transaction has been posted to the Ethereum network.
                - Failed: The transaction failed to be posted to the Scroll network.
        - created_at: The timestamp when the record was created.

## Security

This section describes the system security requirements and measures.

- **Log Monitoring**: Real-time monitoring of logs to detect unauthorized access or abnormal behavior.
- **Private Key**
    - **Access Control**: Strictly control the permissions to access the private key, ensuring that only the minimum necessary users or processes have access.
    - **Secure Storage**: The private key should be stored in a secure location, such as a physically protected secure location or an encrypted database, to prevent unauthorized access.
