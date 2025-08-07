---
sidebar_position: 1
description: "Method to notify that the wallet is ready for communication."
---

# INTMAX Ready

A method notifying that the wallet has been initialized and is ready to communicate with the dapp.

## Request Parameters

None

## Response Parameters

| Parameter           | Type | Description |
| ------------------- | ---- | ----------- |
| `IntmaxReadyResult` |      |             |

## Request Example

```typescript
const sdk = intmaxWalletClient();

sdk.on("intmax/intmax_ready", (c) => {
  return c.success({
    supportedNamespaces: ["eip155", "intmax"],
    supportedChains: supportedChains,
  });
});
```

### Response Example

```typescript
export type WebmaxReadyResult = {
  supportedNamespaces: Namespace[];
  supportedChains: ChainedNamespace[];
};
```
