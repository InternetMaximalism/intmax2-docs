---
sidebar_position: 9
description: "wallet_watchAsset - EIP747"
---

# Watch Wallet Asset

Requests that the user track the specified token in the wallet. Returns a boolean indicating if the token was successfully added. Once added, the token is indistinguishable from those added using legacy methods, such as a centralized registry.

## Request Parameters

| Parameter          | Type    | Required | Description                                                                     |
| ------------------ | ------- | -------- | ------------------------------------------------------------------------------- |
| `type`             | String  | Yes      | Supports ERC-20, ERC-721, and ERC-1155 tokens.                                  |
| `options`          | Object  | Yes      | Contains the params below                                                       |
| `options.address`  | String  | Yes      | The address of the token contract.                                              |
| `options.symbol`   | String  | No       | A ticker symbol or shorthand, up to 11 characters (optional for ERC-20 tokens). |
| `options.decimals` | Integer | No       | The number of token decimals (optional for ERC-20 tokens).                      |
| `options.image`    | String  | No       | A string URL of the token logo (optional for ERC-20 tokens).                    |
| `options.tokenId`  | String  | No       | The unique identifier of the NFT (required for ERC-721 and ERC-1155 tokens).    |

## Response Parameters

| Parameter | Type    | Description                                       |
| --------- | ------- | ------------------------------------------------- |
| `DATA`    | Boolean | `true` if the token was added, `false` otherwise. |

## Request Example

```typescript
ethereum.request({
  method: "wallet_watchAsset",
  params: {
    type: "ERC20",
    options: {
      address: "0xb60e8dd61c5d32be8058aabeb970870f07233155",
      symbol: "FOO",
      decimals: 18,
      image: "https://foo.io/token-image.svg",
    },
  },
});
```

## Response Example

```json
true
```
