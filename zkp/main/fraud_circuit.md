# Fraud Circuit

## Version

**Version Number**: v0.0.1

**Last Updated**: 2024/08/24

## Purpose

The purpose of this document is to clarify the specifications and security requirements of the fraud proof circuit in intmax2_zkp, aiding in the audit process.

**Public Inputs**

`block_hash`: The hash of the block to be slashed

`block_number`: The number of the block to be slashed

`challenger`: The address of the person submitting the fraud proof to the contract. This prevents front-running and hijacking of fraud proofs.

**Witness**

`challenger`: Same as the public input `challenger`

`validity_proof`: The validity proof related to the block being slashed

**Constraints**

1. Verify the validity proof and constrain the public input to be `is_valid=false`.
