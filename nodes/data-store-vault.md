# Data Store Vault specification

## Version

**Version Number**: v0.2.0

**Update Date**: 16.06.2024

## Purpose

The purpose of this document is to clearly define the detailed specifications of the node responsible for backing up data that users need to store individually and restoring that data when using the INTMAX Wallet or CLI from multiple devices. This node manages the process of safely and efficiently backing up user data and restoring it when needed.

### Decentralization

This node is operated solely by the INTMAX team.

### Terminology

**Balance Proof:** A Plonky2 proof that demonstrates a non-negative balance at a certain block number.

**Data Required to Create a Balance Proof:** All tx hashes of the transactions sent and received by the user, the latest balance, and the latest balance proof (Plonky2 proof).

**Balance Data:** A mapping of token addresses and their amounts that the user owns on the INTMAX network.

**Transaction Data:** A set of `transferData` bundled together into a single transaction data.

**Transfer Data:** `transferData` refers to the data created when the sender sends between addresses on the INTMAX network or withdraws to the Ethereum network.

**Deposit Data:** Data indicating deposits from the Ethereum network to the INTMAX network, which includes a tokenIndex indicating the type of token in the `transferData`.

### Main Features

Specifically, the node implements the following features:

1. **Data Backup:**
    - Safely backs up data generated during a user's transaction submission.
        - This includes both the data sent from the sender to the receiver and the data needed by the sender to create a balance proof.
    - Uses secure encryption protocols to protect the data between the sender and receiver.
        - Encryption details are specified in the feature description.
2. **Data Restoration:**
    - Safely restores necessary data when a user accesses from a different device.
        - This includes both the data sent from the sender to the receiver and the data needed by the sender to create a balance proof.
    - Supports the receiver in retrieving and decrypting their related data.
        - This includes the data sent from the sender to the receiver after the transaction is submitted by the sender.

### Data to be Stored

- Data sent from the sender to the receiver after the sender submits a transaction:
    - receiver_public_key: Receiver's INTMAX public key
    - encrypted_transfer_data: Encrypted transfer data
    - salt: Salt for calculating the AES shared key
- Data needed by the sender to create a balance proof:
    - sender: User's INTMAX public key
    - encrypted_tx: Encrypted transaction
    - enough_balance_proof (Plonky2 proof): Balance proof
    - encrypted_balance_data: Encrypted balance data
    - encrypted_transfer_data: Encrypted transfer data and deposit data reflected in the balance proof

## Scope

- Node program written in Go
- Dockerfile and docker-compose.yml for starting the node
- Usage documentation (README.md)

## Requirements

### Functional Requirements

- The node backs up the user's balance data and balance proof.
    
    **NOTE**: By obtaining the last seen block number from the public inputs of the balance proof, it is possible to find the point to roll back to if a reorg occurs. Any transaction data received in the meantime will revert to an unreflected state and need to be re-reflected.
    
    Procedure
    
    1. Encrypt the balance data.
        - Encode the array of token addresses and balances in INTMAX using RLP.
        - Encrypt the encoded string.
    2. Encrypt the transfer data and deposit data reflected in the balance proof.
        - Encode the array of transfer data and deposit data using RLP.
        - Encrypt the encoded string.
    3. Send the data related to the sender's balance proof to the Data Store Vault.
        - Request content:
            - Plonky2 proof and public inputs of the balance proof
                - Includes the sender's public key and block number
            - Encrypted current balance data
            - Encrypted transfer data and deposit data reflected in the balance proof
    4. The Data Store Vault stores the received data in the DB.
        - Stored content:
            - Sender's public key
            - Block number
            - Plonky2 proof and public inputs of the balance proof
            - Encrypted current balance data
            - Encrypted transfer data and deposit data reflected in the balance proof
- The node returns the user's balance data and balance proof to the user.
    
    Procedure
    
    1. Send a request to the Data Store Vault to obtain balance data and balance proof.
        - Request content:
            - Sender's public key
            - Block number (if not specified, it indicates the latest balance proof is desired)
    2. If the Data Store Vault has the balance proof for the sender in its DB, it returns the latest one to the user. If a block number is specified, it returns the balance proof with the largest block number that does not exceed it.
        - Response content:
            - Plonky2 proof and public inputs of the balance proof
            - Encrypted current balance data
            - Encrypted transfer data and deposit data reflected in the balance proof
        - If not found, it returns a message saying "balance proof not found".
        - Error messages and error codes will be defined separately.
- The user backs up their sent transaction data.
    
    Procedure
    
    1. The sender prepares the transaction data they sent (711 bytes total).
        - transfer batch (482 bytes)
        - tx tree Merkle proof
            - siblings (7 * 32 bytes)
            - index (7 bits)
        - block number (4 bytes)
    2. Encrypt the transaction data.
    3. Send a request to the Data Store Vault to save the encrypted transaction data.
        - Request content:
            - sender: Sender's INTMAX public key
            - encrypted_tx: Encrypted transaction data
            - block number: Block number
    4. The Data Store Vault stores this in the DB.
        - Stored content:
            - `sender`: Sender's INTMAX public key
            - `encrypted_tx`: Encrypted transaction data
            - `block_number`: Block number
- The user retrieves their sent transaction data.
    
    Used for:
    
    - Displaying the transaction history
    - Reconstructing the balance proof
    
    Procedure
    
    1. Send a request to the Data Store Vault to obtain their transaction data.
        - Request content:
            - `sender`: Sender's public key
            - `sinceBlockNumber`: Data since the specified block number
            - `limit`: Maximum number of items to retrieve
    2. If the Data Store Vault has the sender's transaction data in its DB, it returns the data since the specified block number up to the maximum number of items.
        - Response content:
            - Array of encrypted transaction data
        - If not found, it notifies the user.
- The user shares transfer data with the **receiver** after sending a transaction.
    
    Procedure
    
    1. The sender prepares the transfer data they want to share with the receiver (570 bytes + 140KB total).
        - transfer data
            - receiver address (20 bytes)
            - token index (4 bytes)
                - Sequential address on INTMAX
            - amount (32 bytes)
            - hashed nonce (32 bytes)
        - transfer tree Merkle proof
            - siblings (7 * 32 bytes)
            - index (7 bits)
        - tx tree Merkle proof
            - siblings (7 * 32 bytes)
            - index (7 bits)
        - block number (4 bytes)
        - sender (32 bytes)
            - INTMAX public key
        - balance proof (140 KB)
            - If not encrypted, the sender's public key is in the public inputs, so the relationship with the receiver is known to the Data Store Vault.
    2. Encrypt the transfer data
        
        **NOTE**: If the encrypted data sent to the recipient is tied to the owner's public key, the relationship between the sender and receiver is revealed. Use the following method to hide the sender's public key from the Data Store Vault while encrypting the transfer data using a shared key known only to the sender and receiver.
        
        - The sender encrypts their INTMAX public key using the receiver's INTMAX public key with ECC.
        - The sender creates a shared secret from their INTMAX private key and the receiver's INTMAX public key.
        - Choose a random salt, hash it with the shared secret, and get the AES shared key.
    3. The sender sends a request to the Data Store Vault to save the following data.
        - Request content:
            - Receiver's INTMAX public key
            - Encrypted transfer data
            - Salt for calculating the AES shared key
    4. The server stores the received content in the DB. The Data Store Vault stores the combination of ciphertext and salt in the DB.
        - Stored content:
            - Receiver's INTMAX public key
            - Encrypted transfer data
            - Salt for calculating the AES shared key
- The **receiver** retrieves the shared transfer data from the sender.
    
    Used for:
    
    - Reconstructing the balance proof
        - Especially for constructing the merged transfer nullifier tree
    
    **NOTE**: Use backup timestamps for pagination.
    
    Procedure
    
    1. The receiver sends a request to the Data Store Vault to check for transfer data related to them.
        - Request content:
            - `recipient`: User's public key
            - `sinceBackupTime`: Data since the specified backup time
            - `limit`: Maximum number of items to retrieve
    2. The Data Store Vault provides the data if it has data for the requested recipient.
        - Response content:
            - Array of transfer data
                - Encrypted transfer data
                    - Including the sender's balance proof
                - Salt for calculating the AES shared key
                - Unique identifier
                - Backup time
    3. Decrypt the encrypted transfer data.
        - The receiver obtains the ciphertext associated with their INTMAX public key.
        - The receiver decrypts the sender's INTMAX public key using their INTMAX private key.
            - Even if the INTMAX wallet has the private key split into two locations, decryption is possible.
        - The receiver creates a shared secret from their INTMAX private key and the sender's INTMAX public key.
        - Hash the salt together to get the AES shared key.
        - Decrypt the ciphertext with the shared key.
    4. Proceed with the balance update process.

### Non-Functional Requirements

- **Availability:** The node maintains a high uptime and minimizes downtime.
- **Scalability:** The node can scale up and out to handle increased requests.
- **Response Time:** The node responds promptly to user requests within 500 milliseconds.
- **Process Recovery:** The node can resume operations if it goes down during processing.
- **Program Updates:** The node can be safely patched when program modifications occur.

## System Configuration

Explanation of the overall system configuration and components.

- Hardware Configuration
    - Server
        - Capable of handling a large number of requests
        - Capable of storing and transmitting a large amount of data
        - Large storage capacity to store all transaction data (1TB or more)
    - Network
        - Sufficient bandwidth
        - **High speed and reliability**
- Software Configuration
    - Runtime environment: Docker, Docker Compose
    - Programming language: Go

## Interface

### User Interface

- CLI
    - Start the node
        - Launch the container using docker-compose
        - Command: `docker-compose up -d data-store-server`
    - Stop the node
        - Stop the container using docker-compose
        - Command: `docker-compose down data-store-server`
- REST API
    - Health Check
        - **Endpoint:** `/`
        - **Method:** GET
        - **Description:** Performs a health check of the server.
        - **Request Format:** None
        - **Response Format:**
            
            ```json
            {
                "success": true
            }
            ```
            
    - Request user authentication
        
        Returns data used for authentication when sending POST requests
        
        - **Endpoint:** `/backup/sender-transaction`
        - **Method:** GET
        - **Description:** Retrieves the sender's transaction data from the data store vault.
        - **Request Format:**
            
            ```json
            {
                "sender": "0x123...456"
            }
            ```
            
        - **Request Description:**
            - `sender` (string): Sender's public key
        - **Response Format:**
            
            ```json
            {
                "success": true,
                "data": {
                    "challenge": "challenge message"
                }
            }
            ```
            
        - **Response Description:**
            - 200: OK
    - User backs up their encrypted transfer data, balance data, and balance proof.
        - **Endpoint:** `/backup/balance-proof`
        - **Method:** POST
        - **Description:** Backs up the balance proof and encrypted transfer data to the Data Store Vault.
        - **Request Format:**
            
            ```json
            {
                "sender": "0xabc...def",
                "balanceProof": {
                    "proof": "0x123...456",
                    "publicInputs": "0x123...456"
                },
                "encryptedBalanceData": "encrypted data",
                "encryptedTransferData": [
                    "encrypted data",
                    "..."
                ]
            }
            ```
            
        - **Request Description:**
            - `sender` (string): Sender's INTMAX public key
            - `balanceProof` (Plonky2 proof): Plonky2 proof representing the balance proof and public inputs.
            - `encryptedBalanceData` (string): Encrypted balance data.
            - `encryptedTransferData` (string[]): Encrypted transfer data reflected in the balance proof.
        - **Response Format:**
            
            ```json
            {
                "success": true,
                "data": {
                    "message": "Backup successful."
                }
            }
            ```
            
        - **Response Description:**
            - 200: OK
                - `message` (string): A message indicating the backup was successful.
    - User retrieves their balance data and balance proof.
        - **Endpoint:** `/backup/balance-proof`
        - **Method:** GET
        - **Description:** Retrieves the balance proof and encrypted transfer data from the Data Store Vault.
        - **Request Format:**
            
            ```json
            {
                "sender": "0xabc...def",
                "blockNumber": 2
            }
            ```
            
            - **Request Description:**
                - `sender` (string): Sender's public key
                - `blockNumber` (number): The block number up to which the balance proof is desired
            - **Response Format:**
            
            ```json
            {
                "success": true,
                "data": {
                    "balanceProof": {
                        "proof": "0x123...456",
                        "publicInputs": "0x123...456"
                    },
                    "encryptedBalanceData": "encrypted data",
                    "encryptedTransferData": [
                        "encrypted data",
                        "..."
                    ]
                }
            }
            ```
            
            - **Response Description:**
                - 200: OK
                    - `balanceProof` (Plonky2 proof): Plonky2 proof representing the balance proof and public inputs.
                    - `encryptedBalanceData` (string): Encrypted balance data.
                    - `encryptedTransferData` (string[]): Encrypted transfer data reflected in the balance proof.
                - 404: Not Found
                    - Balance proof was not found
                        - The sender's balance proof was not found.
    - Backup transaction data for the **transaction sender**
        - **Endpoint:** `/backup/sender-transaction`
        - **Method:** POST
        - **Description:** Backs up the encrypted sender's transaction data to the data store vault.
        - **Request Format:**
        
        ```json
        {
            "encryptedTx": "encrypted data",
            "sender": "0x123...456",
            "blockNumber": 2
        }
        ```
        
        - **Request Description:**
            - `encryptedTx` (string): Encrypted transaction data and sender's public key
            - `sender` (string): Sender's public key
            - `blockNumber` (string): Block number
        - **Response Format:**
            
            ```json
            {
                "success": true,
                "data": {
                    "message": "Transaction data backup successful."
                }
            }
            ```
            
        - **Response Description:**
            - 200: OK
                - `message` (string): A message indicating the backup was successful.
    - Retrieve transaction data for the **transaction sender**
        
        Retrieve the transaction data of the specified user.
        
        - **Endpoint:** `/backup/sender-transaction`
        - **Method:** GET
        - **Description:** Retrieves the sender's transaction data from the data store vault.
        - **Request Format:**
        
        ```json
        {
            "sender": "0x123...456",
            "startBlockNumber": 2,
            "limit": 10
        }
        ```
        
        - **Request Description:**
            - `sender` (string): Sender's public key
            - `startBlockNumber` (string): Request transaction data from the specified block number. If not specified, data from the first transaction will be retrieved.
            - `limit` (number): Maximum number of items to retrieve
        - **Response Format:**
            
            ```json
            {
                "success": true,
                "data": {
                    "encryptedTxs": [
                        "encrypted data",
                        "..."
                    ],
                    "meta": {
                        "startBlockNumber": 2,
                        "endBlockNumber": 3
                    }
                }
            }
            ```
            
        - **Response Description:**
            - 200: OK
                - `encryptedTxs` (string[]): Array of encrypted transaction data.
                    - If not found, `encryptedTxs` will be returned as an empty array.
                - `meta`:
                    - `startBlockNumber`: The first block number retrieved.
                    - `endBlockNumber`: The latest block number retrieved. Used for pagination.
    - Backup transfer data for the **transaction receiver**
        - **Endpoint:** `/backup/recipient-transfer`
        - **Method:** POST
        - **Description:** Backs up transfer data for the recipient to the data store vault.
        - **Request Format:**
            
            ```json
            {
                "encryptedRecipientData": "encrypted data",
                "recipient": "0x123...456",
                "salt": "0xabc...def",
                "blockNumber": 2
            }
            ```
            
        - **Request Description:**
            - `encryptedRecipientData` (string): Encrypted data needed by the recipient to update the balance.
            - `recipient` (string): Recipient's INTMAX public key
            - `salt` (string): Salt for creating the shared secret between the sender and receiver
            - `blockNumber` (number): Block number (4 bytes)
        - **Response Format:**
        
        ```json
        {
            "success": true,
            "data": {
                "message": "Transfer data backup successful."
            }
        }
        ```
        
    - **Transaction receiver** retrieves the transfer data
        - **Endpoint:** `/retrieve-transfer`
        - **Method:** GET
        - **Description:** Retrieves the encrypted transfer data and necessary information for the receiver.
        - **Request Format:**
            
            ```json
            {
                "recipient": "0xabc...def",
                "startBackupTime": "2024-06-10T22:00:00Z",
                "limit": 10
            }
            ```
            
        - **Request Description:**
            - `recipient` (string): Recipient's INTMAX public key
            - `startBackupTime` (number): Retrieve data since the specified time.
            - `limit` (number): Maximum number of items to retrieve
        - **Response Format:**
            
            ```json
            {
                "success": true,
                "data": {
                    "transfers": [
                        "encryptedTransferData": "encrypted_data",
                        "salt": "0xabc...def",
                        "senderBalanceProof": {
                            "proof": "0xabc...def",
                            "publicInputs": "0xabc...def"
                        },
                        "backupTime": "2024-06-10T23:00:00Z"
                    ],
                    "meta": {
                        "startBackupTime": "2024-06-10T22:00:00Z",
                        "endBackupTime": "2024-06-10T23:00:00Z"
                    }
                }
            }
            ```
            
        - **Response Description:**
            - `transfers`: Array of encrypted transfer data.
                - `encryptedTransferData` (string): Encrypted transfer data.
                - `salt` (string): Salt used for encryption.
                - `senderBalanceProof` (Plonky2 proof): Sender's balance proof.
                - `backupTime` (string): The time the backup was saved.
                    - Follows ISO 8601 format.
                    - In Golang, can be converted using `time.RFC3339`.

### System Interface

None

## Data

### Data Requirements

Explanation of the necessary data and data structure.

- `recipient`: Recipient's INTMAX public key
- `encryptedTransferData`: Encrypted transfer data
- `salt`: Salt for calculating the AES shared key
- `sender`: User's INTMAX public key
- `encryptedTx`: Encrypted transaction
- `enoughBalanceProof`: Balance proof
- `encryptedBalanceData`: Encrypted balance data
- `encryptedTransferData`: Encrypted transfer data and deposit data reflected in the balance proof

### Database

This section describes the type and structure of the database used.

- PostgreSQL
    - shared_transfers table
        
        
        | Column Name | Data Type | PK | FK | NotNull | Default | Constraints |
        | --- | --- | --- | --- | --- | --- | --- |
        | id | Integer | PK |  | Yes |  |  |
        | recipient | String |  |  | Yes |  |  |
        | encrypted_transfer_data | String |  |  | Yes |  |  |
        | salt | String |  |  | Yes |  |  |
        | created_at | Timestamp |  |  | Yes | NOW() |  |
        - id: Unique identifier
        - receiver_public_key: Recipient's INTMAX public key
        - encrypted_transfer_data: Encrypted transfer data
        - salt: Salt for calculating the AES shared key
        - created_at: Record creation time
    - sending_transactions table
        
        
        | Column Name | Data Type | PK | FK | NotNull | Default | Constraints |
        | --- | --- | --- | --- | --- | --- | --- |
        | id | Integer | PK |  | Yes |  |  |
        | sender | String |  |  | Yes |  |  |
        | encrypted_tx | String |  |  | Yes |  |  |
        | created_at | Timestamp |  |  | Yes | NOW() |  |
        - id: Unique identifier
        - sender: User's INTMAX public key
        - encrypted_tx: Encrypted transaction
        - created_at: Record creation time
    - balance_proofs table
        
        
        | Column Name | Data Type | PK | FK | NotNull | Default | Constraints |
        | --- | --- | --- | --- | --- | --- | --- |
        | id | Integer | PK |  | Yes |  |  |
        | enough_balance_proof | JSON |  |  | Yes |  |  |
        | encrypted_balance_data | String |  |  | Yes |  |  |
        | encrypted_transfer_data | String[] |  |  | Yes |  |  |
        | created_at | Timestamp |  |  | Yes | NOW() |  |
        - id: Unique identifier
        - enough_balance_proof (Plonky2 proof): Balance proof
        - encrypted_balance_data: Encrypted balance data
        - encrypted_transfer_data: Encrypted transfer data and deposit data reflected in the balance proof
        - created_at: Record creation time

## Security

This section describes the system security requirements and measures.

- **Data Encryption:** Encrypt communication paths with external services using SSL/TLS.
- **Log Monitoring:** Monitor logs in real-time to detect unauthorized access and abnormal behavior.
