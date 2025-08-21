---
sidebar_position: 5
description: Practical code examples for using the INTMAX Client SDK in both browser and Node.js environments. Demonstrates account initialization, authentication, balance retrieval, token management, transaction execution, deposits, withdrawals, fee estimation, and message signing/verification.
---

# Examples

Practical code examples for using the INTMAX Client SDK in both browser and Node.js environments. Demonstrates account initialization, authentication, balance retrieval, token management, transaction execution, deposits, withdrawals, fee estimation, and message signing/verification.

### Usage for browser

We plan to provide JavaScript support for the following modules. Below, you will find examples for each module.

```bash
npm i intmax2-client-sdk
```

#### Initiate INTMAX Client

`IntMaxClient` is a core component of the INTMAX SDK that provides seamless interaction with the INTMAX network. This class simplifies the process of integrating applications with the INTMAX network, enabling developers to interact with both the `mainnet` and `testnet` environments effortlessly.

```tsx
import { IntMaxClient } from "intmax-client-sdk";

const client = await IntMaxClient.init({ environment: "mainnet" });
```

To set up a local Balance Prover instance, please see Tips: [How to Run a Local Balance Prover](https://github.com/InternetMaximalism/intmax2-client-sdk/blob/main/README.md#tips-how-to-run-a-local-balance-prover)

#### Login to INTMAX Network

Here is an example of logging in to INTMAX. Users need to login once before using the SDK functions.

You should sign two message, they will be appeared in the popup window automatically:

1. Sign the message confirm your ETH wallet address.

2. Sign the message with challenge string.

```tsx
await client.login();
```

#### Retrieve Balance

This example retrieves the balances of the generated INTMAX account.

```tsx
const { balances } = await client.fetchTokenBalances();
```

### Usage for Node.js

```bash
npm i intmax2-server-sdk
```

#### Initiate INTMAX Client

```tsx
import { IntMaxNodeClient } from "intmax2-server-sdk";

const client = new IntMaxNodeClient({
  environment: "mainnet",
  eth_private_key: "0x...", // Replace with your Ethereum private key
  l1_rpc_url: "https://sepolia.gateway.tenderly.co",
});
```

#### Login to INTMAX Network & Retrieve Balance

Here is an example of logging in to INTMAX and retrieving balances. Users need to retrieve their balances once before using the SDK functions.

```tsx
await client.login();
const { balances } = await client.fetchTokenBalances();
```

### Usage for both

#### Retrieve INTMAX Account Address & Private Key

This example retrieves the address and private key of the generated INTMAX account.

```tsx
const address = client.address; // Address of the INTMAX account
const privateKey = client.getPrivateKey(); // Private key of the INTMAX account
```

#### Sign & Verify Message

Demonstrates how to sign a message twice and verify the signature.

```tsx
const message = "Hello, World!";
const signature = await client.signMessage(message);
const isVerified = await client.verifySignature(signature, message);
if (!isVerified) {
  throw new Error("Verification failed");
}

console.log("Verification succeeded");
```

#### List Available Tokens & Retrieve Information for a Specific Token

Shows how to get the list of tokens supported by the network.

```tsx
const tokens = await client.getTokensList();
console.log("Available tokens:", tokens);

const nativeToken = tokens.find(
  (t) => t.contractAddress.toLowerCase() === "0x0000000000000000000000000000000000000000",
);
```

#### Fetch Transaction History

Retrieves deposits, transfers, and sent transactions in parallel, then prints the latest entries.

```tsx
const [deposits, transfers, sentTxs] = await Promise.all([
  client.fetchDeposits(),
  client.fetchTransfers(),
  client.fetchTransactions(),
]);

console.log("Deposits:", deposits);
console.log("Received Transfers:", transfers);
console.log("Sent Transfers:", sentTxs);
```

#### Estimate Gas & Deposit

Estimates gas for an ETH deposit and submits the deposit.

```tsx
const token = {
  tokenType: TokenType.NATIVE,
  tokenIndex: 0,
  decimals: 18,
  contractAddress: "0x0000000000000000000000000000000000000000",
};

const depositParams = {
  amount: 0.000001, // 0.000001 ETH
  token,
  address:
    "T6ubiG36LmNce6uzcJU3h5JR5FWa72jBBLUGmEPx5VXcFtvXnBB3bqice6uzcJU3h5JR5FWa72jBBLUGmEPx5VXcB3prnCZ", // recipient INTMAX address
};

// Dry-run gas estimation
const gas = await client.estimateDepositGas({
  ...depositParams,
  isGasEstimation: true,
});
console.log("Estimated gas:", gas);

// Execute the deposit
const depositResult = await client.deposit(depositParams);
console.log("Deposit result:", depositResult);
console.log("Transaction Hash:", depositResult.txHash);
```

The final txHash obtained can be searched on [SepoliaScan](https://sepolia.etherscan.io/).

#### Check Transfer Fee & Broadcast Transaction

This example retrieves the current transfer fee (token index / amount). Then it sends 0.000001 ETH to another INTMAX address.

```tsx
const token = {
  tokenType: TokenType.NATIVE,
  tokenIndex: 0,
  decimals: 18,
  contractAddress: "0x0000000000000000000000000000000000000000",
};

const transferFee = await client.getTransferFee();
console.log("Fee Token Index:", transferFee?.fee?.token_index);
console.log("Fee Amount:", transferFee?.fee?.amount);

const transfers = [
  {
    amount: 0.000001,
    token,
    address:
      "T6ubiG36LmNce6uzcJU3h5JR5FWa72jBBLUGmEPx5VXcFtvXnBB3bqice6uzcJU3h5JR5FWa72jBBLUGmEPx5VXcB3prnCZ", // recipient INTMAX address
  },
];

const transferResult = await client.broadcastTransaction(transfers);
console.log("Transfer result:", transferResult);
const transferConfirmation = await client.waitForTransactionConfirmation(transferResult);
console.log("Transfer confirmation result:", transferConfirmation);
```

#### Retrieve Withdrawal Fee & Execute Withdrawal

This example shows how to fetch both withdrawal and transfer fees before withdrawing.

Then, it performs an ETH withdrawal, then claims it once the proof is ready.

```tsx
const token = {
  tokenType: TokenType.NATIVE,
  tokenIndex: 0,
  decimals: 18,
  contractAddress: "0x0000000000000000000000000000000000000000",
};

// Withdrawal fee
const withdrawalFee = await client.getWithdrawalFee(token);
console.log("Withdrawal Fee Token:", withdrawalFee?.fee?.token_index);
console.log("Withdrawal Fee Amount:", withdrawalFee?.fee?.amount);

// Transfer fee (must also be paid)
const transferFee = await client.getTransferFee();
console.log("Transfer Fee Token:", transferFee?.fee?.token_index);
console.log("Transfer Fee Amount:", transferFee?.fee?.amount);

const withdrawalResult = await client.withdraw({
  address: "0xf9c78dAE01Af727E2F6Db9155B942D8ab631df4B", // Ethereum L1 address
  token,
  amount: 0.000001,
});
console.log("Withdrawal result:", withdrawalResult);

// Check pending withdrawals
const { withdrawals } = await client.fetchWithdrawals();
console.log("Withdrawals:", withdrawals);

// Claim once ready
const claim = await client.claimWithdrawal(withdrawals.need_claim);
console.log("Claim result:", claim);
```

### Notes for Using NodeJS

When using the server-sdk, it is recommended to run the `sync` function before and after calling the `broadcastTransaction` and `withdraw` functions.

* **Without calling `sync`:**
  Your balance will still be updated automatically before the next transfer or withdrawal, but this automatic update may take extra time.

* **By calling `sync` in advance:**
  Your balance is already updated, so transfers and withdrawals can start faster.

* **After a transfer:**
  Running `sync` ensures your balance reflects the completed transaction, making your next transfer smoother.

**Important:**

* ⚠️ Always run `sync` **before and after** transfers or withdrawals for the best experience.

#### Transfer Example

```ts
await client.sync();
const transferResult = await client.broadcastTransaction(params);
const transferConfirmation = await client.waitForTransactionConfirmation(transferResult);
await client.sync();
```

#### Withdrawal Example

```ts
await client.sync();
const withdrawResult = await client.withdraw(params);
await client.sync();
```

**NOTE**: In the **frontend**, The `sync` function should not be called manually in normal use.
