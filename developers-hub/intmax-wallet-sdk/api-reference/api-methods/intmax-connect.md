---
sidebar_position: 2
description: "Method to request the user to connect with the wallet."
---

# INTMAX Connect

A method requesting the user to connect with the wallet.

## Request Parameters

None

## Response Parameters

| Parameter             | Type | Description |
| --------------------- | ---- | ----------- |
| `IntmaxConnectResult` |      |             |

## Request Example

```typescript
Request Example
const intmax = intmaxWalletClient();
webmax.on("intmax/intmax_connect", async (c) => {
if (isConnected(c, connections)) {
	return c.success({
		supportedNamespaces: ["eip155", "intmax"],
		supportedChains: supportedChains,
		accounts: { eip155: ethereumAccounts },
	});
}
```

## Response Example

```typescript
type IntmaxConnectResult = {
  supportedNamespaces: Namespace[];
  supportedChains: ChainedNamespace[];
  accounts: {
    eip155: EthereumAddress[];
  };
};
```
