# Deposit flow

## Version

**Version Number**: v0.2.0

**Update Date**: 16.06.2024

## Purpose

The purpose of this document is to clarify the specifications for reflecting deposits from the Ethereum network into the INTMAX network. Specifically, it describes the following functionalities:

1. **Processing Deposit Requests**:
    - Accept and appropriately process token deposit requests from users.
    - Define the types of tokens that can be deposited (ETH, ERC20, ERC721) and their management methods (e.g., mapping of token addresses and numbers).
2. **Managing Deposit Data**:
    - Store deposit data in the Liquidity contract and periodically transmit the deposit root to the Scroll network's Rollup contract.
    - Implement fee management and processing methods.
3. **Canceling Deposits**:
    - Provide an API for users to request deposit cancellations and process them appropriately.
    - Manage the process of refunding rejected deposits to users.

## Requirements Specification

### Functional Requirements

- User Requests Deposit from Ethereum Network to INTMAX Network
    
    ```mermaid
    sequenceDiagram
    %% participant
    participant DS as Data Store Server
    participant S as Sender (User)
    participant D as Deposit Relayer
    participant L as Liquidity Contract
    participant R as Rollup Contract
    %% communication
    S->>L: Deposit token
    D-->>L: Subscribe deposit event
    D->>L: Confirm deposit root
    L->>R: Relay deposit root
    R->>R: Posted new block
    R-->>S: Subscribe posted block event
    S->>DS: Send backup
    
    ```
    
    **Procedure**
    
    1. The user sends the desired deposit amount to the Liquidity contract and executes the deposit function.
        - For ETH, the amount is sent as the transaction value.
        - For ERC20 or ERC721 tokens, the tokens are approved and then transferred using `transferFrom`.
        - The deposit request is stored in an array in the contract's storage with the following details:
            - recipient: Address on the INTMAX network (32 bytes)
            - token address: Token address (20 bytes)
            - token ID: Token ID (32 bytes) - only for ERC721 tokens
            - amount: Deposit amount (32 bytes)
    2. ERC20 and ERC721 tokens that can be deposited are defined in the Liquidity contract.
        - It maintains a mapping of address ⇒ uint256, with token addresses assigned numbers greater than 0. A token with a number of 0 cannot be deposited.
        - NFTs can also be registered similarly, with each token ID assigned a different number.
    3. Pay the ETH deposit fee simultaneously.
        - A fixed deposit fee is paid. The Deposit Relayer proceeds when sufficient deposits are collected.
        - **NOTE**: Anyone can call the deposit root messaging function.
    4. The Deposit Relayer periodically (after 1 hour from an unprocessed deposit or when 128 unprocessed deposits accumulate) uses the Scroll message bridge function to transmit deposit requests to the Rollup contract on the Scroll network. Specifically, the Deposit Relayer calls the `submitDepositRoot` function of the Liquidity contract, which internally uses the `sendMessage` method of the Messenger contract on the Ethereum network to execute the `updateDepositRoot` method of the Rollup contract on the Scroll network.
        - sendMessage
            
            ```solidity
            function sendMessage(
              address target,
              uint256 value,
              bytes calldata message,
              uint256 gasLimit,
              address refundAddress
            ) external payable;
            ```
            
            - `target`: Address of the Rollup contract on Scroll.
            - `value`: Amount of Ether to send to the target contract.
            - `message`: Calldata for calling the target contract.
            - `gasLimit`: Gas limit for calling the target contract.
            - `refundAddress`: Specify `msg.sender`
        - If successful, the following event logs are emitted:
            
            ```solidity
            // L1Messenger
            event SentMessage(
              address indexed sender,
              address indexed target,
              uint256 value,
              uint256 messageNonce,
              uint256 gasLimit,
              bytes message
            );
            ```
            
    5. The Scroll network calls the `updateDepositRoot` method on the Rollup contract to calculate the deposit tree based on the `sendMessage` content.
        - updateDepositRoot
            - Input: All approved but not yet reflected deposit requests
            - For each deposit request in the input, sequentially:
                - Add the deposit request to a new leaf in the deposit tree, calculate the root hash, and record it in storage. This Merkle root is called the deposit root.
        - This Merkle tree leaf includes all approved deposit requests up to that point.
    6. When a Block Builder posts a block, the current deposit root value is automatically included in the block.
        
        NOTE: At this stage, the user can reflect the deposit request in their balance proof.
        
- Canceling Deposits
    
    The API allows users to cancel deposits that have not yet been reflected in the Rollup contract.
    
    **Conditions**
    
    - Unreflected deposits include those not yet processed (after 1 hour from an unprocessed deposit or when 128 unprocessed deposits accumulate) or those that were not executed for some reason.
    
    **Procedure**
    
    1. The user calls the `cancelDeposit(uint256 depositIndex)` method on the Liquidity contract.
        - If the `depositIndex` does not exist, a revert indicating non-existence is returned.
        - If the deposit address for the `depositIndex` differs from `msg.sender`, it reverts.
