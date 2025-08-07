---
sidebar_position: 8
description: "wallet_addEthereumChain - EIP3085"
---

# Add Chain To Wallet

Creates a confirmation asking the user to add the specified chain to the wallet application. The caller must specify a chain ID and some chain metadata.

## Request Parameters

### Params\[0\]

| Parameter | Type     | Required | Description |
|-----------|----------|----------|-------------|
| `chainId` | String   | Yes      | The chain ID is a `0x`-prefixed hexadecimal string |
| `chainName` | String | Yes      | A human-readable name for the chain. |
| `rpcUrls` | Array\[string\] | Yes | One or more URLs pointing to RPC endpoints that can be used to communicate with the chain. |
| `iconUrls` | Array\[string\] | No | One or more URLs pointing to reasonably sized images that can be used to visually identify the chain. |
| `nativeCurrency` | Object | Yes | Describes the native currency of the chain using the `name`, `symbol`, and `decimals` fields. |
| `nativeCurrency.decimals` | Integer | Yes | A non-negative integer. |
| `nativeCurrency.symbol` | String | Yes | A human-readable symbol. |
| `nativeCurrency.name` | String | No | A human-readable name. |
| `blockExplorerUrls` | Array\[string\] | No | One or more URLs pointing to block explorer sites for the chain. |

## Response Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `null`    |      | The method **MUST** return `null` if the request was successful, and an error otherwise. |

## Request Example

```typescript
ethereum.request({
  "method": "wallet_addEthereumChain",
  "params": [
    {
      "chainId": "0x64",
      "chainName": "Gnosis",
      "rpcUrls": [
        "https://rpc.ankr.com/gnosis"
      ],
      "iconUrls": [
        "https://xdaichain.com/fake/example/url/xdai.svg",
        "https://xdaichain.com/fake/example/url/xdai.png"
      ],
      "nativeCurrency": {
        "decimals": 18
        "symbol": "xDAI",
        "name": "xDAI",
      },
      "blockExplorerUrls": [
        "https://blockscout.com/poa/xdai/"
      ]
    }
  ]
})
```

## Response Example

```json
null
```
