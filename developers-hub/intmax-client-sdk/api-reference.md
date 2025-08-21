---
sidebar_position: 3
description: Comprehensive API reference for the INTMAX Client SDK, including detailed descriptions of properties, methods, parameters, return values, and usage examples for account management, transactions, deposits, withdrawals, fees, and more.
---

# API Reference

Comprehensive API reference for the INTMAX Client SDK, including detailed descriptions of properties, methods, parameters, return values, and usage examples for account management, transactions, deposits, withdrawals, fees, and more.

### Properties

#### `isLoggedIn: boolean`

This property indicates the current authentication state of the wallet user. It returns true when a user has successfully completed the authentication process and has an active session. This is crucial for determining whether sensitive operations like transactions or data access can be performed.

#### `address: string`

This `address`, which corresponds one-to-one with the connected wallet's Ethereum address, represents the address **on the INTMAX network**.

#### `tokenBalances: TokenBalance[] | undefine`

Represents the user's current token balances, including token address, balance, symbol, decimals, and name. If undefined, the balances are not yet available.

## Functions

This section describes all available functions and methods provided by the `IntMaxClient` SDK.
Each function includes a detailed explanation of its purpose, parameters, return values,
and usage examples. These APIs allow developers to perform account management, transactions,
and deposit/withdrawal operations directly with the INTMAX network.

All methods are asynchronous unless otherwise specified and are designed to handle
secure cryptographic operations via WebAssembly for optimal performance.

### Initialization

`IntMaxClient` is a core component of the INTMAX SDK that provides seamless interaction with the INTMAX network. Please specify either **testnet** or **mainnet** for the environment.

```tsx
import { IntMaxClient } from "intmax2-client-sdk";

const intMaxClient = IntMaxClient.init({ environment: "mainnet" });
```

To set up a local Balance Prover instance, please see Tips: [How to Run a Local Balance Prover](https://github.com/InternetMaximalism/intmax2-client-sdk/blob/main/README.md#tips-how-to-run-a-local-balance-prover)

### Account

The Account module provides comprehensive authentication and cryptographic operations for wallet management.

#### `login`

Initiates wallet authentication and establishes a secure session. This method handles key derivation, session token management, and initial data synchronization. It is essential for secure access to protected wallet functionalities.

The `nonce` and `encryptionKey` can be used to protect a private key, enabling its recovery without needing external wallet signatures on subsequent uses. Using this feature is optional.

The `encryptionKey` is a 32-byte string suitable for use as the key in AES-GCM encryption, and it is output as a Base64-encoded string.

A `nonce` is a value related to the generation of an encryption key. The same nonce will always produce the same encryptionKey.

The value of the `encryptionKey` is derived from a fixed message signed by an external wallet and the nonce value. If there is a risk of the encryptionKey being compromised, you can generate a new encryption key by updating the nonce.

[**Q.** What is “Login” in the context of the INTMAX network?](./faq#q-what-is-login-in-the-context-of-the-intmax-network)

```tsx
const loginResponse: LoginResponse = await client.login();

// example
{
  address: "T7iFM2BEtd3JxkaUNfZge83CtAqhdgcjGgJpiityyrYMW739SyyDYF5bnR8fkSG3G9YT4VZtur3hKhvuDm5ZLneYLy8j7gG",
  isLoggedIn: true,
  nonce: 0,
  encryptionKey: "/Nu5eFDLrYh0eRrU2izrptQE28aCE15XaVsjpM2JOmQ=",
  accessToken: "eyJkbGciOiJXUzUxNiIsInR3cCI6IkqXVCJ9.eyJhZGRyZXNzIjoiMHhmOWM3OGRhZTAxYWY3MjdlMmY2ZGI5MTU1Yjk0MmQ4YWI2MzFkZjRiIiwiZRhwIjoxNyQ5NjE4NjY2ODg5fQ.6Xa7fy0dtQBPDQR6mEJ1buH1fZo-GP6Fn8SgTDA8hGG1ZwkfMmpo-S36OUnxjPyIo76Ds4qz6ChFH40Ix40hfA"
}
```

#### `logout`

Securely terminates the current wallet session and clears sensitive data from memory. This method ensures proper cleanup of authentication tokens, cached data, and any active connections. Critical for maintaining security when the user is finished with their wallet operations.

```tsx
const res: void = await client.logout();
```

#### `getPrivateKey`

Securely retrieves the INTMAX private key required for signing operations when necessary. This can be used if the user wishes to back up their **INTMAX private key.** Transaction signing and decryption of transaction history can still be performed without executing this function.

```tsx
const privateKey: string = await client.getPrivateKey(); // will return hex string of private key
```

#### `signMessage`

Signs a message using an INTMAX account. This function signs the provided message, which can be any arbitrary string.

```tsx
const message = "Hello, World!";
const signature: SignMessageResponse = await client.signMessage(message);

// example
[
  "0x04f4185d46acee320b4628d252dc5d4802999b4499c9260ba3db9a7201a833dd",
  "0x273118b123ab37016456a538b5e15b881642b1a278a211bbd778f95d3f3c062e",
  "0x1af8a1df154fde0fa6c48d6c5e36c0edea202eb4da3d21062938f10a026b0a06",
  "0x2619565e2f4173043a4030c9f12d7dbada6b363425d1580e7a96c0632ad42585",
];
```

**Note**: The signature is computed deterministically. This means that signing the same message with the same account will always produce the same signature.

#### `verifySignature`

Verifies a signature generated using the `signMessage` function to ensure it matches the original message and INTMAX account.

```tsx
const signature = [
  "0x04f4185d46acee320b4628d252dc5d4802999b4499c9260ba3db9a7201a833dd",
  "0x273118b123ab37016456a538b5e15b881642b1a278a211bbd778f95d3f3c062e",
  "0x1af8a1df154fde0fa6c48d6c5e36c0edea202eb4da3d21062938f10a026b0a06",
  "0x2619565e2f4173043a4030c9f12d7dbada6b363425d1580e7a96c0632ad42585",
];
const message = "Hello, World!";
const isVerified: boolean = await client.verifySignature(signature, message);
```

#### `sync`

```ts
await intMaxClient.sync();
```

The `sync` function updates the user’s balance to the latest state.
On the INTMAX network, a user’s balance must be refreshed before transfers or withdrawals.

However, in the **frontend**, this function should not be called manually in normal use.
When an instance of `IntMaxClient` is created, the `sync` function is automatically executed in the background at regular intervals.

**Important:**

* ⚠️ In the **frontend**, The `sync` function should not be called manually in normal use.
* ⚠️ Be aware that multiple `sync` calls cannot run concurrently — if called at the same time, one of them will fail.
* ✅ However, if you create two separate IntMaxClient instances with different private keys, it is safe to call their sync functions concurrently.

#### `updateL1RpcUrl`

You can customize the RPC URL of the Ethereum (Sepolia) network used when executing a deposit transaction.

```tsx
const newL1RpcUrl = "https://new-rpc-url.com";
intMaxClient.updateL1RpcUrl(newL1RpcUrl);
```

### Token

This SDK manages cryptocurrency and digital asset information within the wallet ecosystem.

[Q. What are `tokenList` and `tokenBalances`](./faq#q-what-are-tokenlist-and-tokenbalances)

#### `getTokensList`

This API retrieves a list of tokens. The `tokenIndex` parameter is particularly important as it is used to specify tokens in operations such as deposits, withdrawals, and transfers. This allows precise identification of tokens within the INTMAX Client SDK.

```tsx
const tokens: Token[] = await client.getTokensList();

// example
[
  {
    contractAddress: "0x08210f9170f89ab7658f0b5e3ff39b0e03c594d4",
    decimals: 18,
    image: "https://..../ethereum.png",
    price: 3000,
    symbol: "ETH",
    tokenIndex: 0,
  },
];
```

#### `fetchTokenBalances`

Retrieves all token balances held by the currently logged-in INTMAX account. This is useful for displaying the user’s asset holdings within an application.

[Q. Why does it take time to execute the fetchTokenBalances function?](./faq#q-why-does-it-take-time-to-execute-the-fetchtokenbalances-function)

```tsx
const tokenBalances: TokenBalancesResponse = await client.fetchTokenBalances();

// example
{
  balances: [
    {
      amount: 10000n,
      token: {
        contractAddress: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        image: "https://.../ethereum.png",
        price: 3000,
        symbol: "ETH",
        tokenIndex: 0,
      },
    },
  ];
}
```

### Transaction

A transfer is made within the INTMAX network by executing a transaction on the network's transfer mechanism. It supports ETH, ERC20, ERC721, and ERC1155 tokens.

#### `fetchTransfers`

This function retrieves the history of tokens received by the user, including details like amount, sender (`from`), recipient (`to`), status, timestamp, and token information.

[Q. What is the difference between a transfer and a transaction?](./faq#q-what-is-the-difference-between-a-transfer-and-a-transaction)

```tsx
const transferList: FetchTransactionsResponse = await fetchTransfers({})

// example
[
 {
    amount: "100000000000000000",
    from: "T7iFM2BEtd3JxkaUNfZge83CtAqhdgcjGgJpiityyrYMW739SyyDYF5bnR8fkSG3G9YT4VZtur3hKhvuDm5ZLneYLy8j7gG", // INTMAX address
    status: 2,
    timestamp: 1735364080,
    to: "T7iFM2BEtd3JxkaUNfZge83CtAqhdgcjGgJpiityyrYMW739SyyDYF5bnR8fkSG3G9YT4VZtur3hKhvuDm5ZLneYLy8j7gG", // INTMAX address
    tokenIndex: 0,
    transfers: [],
    txType: "Receive"
    digest: "0xcb2a31dd08339e4a95c3ab03c9111888d81baa65f21413679b943af0c8fcd9b3"
  },
  {
    amount: "100000000000000000",
    from: "T7iFM2BEtd3JxkaUNfZge83CtAqhdgcjGgJpiityyrYMW739SyyDYF5bnR8fkSG3G9YT4VZtur3hKhvuDm5ZLneYLy8j7gG",
    status: 2,
    timestamp: 1735364080,
    to: "T7iFM2BEtd3JxkaUNfZge83CtAqhdgcjGgJpiityyrYMW739SyyDYF5bnR8fkSG3G9YT4VZtur3hKhvuDm5ZLneYLy8j7gG",
    tokenType: 1,
    tokenIndex: 7,
    transfers: [],
    txType: "Receive"
    digest: "0xcb2a31dd08339e4a95c3ab03c9111888d81baa65f21413679b943af0c8fcd9b3"
  }
]
```

#### `fetchTransactions`

This function retrieves the history of tokens sent by the user. Each transaction may include multiple transfers to different recipients, including the payment of fees.

For details about the differences between transactions and transfers, please refer to the FAQ below.

[Q. What is the difference between a transfer and a transaction?](./faq#q-what-is-the-difference-between-a-transfer-and-a-transaction)

```tsx
const transactionList: FetchTransactionsResponse = await fetchTransactions({})

// example
[
 {
    amount: "",
    from: "",
    status: 2,
    timestamp: 1735364080,
    to: "",
    tokenIndex: 0,
    transfers: [
      {
        recipient: "T7iFM2BEtd3JxkaUNfZge83CtAqhdgcjGgJpiityyrYMW739SyyDYF5bnR8fkSG3G9YT4VZtur3hKhvuDm5ZLneYLy8j7gG", // INTMAX address
        salt: "0x98dd88e41a4f86e210860c414e0b78426c75b4243e85d3500a82c5006bce4749",
        amount: "100000000",
        tokenIndex: 4,
        to: "T7iFM2BEtd3JxkaUNfZge83CtAqhdgcjGgJpiityyrYMW739SyyDYF5bnR8fkSG3G9YT4VZtur3hKhvuDm5ZLneYLy8j7gG", // same as recipient
        isWithdrawal: false
      },
      {
        recipient: "T7iFM2BEtd3JxkaUNfZge83CtAqhdgcjGgJpiityyrYMW739SyyDYF5bnR8fkSG3G9YT4VZtur3hKhvuDm5ZLneYLy8j7gG",
        salt: "0x5b287885b6629963a2a9b7a741aa02d69cbc27af4d7e5b07fa1c5cc7e0e089f4",
        amount: "1",
        tokenIndex: 0,
        to: "T7iFM2BEtd3JxkaUNfZge83CtAqhdgcjGgJpiityyrYMW739SyyDYF5bnR8fkSG3G9YT4VZtur3hKhvuDm5ZLneYLy8j7gG",
        isWithdrawal: false
      }],
    txType: "Send"
    digest: "0x193d1e4afca1732c611b175076c60c6602d60c8143641d903f394c2372b215b6"
  }
]
```

#### `broadcastTransaction`

The `broadcastTransaction` function broadcasts one or more transactions to the blockchain network. It accepts an array of transaction parameters, such as recipient addresses, transfer amounts, and token types. After broadcasting the transactions, the function verifies the root of the transaction tree and waits for confirmation. The response includes transaction results containing the confirmation status, block number, and other relevant information.

You can specify multiple transactions in a single call — up to a maximum of **63 transactions**.

- [Q. How are transaction fees determined on the INTMAX network?](./faq#q-how-are-transaction-fees-determined-on-the-intmax-network)
- [Q. What happens to transaction fees when multiple transactions are batched together?](./faq#q-what-happens-to-transaction-fees-when-multiple-transactions-are-batched-together)
- [Q. How do you use the return value of `broadcastTransaction`?](./faq#q-how-do-you-use-the-return-value-of-broadcasttransaction)

```tsx
const params: BroadcastTransactionRequest[] = [
  {
    amount: 0.000001, // 0.000001 ETH
    token: {
      tokenType: 0, // TokenType.NATIVE
      tokenIndex: 0,
      decimals: 18,
      contractAddress: "0x0000000000000000000000000000000000000000",
      price: 2417.08
    },
    address: "T6ubiG36LmNce6uzcJU3h5JR5FWa72jBBLUGmEPx5VXcFtvXnBB3bqice6uzcJU3h5JR5FWa72jBBLUGmEPx5VXcB3prnCZ", // INTMAX Address
  }
];
const isWithdrawal = false;

const transferResult = await client.broadcastTransaction(params, isWithdrawal);

// example
{
  txTreeRoot: "0x52146f411e84ccba11e0887a0780a558f41042300a1515c7ff2cb7e1dd8b8c77",
  transferDigests: [
    "0x0fddb7a7b18025c8a2242a66c8c73100f272ba0fc0064c65d725badcc5f9df66",
    "0xbccada67a9ad5eafae682fe000c955b6fd2bde90b16298dac87aa23bd021aa65"
  ]
}
```

#### `waitForTransactionConfirmation`

The `waitForTransactionConfirmation` function is used to verify whether a transfer or withdrawal has been fully finalized after execution.
On the INTMAX network, transactions are submitted to nodes using the `broadcastTransaction`/`withdraw` function and then processed.

The success response of `broadcastTransaction`/`withdraw` alone does not guarantee on-chain finalization.
Therefore, the `waitForTransactionConfirmation` function provides a reliable way to track the transaction until its status becomes either `success` or `failed`.

**Important:**

* ⚠️ It is important to call `waitForTransactionConfirmation` after executing a transfer or withdrawal transaction.

```ts
const txTreeRoot = "0x52146f411e84ccba11e0887a0780a558f41042300a1515c7ff2cb7e1dd8b8c77";
const transferConfirmation = await client.waitForTransactionConfirmation({ txTreeRoot });
```

### Deposit

A deposit is made from Ethereum mainnet to the INTMAX network by executing a transaction on the liquidity contract of Ethereum mainnet. It supports ETH, ERC20, ERC721, and ERC1155 tokens.

#### `fetchDeposits`

Retrieves a paginated list of deposit transactions with all associated details, such as amount, sender, recipient, status, timestamp, and token information. This method provides comprehensive data for tracking and managing deposits, enabling users to monitor transaction status and history efficiently.

```tsx
const depositList: Transaction[] = await client.fetchDeposits({})[
  // example
  {
    amount: "100000000000000000",
    from: "",
    status: 2,
    timestamp: 1735364080,
    to: "",
    tokenType: 3,
    tokenIndex: 0,
    transfers: [],
    txType: "Deposit",
    digest: "0x47f90ce9ee420a145e237397d106a35c6d3cf3c96c4f8eb2fa7caed26a6b2c17",
    tokenAddress: "0x1e4da6fb14da45f025622e501e28ade8dc5e4ec8",
  }
];
```

#### `deposit`

Processes a deposit transaction to the user's account with all required transaction parameters. This method handles the complete deposit flow including validation, signing, broadcasting to the network — **and includes an on-chain AML (Anti-Money Laundering) check via a Predicate Contract**.

Here, `estimateDepositGas` is necessary to validate whether there is enough gas available for the transaction in advance.

The `deposit` function returns both the txHash and the status.
`status: 1` represents Processing, and `status: 2` represents Completed.

```tsx
const params: PrepareDepositTransactionRequest = {
  amount: 0.000001, // 0.000001 ETH
  token: {
    tokenType: 0,
    tokenIndex: 0,
    decimals: 18,
    contractAddress: "0x0000000000000000000000000000000000000000",
  },
  address: "T7iFM2BEtd3JxkaUNfZge83CtAqhdgcjGgJpiityyrYMW739SyyDYF5bnR8fkSG3G9YT4VZtur3hKhvuDm5ZLneYLy8j7gG", // INTMAX Address
  skipConfirmation: false,
}

// Check gas estimation to verify if the transaction can be executed
const gas: bigint = await client.estimateDepositGas({
  ...params,
  isGasEstimation: true,
});

// example
114231256530n

const deposit: PrepareDepositTransactionResponse = await client.deposit(params);

// example
{
  "status": 2,
  "txHash": "0xd03b99a0de83803bede24834715a36181008a73a76b627391042083c70af9c52" // Ethereum address
}
```

### Withdrawal

A withdrawal is made from the INTMAX network to Ethereum mainnet by executing a transaction on the liquidity contract of the mainnet. It supports ETH, ERC20, ERC721, and ERC1155 tokens.

#### `fetchWithdrawal`

Organizes withdrawal transactions into categorized lists based on their current status, including Failed, NeedClaim, Relayed, Requested, and Success states. This structured organization enables efficient filtering and management of withdrawals, allowing users to track transaction progress and handle different withdrawal states separately. Each status category maintains an array of ContractWithdrawal objects containing detailed transaction information.

```tsx
const withdrawals = await client.fetchWithdrawals();

// example
{
 withdrawals: {
   failed: [],
   need_claim: [
     {
       recipient: "0xe888365f8b2ffe41Cc797F6Cb2dc25F191Aa9643", // Ethereum address
       nullifier: "0x1c66c5286f4281fd778a9f91ab3a7278b095aab77525c8383a4662ecd4569fc3",
       amount: "10",
       tokenIndex: 6
     }
   ],
   relayed: [],
   requested: [],
   success: [
     {
       recipient: "0xe888365f8b2ffe41Cc797F6Cb2dc25F191Aa9643", // Ethereum address
       nullifier: "0x802634b2292d5e3a3740f83e9d1817c78a3e23b866fcf08df1f747fb30610c41",
       amount: "52500000000000",
       tokenIndex: 0
     },
     {
       recipient: "0xC7f36AA3C3294025C1b6F57EBB93A0c81c86eEB3",
       nullifier: "0x8f72ab3f00af84b0860921a32d09e958847ebe53a16f33716ddb991d9efdf7ac",
       amount: "5250000000000",
       tokenIndex: 0
     }
   ]
 },
 pagination: undefined
}
```

#### `withdraw`

The `withdraw` function is an asynchronous method that processes a withdrawal request from the user's wallet. This function performs comprehensive validation and security checks to ensure the withdrawal is handled safely and accurately. It follows the entire withdrawal flow, including verifying the user's balance, calculating transaction fees, and signing the transaction.

As with the `broadcastTransaction` function, after executing the `withdraw` function, you can use the `waitForTransactionConfirmation` function to wait until the transaction is finalized.

```tsx

const params: WithdrawRequest = {
  amount: 0.00000001
  token: {
    tokenType: 0, // 0: NATIVE, 1: ERC20, 2: ERC721, 3: ERC1155
    tokenIndex: 0,
    decimals: 18,
    contractAddress: "0x0000000000000000000000000000000000000000",
  },
  address: "0xf9c78dAE01Af727E2F6Db9155B942D8ab631df4B", // ethereum address
}

const withdrawResult = await client.withdraw(params);

// example
{
  txTreeRoot: "0x4cd9d917b0cfc6b9a7073d44ed52256d734ff2f2011c0cf855967af12944dd4b",
  transferDigests: [
    "0x9f367ef1067d3b1abcb46de4afa1a99de622ab141dc64d07789a51e9a65df8dc",
    "0x70c9bae268e4da2e496058bd9c768bd83e618a9e10d34ef80901bb16389b5059",
    "0x124b88a1e566efd86078b2f9c305aacd83e56a686ae7731ee5b743a77421e580",
    "0x060f8bdd95502e610713529ec450da7ead1a8d85ebe5d3e81065ad22e3ab9672"
  ]
}

const withdrawalConfirmation = await client.waitForTransactionConfirmation(withdrawResult);

// example
{
  "status": "success"
}
```

#### `claimWithdrawal`

Initiates the claim process for one or more withdrawal transactions, returning a response containing the transaction hash and status. After execution of this function completes, the progress of the claim operation can be tracked to confirm its success on the blockchain.

[Q. What is `claimWithdrawal`?](./faq#q-what-is-claimwithdrawal)

```tsx
// The withdrawal will be processed in approximately three hours
const claim = await client.claimWithdrawal(withdrawals.need_claim);

// example
{
  status: 2,
  txHash: "0x305cb34f6c870e708b09e63cec9c02470bf5156b6e641c59237c84f46c1145b4" // Ethereum tx hash
}
```

**NOTE**: When there are no tokens available to claim, the error `No withdrawals to claim` occurs.

## Technical Terms

- **Nullifier**: A unique identifier used to prevent the same deposit/withdrawal from being used more than once.
- **Salt**: A random value added during encryption or hashing to ensure different outputs from identical inputs. Used to conceal the recipient’s deposit address.
- **Token index**: A numerical ID uniquely identifying tokens within the INTMAX network.

## Fee

Please refer to the following for details about the fees.

- [Q. How are transaction fees determined on the INTMAX network?](./faq#q-how-are-transaction-fees-determined-on-the-intmax-network)
- [Q. What is the collateral fee?](./faq#q-what-is-the-collateral-fee)

#### `getTransferFee`

The getTransferFee function estimates the transaction fee required to perform a token transfer within the INTMAX network.

```tsx
const trasnferFee: FeeResponse = await client.getTransferFee();

// example
{
  beneficiary: 'T7iFM2BEtd3JxkaUNfZge83CtAqhdgcjGgJpiityyrYMW739SyyDYF5bnR8fkSG3G9YT4VZtur3hKhvuDm5ZLneYLy8j7gG',
  fee: {
    amount: "2000000000000",
    token_index: 0,
  },
  collateral_fee: {
    amount: "20000000000000",
    token_index: 0,
  }
}
```

#### `getWithdrawalFee`

This function estimates the transaction fee required to perform a token withdrawal within the INTMAX network.

```tsx
const withdrawalFee: FeeResponse = await client.getWithdrawalFee();

// example
{
  beneficiary: 'T7v5ya7osVxjhu35X8hRMFD2wByq8tF2Pjkag2K2NfNMX8ZdUfiAD5pR2M4bQf8XgTAbAYzyLX6AMGm3Vj78oYNLH5PhGMm',
  fee: {
    amount: "32500000000000",
    token_index: 0,
  },
  collateral_fee: undefined
}
```
