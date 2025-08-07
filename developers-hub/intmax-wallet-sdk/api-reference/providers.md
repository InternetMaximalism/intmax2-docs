---
sidebar_position: 10
---

# Providers

## `.provider` method

The `.provider` method is a crucial part of the `intmaxDappClient` in the `INTMAX WalletSDK`, enabling direct interaction with different blockchain providers. It enables the use of custom providers, giving you the flexibility to integrate with blockchain networks not directly supported by the SDK. Let's dive into how it works and how to use it effectively.

### Method Signature

```typescript
provider<NS extends Schema[number]["namespace"]>(namespace: ChainedNamespace<NS> | NS)
```

- `namespace`: A string representing the namespace of the blockchain provider you wish to interact with. This can be a simple namespace (e.g., `"eip155"`) or a chained namespace (e.g., `"eip155:1"`), where the number represents the chain ID.

### Example

```typescript
const ethereum = await sdk.provider("eip155");
// or for a specific chain ID
const ethereumChainSpecific = await sdk.provider("eip155:1");
```

In this example, `client.provider("eip155")` returns an instance of the Ethereum provider, which can then be used to interact with the Ethereum blockchain. If you need to interact with a specific chain, such as Ethereum Mainnet (chain ID 1), you can specify the chain ID as part of the namespace (e.g., `"eip155:1"`).

## EthereumProvider

The `ethereumProvider` is a factory function that creates an Ethereum provider instance, conforming to the EIP-1193 standard. This provider enables interaction with the Ethereum blockchain through a set of methods, allowing Dapps to request account information, switch chains, and perform various blockchain operations like transaction signing, handling various Ethereum JSON-RPC requests, such as `eth_chainId`, `eth_accounts`, and `wallet_switchEthereumChain`, etc.

### Configuration

The `ethereumProvider` accepts an optional `EthereumProviderOptions` object, which can include:

- `httpRpcUrls`: A mapping of chain IDs to HTTP RPC URLs for interacting with the Ethereum blockchain. This is necessary for operations that require direct interaction with the blockchain.

### Example

To use the `ethereumProvider` within a Dapp, you must first initialize the `intmaxDappClient` with the provider configuration:

```typescript
const client = intmaxDappClient({
  wallet: { url: walletUrl, name: "DEMO Wallet" },
  metadata: DAPP_METADATA,
  providers: {
    eip155: ethereumProvider({
      httpRpcUrls: {
        1: "https://mainnet.infura.io/v3",
        137: "https://rpc-mainnet.maticvigil.com",
      },
    }),
  },
});
```

In this example, the `ethereumProvider` is configured with HTTP RPC URLs for the Ethereum Mainnet (chain ID 1) and Matic Mainnet (chain ID 137).
