---
sidebar_position: 6
description: "eth-signTransaction - EIP1474"
---

# Sign Transaction

Sign a transaction that can be submitted to the network later.

## Request Parameters

### Params\[0\]

| Parameter  | Type    | Required                                  | Description                                                                                         |
| ---------- | ------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `from`     | String  | Yes                                       | The address the transaction is sent from. (20 Bytes)                                                |
| `to`       | String  | Yes (optional when creating new contract) | The address the transaction is directed to. (20 Bytes)                                              |
| `gas`      | String  | No (default: 90000)                       | Integer of the gas provided for the transaction execution. It will return unused gas.               |
| `gasPrice` | String  | No                                        | The gas price the sender is willing to pay to miners in wei.                                        |
| `value`    | Integer | No                                        | Integer of the value sent with this transaction, in Wei.                                            |
| `data`     | String  | No                                        | The compiled code of a contract OR the hash of the invoked method signature and encoded parameters. |
| `nonce`    | Integer | No                                        | Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce. |

## Response Parameters

| Parameter | Type   | Description                                                         |
| --------- | ------ | ------------------------------------------------------------------- |
| `DATA`    | String | The RLP-encoded transaction object signed by the specified account. |

## Request Example

```typescript
await window.ethereum.request({
  method: "eth_signTransaction",
  params: [
    {
      from: "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
      to: "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
      gas: "0x76c0",
      gasPrice: "0x9184e72a000",
      value: "0x9184e72a",
      data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
    },
  ],
});
```

## Response Example

```json
"0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b"
```
