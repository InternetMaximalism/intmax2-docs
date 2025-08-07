---
sidebar_position: 12
description: "wallet_switchEthereumChain - EIP3085"
---

# Switch Chain

Requests that the wallet switches its active Ethereum chain

## Request Parameters

### Params\[0\]

| Parameter | Type     | Required | Description |
|-----------|----------|----------|-------------|
| `chainId` | String   | Yes      | The chain ID is a `0x`-prefixed hexadecimal string. |

## Response Parameters

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `null`    |          | `null` is returned **if the active chain was switched**, and an error otherwise. |

## Request Example

```typescript
ethereum.request({ 
  method: "wallet_switchEthereumChain", 
  params: [
    { 
      chainId: "0x89"
    }
  ]
})
```

## Response Example

```json
null
```
