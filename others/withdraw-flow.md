# Withdraw flow

## Version

**Version Number**: v0.2.0

**Update Date**: 16.06.2024

## Purpose

The purpose of this document is to clarify the specifications for processing withdrawal requests from the INTMAX network to the Ethereum network. Specifically, the document covers the following functionalities:

1. **Processing Withdrawal Requests**:
    - Accepting withdrawal requests from users and collecting the necessary information.
    - Verifying and validating the requests and storing them in the database (DB).
2. **Managing Withdrawal Data**:
    - Creating Zero-Knowledge Proofs (ZKPs) based on withdrawal requests and storing them in the DB.
    - Generating the root hash of the withdrawal tree when a certain number of requests are collected or a specific time has passed, and transmitting this to the Ethereum network.
3. **Executing Withdrawals**:
    - Using Scroll's message bridge functionality to transmit the withdrawal tree root hash to the liquidity contract on Ethereum.
    - Executing withdrawals on the Liquidity contract on the Ethereum network and sending tokens to users.
4. **Cancelling and Retrying Withdrawals**:
    - Providing an API for users to cancel withdrawal requests if necessary.
    - Implementing a retry mechanism for the withdrawal process in case of failure.

## Requirements

### Functional Requirements

- Withdrawal Requests
    
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
    W->>W: Make withdrawal proof
    W->>R: Submit withdrawal proof
    R->>L: Relay withdraw root
    L->>L: Write withdrawal hash
    L-->>S: Return token
    
    ```
    
    - Users specify the transaction type `withdraw` and send the transaction data to the Block Builder node.
        - The Ethereum address to which the withdrawal is to be made is specified as the receiver.
        - Create a balance proof for the address from which the withdrawal is being made.
            - No need to create a balance proof for the dedicated withdrawal address.
    - Users send withdrawal requests to the Withdraw Aggregator node.
        - The request includes proof of the transfer to the Ethereum address.
            - The type and amount of the token to be withdrawn are derived from the transfer details.
    - The Withdraw Aggregator node verifies the request content and stores it in the DB.
        - Verify the correctness of the provided balance proof.
        - Create a ZKP for the withdrawal and store it in the DB. Update the withdrawal tree using the newly received leaf and recursively create a new ZKP for the withdrawal (dynamic tree).
    - The Withdraw Aggregator collects a sufficient number of requests (128) or waits for a certain period (1 hour after receiving a withdrawal request).
        - If a large number of requests come at once, process them in batches of 1024 sequentially.
    - Store the withdrawal ZKP proof in the DB.
        - Withdrawal tree leaf:
            - Receiver (Ethereum address)
            - Token address (160 bits)
            - Amount (256 bits)
        - Verification:
            - Correct construction of the withdrawal tree.
            - Inclusion of the withdrawal tree leaf in the transfer tree of a block.
            - Correctness of the provided validity proof.
    - Provide the withdrawal tree Merkle proof to the user.
        - If the Merkle proof is lost before being given to the user, the withdrawal cannot be processed, but it can be retried multiple times.
            - If the Withdraw Aggregator fails to respond indefinitely, the user can withdraw on their own since it is permissionless.
    - Post to the Rollup contract. Use the Scroll message bridge functionality to transmit the withdrawal tree root hash from the Rollup contract on the Scroll network to the Liquidity contract on the Ethereum network.
        
        ```solidity
        function sendMessage(
          address target,
          uint256 value,
          bytes calldata message,
          uint256 gasLimit,
          address refundAddress
        ) external payable;
        ```
        
        - Specify the Liquidity contract on the Ethereum network as the target.
        - The value is 0.
        - Specify the root hash in the message.
    - The Withdraw Aggregator executes the method on the Liquidity contract.
        - This function includes all leaves of the withdrawal tree in the calldata.
        - Execute the `relayMessageWithProof` function of the Scroll messenger contract to reflect the withdrawal root in the Liquidity contract.
            
            ```solidity
            function relayMessageWithProof(
              address from,
              address to,
              uint256 value,
              uint256 nonce,
              bytes memory message,
              L2MessageProof memory proof
            ) external;
            ```

        - Calculate the root of the withdrawal tree from the given leaves and match it with the messaged value.
            - **NOTE**: It is indicated that such leaves exist on the Scroll network.
        - Send tokens according to what is written in the leaf.
            - For ETH withdrawals, users do not need to claim.
            - For ERC20 or ERC721 withdrawals, users need to claim.
    - Record the processed withdrawal transfer hash in a mapping in the contract.
        - Therefore, the same transfer hash can be included in the withdrawal tree multiple times, but double withdrawal is not possible.
