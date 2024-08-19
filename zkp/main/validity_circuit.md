# Validity Circuit

## Version

**Version Number**: v0.0.1

**Update Date**: 2024/08/17

## Purpose

The purpose of this document is to clarify the specifications and security requirements of the validity proof circuit for intmax2_zkp, to assist with auditing.

## Overview

The validity proof is a ZKP based on the validity of blocks posted to intmax2 and other information obtainable on-chain. The validity proof is a type of cyclic proof and is updated every time a new block is posted. The validity proof is common to all users.

In the validity circuit, posted blocks are processed in the order of **block validation** → **transition**.

The **block validation circuit** is a ZKP circuit that determines whether a posted block is valid. All blocks that are posted to the contract are assigned either `is_valid = true` or `false` by the block validation circuit. It mainly performs signature verification excluding pairing, checks for sender duplication, and account id lookup (or public key exclusion).

The **transition circuit** is a circuit that is executed based on the result of block validation.

- If the posted block is a registration block (all senders are first-time tx senders, specified by public keys) and the block is valid, it registers the senders whose signatures have been returned in the account tree and assigns account ids.
- If the posted block is a non-registration block (all senders are second or subsequent tx senders, specified by account ids assigned during their first tx) and the block is valid, it updates the last block number in the account tree for the senders whose signatures have been returned.
- Regardless of the validity of the posted block, it registers the hash value of the posted block in the block hash tree.

Thus, the validity circuit performs validation processing on the posted block and transition processing based on it. The following are details of each circuit.

## Block Validation

### **Account Exclusion**

Account exclusion is used for validation of registration blocks. It is a circuit that returns a boolean value indicating whether all of the senders' BLS public keys do not exist in the account tree.

**Public Inputs**

`account_tree_root`: The root of the current account tree (immediately after processing the previous block)

`pubkey_commitment`: Poseidon hash of the array of senders' BLS public keys

`is_valid`: Returns `true` if all BLS public keys specified by `pubkey_commitment` do not exist in the account tree specified by `account_tree_root`. Otherwise, returns `false`.

**Witness**

`account_tree_root`: Same as the public input `account_tree_root`

`account_membership_proofs`: Indexed merkle proof to prove whether the specified pubkey exists in the account tree. `account_membership_proofs` can always be created whether the specified pubkey exists in the account tree or not.

`pubkeys`: Array of BLS public keys (in compressed format)

`pubkey_commitment`: Hash value of `pubkeys` by Poseidon hash

`is_valid`: Same as the public input `is_valid`

**Constraint**

1. Verify each `account_membership_proofs`. If the corresponding `pubkey` is not a dummy and exists in the account tree, return `is_valid=false`. Otherwise, return `is_valid=true`.

### **Account Inclusion**

Account inclusion is used for validation of non-registration blocks. It is a circuit that returns a boolean value indicating whether all of the senders' BLS public keys exist in the account tree.

**Public Inputs**

`account_id_hash`: Keccak256 hash of the byte string encoded from account_id in 5-byte chunks

`account_tree_root`: The root of the current account tree (immediately after processing the previous block)

`pubkey_commitment`: Poseidon hash of the array of senders' BLS public keys

`is_valid`: Returns `true` if all BLS public keys specified by `pubkey_commitment` exist in the account tree specified by `account_tree_root`. Otherwise, returns `false`.

**Witness**

`account_id_packed`: Byte string encoded from account_id in 5-byte chunks

`account_id_hash`: Hash value of `account_id_packed`

`account_tree_root`: Same as the public input `account_tree_root`

`account_merkle_proofs`: Merkle proof corresponding to the index of account_id. Since account_id is 40 bits and the height of the merkle tree is also 40, the corresponding merkle proof always exists.

`pubkeys`: Array of BLS public keys (in compressed format)

`pubkey_commitment`: Poseidon hash of `pubkeys`

`is_valid`: Same as the public input `is_valid`

**Constraint**

1. Verify each `account_merkle_proofs`. Return `is_valid=true` if the `pubkey` contained in the leaf corresponding to the account id is not all zeros. Otherwise, return `is_valid=false`.

### Format Validation

The format validation circuit is a circuit that returns a boolean value indicating whether the signature content of the posted block is correct.

**Public Inputs**

`pubkey_commitment`: Poseidon hash of the array of senders' BLS public keys

`signature_commitment`: Poseidon hash of the signature content

`is_valid`: Returns `true` only if all of the following conditions are met, otherwise returns `false`:

1. `sender_flag` is not 0
2. `pubkeys` are sorted in descending order, and pubkey=1 is used as padding.
3. `pubkeys` exist within the range of Fq of the bn254 base field.
4. `pubkeys` are correct as the compressed form of G1. That is, G1 can be restored from each `pubkey`. In other words, when `x=pubkey`, `y = x^3 + 3` is square.
5. The G2 message point corresponding to `tx_tree_root` is correctly calculated.

**Witness**

`pubkeys`: Array of BLS public keys (in compressed format)

`signature`: Signature content

`pubkey_commitment`: Same as the public input `pubkey_commitment`

`signature_commitment`: Same as the public input `signature_commitment`

`is_valid`: Same as the public input `is_valid`

**Constraint**

Please refer to the explanation of `is_valid` in the public input.

### **Aggregation**

The aggregation circuit is a circuit that returns a boolean value indicating the correctness of the BDN18 weighted aggregation of the array of BLS public keys pubkeys. The values input to this circuit must have already passed format validation with `is_valid=true`. If not, it is not possible to generate a proof.

**Public Inputs**

`pubkey_commitment`: Poseidon hash of the array of senders' BLS public keys

`signature_commitment`: Poseidon hash of the signature content

`is_valid`: Returns `true` if `agg_pubkey` is equal to the value `sum` calculated by the following procedure, otherwise returns `false`:

1. For each `pubkey`, calculate `weight=hash_to_weight(pubkey, pubkey_hash)`
2. Calculate `sum` = Σ`b`_ `weight`_`pubkey`. Here, `b` is the bit decomposition of `sender_flag`.

**Witness**

`pubkeys`: Array of BLS public keys (in compressed format)

`signature`: Signature content

`pubkey_commitment`: Same as the public input `pubkey_commitment`

`is_valid`: Same as the public input `is_valid`

**Constraint**

Please refer to the explanation of `is_valid` in the public input.

### Main Validation

The main validation circuit is a circuit that performs block validation. It is also a wrapper circuit for the account exclusion, account inclusion, format validation, and aggregation circuits.

**Public Inputs**

`prev_block_hash`: Hash of the previous block

`block_hash`: Hash of the current block

`deposit_tree_root`: Root of the deposit tree at the time the block was posted

`account_tree_root`: Root of the current (latest at the time of processing the previous block) account tree

`tx_tree_root`: Root of the tx tree of the current block

`sender_tree_root`: Root of the merkle tree consisting of structures of flags indicating whether the sender returned the BLS signature to the block builder and the compressed form of the public key

`block_number`: Block number of the current block

`is_registration_block`: Whether the current block is a registration block

`is_valid`: Returns `true` if it passes all verifications of account exclusion (when is_registration_block=true), account inclusion (when is_registration_block=false), format validation, and aggregation. Otherwise, returns `false`.

**Witness**

`block`: Current block

`signature`: Signature content of the current block

`pubkeys`: Array of BLS public keys (in compressed format)

`account_tree_root`: Same as the public input `account_tree_root`

`account_inclusion_proof`: Account inclusion proof. Only given when is_registration_block=false.

`account_exclusion_proof`: Account exclusion proof. Only given when is_registration_block=true.

`format_validation_proof`: Format validation proof

`aggregation_proof`: Aggregation proof. Only given when is_valid=true up to format validation.

`signature_commitment`: Poseidon hash of signature

`pubkey_commitment`: Same as the public input `pubkey_commitment`

`prev_block_hash`: Same as the public input `prev_block_hash`

`block_hash`: Same as the public input `block_hash`

`sender_tree_root`: Same as the public input `sender_tree_root`

`is_registration_block`: Same as the public input `is_registration_block`

`is_valid`: Same as the public input `is_valid`

**Constraint**

1. Introduce a variable `result = true`.
2. Calculate the Poseidon hash value of the given `pubkey` to obtain `pubkey_commitment`.
3. Also calculate the keccak256 hash value of the given `pubkeys` to obtain `pubkey_hash`.
4. If `is_registration_block=true`, constrain that `signature.pubkey_hash` matches the `pubkey_hash` calculated in step 2. If `is_registration_block=false`, assign `result = false` if `signature.pubkey_hash` does not match the `pubkey_hash` calculated in step 2.
5. Calculate `signature_hash`, which is the keccak256 hash of the given `signature`, and `signature_commitment`, which is the Poseidon hash. Then, constrain that `block.signature_hash` matches `signature_hash`.
6. If `is_registration_block=true`, verify the `account_exclusion_proof` and check the consistency of its public inputs `pubkey_commitment` and `account_tree_root`. Also, take the AND of the public input `is_valid` and `result`, and assign it to `result`.
7. If `is_registration_block=false`, verify the `account_inclusion_proof` and check the consistency of its public inputs `pubkey_commitment`, `account_tree_root`, and `account_id_hash`.
8. Verify the `format_validation_proof` and check the consistency of its public inputs `pubkey_commitment` and `signature_commitment`. Also, take the AND of the public input `is_valid` and `result`, and assign it to `result`.
9. Only if `result=true`, verify the `aggregation_proof` and check the consistency of its public inputs `pubkey_commitment` and `signature_commitment`. Also, take the AND of the public input `is_valid` and `result`, and assign it to `result`.
10. Verify `block_hash` and `sender_tree_root`.

## Transition

### **Account Registration**

A circuit that performs account registration.

**Public Inputs**

`prev_account_tree_root`: Account tree root of the previous block

`new_account_tree_root`: Current account tree root

`sender_tree_root`: Current sender tree root

`block_number`: Current block number

**Witness**

`prev_account_tree_root`: Same as the public input `prev_account_tree_root`

`new_account_tree_root`: Same as the public input `new_account_tree_root`

`sender_tree_root`: Current sender tree root

`block_number`: Current block number

`sender_leaves`: Leaves of the sender tree. Consists of `pubkey` and `is_valid` (whether the signature was returned).

`account_registration_proofs`: Indexed insertion proof to insert `pubkey` into the account tree. If `pubkey` is dummy, insert a dummy indexed insertion proof.

**Constraint**

For each `sender_leaf`, if it is not dummy, verify the `account_registration_proof` and assign `block_number` to the `last_block_number` corresponding to `pubkey` in the account tree.

### **Account Update**

A circuit that updates the last block number of accounts.

**Public Inputs**

`prev_account_tree_root`: Account tree root of the previous block

`new_account_tree_root`: Current account tree root

`sender_tree_root`: Current sender tree root

`block_number`: Current block number

**Witness**

`prev_account_tree_root`: Same as the public input `prev_account_tree_root`

`new_account_tree_root`: Same as the public input `new_account_tree_root`

`sender_tree_root`: Current sender tree root

`block_number`: Current block number

`sender_leaves`: Leaves of the sender tree. Consists of `pubkey` and `is_valid` (whether the signature was returned).

`account_update_proofs`: Merkle proof to update the `last_block_number` corresponding to `pubkey` in the account tree. If `pubkey` is dummy, do not update `last_block_number`, otherwise update `last_block_number` to `block_number`.

**Constraint**

For each `sender_leaf`, verify the `account_update_proof`. If `pubkey` is dummy, do not update `last_block_number`, otherwise update `last_block_number` to `block_number`.
