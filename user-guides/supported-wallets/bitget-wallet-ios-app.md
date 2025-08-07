---
sidebar_position: 2
---

# BitGet Wallet

The BitGet Wallet works without major issues on the Ethereum Mainnet, but there are some limitations when using it on the Ethereum Sepolia test network.

On the iOS version of the app, it is not possible to add the Ethereum Sepolia network using an imported private key. It can only be used with wallets created using a mnemonic or a keyless wallet.

Additionally, if WalletConnect fails to connect, closing the WalletConnect popup once and reopening it to scan the QR code allowed me to proceed to the next screen.

## To add the Sepolia Network in BitGet Wallet

1. Tap the network name displayed in the upper right corner of the screen.
2. Select "Add Network".

<figure>
  <img src="/img/user-guides/bitget_wallet_10.webp" alt="Network Name" />
  <img src="/img/user-guides/bitget_wallet_20.webp" alt="Add Network" />
</figure>

3. In the search bar, type "Sepolia", and choose "Ethereum Sepolia" from the list of suggestions.
4. If a message saying "Adding network is not supported yet" appears, it means that the Sepolia network cannot be added to the currently used address.
In this case, please create a new wallet or restore a wallet by importing a mnemonic phrase or using a keyless wallet.

<figure>
  <img src="/img/user-guides/bitget_wallet_30.webp" alt="Ethereum Sepolia" />
  <img src="/img/user-guides/bitget_wallet_40.webp" alt="Adding Network Not Supported" />
</figure>

5. If you encounter a "WalletConnect connection failed" message, please close the WalletConnect popup on the website and reopen it.
Then, try scanning the QR code again to connect.

<figure className="no-max-height">
  <img src="/img/user-guides/bitget_wallet_50.webp" width="300" alt="WalletConnect Connection Failed" />
  <br />
  <img src="/img/user-guides/bitget_wallet_60.webp" width="300" alt="WalletConnect QR Code" />
</figure>
