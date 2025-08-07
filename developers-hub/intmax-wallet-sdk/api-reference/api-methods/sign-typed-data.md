---
sidebar_position: 5
description: "eth-signTypedData_v4 - EIP712"
---

# Sign Typed Data

Presents a data message for the user to sign in a structured and readable format and returns the signed response. This method requires that the user has granted permission to interact with their account first, so make sure to call `eth_requestAccounts` first.

## Request Parameters

### Params\[0\]

| Parameter | Type   | Required | Description                                              |
| --------- | ------ | -------- | -------------------------------------------------------- |
| `DATA`    | String | Yes      | The address of the requested signing account. (20 Bytes) |

### Params\[1\]

| Parameter            | Type   | Required | Description                                                                    |
| -------------------- | ------ | -------- | ------------------------------------------------------------------------------ |
| `types`              | Object | Yes      | Message to sign (N Bytes)                                                      |
| `types.EIP712Domain` | Array  | Yes      | An array specifying one or more of the following domain separator values below |
| `domain`             | Object | Yes      | Contains the domain separator values specified in the `EIP712Domain` type      |
| `primaryType`        | String | Yes      |                                                                                |
| `message`            | Object | Yes      | The message you're proposing the user to sign.                                 |

## Response Parameters

​
| Parameter | Type | Description |
|-----------|----------|-------------|
| `DATA` | String | signature |

## Request Example

```typescript
await window.ethereum.request({
  "method": "eth_signTypedData_v4",
  "params": [
    "0x0000000000000000000000000000000000000000",
    {
      "types": {
        "EIP712Domain": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "version",
            "type": "string"
          },
          {
            "name": "chainId",
            "type": "uint256"
          },
          {
            "name": "verifyingContract",
            "type": "address"
          }
        ],
        "Person": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "wallet",
            "type": "address"
          }
        ],
        "Mail": [
          {
            "name": "from",
            "type": "Person"
          },
          {
            "name": "to",
            "type": "Person"
          },
          {
            "name": "contents",
            "type": "string"
          }
        ]
      },
      "primaryType": "Person",
      "domain": {
        "name": "Webmax Dapp Example",
        "version": "1",
        "chainId": 1,
        "verifyingContract": "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
      },
      "message": {
        { name: "Bob", age: 25 }
      }
    }
  ]
});
```

## Response Example

```json
"0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b915621c"
```

​
