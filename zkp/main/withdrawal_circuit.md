# Withdrawal Circuit

## Version

**Version Number**: v0.0.1

**Last Updated**: 2024/08/24

## Purpose

The purpose of this document is to clarify the specifications and security requirements of the withdrawal proof circuit in intmax2_zkp, aiding in the audit process.

## Withdrawal Inner Circuit

The Withdrawal inner circuit executes the calculation of one step in the withdrawal circuit. It verifies that the withdrawal transfer is included in the block and calculates one step of the hash chain.

**Public Inputs**

`prev_withdrawal_hash`: The previous `withdrawal_hash`

`withdrawal_hash`: The current withdrawal_hash

**Witness**

`prev_withdrawal_hash`: The previous `withdrawal_hash`

`transfer_inclusion_target`: Transfer inclusion target (refer to the balance circuit documentation)

**Constraints**

1. Verify the `transfer_inclusion_target`
2. Create the `nullifier` by hashing the Poseidon hash of `transfer` together with `transfer.salt`. We don't simply use the Poseidon hash of `transfer` as the `nullifier` because the recipient of an adjacent transfer in the transfer tree knows the Poseidon hash of `transfer` and could link it to the withdrawal.
3. Create an instance of the following struct `withdrawal` from `transfer_inclusion_target`:

```rust
pub struct WithdrawalTarget {
    pub recipient: AddressTarget,
    pub token_index: Target,
    pub amount: U256Target,
    pub nullifier: Bytes32Target,
    pub block_hash: Bytes32Target,
    pub block_number: Target,
}
```

4. Vectorize `withdrawal`, compute the keccak256 hash together with `prev_withdrawal_hash` to create `withdrawal_hash`.

## Withdrawal Circuit

The withdrawal circuit verifies the withdrawal inner proof and rotates the cyclic proof. The circuit is similar to other cyclic circuits, so the explanation is omitted.

## Withdrawal Wrapper Circuit

The Withdrawal wrapper circuit verifies the cyclic proof of the withdrawal proof and converts it into a regular non-cyclic plonky2 proof.

**Public Inputs**

`last_withdrawal_hash`: The last hash of the withdrawal hash chain

`withdrawal_aggregator`: The address of the person submitting the withdrawal proof to the contract. This prevents front-running and hijacking of withdrawal proofs.

**Witness**

`withdrawal_aggregator`: Same as the public input `withdrawal_aggregator`

`withdrawal_proof`: The withdrawal proof

**Constraints**

1. Verify `withdrawal_proof` and output its public input `withdrawal_hash` as a public input
