# CLI specification

## Version

**Version Number**: v0.2.0

**Update Date**: 16.06.2024

## Purpose

The purpose of this document is to define the role and operation of the CLI program required for users to interact with the INTMAX network from the terminal. The CLI program provides commands for users to perform operations such as depositing, transferring, and withdrawing tokens on the INTMAX network.

This CLI program primarily provides the following features:

1. **Token Deposit**:
    - Executes commands for users to deposit specified tokens (ETH, ERC20, ERC721) into the INTMAX network.
2. **Token Transfer**:
    - Executes commands for users to transfer specified tokens on the INTMAX network to other users.
3. **Token Withdrawal**:
    - Executes commands for users to withdraw specified tokens from the INTMAX network to an external Ethereum address.
4. **Account Management**:
    - Executes commands for creating, modifying, and retrieving information about the user's Ethereum and INTMAX accounts.
5. **Balance Inquiry**:
    - Executes commands for users to check their token balances on the INTMAX network.

## Scope

- CLI program written in Go
- Documentation (README.md) detailing usage

## Requirements

### Functional Requirements

- Create Ethereum Account
    - Command arguments: None
    - Command example:
        - `account create` - Creates an account
    
    Steps:
    
    1. If the `PRIVATE_KEY` file exists locally, display "Wallet already exists" and terminate.
    2. Prompt for a password to encrypt and save the private key.
        - Terminate if consent is not given.
    3. Generate a new random private key.
    4. Derive both the Ethereum address and INTMAX account from the generated private key.
    5. Save the encrypted private key with the password in the `PRIVATE_KEY` file locally.
- Delete Ethereum Account
    - Command arguments: None
    - Command example:
        - `account delete` - Deletes an account
    
    Steps:
    
    1. Display a final confirmation prompt.
        - Terminate if consent is not given.
    2. Delete all CLI-related data from local files.
        - Display "Failed to delete account" if deletion fails.
- Deposit Tokens into INTMAX
    - Command arguments:
        - Token type: ETH, ERC20, ERC721
        - Token address (not required for ETH)
        - Token ID (only for ERC721)
        - Deposit amount (optional for ERC721)
        - `-force` flag to force execution even if there are pending transactions
    - Command examples:
        - `tx deposit eth 1` - Deposits 1 ETH
        - `tx deposit erc20 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 1000` - Deposits 1000 USDC
        - `tx deposit erc721 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d 74571` - Deposits CryptoKitties with ID 74571
    
    Steps:
    
    1. Process any pending deposit requests first.
        - If `pendingDepositTxHash` is recorded locally and `-force` is not specified, skip to step 6.
    2. Retrieve the token address on INTMAX for the given token information.
        1. Use the locally saved token address if available.
            - **NOTE**: The corresponding token address should not change unless Ethereum undergoes a reorganization.
        2. If not available locally, check the Liquidity contract's token mapping.
        3. If the Liquidity contract does not have a corresponding token address, log "Token does not exist on INTMAX network" and terminate.
    3. Approve the token for deposit in the Liquidity contract.
        - Display a prompt to confirm the transaction details.
        - Approval is only necessary for ERC20 and ERC721 tokens, not ETH.
    4. Call the Liquidity contract method to deposit the token.
        - Display a prompt to confirm the transaction details.
        - For ETH, call the `depositETH` method with the deposit amount as the transaction value.
        - For ERC20, call the `depositERC20` method.
        - For ERC721, call the `depositERC721` method.
    5. Record the transaction hash as `pendingDepositTxHash` in the local file.
    6. Monitor the transaction until one of the following conditions is met:
        - Confirm that the transaction is included in a block, then delete `pendingDepositTxHash` and terminate successfully.
        - Display an error and terminate if the transaction is rejected.
        - Resume this step if the user restarts the deposit command.
        - Continue waiting if the deposit request remains pending indefinitely.
- Transfer Tokens on INTMAX
    - Command arguments:
        - Token type: ETH, ERC20, ERC721
        - Token address (not required for ETH)
        - Token ID (only for ERC721)
        - Recipient address: INTMAX account (32 bytes)
        - Transfer amount (optional for ERC721)
        - `-force` flag to force execution even if there are pending transactions
    - Command examples:
        - `tx transfer eth 1 0x1234...5678` - Transfers 1 ETH to `0x1234...5678`
        - `tx transfer erc20 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 1000 0x1234...5678` - Transfers 1000 USDC to `0x1234...5678`
        - `tx transfer erc721 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d 74571 0x1234...5678` - Transfers CryptoKitties with ID 74571 to `0x1234...5678`
    
    Steps:
    
    1. Process any pending transactions first.
        - If `proposedBlock` is recorded locally and `-force` is not specified, skip to step 8.
    2. Retrieve the token address on INTMAX for the given token information.
        1. Use the locally saved token address if available.
            - **NOTE**: The corresponding token address should not change unless Ethereum undergoes a reorganization.
        2. If not available locally, check the Liquidity contract's token mapping.
        3. If the Liquidity contract does not have a corresponding token address, log "Token does not exist on INTMAX network" and terminate.
    3. Query the Node Indexer for a list of active Block Builders.
        - Display "Failed to retrieve Block Builder information" and terminate if the request fails.
        - Obtain a list of active Block Builders (`blockBuilders`) if the request is successful.
    4. Send the transfer request to a selected Block Builder from the list.
        - Call the `POST /transaction` API on the first Block Builder in the `blockBuilders` list.
        - Handle the response accordingly:
            - Success: Proceed to the next step.
            - Insufficient PoW response: Log the exception and terminate with an error.
            - Connection failure: Log the exception and retry with another Block Builder.
            - Invalid transaction format: Log the exception, indicating a CLI bug, and terminate with an error.
    5. After 2 seconds, check if the block containing the transaction has been created by querying the same Block Builder.
        - Handle the response accordingly:
            - Success: Verify the transaction inclusion and proceed.
            - Block not created: Retry after 5 seconds, or terminate if the expiration time is exceeded.
            - Block Builder unaware of the transaction: Retry after 5 seconds, or terminate if the expiration time is exceeded.
            - Connection failure: Retry after 5 seconds, or prompt the user to specify another Block Builder URL.
    6. Validate the data received from the Block Builder.
        - Ensure it is a valid Merkle proof with the transaction as a leaf.
        - Discard the data if it is from a previously signed block by the user.
        - Verify the Block Builder's sufficient stake on Scroll.
    7. Save the proposed block data in JSON format to a local file under the key `proposedBlock`.
        - Save content:
            
            ```json
            {
                "txRoot": "0x123...456",
                "blockBuilderAddress": "0xabc...def",
                "txMerkleProof": [
                    "0x123...456",
                    "..."
                ]
            }
            ```
            
            - `txRoot`: Root hash of the tx tree
            - `blockBuilderAddress`: Scroll address of the Block Builder
            - `txMerkleProof`: Merkle proof of the transaction in the tx tree
    8. Send the signed proposed block data hash to the Block Builder.
        - Handle the response accordingly:
            - Success: Proceed to the next step.
            - Validation failure: Log the exception, indicating a CLI bug, and terminate with an error.
            - Connection failure: Retry after 5 seconds, or terminate after 3 consecutive failures.
    9. Record the transaction and its included block hash in the Data Store Vault.
        - Encrypt the transaction data with the sender's INTMAX public key and the transfer data with the recipient's INTMAX public key.
        - Handle the response accordingly:
            - Success: Confirm DB save and delete `proposedBlock` from the local file.
            - Connection failure: Retry after 5 seconds, or terminate after 3 consecutive failures.
    10. Send data to the ZKP prover for client to create a balance proof.
        - Send data:
            - Old balance proof
            - Old balance
            - Transaction data
        - Handle the response accordingly:
            - Success: Receive updated balance proof and proceed.
            - Connection failure: Retry after 5 seconds, or terminate after 3 consecutive failures.
    11. Record the new balance proof and its public inputs, as well as the balance, in the Data Store Vault.
        - Send data:
            - Public inputs encrypted with the user's INTMAX public key
            - Balance encrypted with the user's INTMAX public key
            - Balance proof
        - Handle the response accordingly:
            - Success: Confirm DB save and terminate successfully.
            - Connection failure: Retry after 5 seconds, or terminate after 3 consecutive failures.
- Withdraw Tokens from INTMAX
    - Command arguments:
        - Token type: ETH, ERC20, ERC721
        - Token address (not required for ETH)
        - Token ID (only for ERC721)
        - Recipient address: Ethereum address (20 bytes)
        - Withdrawal amount (optional for ERC721)
        - `-force` flag to force execution even if there are pending transactions
    - Command examples:
        - `tx withdraw eth 1 0x1234...5678` - Withdraws 1 ETH to `0x1234...5678`
        - `tx withdraw erc20 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 1000 0x1234...5678` - Withdraws 1000 USDC to `0x1234...5678`
        - `tx withdraw erc721 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d 74571 0x1234...5678` - Withdraws CryptoKitties with ID 74571 to `0x1234...5678`
    
    Steps:
    
    1. Process any pending withdrawal requests first.
        - If `pendingWithdrawal` is recorded locally, skip to step 3.
    2. Perform steps 1~11 of the transfer command with the following exceptions:
        - The recipient address is an Ethereum address, not an INTMAX account.
        - The transaction type sent to the builder is `WITHDRAW` instead of `TRANSFER`.
        - Do not send transfer data encrypted with the recipient's public key to the Data Store Vault.
        - Record the withdrawal data hash in `pendingWithdrawal` locally.
    3. Send the transaction data from step 2 to the Withdraw Aggregator to request the withdrawal.
        - Send data:
            - Transaction data
            - Balance proof immediately after the withdrawal transaction
        - Handle the response accordingly:
            - Success: Confirm the withdrawal request is accepted and proceed.
            - Connection failure: Log the exception and terminate with an error.
    4. Wait until the withdrawal request is aggregated and posted to the Rollup contract by the Withdraw Aggregator, then confirm the inclusion and terminate successfully.
        - Resume from step 4 if the command is forcibly terminated during this process.
- Claim Withdrawn Tokens
    - Necessary only for ERC20 and ERC721; ETH is directly sent upon withdrawal by the Withdraw Aggregator.
    - Command arguments: None
    - Command example:
        - `tx claim`
    
    Steps:
    
    1. Check the Liquidity contract for claimable tokens.
        - Filter `Withdraw(address recipient, uint256 tokenIndex, uint256 amount)` event logs where `recipient` is the user's address.
    2. Obtain the Merkle proof for the withdrawal token from the Withdraw Aggregator's `/withdrawal/proof` API.
        - Send data:
            - `transferHash` (string): Identifier for the withdrawal request.
    3. Call the Liquidity contract method to claim the tokens.
        - For ERC20, call `claimWithdrawnErc20`.
        - For ERC721, call `claimWithdrawnErc721`.
- Retrieve Account Information
    - Command arguments: None
    - Command example:
        - `account info`
    
    Steps:
    
    1. Retrieve the following data from local files and display them in logs:
        - Ethereum address (20 bytes, hex string)
        - INTMAX account (32 bytes, hex string)
        - If the data is not found, prompt the user to initialize the account.
            - Example: "Wallet does not exist. Do you want to initialize the account?"
            - Terminate if the user does not consent. If consent is given, proceed with creating an Ethereum account.
- Check INTMAX Balance
    - Command arguments:
        - Token type: ETH, ERC20, ERC721
        - Token address (not required for ETH)
        - Token ID (only for ERC721)
    - Command examples:
        - `account balance eth` - Checks ETH balance
        - `account balance erc20 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` - Checks USDC balance
        - `account balance erc721 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d` - Checks if holding CryptoKitties with ID 74571
    
    Steps:
    
    1. Retrieve the token address on INTMAX for the given token information.
        1. Use the locally saved token address if available.
            - **NOTE**: The corresponding token address should not change unless Ethereum undergoes a reorganization.
        2. If not available locally, check the Liquidity contract's token mapping.
        3. If the Liquidity contract does not have a corresponding token address, log "Token does not exist on INTMAX network" and terminate.
    2. Retrieve the user's balance from the Data Store Vault.
        1. Obtain balance data from the Data Store Vault.
        2. Decrypt the data using the user's public key.
        3. Display an error and terminate if decryption fails.
    3. Format and display the information in logs.
- Check User Transaction List
    - Command arguments:
        - `-startBlockNumber` (optional)
            - INTMAX network block number to start searching for transactions
    - Command example:
        - `tx transfer list --startBlockNumber 2`
    
    Steps:
    
    1. Retrieve transaction data from the Data Store Vault `/backup/sender-transaction` API.
        - Send data:
            - `sender` (string): Sender's public key
            - `startBlockNumber` (string): INTMAX network block number to start searching for transactions
            - `limit` (number): Maximum number of entries to retrieve
        - Display "Failed to retrieve transaction data" and terminate if the request fails.
        - Display the list of transaction hashes from the response if the request is successful.
- Check Transaction by Hash
    - Command arguments:
        - `txHash`: Transaction hash
    - Command example:
        - `tx transfer info 0x123...456`
    
    Steps:
    
    1. Retrieve transaction data from the Data Store Vault `/backup/sender-transaction` API.
        - Send data:
            - `sender` (string): Sender's public key
            - `startBlockNumber` (string): INTMAX network block number to start searching for transactions
            - `limit` (number): Maximum number of entries to retrieve
        - Display "Failed to retrieve transaction data" and terminate if the request fails.
        - Display the transaction details if the specified transaction hash is found in the response, otherwise display "Transaction hash not found" and terminate.
- Retrieve Deposit List
    - Command arguments:
        - `-startBlockNumber` (number, optional)
            - INTMAX network block number to start searching for deposit requests
    - Command example:
        - `tx deposit info --startBlockNumber 2`
    
    Steps:
    
    1. Retrieve deposit data for the specified user from the Block Validity Prover API.
        - Only includes deposits reflected in the INTMAX network blocks.
        - Send data:
            - `publicKey` (string): Depositor's public key
            - `startIndex` (string): Deposit index to start searching for deposits
            - `limit` (number): Maximum number of entries to retrieve
        - Display "Failed to retrieve deposit data" and terminate if the request fails.
        - Display the deposit details if the specified transaction hash is found in the response, otherwise display "Specified deposit data not found" and terminate.
- Check Specific User Deposits
    - Command Arguments
        - `txHash`
            - Transaction hash
    - Command Example
        - `tx transfer info 0x123...456`
    
    Procedure
    
    1. Retrieve transaction data from the data store vault using the `/backup/sender-transaction` API.
        - Request Content
            - `sender` (string): Public key of the sender
            - `startBlockNumber` (string): The block number on the INTMAX network to start searching for the transaction
            - `limit` (number): The maximum number of transactions to retrieve
        - If the request fails, display a log "Failed to retrieve transaction data" and terminate.
        - If the request succeeds, display the details of the transaction with the specified transaction hash from the response. If not found, display "No transaction found with the specified hash" and terminate.
- Retrieve List of User Withdrawals
    - Command Arguments
        - `-startRequestTime` (string, optional)
            - The request start time to begin searching for withdrawal requests
    - Command Example
        - `tx withdraw info --startRequestTime 2024-06-10T22:00:00Z`
    
    Procedure
    
    1. Retrieve the user's withdrawal data from the Withdraw Aggregator API.
        - Request Content
            - `publicKey` (string): Public key of the withdrawal requester
            - `startRequestTime` (string): The start time to begin searching for withdrawal data
            - `limit` (number): The maximum number of withdrawals to retrieve
        - If the request fails, display a log "Failed to retrieve withdrawal data" and terminate.
        - If the request succeeds, display the details of the withdrawal with the specified transaction hash from the response. If not found, display "No withdrawal data found with the specified transaction hash" and terminate.
- Check INTMAX Block Status
    - Command Arguments
        - `-number` (optional, integer, 4 bytes): Specify the INTMAX block number
        - `-hash` (optional, string, 32 bytes): Specify the block hash
        
        **NOTE**: Either `--number` or `--hash` is required
        
    - Command Example
        - `block info --number 1`
            - Retrieve information of block number 1
        - `block info --hash 0x1234...5678`
            - Retrieve information of block hash `0x1234...5678`
    
    Procedure
    
    1. Query the explorer server for the specified block information.
        - Possible Responses:
            - Success
                - The following data will be returned and displayed:
                    - Block Number
                    - Block Hash
                    - Block Status
                        - The block number posted on Scroll
                        - The block number of the Scroll block posted on Ethereum
            - Failure to connect to the explorer server
                - Display an error message and terminate.
- Set or Change Default Block Builder
    - Command Arguments
        - URL of the Block Builder to connect to
    - Command Example
        - `config builder www.example.com`
            - Change the initial Block Builder to `www.example.com`
    
    Procedure
    
    1. Communicate with the desired Block Builder node and perform a health check.
        - If there is no response, display "This Block Builder is not responding" and terminate with an error.
    2. Check the stake status of the Block Builder node on the rollup contract.
        - If the stake is insufficient, display "This Block Builder is not qualified to post blocks" and terminate with an error.
    3. Overwrite the URL of the Block Builder in the local file `blockBuilderUrl` and terminate successfully.

### Non-Functional Requirements

- The program must run on any OS, or specify supported OS if not universally compatible.
    - Ensure error messages and other CLI messages are user-friendly.
- **Perform appropriate validation as needed.**
- Provide documentation and messages in English only.

## System Configuration

- **CLI Runtime Environment**
    - Requires Go language runtime environment
    - Requires Rust runtime environment
        - Necessary to operate the ZKP prover independently

## Interface

### User Interface

- List of Commands Invoked by the User (including interaction with other components if applicable)
- **Deposit**
    - Communicate with Data Store Vault
    - Call Ethereum contract (Liquidity contract)
- **Transfer**
    - Communicate with Data Store Vault
    - Communicate with Block Builder node
    - View status of Scroll contract (Rollup contract)
- **Withdraw**
    - Communicate with Data Store Vault
    - Communicate with Withdraw Aggregator node
- **Claim Withdrawn Tokens**
    - Call Ethereum contract (Liquidity contract)
- **Check Balance on INTMAX**
    - Communicate with Data Store Vault
- **Check INTMAX Block Status**
    - View status of Scroll contract (Rollup contract)
- **Change Default Block Builder**
    - Communicate with the desired Block Builder node
    - View status of Scroll contract (Rollup contract)

### System Interface

- **Block Builder**
    - Pass transaction
    - Sign and return the block created by the builder
- **Data Store Vault**
    - Retrieve balance
    - Retrieve balance proof
    - Retrieve transaction data related to the user
- **Ethereum Contracts**
    - Send deposit request to Liquidity contract
- **Scroll Contracts**
    - Check if the Block Builder is staked on the rollup contract
    - Check if the block is posted on the rollup contract
    - Check if the withdraw is reflected on the rollup contract
- **Withdraw Aggregator**
    - Send withdrawal request

## Data

### Data Requirements

- **INTMAX Account**
    - Private Key
    - Public Key
    - Account ID
- **Settings**
    - `indexerUrl` (string): URL of the Node Indexer to communicate with
        - If not set, use the default node specified by INTMAX.
    - `builderUrl` (string): URL of the default Block Builder to communicate with.
- **Temporary Data**
    - `pendingDepositTxHash` (string): Hash of the deposit data. Recorded while there is a pending deposit request not reflected in the balance.
    - `proposedBlock` (JSON): Data of the proposed block containing the user's transaction. Recorded while awaiting the signature return after receiving the proposed block from the Block Builder.
        - JSON contents:
            - `txRoot`: Root hash of the tx tree
            - `blockBuilderAddress`: Scroll address of the Block Builder
            - `txMerkleProof`: Merkle proof to the transaction in the tx tree
    - `pendingWithdrawal` (string): Hash of the withdrawal data. Recorded while there is a pending withdrawal request not yet received on Ethereum.
- **Balance**
    - `balanceData` (JSON): Latest balance data. Represented as a mapping of token addresses and their quantities on INTMAX.
    - `balanceProof` (string): Latest balance proof.
- **Transaction Data**
    - `sentTransactions` (JSON): Array of transaction data sent by the user.
    - `receivedTransferHashes` (JSON): Array of received transfer data hashes.
        - Used to update balance proof
    - `nonce` (number): The count of transactions sent and included in a block so far. Default is 0.
        - Used for sending transactions.
    - `tokenMapping` (JSON): Mapping from token address and token ID to token address (token index) on INTMAX.

### Database

Save the following data to local files:

- `privateKey` (string): User's private key for the CLI. Can be encrypted with a password before saving.
- `indexerUrl` (string): URL of the Node Indexer to communicate with
    - If not set, use the default node specified by INTMAX.
- `blockBuilderUrl` (string): URL of the default Block Builder to communicate with.
- `pendingDepositTxHash` (string): Hash of the deposit data. Recorded while there is a pending deposit request not reflected in the balance.
- `proposedBlock` (JSON): Data of the proposed block containing the user's transaction. Recorded while awaiting the signature return after receiving the proposed block from the Block Builder.
    - JSON contents:
        - `txRoot`: Root hash of the tx tree
        - `blockBuilderAddress`: Scroll address of the Block Builder
        - `txMerkleProof`: Merkle proof to the transaction in the tx tree
- `pendingWithdrawal` (string): Hash of the withdrawal data. Recorded while there is a pending withdrawal request not yet received on Ethereum.
- `balanceData` (JSON): Latest balance data. Represented as a mapping of token addresses and their quantities on INTMAX.
- `balanceProof` (string): Latest balance proof.
- `sentTransactions` (JSON): Array of transaction data sent by the user.
- `receivedTransferHashes` (JSON): Array of received transfer data hashes.
    - Used to update balance proof
- `nonce` (number): The count of transactions sent and included in a block so far. Default is 0.
    - Used for sending transactions.
- `tokenMapping` (JSON): Mapping from token address and token ID to token address (token index) on INTMAX.

## Security

- **Private Key**: Encrypt the private key with a password before saving.
- **Input and Output Data Protection**: Mask the password when prompting for input.
