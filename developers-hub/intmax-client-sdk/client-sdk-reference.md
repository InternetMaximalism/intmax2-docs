---
sidebar_position: 1
description: The INTMAX Client SDK provides a secure, high-performance interface for interacting with the INTMAX network. Built with WebAssembly for optimized cryptographic processing, the SDK abstracts complex blockchain operations into a developer-friendly API that handles the complete transaction lifecycle—from creation and signing to broadcasting.
---

# Client SDK Reference

The INTMAX Client SDK provides a secure, high-performance interface for interacting with the INTMAX network. Built with WebAssembly for optimized cryptographic processing, the SDK abstracts complex blockchain operations into a developer-friendly API that handles the complete transaction lifecycle—from creation and signing to broadcasting.
This documentation covers the SDK's core functionality, available functions, and interface specifications to help developers build secure blockchain wallet integrations with confidence.

**Latest Version**: `1.4.4`

**Check out the INTMAX Client SDK on GitHub**

[View on GitHub](https://github.com/InternetMaximalism/intmax2-client-sdk)

**INTMAX Client SDK Examples**

[View Examples on GitHub](https://github.com/InternetMaximalism/intmax2-client-sdk/tree/main/examples)

**INTMAX Client SDK Integration Guide**

[Open Integration Guide](./integration-guide.md)

# Architecture

This section outlines the core workflows supported by the INTMAX network: **Deposit**, **Transfer**, and **Withdrawal**. Each workflow is carefully designed to ensure security, scalability, and seamless interaction between Ethereum mainnet and INTMAX network.

### Deposit Workflow

Transfers assets from the Ethereum mainnet to INTMAX network. A Predicate contract blocks deposits originating from sanctioned addresses, preventing illicit funds from entering INTMAX network. Deposit data is then relayed to the Scroll network via the Scroll Messenger, preserving maximum security throughout the process.

```bash
Ethereum Mainnet
    │
    ▼
[Deposit Contract (Predicate AML)]
    │
    ▼
[Deposit Analyzer]
    │
    ▼
[L1 Scroll Messenger]
    │
    ▼
[Rollup Contract]
    │   └─ A new deposit block is submitted and verified by the block builder
    ▼
INTMAX Network
```

### Transfer Workflow

A user-signed transaction is packaged as a single transfer and submitted to the Rollup Contract by the Block Builder.

Enables instant, low-cost value transfers within the INTMAX network.

```bash
INTMAX Network
    │
    ▼
[Transfer]
    │
    ▼
[Block Builder]
    │
    ▼
[Rollup Contract]
    │   └─ A new transfer block is submitted and verified by the block builder
    ▼
INTMAX Network
```

### Withdrawal Workflow

Returns assets from INTMAX network to Ethereum mainnet without compromising security.
Withdrawal requests are batched by the Withdrawal Aggregator and proven on L2. The proof is sent through the L2 Scroll Messenger; the Withdrawal Messenger Relayer then submits it on Ethereum. For ERC-20 and other non-ETH tokens, the Liquidity Contract executes an additional claim step before releasing funds, ensuring smooth cross-chain exits with minimal gas overhead.

```bash
INTMAX Network
    │
    ▼
[Withdrawal]
    │
    ▼
[Withdrawal Aggregator]
    │
    ▼
[L2 Scroll Messenger]
    │
    ▼
[Withdrawal Messenger Relayer]
    │
    ▼
[Liquidity Contract]
    │   └─ For non-ETH tokens, an additional claim process is required
    ▼
Ethereum Mainnet
```

## Basic Concepts

### Account System

INTMAX uses a unique address format that differs from Ethereum.

- **Address derivation**

  An INTMAX address is deterministically derived from a given Ethereum address, but the resulting value differs because INTMAX uses its own encoding scheme.

- **Parameter usage**

  | **Operation**                         | **Address to supply** |
  | ------------------------------------- | --------------------- |
  | Deposit                               | INTMAX address        |
  | Withdraw                              | Ethereum address      |
  | On-chain transaction (INTMAX network) | INTMAX address        |

- **Environment scope**

  The derivation is environment-specific: the INTMAX address produced on Mainnet is different from the one produced on the network, even when starting from the same Ethereum address. Always double-check which network you are targeting before submitting transactions.

  **Mainnet**: A 95-character string starting with **i** (lowercase)
  - Example: `i9bX5qzARYR7geR35g4K9972DB8fcWqPjNNgQnoGFViZaTLaSiKUTEd7geR35g4K9972DB8fcWqPjNNgQnoGFViZPctJYmE`

  **Testnet**: A 95-character string starting with **T** (uppercase)
  - Example: `T6ubiG36LmNce6uzcJU3h5JR5FWa72jBBLUGmEPx5VXcFtvXnBB3bqice6uzcJU3h5JR5FWa72jBBLUGmEPx5VXcB3prnCZ`

  **Important**: Be careful not to mix them up.

  Always verify which type of address is required for the operation you're performing, and ensure you are using the correct environment (Mainnet or Testnet) when deriving and using your INTMAX address.

# SDK Interfaces

The `INTMAXClient` is an SDK interface designed for interacting with the INTMAX network. This interface provides essential features such as account management, transaction operations, deposits, and withdrawals. Below is an overview of each functionality.

This interface offers high-level APIs for seamless integration with the INTMAX network. It integrates account login/logout, transaction management, and deposit/withdrawal processing, allowing developers to execute complex blockchain operations through simple functions. Additionally, with WebAssembly support, it ensures fast and secure processing.

```tsx
export interface INTMAXClient {
  // properties
  isLoggedIn: boolean;
  address: string;
  tokenBalances: TokenBalance[] | undefined;

  // account
  login: () => Promise<LoginResponse>;
  logout: () => Promise<void>;
  getPrivateKey: () => Promise<string | undefined>;
  signMessage: (message: string) => Promise<SignMessageResponse>;
  verifySignature: (
    signature: SignMessageResponse,
    message: string | Uint8Array,
  ) => Promise<boolean>;

  // token
  getTokensList: () => Promise<Token[]>;
  fetchTokenBalances: () => Promise<TokenBalancesResponse>;

  // transaction
  fetchTransfers: (params: {}) => Promise<Transaction[]>;
  fetchTransactions: (params: {}) => Promise<Transaction[]>;
  broadcastTransaction: (
    rawTransfers: BroadcastTransactionRequest[],
    isWithdrawal: boolean,
  ) => Promise<BroadcastTransactionResponse>;

  // deposit
  fetchDeposits: (params: {}) => Promise<Transaction[]>;
  deposit: (params: PrepareDepositTransactionRequest) => Promise<PrepareDepositTransactionResponse>;

  // withdrawal
  fetchWithdrawals: () => Promise<FetchWithdrawalsResponse>;
  withdraw: (params: WithdrawRequest) => Promise<WithdrawalResponse>;
  claimWithdrawal: (params: ContractWithdrawal[]) => Promise<ClaimWithdrawalTransactionResponse>;

  // Fees
  getTransferFee: () => Promise<FeeResponse>;
  getWithdrawalFee: (token: Token) => Promise<FeeResponse>;
}
```

# Function List

The **Function List** outlines key properties and interfaces of the INTMAX Client SDK, enabling seamless user authentication, token balance management, and interaction with the INTMAX network. It provides clear and standardized methods for handling authentication states, token information, and paginated data retrieval to ensure efficient integration and extensibility across different use cases.

## Interfaces Overview

The following interfaces are designed to be used as part of the INTMAX Client SDK. These interfaces provide a flexible and generic structure for handling paginated data retrieval and transaction-related operations. They ensure a standardized way to manage various entities, allowing seamless integration and extensibility across different use cases in the INTMAX ecosystem

### Basic Interfaces

```tsx
// Enum defining supported token types in the INTMAX ecosystem
export enum TokenType {
  NATIVE, // Native blockchain currency (ETH)
  ERC20, // Fungible tokens following ERC-20 standard
  ERC721, // Non-fungible tokens (NFTs) following ERC-721 standard
  ERC1155, // Multi-token standard supporting both fungible and non-fungible tokens
}

// Enum representing the current status of a transaction
export enum TransactionStatus {
  ReadyToClaim, // Transaction is ready to be claimed
  Processing, // Transaction is currently being processed
  Completed, // Transaction has been completed successfully
  Rejected, // Transaction was rejected
  NeedToClaim, // Transaction needs to be claimed by the user
}

// Enum representing the status of withdrawal operations
export enum WithdrawalsStatus {
  Requested = "requested", // Withdrawal has been requested but not yet processed
  Relayed = "relayed", // Withdrawal is currently being relayed from L2 to L1.
  Success = "success", // Withdrawal completed successfully
  NeedClaim = "need_claim", // Withdrawal requires claiming action from user
  Failed = "failed", // Withdrawal operation failed
}

// Interface representing a withdrawal transaction on the smart contract
export interface ContractWithdrawal {
  recipient: `0x${string}`; // Ethereum address of the withdrawal recipient
  tokenIndex: number; // Index identifying the token being withdrawn
  amount: string | bigint; // Amount being withdrawn (in smallest token unit)
  nullifier: `0x${string}`; // Unique hash preventing double-spending
}

// Enum categorizing different types of transactions
export enum TransactionType {
  Mining = "Mining", // Mining reward transaction
  Deposit = "Deposit", // Deposit from Ethereum to INTMAX
  Withdraw = "Withdraw", // Withdrawal from INTMAX to Ethereum
  Send = "Send", // Send transaction within INTMAX network
  Receive = "Receive", // Receive transaction within INTMAX network
}

// Interface representing token information
export interface Token {
  contractAddress: string; // Smart contract address of the token on Ethereum
  decimals?: number; // Number of decimal places for the token (e.g., 18 for ETH, 6 for USDC)
  image?: string; // URL to the token's icon/logo image
  price: number; // Current price of the token in USD
  symbol?: string; // Token symbol (e.g., ETH, USDC, DAI)
  tokenIndex: number; // Unique identifier for the token within INTMAX network
  tokenType: TokenType; // Type classification of the token
}
```

### Request(Token, Transaction, Deposit)

```tsx
// Type representing a message signature in INTMAX format
// Returns 4 string components required for signature verification
export type SignMessageResponse = [string, string, string, string];

// Response interface for token balance queries
export interface TokenBalancesResponse {
  balances: TokenBalance[]; // Array of token balances for the user
}

// Interface representing the balance of a specific token
export interface TokenBalance {
  token: Token; // Information about the token
  amount: bigint; // Amount held in the smallest unit (considering decimals)
}

// Interface representing a complete transaction on INTMAX network
export interface Transaction {
  digest: string; // Unique identifier for the transaction (UUID format)
  amount: string; // Transaction amount as string to avoid precision issues
  from: string; // INTMAX address of the transfer sender (The transfer history includes values, but for deposit and transaction histories, empty strings are returned)
  to: string; // INTMAX/Ethereum address of the transfer recipient (The transfer history includes values, but for deposit and transaction histories, empty strings are returned)
  status: TransactionStatus; // Current processing status of the transaction
  timestamp: number; // Unix timestamp when transaction was created
  transfers: Transfer[]; // Array of transfer operations included in this transaction
  tokenType?: TokenType; // Type of token involved in the transaction
  tokenIndex: number; // Index of the token being transacted
  txType: TransactionType | undefined; // Category of the transaction (For transfer histories, undefined is returned)
  tokenAddress?: string; // Contract address of the token (for non-native tokens)
}

// Type alias for transaction fetch responses
export type FetchTransactionsResponse = Transaction[];

// Interface for broadcasting a new transaction
export interface BroadcastTransactionRequest {
  address: string; // Destination address for the transaction
  amount: number; // Amount to be transferred
  token: Token; // Token information for the transfer
}

// Response interface for transaction broadcasting
export interface BroadcastTransactionResponse extends TransactionResult {}

// Interface representing the result of a transaction execution
export interface TransactionResult {
  txTreeRoot: string; // Root hash of the transaction merkle tree
  transferDigests: string[]; // Array of digest hashes for individual transfers
}

// Interface representing an individual transfer operation
export interface Transfer {
  recipient: string; // Address receiving the transfer
  tokenIndex: number; // Index of the token being transferred
  amount: string; // Amount being transferred as string
  salt: string; // Random salt used to conceal the recipient’s address for privacy protection
  to?: string; // Final destination address (if different from recipient)
  isWithdrawal?: boolean; // Flag indicating if this is a withdrawal operation
  nullifier?: string; // Unique identifier preventing double-spending
}

// Interface for configuring transaction confirmation waiting
export interface WaitForTransactionConfirmationRequest {
  txTreeRoot: string; // Transaction tree root to wait for confirmation
  pollingInterval?: number; // Interval between confirmation checks in milliseconds
  retryCount?: number; // Maximum number of retry attempts
  retryDelay?: number; // Delay between retry attempts in milliseconds
  timeout?: number; // Maximum time to wait for confirmation in milliseconds
}

// Interface representing the result of transaction confirmation waiting
export interface WaitForTransactionConfirmationResponse {
  status: "not_found" | "success" | "confirmed"; // Status of the confirmation check
  blockNumber: number | null; // Block number where transaction was confirmed (null if not found)
}

// Interface for preparing a deposit transaction
export interface PrepareDepositTransactionRequest {
  token: Token; // Token to be deposited
  amount: number; // Amount to deposit ex. 0.000001 means 0.000001 ETH
  address: string; // INTMAX address to receive the deposit on INTMAX Network
}

// Extended interface for deposit transaction gas estimation
export interface PrepareEstimateDepositTransactionRequest extends PrepareDepositTransactionRequest {
  isGasEstimation: boolean; // Flag indicating if this is for gas estimation only
}

// Interface representing the response from deposit transaction preparation
export interface PrepareDepositTransactionResponse {
  txHash: `0x${string}`; // Ethereum transaction hash
  status: TransactionStatus; // Current status of the transaction
}
```

### Request (Withdrawal)

```tsx
export type PaginationCursor = {
  next_cursor: bigint | null;
  has_more: boolean;
  total_count: number;
};

// Type mapping withdrawal statuses to arrays of contract withdrawals
export type FetchWithdrawalsResponse = {
  withdrawals: Record<WithdrawalsStatus, ContractWithdrawal[]>;
  pagination: PaginationCursor;
};

// Interface representing the response from withdrawal claim transaction
export interface ClaimWithdrawalTransactionResponse {
  txHash: `0x${string}`; // Ethereum transaction hash for the claim
  status: TransactionStatus; // Current status of the claim transaction
}

// Interface representing a withdrawal operation response
export interface WithdrawalResponse extends TransactionResult {}

// Interface for initiating a withdrawal request
export interface WithdrawRequest {
  address: `0x${string}`; // Ethereum address to receive the withdrawal
  token: Token; // Token to be withdrawn
  amount: number; // Amount to withdraw
}

// Interface representing the response from user login
export interface LoginResponse {
  address: string; // User's INTMAX address
  isLoggedIn: boolean; // Boolean indicating successful login status
  nonce: number; // A nonce is a value related to the generation of an encryption key. The same nonce will always produce the same encryptionKey.
  encryptionKey: string; // A 32-byte string suitable for use as the key in AES-GCM encryption. It is output as a Base64-encoded string.
  accessToken?: string; // JWT access token for API authentication
}

// Type defining available INTMAX network environments
export type IntMaxEnvironment = "testnet" | "mainnet";

// Constructor parameters for browser environment
export interface ConstructorParams {
  environment: IntMaxEnvironment; // Target network environment
  async_params?: ArrayBuffer; // Optional WebAssembly initialization parameters (URL of the file generated at build time)
}

// Constructor parameters for Node.js environment
export interface ConstructorNodeParams {
  environment: IntMaxEnvironment; // Target network environment
  eth_private_key: `0x${string}`; // Ethereum private key for Node.js usage
  l1_rpc_url: string; // Ethereum L1 RPC URL
}

// Interface representing fee information
interface Fee {
  amount: string; // Fee amount as string
  token_index: number; // Index of token used for fee payment
}

// Interface for fee response information
export interface FeeResponse {
  beneficiary: string | undefined; // Address of fee beneficiary
  fee: Fee | undefined; // Basic fee information
  collateral_fee: Fee | undefined; // Collateral fee information
}
```

### Technical Terms

- **Nullifier**: A unique identifier used to prevent the same deposit/withdrawal from being used more than once.
- **Salt**: A random value added during encryption or hashing to ensure different outputs from identical inputs. Used to conceal the recipient’s deposit address.
- **Token index**: A numerical ID uniquely identifying tokens within the INTMAX network.

## Properties

### `isLoggedIn: boolean`

This property indicates the current authentication state of the wallet user. It returns true when a user has successfully completed the authentication process and has an active session. This is crucial for determining whether sensitive operations like transactions or data access can be performed.

### `address: string`

This `address`, which corresponds one-to-one with the connected wallet's Ethereum address, represents the address **on the INTMAX network**.

### `tokenBalances: TokenBalance[] | undefine`

Represents the user's current token balances, including token address, balance, symbol, decimals, and name. If undefined, the balances are not yet available.

## Initialization

`IntMaxClient` is a core component of the INTMAX SDK that provides seamless interaction with the INTMAX network. Please specify either **testnet** or **mainnet** for the environment.

```tsx
import { IntMaxClient } from "intmax2-client-sdk";

const intMaxClient = IntMaxClient.init({ environment: "mainnet" });
```

To set up a local Balance Prover instance, please see Tips: [How to Run a Local Balance Prover](https://github.com/InternetMaximalism/intmax2-client-sdk/blob/main/README.md#tips-how-to-run-a-local-balance-prover)

## Account

The Account module provides comprehensive authentication and cryptographic operations for wallet management.

### `login`

Initiates wallet authentication and establishes a secure session. This method handles key derivation, session token management, and initial data synchronization. It is essential for secure access to protected wallet functionalities.

The `nonce` and `encryptionKey` can be used to protect a private key, enabling its recovery without needing external wallet signatures on subsequent uses. Using this feature is optional.

The `encryptionKey` is a 32-byte string suitable for use as the key in AES-GCM encryption, and it is output as a Base64-encoded string.

A `nonce` is a value related to the generation of an encryption key. The same nonce will always produce the same encryptionKey.

The value of the `encryptionKey` is derived from a fixed message signed by an external wallet and the nonce value. If there is a risk of the encryptionKey being compromised, you can generate a new encryption key by updating the nonce.

[**Q.** What is “Login” in the context of the INTMAX network?](#q-what-is-login-in-the-context-of-the-intmax-network)

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

### `logout`

Securely terminates the current wallet session and clears sensitive data from memory. This method ensures proper cleanup of authentication tokens, cached data, and any active connections. Critical for maintaining security when the user is finished with their wallet operations.

```tsx
const res: void = await client.logout();
```

### `getPrivateKey`

Securely retrieves the INTMAX private key required for signing operations when necessary. This can be used if the user wishes to back up their **INTMAX private key.** Transaction signing and decryption of transaction history can still be performed without executing this function.

```tsx
const privateKey: string = await client.getPrivateKey(); // will return hex string of private key
```

### `signMessage`

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

### `verifySignature`

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

## Token

This SDK manages cryptocurrency and digital asset information within the wallet ecosystem.

[Q. What are `tokenList` and `tokenBalances`](#q-what-are-tokenlist-and-tokenbalances)

### `getTokensList`

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

### `fetchTokenBalances`

Retrieves all token balances held by the currently logged-in INTMAX account. This is useful for displaying the user’s asset holdings within an application.

[Q. Why does it take time to execute the fetchTokenBalances function?](#q-why-does-it-take-time-to-execute-the-fetchtokenbalances-function)

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

## Transaction

A transfer is made within the INTMAX network by executing a transaction on the network's transfer mechanism. It supports ETH, ERC20, ERC721, and ERC1155 tokens.

### `fetchTransfers`

This function retrieves the history of tokens received by the user, including details like amount, sender (`from`), recipient (`to`), status, timestamp, and token information.

[Q. What is the difference between a transfer and a transaction?](#q-what-is-the-difference-between-a-transfer-and-a-transaction)

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

### `fetchTransactions`

This function retrieves the history of tokens sent by the user. Each transaction may include multiple transfers to different recipients, including the payment of fees.

For details about the differences between transactions and transfers, please refer to the FAQ below.

[Q. What is the difference between a transfer and a transaction?](#q-what-is-the-difference-between-a-transfer-and-a-transaction)

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

### `broadcastTransaction`

The `broadcastTransaction` function broadcasts one or more transactions to the blockchain network. It accepts an array of transaction parameters, such as recipient addresses, transfer amounts, and token types. After broadcasting the transactions, the function verifies the root of the transaction tree and waits for confirmation. The response includes transaction results containing the confirmation status, block number, and other relevant information.

You can specify multiple transactions in a single call — up to a maximum of **63 transactions**.

[Q. How are transaction fees determined on the INTMAX network?](#q-how-are-transaction-fees-determined-on-the-intmax-network)

[Q. What happens to transaction fees when multiple transactions are batched together?](#q-what-happens-to-transaction-fees-when-multiple-transactions-are-batched-together)

[Q. How do you use the return value of `broadcastTransaction`?](#q-how-do-you-use-the-return-value-of-broadcasttransaction)

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

## Deposit

A deposit is made from Ethereum mainnet to the INTMAX network by executing a transaction on the liquidity contract of Ethereum mainnet. It supports ETH, ERC20, ERC721, and ERC1155 tokens.

### `fetchDeposits`

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

### `deposit`

Processes a deposit transaction to the user's account with all required transaction parameters. This method handles the complete deposit flow including validation, signing, broadcasting to the network — **and includes an on-chain AML (Anti-Money Laundering) check via a Predicate Contract**.

Here, `estimateDepositGas` is necessary to validate whether there is enough gas available for the transaction in advance.

```tsx
const params: PrepareDepositTransactionRequest = {
  amount: 0.000001, // 0.000001 ETH
  token: {
    tokenType: 0,
    tokenIndex: 0,
    decimals: 18,
    contractAddress: "0x0000000000000000000000000000000000000000",
    price: 2417.08
  },
  address: "T7iFM2BEtd3JxkaUNfZge83CtAqhdgcjGgJpiityyrYMW739SyyDYF5bnR8fkSG3G9YT4VZtur3hKhvuDm5ZLneYLy8j7gG", // INTMAX Address
  isMining: false,
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

**NOTE**: Currently, even if the `isMining` flag is set to true, it is not treated as mining.

## Withdrawal

A withdrawal is made from the INTMAX network to Ethereum mainnet by executing a transaction on the liquidity contract of the mainnet. It supports ETH, ERC20, ERC721, and ERC1155 tokens.

### `fetchWithdrawal`

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

### `withdraw`

The `withdraw` function is an asynchronous method that processes a withdrawal request from the user's wallet. This function performs comprehensive validation and security checks to ensure the withdrawal is handled safely and accurately. It follows the entire withdrawal flow, including verifying the user's balance, calculating transaction fees, and signing the transaction.

```tsx

const params: WithdrawRequest = {
  amount: 0.00000001
  token: {
    tokenType: 0, // 0: NATIVE, 1: ERC20, 2: ERC721, 3: ERC1155
    tokenIndex: 0,
    decimals: 18,
    contractAddress: "0x0000000000000000000000000000000000000000",
    price: 2417.08
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
```

### `claimWithdrawal`

Initiates the claim process for one or more withdrawal transactions, returning a response containing the transaction hash and status. After execution of this function completes, the progress of the claim operation can be tracked to confirm its success on the blockchain.

[**Q.** What is `claimWithdrawal`?](#q-what-is-claimwithdrawal)

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

## Fee

Please refer to the following for details about the fees.

[Q. How are transaction fees determined on the INTMAX network?](#q-how-are-transaction-fees-determined-on-the-intmax-network)

[Q. What is the collateral fee?](#q-what-is-the-collateral-fee)

### `getTransferFee`

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

### `getWithdrawalFee`

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

# Examples

## Usage for browser

We plan to provide JavaScript support for the following modules. Below, you will find examples for each module.

```bash
npm i intmax2-client-sdk
```

### Initiate INTMAX Client

`IntMaxClient` is a core component of the INTMAX SDK that provides seamless interaction with the INTMAX network. This class simplifies the process of integrating applications with the INTMAX network, enabling developers to interact with both the `mainnet` and `testnet` environments effortlessly.

```tsx
import { IntMaxClient } from "intmax-client-sdk";

const client = await IntMaxClient.init({ environment: "mainnet" });
```

To set up a local Balance Prover instance, please see Tips: [How to Run a Local Balance Prover](https://github.com/InternetMaximalism/intmax2-client-sdk/blob/main/README.md#tips-how-to-run-a-local-balance-prover)

### Login to INTMAX Network

Here is an example of logging in to INTMAX. Users need to login once before using the SDK functions.

You should sign two message, they will be appeared in the popup window automatically:

1. Sign the message confirm your ETH wallet address.

2. Sign the message with challenge string.

```tsx
await client.login();
```

### Retrieve Balance

This example retrieves the balances of the generated INTMAX account.

```tsx
const { balances } = await client.fetchTokenBalances();
```

## Usage for Node.js

```bash
npm i intmax2-server-sdk
```

### Initiate INTMAX Client

```tsx
import { IntMaxNodeClient } from "intmax2-server-sdk";

const client = new IntMaxNodeClient({
  environment: "mainnet",
  eth_private_key: "0x...", // Replace with your Ethereum private key
  l1_rpc_url: "https://sepolia.gateway.tenderly.co",
});
```

### Login to INTMAX Network & Retrieve Balance

Here is an example of logging in to INTMAX and retrieving balances. Users need to retrieve their balances once before using the SDK functions.

```tsx
await client.login();
const { balances } = await client.fetchTokenBalances();
```

## Usage for both

### Retrieve INTMAX Account Address & Private Key

This example retrieves the address and private key of the generated INTMAX account.

```tsx
const address = client.address; // Address of the INTMAX account
const privateKey = client.getPrivateKey(); // Private key of the INTMAX account
```

### **Sign & Verify Message**

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

### **List Available Tokens & Retrieve Information for a Specific Token**

Shows how to get the list of tokens supported by the network.

```tsx
const tokens = await client.getTokensList();
console.log("Available tokens:", tokens);

const nativeToken = tokens.find(
  (t) => t.contractAddress.toLowerCase() === "0x0000000000000000000000000000000000000000",
);
```

### **Fetch Transaction History**

Retrieves deposits, transfers, and sent transactions in parallel, then prints the latest entries.

```tsx
const [deposits, transfers, sentTxs] = await Promise.all([
  client.fetchDeposits({}),
  client.fetchTransfers({}),
  client.fetchTransactions({}),
]);

console.log("Deposits:", deposits);
console.log("Received Transfers:", transfers);
console.log("Sent Transfers:", sentTxs);
```

### Estimate Gas & Deposit

Estimates gas for an ETH deposit and submits the deposit.

```tsx
const token = {
  tokenType: TokenType.NATIVE,
  tokenIndex: 0,
  decimals: 18,
  contractAddress: "0x0000000000000000000000000000000000000000",
  price: 2417.08,
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

### Check Transfer Fee & Broadcast Transaction

This example retrieves the current transfer fee (token index / amount). Then it sends 0.000001 ETH to another INTMAX address.

```tsx
const token = {
  tokenType: TokenType.NATIVE,
  tokenIndex: 0,
  decimals: 18,
  contractAddress: "0x0000000000000000000000000000000000000000",
  price: 2417.08,
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

const tx = await client.broadcastTransaction(transfers);
console.log("Transfer result:", tx);
```

### Retrieve Withdrawal Fee & Execute Withdrawal

This example shows how to fetch both withdrawal and transfer fees before withdrawing.

Then, it performs an ETH withdrawal, then claims it once the proof is ready.

```tsx
const token = {
  tokenType: TokenType.NATIVE,
  tokenIndex: 0,
  decimals: 18,
  contractAddress: "0x0000000000000000000000000000000000000000",
  price: 2417.08,
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

# Tips

## How to Run a Local Balance Prover

You can set up a local Balance Prover instance and send requests to it.

### 1. Clone the Repository

Clone the `intmax2` repository (branch `dev`) from GitHub to your local environment.

```bash
git clone git@github.com:InternetMaximalism/intmax2.git -b dev
```

### 2. Navigate to the Balance Prover Directory

Move into the `balance-prover` directory within the cloned repository.

```bash
cd intmax2/balance-prover
```

### 3. Prepare Environment Configuration

Create an environment configuration file `.env` based on the provided `.example.env` template.

```bash
cp -n .example.env .env
```

### 4. Start the Balance Prover

Run the Balance Prover in release mode (`-r`) using Cargo.

```bash
cargo run -r
```

### 5. Change the SDK Config

Here's how to update the configuration for Browser and NodeJS, respectively.

### 5-a. Browser

To use the private ZKP server hosted at `http://localhost:9001`, you can use the following code:

```tsx
import { IntMaxClient } from "intmax2-client-sdk";

const intMaxClient = IntMaxClient.init({
  environment: "mainnet",
  urls: {
    balance_prover_url: "http://localhost:9001",
    use_private_zkp_server: false,
  },
});
```

Set `use_private_zkp_server` to `false` when running the balance prover locally.

### 5-b. NodeJS

To use the private ZKP server hosted at `http://localhost:9001`, you can use the following code:

```tsx
const intMaxClient = new IntMaxNodeClient({
  environment: "mainnet",
  eth_private_key: process.env.ETH_PRIVATE_KEY,
  l1_rpc_url: process.env.L1_RPC_URL,
  urls: {
    balance_prover_url: "http://localhost:9001",
    use_private_zkp_server: false,
  },
});
```

Set `use_private_zkp_server` to `false` when running the balance prover locally.

# FAQ

### Q. Does the INTMAX network support smart contracts?

No, the INTMAX network does **not** support smart contracts. Instead, interaction with the network is performed through the **Client SDK**, which provides all necessary functionalities for sending transactions, managing assets, and integrating with applications.

### Q. What is “Login” in the context of the INTMAX network?

**Login** is the process of generating an INTMAX address from a given Ethereum account. INTMAX addresses use a different signature scheme from typical EVM chains. Access is performed through an EVM-compatible wallet application in a browser.

### Q. Are an Ethereum address and an INTMAX address the same?

No, they are distinct. For more details, please refer [Account System](#account-system).

### Q. How are transaction fees determined on the INTMAX network?

Transaction fees on the INTMAX network apply in the following cases:

- Transfers within the INTMAX network
- Withdrawals from INTMAX to Ethereum
- Claiming mining rewards

Currently, the SDK does not handle mining. Thus, the fee structure explained here applies only to transfers and withdrawals on the network.

- Transfer Fees:
  - First transaction: **2,250 - 2,500 Gwei**
  - Subsequent transactions: **1,800 - 2,000 Gwei**
- Withdrawal Fee: **32,500 Gwei**

### Q. What happens to transaction fees when multiple transactions are batched together?

Even when many transactions (for example, 63 transactions) are batched together into a single block, each individual transaction maintains the same fee structure.

### Q. How do you use the return value of `broadcastTransaction`?

The function returns a response like this:

```json
{
  "txTreeRoot": "0x52146f411e84ccba11e0887a0780a558f41042300a1515c7ff2cb7e1dd8b8c77",
  "transferDigests": [
    "0x0fddb7a7b18025c8a2242a66c8c73100f272ba0fc0064c65d725badcc5f9df66",
    "0xbccada67a9ad5eafae682fe000c955b6fd2bde90b16298dac87aa23bd021aa65"
  ]
}
```

This return value will be used with a function called `waitForConfirmationTransaction`, which is currently under development. That function will allow you to wait until the transaction is confirmed.

### Q. What is the collateral fee?

**The collateral fee** is a fee introduced by the Block Builder to protect against spam attacks from users.

If the user cancels a transfer midway, the fee specified as the collateral fee is charged. If the transfer is completed without being canceled, the collateral fee is not used.

The collateral fee is typically set to be 2 to 10 times higher than the regular transaction fee. To initiate a transfer, the user must have a balance greater than or equal to the larger of the two: the regular fee or the collateral fee.

### Q. What is the difference between a transfer and a transaction?

On the INTMAX network, a **transfer** refers to the movement of tokens from one sender specifically to a single recipient. In contrast, a **transaction** bundles multiple transfers originating from the same sender into one grouped operation, enabling multiple recipients to receive tokens simultaneously.

### Q. What is `claimWithdrawal`?

There are two types of withdrawals: one for **native tokens** and one for **non-native tokens**.

- For **native tokens**, calling `withdraw` is enough—the tokens are sent directly to the specified address.
- For **non-native tokens**, after calling `withdraw`, the withdrawal status becomes `NeedToClaim`. In this case, you must explicitly call `claimWithdrawal` to complete the process.

You can also batch multiple pending withdrawals and claim them together using `claimWithdrawal`.

### Q. What are `tokenList` and `tokenBalances`?

- `tokenList` is a list of tokens that exist on the INTMAX network.

  Any token that has ever been deposited into the INTMAX network is indexed and assigned a unique `tokenIndex` ID.

- `tokenBalances` represents all token types held by a specific address, along with the balance of each token.

### Q. What does privacy mean in INTMAX?

INTMAX is designed with strong privacy protection. Only the owner of a wallet can view their asset balances and transaction history. This means that without the private key of a specific address, no one—not even network participants—can access this information.

### Q. Why does it take time to execute the fetchTokenBalances function?

**A.** The fetchTokenBalances function retrieves user data and simultaneously synchronizes token balances. Once the synchronization is complete, the execution time will be shorter for subsequent calls. **Normally, if balance synchronization is not required, it completes in about 6 seconds.**

# Want to contribute or report an issue?

We welcome contributions and feedback!

Please feel free to open an [issue](https://github.com/InternetMaximalism/intmax2-client-sdk/issues) or submit a [pull request](https://github.com/InternetMaximalism/intmax2-client-sdk/pulls) on GitHub.

Your support helps improve the INTMAX ecosystem.

# References

You’ll find links to the Rust code and other contract addresses below—please use them as reference material.

You’ll find links to the Rust code and contract documentation below—please use them as reference material.

### 📜 Smart Contracts

Documentation for deployed contracts and how to interact with them. [**View Smart Contracts Documentation**](../intmax-nodes/smart-contracts.md)

### 🔧 Rust CLI

Command-line interface for interacting with the INTMAX network using Rust.
[**View INTMAX CLI on GitHub**](https://github.com/InternetMaximalism/intmax2/tree/dev/cli)

### 🦀 Rust SDK

The official Rust SDK for interacting with the INTMAX network externally.
[**View INTMAX Client SDK on GitHub**](https://github.com/InternetMaximalism/intmax2/tree/dev/client-sdk)

> This SDK enables seamless external interaction with the INTMAX network using Rust.
