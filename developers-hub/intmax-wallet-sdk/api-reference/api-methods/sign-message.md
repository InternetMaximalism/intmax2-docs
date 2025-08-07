---
sidebar_position: 4
description: "eth-sign - EIP1474"
---

# Sign Message

The sign method calculates an Ethereum-specific signature. Adding a prefix to the message makes the calculated signature recognizable as an Ethereum-specific signature. This prevents misuse where a malicious dapp can sign arbitrary data (e.g. transaction) and use the signature to impersonate the victim.

## Request Parameters

### Params\[0\]

| Parameter | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| `DATA`    | String | Yes      | address (20 Bytes) |

### Params\[1\]

| Parameter | Type   | Required | Description               |
| --------- | ------ | -------- | ------------------------- |
| `DATA`    | String | Yes      | message to sign (N Bytes) |

## Response Parameters

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| `DATA`    | String | signature   |

## Request Example

```typescript
ethereum.request({
  method: "eth_sign",
  params: ["0x7a2054d370f93ec7d8a08e065121118dc8f4bf29", "Hello Webmax"],
});
```

## Response Example

```json
"0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b"
```
