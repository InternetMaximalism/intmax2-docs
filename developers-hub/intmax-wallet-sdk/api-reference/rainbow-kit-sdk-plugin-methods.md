---
sidebar_position: 12
---

# Rainbow Kit SDK Plugin Methods

### `intmaxwalletsdk(parameters: intmaxwalletsdkParameters)`

This function initializes a new wallet connection with the specified parameters. The `parameters` object can include:

- `metadata`: Optional metadata about the DApp.
- `wallet`: An object containing the wallet's name, URL, and icon URL.
- `mode`: The mode of connection, either "iframe" or "popup".
- `chains`: The default chain ID(s) to connect to.

**Example**

```typescript
const additionalWallets = [
  intmaxwalletsdk({
    wallet: {
      url: "https://intmaxwallet-sdk-wallet.vercel.app/",
      name: "IntmaxWalletSDK Demo",
      iconUrl: "https://intmaxwallet-sdk-wallet.vercel.app/vite.svg",
    },
    metadata: {
      name: "Rainbow-Kit Demo",
      description: "Rainbow-Kit Demo",
      icons: ["https://intmaxwallet-sdk-wallet.vercel.app/vite.svg"],
    },
  }),
  intmaxwalletsdk({
    mode: "iframe",
    wallet: {
      url: "https://intmaxwallet-sdk-wallet.vercel.app/",
      name: "IntmaxWalletSDK Demo",
      iconUrl: "https://intmaxwallet-sdk-wallet.vercel.app/vite.svg",
    },
    metadata: {
      name: "Rainbow-Kit Demo",
      description: "Rainbow-Kit Demo",
      icons: ["https://intmaxwallet-sdk-wallet.vercel.app/vite.svg"],
    },
  }),
  intmaxwalletsdk({
    wallet: {
      url: "https://wallet.intmax.io",
      name: "INTMAX Wallet",
      iconUrl: "https://wallet.intmax.io/favicon.ico",
    },
    metadata: {
      name: "Rainbow-Kit Demo",
      description: "Rainbow-Kit Demo",
      icons: ["https://intmaxwallet-sdk-wallet.vercel.app/vite.svg"],
    },
  }),
];
```

**Results**

<figure><img src="/img/developers-hub/rainbow-kit-sdk-plugin.webp" alt="Rainbow Kit SDK Plugin" /></figure>

### `connectorsForWallets(wallets: Wallet[]): Connector[]`

Takes an array of wallet configurations and returns an array of connectors that can be used to connect to those wallets.

```typescript
const connectors = connectorsForWallets([
  {
    groupName: "IntmaxWalletSDK",
    wallets: additionalWallets,
  },
]);
```

### `createConfig(config: WagmiConfig): WagmiConfig`

Creates a configuration object for the Wagmi SDK. This includes settings for auto-connect, the connectors to use, and the public client for blockchain interaction.

```typescript
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
intmaxwalletsdk(parameters: intmaxwalletsdkParameters)
This function initializes a new wallet connection with the specified parameters. The parameters object can include:
metadata: Optional metadata about the DApp.wallet: An object containing the wallet's name, URL, and icon URL.mode: The mode of connection, either "iframe" or "popup".chains: The default chain ID(s) to connect to.
Example
const additionalWallets = [ intmaxwalletsdk({  wallet: {   url: "https://intmaxwallet-sdk-wallet.vercel.app/",   name: "IntmaxWalletSDK Demo",   iconUrl: "https://intmaxwallet-sdk-wallet.vercel.app/vite.svg",  },  metadata: {   name: "Rainbow-Kit Demo",   description: "Rainbow-Kit Demo",   icons: ["https://intmaxwallet-sdk-wallet.vercel.app/vite.svg"],  }, }), intmaxwalletsdk({  mode: "iframe",  wallet: {   url: "https://intmaxwallet-sdk-wallet.vercel.app/",   name: "IntmaxWalletSDK Demo",   iconUrl: "https://intmaxwallet-sdk-wallet.vercel.app/vite.svg",  },  metadata: {   name: "Rainbow-Kit Demo",   description: "Rainbow-Kit Demo",   icons: ["https://intmaxwallet-sdk-wallet.vercel.app/vite.svg"],  }, }), intmaxwalletsdk({  wallet: {   url: "https://wallet.intmax.io",   name: "INTMAX Wallet",   iconUrl: "https://wallet.intmax.io/favicon.ico",  },  metadata: {   name: "Rainbow-Kit Demo",   description: "Rainbow-Kit Demo",   icons: ["https://intmaxwallet-sdk-wallet.vercel.app/vite.svg"],  }, }),];
Results

connectorsForWallets(wallets: Wallet[]): Connector[]
Takes an array of wallet configurations and returns an array of connectors that can be used to connect to those wallets.
const connectors = connectorsForWallets([  {   groupName: "IntmaxWalletSDK",   wallets: additionalWallets,  },]);
createConfig(config: WagmiConfig): WagmiConfig
Creates a configuration object for the Wagmi SDK. This includes settings for auto-connect, the connectors to use, and the public client for blockchain interaction.
const wagmiConfig = createConfig({  autoConnect: true,  connectors,  publicClient,});
```
