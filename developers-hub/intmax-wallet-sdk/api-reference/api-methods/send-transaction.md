---
sidebar_position: 7
description: "eth-sendTransaction - EIP1474"
---

# Send Transaction

Creates, signs, and sends a new transaction to the network. Creates new message call transaction or a contract creation, if the data field contains code, and signs it using the account specified in `from`.

**Note:** If a `to` address is not provided, it will be assumed that the transaction is a contract creation transaction, and the `data` field of the transaction will be used as the contract initialization code. `gasPrice` cannot be used together with `maxPriorityFeePerGas` and `maxFeePerGas`.

## Request Parameters

### Params\[0\]

| Parameter | Type     | Required | Description |
|-----------|----------|----------|-------------|
| `from`    | String   | Yes      | The address the transaction is sent from. (20 Bytes) |
| `to`      | String   | Yes (optional when creating new contract) | The address the transaction is directed to. (20 Bytes) |
| `gas`     | String   | No (default: 90000) | Integer of the gas provided for the transaction execution. It will return unused gas. |
| `gasPrice`| String   | No       | The gas price the sender is willing to pay to miners in wei. |
| `value`   | String   | Yes      | Integer of the value sent with this transaction, in Wei. |
| `data`    | String   | No       | The compiled code of a contract OR the hash of the invoked method signature and encoded parameters. |
| `nonce`   | Integer  | No       | Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce. |

## Response Parameters

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `DATA`    | String   | The transaction hash, or the zero hash if the transaction is not yet available. (32 Bytes) |

## Request Example

```typescript
ethereum.request({
  method: "eth_sendTransaction",
  params: [
    { 
      from: "0x5A3897b0513FdBeEc7C469D9aF4fA6C0752aBea7", 
      to: "0xDeaDbeefdEAdbeefdEadbAcFdeadbeefDEADbEEF", 
      value: "0x0",
      data: "0x"
    }
  ],
})
```

## Response Example

```json
"0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b"
```
