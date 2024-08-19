# Balance Circuit

## Version

**Version Number**: v0.0.1

**Update Date**: 2024/08/19

## Purpose

The purpose of this document is to clarify the specifications and security requirements of the balance proof circuit for intmax2_zkp, to assist with auditing.

## Overview

The balance proof is a ZKP that proves a user's balance, with each user having a separate ZKP. When user A sends money to user B, after user A sends the tx, they update their balance proof A using the sender circuit. User B synchronizes their balance proof B to the latest block using the update circuit, then incorporates balance proof A into balance proof B using the receive transfer circuit. This increases user B's balance. When a user receives a deposit, after making the deposit to the contract, they wait until the new deposit tree root is included in a block. After synchronizing to the latest block using the update circuit, they incorporate the deposit into their balance using the receive deposit circuit. The following are details of each circuit.

## Private State Transition

A gadget that performs private state transition when receiving a transfer or deposit.

**Input**

`token_index`: Index of the token being received

`amount`: Amount of the token being received

`nullifier`: Nullifier of the transfer or deposit

`new_private_state_salt`: New salt for the private state

`prev_private_state`: Previous private state

`nullifier_proof`: Indexed merkle proof to insert the nullifier into the nullifier tree

`prev_asset_leaf`: Previous asset leaf (token balance)

`asset_merkle_proof`: Asset merkle proof for updating the asset

`new_private_state`: New private state

**Constraint**

1. Verify the `nullifier_proof` and insert the `nullifier` into the nullifier tree
2. Verify the `asset_merkle_proof`, add `amount` to `prev_asset_leaf`, and update the asset tree.
3. Update the private state's `asset_tree_root`, `nullifier_tree_root`, and `salt` to the new values, and constrain that it equals `new_private_state`

## Transfer Inclusion

A gadget that verifies the sender's balance proof and confirms that the sender indeed sent the transfer.

`transfer`: Transfer sent by the sender

`transfer_index`: Index of the transfer in the transfer tree

`transfer_merkle_proof`: Transfer merkle proof

`tx`: Tx containing the `transfer`

`balance_proof`: Sender's balance proof. The `last_tx_hash` of the balance proof's public input must match the hash of the tx, and the flag corresponding to `transfer_index` in `last_tx_insufficient_flags` must be false.

`balance_circuit_vd`: Verifier data for the balance circuit

`public_state`: Public state of `balance_proof`

**Constraint**

1. Verify `balance_proof` using `balance_circuit_vd`. Also constrain that `balance_circuit_vd` is included in the public input of `balance_proof`.
2. Constrain that the flag corresponding to `transfer_index` in `last_tx_insufficient_flags` is `false`.
3. Constrain that `last_tx_hash` matches the hash of the tx.
4. Verify the `transfer_merkle_proof`.

## Receive Deposit Circuit

A circuit for receiving money deposited in the L1 contract.

A deposit is a struct with the following structure:

```rust
pub struct Deposit {
    pub pubkey_salt_hash: Bytes32, // The poseidon hash of the pubkey and salt, to hide the pubkey
    pub token_index: u32,          // The index of the token
    pub amount: U256,              // The amount of the token, which is the amount of the deposit
}
```

The recipient creates `pubkey_salt_hash` by poseidon hashing their public key `pubkey` together with a secret `salt`. Anyone who knows their own `pubkey` matches and knows the secret `salt` can add the amount `amount` of the token specified by `token_index` to their balance.

**Public Inputs**

`prev_private_commitment`: Poseidon hash of the previous private state

`new_private_commitment`: Poseidon hash of the private state after incorporating the deposit

`pubkey`: Recipient's pubkey

`public_state`: Recipient's public state

**Witness**

`pubkey`: Recipient's pubkey

`deposit_salt`: Salt used for the deposit

`deposit_index`: Index in the deposit tree

`deposit`: Deposit data

`deposit_merkle_proof`: Merkle proof of the deposit tree

`public_state`: Recipient's public state

`private_state_transition`: Input for the private state transition gadget

`prev_private_commitment`: Poseidon hash of the previous private state

`new_private_commitment`: Poseidon hash of the private state after incorporating the deposit

**Constraint**

1. Verify that poseidon hashing `pubkey` and `salt` results in `pubkey_salt_hash`.
2. Verify the `deposit_merkle_proof`
3. Check the consistency between `private_state_transition` and `deposit`. Create the `nullifier` by poseidon hashing the `deposit`. Constrain that other values like `amount` and `token_index` match.
4. Calculate the poseidon hash of `private_state_transition`'s `prev_private_state` and `new_private_state` and output to the public input

## Receive Transfer Circuit

A circuit for receiving transferred assets

**Public Inputs**

`prev_private_commitment`: Poseidon hash of the previous private state

`new_private_commitment`: Poseidon hash of the private state after incorporating the deposit

`pubkey`: Recipient's pubkey

`public_state`: Recipient's public state

`balance_circuit_vd`: Verifier data for the balance circuit

**Witness**

`pubkey`: Recipient's pubkey

`public_state`: Recipient's public_state

`block_merkle_proof`: Block merkle proof in the recipient's public state's block tree, for the block containing the `transfer`

`transfer_inclusion`: Input for the transfer inclusion gadget

`private_state_transition`: Input for the private state transition gadget

`prev_private_commitment`: Poseidon hash of the previous private state

`new_private_commitment`: Poseidon hash of the private state after incorporating the transfer

`balance_circuit_vd`: Verifier data for the balance circuit

**Constraint**

1. Verify `transfer_inclusion`.
2. Verify `block_merkle_proof`. In this process, verify `transfer_inclusion.public_state.block_hash` as a leaf of the block hash tree.
3. Check the consistency between `private_state_transition` and `transfer`. Create the `nullifier` by poseidon hashing the `transfer`. Constrain that other values like `amount` and `token_index` match.
4. Calculate the poseidon hash of `private_state_transition`'s `prev_private_state` and `new_private_state` and output to the public input

## Update Circuit

A circuit for synchronizing the public state of a user's balance proof to a new block. The user must not have sent any tx up to the new block. If they have sent a tx, they need to execute the sender circuit for the block in which they sent the tx.

**Public Inputs**

`pubkey`: User's public key

`prev_public_state`: User's previous public state

`new_public_state`: Public state corresponding to the new block

**Witness**

`pubkey`: User's public key

`prev_public_state`: User's previous public state

`new_public_state`: Public state corresponding to the new block

`validity_proof`: Validity proof corresponding to the new block

`block_merkle_proof`: Block merkle proof of the old block in the block tree of the new public state

`account_membership_proof`: Merkle proof for `pubkey` in the account tree of the new public state

**Constraint**

1. Verify `validity_proof` and obtain `new_public_state` from the public input
2. Verify `block_merkle_proof` and confirm that the block tree of the new block contains `prev_public_state.block_hash`
3. Verify `account_membership_proof` and confirm that in the account tree of the new block, the `last_block_number` of `pubkey` is equal to or less than the block number of `prev_public_state`. This means the user has not sent any tx after `prev_public_state`.

## Spent Circuit

When sending money, the user constructs a merkle tree of height 6 consisting of 64 transfers.

A transfer is a struct with the following structure:

```rust
pub struct Transfer {
    pub recipient: GenericAddress,
    pub token_index: u32,
    pub amount: U256,
    pub salt: Salt,
}
```

The user creates a tx struct by combining the merkle root of the transfer tree and a nonce:

```rust
pub struct Tx {
    pub transfer_tree_root: PoseidonHashOut,
    pub nonce: u32,
}
```

The Spent Circuit is a circuit that deducts balance from the user's asset tree according to the amount of the transfer the user is sending. It also checks if the nonce of the user's private state matches the nonce of the tx, and increments the nonce.

**Public Inputs**

`prev_private_commitment`: Poseidon hash of the private state before sending

`new_private_commitment`: Poseidon hash of the private state after sending

`tx`: Tx to send

`insufficient_flags`: Array of boolean values indicating whether there will be insufficient balance for that token after sending the transfer

`is_valid`: Boolean value indicating whether the nonce of the user's private state matches the nonce of the tx

**Witness**

`prev_private_state`: Private state before sending

`new_private_state_salt`: Salt to be used in the private state after sending

`transfers`: Vector of 64 transfers to send

`prev_balances`: Balances before sending for the tokens corresponding to the transfers

`asset_merkle_proofs`: Merkle proofs for updating the asset tree

`prev_private_commitment`: Poseidon hash of the private state before sending

`new_private_commitment`: Poseidon hash of the new private state

`tx`: Tx to send

`insufficient_flags`: Array of boolean values indicating whether there will be insufficient balance for that token after sending the transfer

`is_valid`: Boolean value indicating whether the nonce of the user's private state matches the nonce of the tx

**Constraint**

1. For each `transfer`, update the asset tree while deducting the balance. Also save the `is_insufficient` of the updated asset leaf as a vector.
2. Set `is_valid=true` if the nonce of the user's private state matches the nonce of the tx, otherwise set `is_valid=false`
3. Update `new_private_state` with `nonce = prev_private_state+1`, `salt = new_private_state_salt`, and update `asset_tree_root` to the root of the updated asset tree.

## Tx Inclusion Circuit

After sending a tx, the user needs to prove that the tx was included in a block to update their balance proof. The tx inclusion circuit needs to include the user's tx in the block. The tx inclusion circuit proves this.

**Public Inputs**

`prev_public_state`: Public state of the old balance proof

`new_public_state`: Public state of the new balance proof

`pubkey`: User's public key

`tx`: Tx sent by the user, included in the block corresponding to `new_public_state`

`is_valid`: Set to `is_valid=true` if the user's BLS signature is included in the aggregate signature and the block containing the tx is valid, otherwise set to `is_valid=false`

```rust
    pub prev_public_state: PublicStateTarget,
    pub new_public_state: PublicStateTarget,
    pub pubkey: U256Target,
    pub tx: TxTarget,
    pub is_valid: BoolTarget,
```

**Witness**

`pubkey`: Public key pubkey

`prev_public_state`: Public state of the old balance proof

`new_public_state`: Public state of the new balance proof

`validity_proof`: Validity proof of `new_public_state`

`block_merkle_proof`: Merkle proof of the block hash of `prev_public_state` in the block tree of `new_public_state`

`prev_account_membership_proof`: Merkle proof from `new_public_state.prev_account_tree_root` to `pubkey`. last_block_number

`sender_index`: Index in the sender tree

`tx`: Sender's tx

`tx_merkle_proof`: Tx merkle proof

`sender_leaf`: Leaf of the sender tree

`sender_merkle_proof`: Sender merkle proof

`is_valid`: Same as `is_valid` in the public input

**Constraint**

1. Verify `block_merkle_proof` and check that it contains `prev_public_state.block_hash`.
2. Verify `prev_account_membership_proof` and constrain that the `last_block_number` immediately before reflecting the new block is less than or equal to `*prev_public_state*.block_number`. This constrains that no tx has been sent between `prev_public_state` and `new_public_state`.
3. Verify `tx_merkle_proof` and constrain that `tx` is included in `new_public_state`.
4. Verify `sender_merkle_proof` and constrain that the sender of `tx` is `pubkey`.
5. Set `is_valid = *sender_leaf*.is_valid && validity_pis.is_valid_block`

## Sender Circuit

A circuit used to update the balance proof after a user sends a tx.

**Public Inputs**

`prev_balance_pis`: Public inputs of the balance proof before reflecting the tx send

`new_balance_pis`: Public inputs of the new balance proof after reflecting the tx send

**Witness**

`spent_proof`: Spent proof

`tx_inclusion_proof`: Tx inclusion proof

`prev_balance_pis`: Balance proof before reflecting the tx send

`new_balance_pis`: Public inputs of the new balance proof after reflecting the tx send

**Constraint**

1. Verify `*spent_proof*`
2. Verify `*tx_inclusion_proof*`
3. Constrain that `spent_pis.tx` and `tx_inclusion_pis.tx` are the same
4. Set `is_valid = spent_pis.is_valid && tx_inclusion_pis.is_valid`
5. If `is_valid=true`, set `last_tx_hash` to the poseidon hash of `tx_inclusion_pis.tx`, otherwise set it to `prev_balance_pis.last_tx_hash`.
6. If `is_valid=true`, set `new_private_commitment` to `spent_pis.new_private_commitment`, otherwise set it to `spent_pis.prev_private_commitment`.
7. Update `private_commitment`, `last_tx_hash`, `last_tx_insufficient_flags`, and `public_state` of `BalancePublicInputs`.

## Balance Transition Circuit

A wrapper circuit that verifies one of Receive Transfer Proof, Receive Deposit Proof, Update Proof, or Sender Proof.

**Public Inputs**

`prev_balance_pis`: Public inputs of the balance proof before update

`new_balance_pis`: Public inputs of the balance proof after update

**Witness**

`circuit_type`: Circuit type

`circuit_flags`: Circuit type encoded as flags

`receive_transfer_proof`: Receive transfer proof

`receive_deposit_proof`: Receive deposit proof

`update_proof`: Update proof

`sender_proof`: Sender proof

`prev_balance_pis`: Public inputs of the previous balance

`new_balance_pis`: Public inputs of the new balance

`new_balance_pis_commitment`: Poseidon hash of the public inputs of the updated balance proof

`balance_circuit_vd`: Verifier data for the balance circuit

**Constraint**

1. Constrain that `circuit_flags[circuit_type]=1` and `circuit_flags[0]+circuit_flags[1]+circuit_flags[2] + circuit_flags[3]=1`.
2. Verify `receive_transfer_proof`, `receive_deposit_proof`, `update_proof`, or `sender_proof` according to `circuit_flags`, and construct `new_balance_pis`.
