---
sidebar_position: 1
id: supported-wallets
title: Supported Wallets
---

# Supported Wallets

This service supports the following browsers and wallets to ensure users can securely and easily connect to the blockchain network. If your preferred wallet is listed below, you can use it to sign transactions and manage your assets seamlessly.

Please note that using a wallet not listed here is strongly discouraged, as it may not function properly with our service and could result in the loss of your assets. In particular, INTMAX wallet is also not supported at this time.

The list of supported wallets may be updated periodically, so please refer to this documentation for the most current information.

## Supported Browsers

The recommended browsers are as follows:
- **Mac:** Safari and Google Chrome
- **Windows:** Google Chrome
- **Android:** Google Chrome
- **iOS:** Safari

## Supported Wallets

| Application Name | Supported OS             | Note |
|------------------|--------------------------|------|
| Metamask         | MacOS Chrome extension<br />Windows Chrome extension<br />iOS app from iOS Safari |      |
| Bitget Wallet    | MacOS Chrome extension<br />iOS app from iOS Safari<br />iOS in-app browser       | [BitGet Wallet (iOS App)](supported-wallets/bitget-wallet-ios-app.md) |
| Coinbase Wallet  | MacOS Chrome extension   |      |
| OKX Wallet       | MacOS Chrome extension   |      |
| Rabby Wallet     | MacOS Chrome extension   | [Rabby Wallet](supported-wallets/rabby-wallet.md) |
| Trust Wallet     | MacOS Chrome extension<br />iOS app from iOS Safari | [Trust Wallet](supported-wallets/trust-wallet.md) |
| Phantom Wallet   | MacOS Chrome extension   | [Phantom Wallet](supported-wallets/phantom-wallet.md) |


**NOTE**: "iOS app from iOS Safari" means connecting to a wallet app from the Safari browser.

### Unsupported Wallet

- INTMAX Wallet (The INTMAX address changes every time you connect)
- iOS Safari + Coinbase Wallet (Unable to connect to the wallet)
- iOS Safari + Rabby Wallet (Unable to connect to the wallet)
- iOS Safari + OKX Wallet (Unable to deposit ETH)

## Connecting Your Wallet to the Sepolia Test Network

To interact with the Testnet environment, your wallet must be connected to the **Sepolia network**.
Please note that some wallet applications do not include Sepolia in their default network list. In such cases, you will need to manually add the Sepolia network.
Refer to the official documentation or in-app instructions for your wallet to learn how to add a custom network. Make sure the Sepolia network is added and selected before proceeding with any Testnet-related operations.

## Additional Note

1. When using a mobile wallet on an mobile device, it is highly recommended to access DApps through the **In-App Browser** provided within each wallet application. Some wallets may become unstable when connecting to DApps via external mobile browsers like Chrome or Brave. This can result in issues with DApp communication or signing transactions. Using the In-App Browser ensures that the wallet and DApp operate within the same secure environment, significantly reducing connection issues.
2. When importing a private key created in Wallet App A into another Wallet App B, it is **NOT guaranteed** that the INTMAX address will remain the same when connected via Wallet A and Wallet B.
Please ensure that you always use the same wallet app for connection.
