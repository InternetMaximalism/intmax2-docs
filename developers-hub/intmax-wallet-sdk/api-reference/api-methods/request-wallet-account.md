---
sidebar_position: 3
description: "eth-requestAccounts - EIP1102"
---

# Request Wallet Account

Requests that the user provide an Ethereum address to be identified.

## Request Parameters

None

## Response Parameters

| Parameter     | Type            | Description               |
| ------------- | --------------- | ------------------------- |
| `AddressList` | Array\[string\] | Array of wallet addresses |

## Request Example

```typescript
// For wallet side example
const intmax = intmaxWalletClient();
intmax.on("eip155/eth_requestAccounts", (c) => {
  return c.success({
    accounts: ["0x1234..."],
  });
});

// For dapp side example
const ethereum = await webmax.provider("eip155");
await ethereum.request({ method: "eth_requestAccounts", params: [] });
```

## Response Example

```json
"0xa22392123a1095f75e62abc7dea7e0e1e5142d5f"
```
