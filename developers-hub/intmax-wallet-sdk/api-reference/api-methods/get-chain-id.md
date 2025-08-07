---
sidebar_position: 11
description: "eth_chainId - EIP1193"
---

# Get Chain ID

Returns the chain ID of the current network.

## Request Parameters

None

## Response Parameters

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `chainId` | String   | The chain ID is a `0x`-prefixed hexadecimal string. |

## Request Example

```typescript
await window.ethereum.request({
 "method": "eth_chainId",
 "params": [],
});
```

## Response Example

```json
"0x1"
```
