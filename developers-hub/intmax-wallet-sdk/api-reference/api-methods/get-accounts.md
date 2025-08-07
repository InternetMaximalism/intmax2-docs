---
sidebar_position: 10
description: "eth_accounts - EIP1193"
---

# Get Accounts

Returns a list of addresses for the accounts owned by the user.

## Request Parameters

None

## Response Parameters

| Parameter     | Type               | Description                       |
|---------------|--------------------|-----------------------------------|
| `AddressList` | Array\[string\]    | Addresses owned by the client.    |

## Request Example

```typescript
await window.ethereum.request({
  "method": "eth_accounts",
  "params": []
});
```

## Response Example

```json
"0xD88392123a1085c75e62eAc7dea7e0e1e5142d5f"
```
