---
sidebar_position: 1
id: api-methods
title: API Methods
---

# API Methods

This section provides an interactive reference for the JSON-RPC API of INTMAX WalletSDK. The API builds on a set of standard Ethereum methods with INTMAX WalletSDK-specific enhancements and is designed for seamless integration into dapps.

The `INTMAX WalletSDK` protocol defines three types of JSON-RPC methods.

- **[notice](#notice-method-types)**: Notification messages from the wallet.
- **[approval](#approval-method-types)**: Methods that request approval from the wallet.
- **[readonly](#readonly-method-types)**: Read-only methods resolved on the dapp side.

## Notice Method Types

A slightly special method type representing notifications from the wallet. This type of method is implicitly fired by the wallet and notified to the dapp side. This type is not used except for methods defined in the INTMAX WalletSDK protocol.

These methods are:

- [INTMAX Ready](intmax-ready)
- [INTMAX Connect](intmax-connect)

## Approval Method Types

These are methods that require user approval, such as signing.

The following methods request user approval from the dapp to the wallet. They inherit the schema of each EIP.

- [Request Wallet Account](request-wallet-account)
- [Sign Message](sign-message)
- [Sign Typed Data](sign-typed-data)
- [Sign Transaction](sign-transaction)
- [Send Transaction](send-transaction)
- [Add Chain to Wallet](add-chain-to-wallet)
- [Watch Wallet Asset](watch-wallet-asset)

## Readonly Method Types

They are Read-only methods like `eip155/eth_accounts`. These are generally cached by the SDK on the dapp side and are not requested from the wallet. However, they are just methods, so it is also possible to handle them on the wallet side.

The following methods are expected to be resolved by the SDK on the dapp side. They are not requested from the wallet. The naming "readonly" may change in the future.

- [Get Accounts](get-accounts)
- [Get Chain ID](get-chain-id)
- [Switch Chain](switch-chain)
