---
sidebar_position: 2
description: The IntMaxClient is an SDK interface designed for interacting with the INTMAX network. This interface provides essential features such as account management, transaction operations, deposits, and withdrawals. Below is an overview of each functionality.
---

# Interfaces

The `IntMaxClient` is an SDK interface designed for interacting with the INTMAX network. This interface provides essential features such as account management, transaction operations, deposits, and withdrawals. Below is an overview of each functionality.

This interface offers high-level APIs for seamless integration with the INTMAX network. It integrates account login/logout, transaction management, and deposit/withdrawal processing, allowing developers to execute complex blockchain operations through simple functions. Additionally, with WebAssembly support, it ensures fast and secure processing.

```tsx
export interface INTMAXClient {
  // properties
  isLoggedIn: boolean;
  address: string; // INTMAX address
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
  sync: () => Promise<void>;
  updatePublicClientRpc: (url: string) => void;

  // token
  getTokensList: () => Promise<Token[]>;
  fetchTokenBalances: () => Promise<TokenBalancesResponse>;
  getPaginatedTokens: (params: {
    tokenIndexes?: number[];
    perPage?: number;
    cursor?: string;
  }) => Promise<PaginatedResponse<Token>>;

  // transaction
  fetchTransactions: (params?: FetchTransactionsRequest) => Promise<FetchTransactionsResponse>;
  broadcastTransaction: (
    rawTransfers: BroadcastTransactionRequest[],    isWithdrawal?: boolean,
  ) => Promise<BroadcastTransactionResponse>;
  waitForTransactionConfirmation: (
    params: WaitForTransactionConfirmationRequest,
  ) => Promise<WaitForTransactionConfirmationResponse>;

  //receiveTxs
  fetchTransfers: (params?: FetchTransactionsRequest) => Promise<FetchTransactionsResponse>;

  // deposit
  estimateDepositGas: (params: PrepareEstimateDepositTransactionRequest) => Promise<bigint>;
  deposit: (params: PrepareDepositTransactionRequest) => Promise<PrepareDepositTransactionResponse>;
  fetchDeposits: (params?: FetchTransactionsRequest) => Promise<FetchTransactionsResponse>;

  // withdrawal
  fetchWithdrawals: (params?: FetchWithdrawalsRequest) => Promise<FetchWithdrawalsResponse>;
  withdraw: (params: WithdrawRequest) => Promise<WithdrawalResponse>;
  claimWithdrawal: (params: ContractWithdrawal[]) => Promise<ClaimWithdrawalTransactionResponse>;

  // Fees
  getTransferFee: () => Promise<FeeResponse>;
  getWithdrawalFee: (token: Token) => Promise<FeeResponse>;
}
```

### Function List Overview

The **Function List** outlines key properties and interfaces of the INTMAX Client SDK, enabling seamless user authentication, token balance management, and interaction with the INTMAX network. It provides clear and standardized methods for handling authentication states, token information, and paginated data retrieval to ensure efficient integration and extensibility across different use cases.

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
  price?: number; // Current price of the token in USD
  symbol?: string; // Token symbol (e.g., ETH, USDC, DAI)
  tokenIndex: number; // Unique identifier for the token within INTMAX network
  tokenType: TokenType; // Type classification of the token
}
```

### Request Interfaces(Token, Transaction, Deposit)

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

interface PaginatedResponse<T> {
  items: T[];
  nextCursor: null | string;
  total: number;
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

export interface FetchItemsResponse<T> {
  items: T[];
  pagination: PaginationCursor;
}

// Type alias for transaction fetch responses
export type FetchTransactionsResponse = FetchItemsResponse<Transaction>;

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
interface WaitForTransactionConfirmationRequest {
  txTreeRoot: string; // Transaction tree root to wait for confirmation
  pollInterval?: number; // Interval between confirmation checks in milliseconds
}

// Interface representing the result of transaction confirmation waiting
export interface WaitForTransactionConfirmationResponse {
  status: "not_found" | "success" | "confirmed" | "pending" | "failed"; // Status of the confirmation check
}

// Interface for preparing a deposit transaction
export interface PrepareDepositTransactionRequest {
  token: Token; // Token to be deposited
  amount: number; // Amount to deposit ex. 0.000001 means 0.000001 ETH
  address: string; // INTMAX address to receive the deposit on INTMAX Network
  skipConfirmation?: boolean; // Flag indicating if confirmation is skipped
}

// Extended interface for deposit transaction gas estimation
export interface PrepareEstimateDepositTransactionRequest extends Omit<PrepareDepositTransactionRequest, "skipConfirmation"> {
  isGasEstimation: boolean; // Flag indicating if this is for gas estimation only
}

// Interface representing the response from deposit transaction preparation
export interface PrepareDepositTransactionResponse {
  txHash: `0x${string}`; // Ethereum transaction hash
  status: TransactionStatus; // Current status of the transaction
}
```

### Request Interfaces(Withdrawal)

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

// Configuration options for various URLs used in the SDK
export type UrlConfig = {
  balance_prover_url?: string; // URL for the balance prover service
  use_private_zkp_server?: boolean; // Flag indicating if a private ZKP server should be used
  rpc_url_l1?: string; // RPC URL for Ethereum (Sepolia)
  rpc_url_l2?: string; // RPC URL for Scroll (Sepolia)
};

// Constructor parameters for browser environment
export interface ConstructorParams {
  environment: IntMaxEnvironment; // Target network environment
  async_params?: ArrayBuffer; // Optional WebAssembly initialization parameters (URL of the file generated at build time)
  urls?: UrlConfig; // Configuration options for various URLs used in the SDK
  loggerLevel?: 'error' | 'warn' | 'info' | 'none'; // Logging level for the SDK
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
