# Solidity API

## BlockBuilderInfoLib

### isStaking

```solidity
function isStaking(struct IBlockBuilderRegistry.BlockBuilderInfo info) internal pure returns (bool)
```

Check if the block builder is staking.

### isChallengeDuration

```solidity
function isChallengeDuration(struct IBlockBuilderRegistry.BlockBuilderInfo info) internal view returns (bool)
```

Check if the challenge duration has passed.

### isStakeAmountSufficient

```solidity
function isStakeAmountSufficient(struct IBlockBuilderRegistry.BlockBuilderInfo info) internal pure returns (bool)
```

Check if the minimum stake amount is held.

## BlockBuilderRegistry

### blockBuilders

```solidity
mapping(address => struct IBlockBuilderRegistry.BlockBuilderInfo) blockBuilders
```

### isStaking

```solidity
modifier isStaking()
```

### initialize

```solidity
function initialize(address _rollup, address _fraudVerifier) public
```

Initialize the contract.

#### Parameters

| Name            | Type    | Description                         |
| --------------- | ------- | ----------------------------------- |
| \_rollup        | address | The address of the rollup contract. |
| \_fraudVerifier | address |                                     |

### updateBlockBuilder

```solidity
function updateBlockBuilder(string url) external payable
```

Update block builder.

_This method is used to register or update the URL or IP address of the block builder.
The block builder must send at least 0.1 ETH to this contract to register._

#### Parameters

| Name | Type   | Description                             |
| ---- | ------ | --------------------------------------- |
| url  | string | The URL or IP address of Block builder. |

### stopBlockBuilder

```solidity
function stopBlockBuilder() external
```

Declare that the block builder has stopped.

_This method must be run before unstake._

### unstake

```solidity
function unstake() external
```

unstake after stoping block builder.

_You cannot unstake within one day of the Block Builder's last block submission.
This is because a fraud proof may be submitted against the posted block, which could result
in a reduction of the stake._

### submitBlockFraudProof

```solidity
function submitBlockFraudProof(struct FraudProofPublicInputsLib.FraudProofPublicInputs publicInputs, bytes proof) external
```

Submits a fraud proof to demonstrate that a block submitted by a block builder is invalid.

#### Parameters

| Name         | Type                                                    | Description                       |
| ------------ | ------------------------------------------------------- | --------------------------------- |
| publicInputs | struct FraudProofPublicInputsLib.FraudProofPublicInputs | Public inputs of the fraud proof. |
| proof        | bytes                                                   | The fraud proof itself.           |

### isValidBlockBuilder

```solidity
function isValidBlockBuilder(address blockBuilder) external view returns (bool)
```

Check if the block builder is valid.

_The block builder is valid if the stake amount is greater than or equal to 0.1 ETH._

#### Parameters

| Name         | Type    | Description                       |
| ------------ | ------- | --------------------------------- |
| blockBuilder | address | The address of the block builder. |

#### Return Values

| Name | Type | Description                         |
| ---- | ---- | ----------------------------------- |
| [0]  | bool | True if the block builder is valid. |

### setBurnAddress

```solidity
function setBurnAddress(address _burnAddress) external
```

Set the burn address.

_The burn address is used to burn the stake amount when the block builder is slashed._

#### Parameters

| Name          | Type    | Description       |
| ------------- | ------- | ----------------- |
| \_burnAddress | address | The burn address. |

### getValidBlockBuilders

```solidity
function getValidBlockBuilders() external view returns (struct IBlockBuilderRegistry.BlockBuilderInfoWithAddress[])
```

Get the block builder information of valid block builders.

#### Return Values

| Name | Type                                                       | Description                    |
| ---- | ---------------------------------------------------------- | ------------------------------ |
| [0]  | struct IBlockBuilderRegistry.BlockBuilderInfoWithAddress[] | The block builder information. |

### \_authorizeUpgrade

```solidity
function _authorizeUpgrade(address) internal
```

## MIN_STAKE_AMOUNT

```solidity
uint256 MIN_STAKE_AMOUNT
```

## IBlockBuilderRegistry

### URLIsEmpty

```solidity
error URLIsEmpty()
```

Error thrown when trying to register a block builder with an empty URL

### InsufficientStakeAmount

```solidity
error InsufficientStakeAmount()
```

Error thrown when the staked amount is insufficient

### BlockBuilderNotFound

```solidity
error BlockBuilderNotFound()
```

Error thrown when trying to slash a block builder that is not staking

### CannotUnstakeWithinChallengeDuration

```solidity
error CannotUnstakeWithinChallengeDuration()
```

Error thrown when trying to unstake within the challenge duration

### FailedTransfer

```solidity
error FailedTransfer(address to, uint256 amount)
```

Error thrown when ETH transfer fails

#### Parameters

| Name   | Type    | Description                                     |
| ------ | ------- | ----------------------------------------------- |
| to     | address | The address to which the transfer was attempted |
| amount | uint256 | The amount that failed to transfer              |

### FraudProofAlreadySubmitted

```solidity
error FraudProofAlreadySubmitted()
```

Error thrown when attempting to slash the same block number twice

### FraudProofVerificationFailed

```solidity
error FraudProofVerificationFailed()
```

Error thrown when fraud proof verification fails

### FraudProofBlockHashMismatch

```solidity
error FraudProofBlockHashMismatch(bytes32 given, bytes32 expected)
```

Error thrown when the block hash in public input doesn't match the contract's record

#### Parameters

| Name     | Type    | Description                                 |
| -------- | ------- | ------------------------------------------- |
| given    | bytes32 | The block hash provided in the public input |
| expected | bytes32 | The block hash expected by the contract     |

### FraudProofChallengerMismatch

```solidity
error FraudProofChallengerMismatch()
```

Error thrown when the challenger in public input doesn't match msg.sender

### BlockFraudProofSubmitted

```solidity
event BlockFraudProofSubmitted(uint32 blockNumber, address blockBuilder, address challenger)
```

Event emitted when a fraud proof is submitted

#### Parameters

| Name         | Type    | Description                                              |
| ------------ | ------- | -------------------------------------------------------- |
| blockNumber  | uint32  | The number of the block being challenged                 |
| blockBuilder | address | The address of the block builder being challenged        |
| challenger   | address | The address of the challenger submitting the fraud proof |

### BlockBuilderUpdated

```solidity
event BlockBuilderUpdated(address blockBuilder, string url, uint256 stakeAmount)
```

Event emitted when a block builder is updated

#### Parameters

| Name         | Type    | Description                               |
| ------------ | ------- | ----------------------------------------- |
| blockBuilder | address | The address of the updated block builder  |
| url          | string  | The new URL of the block builder          |
| stakeAmount  | uint256 | The new stake amount of the block builder |

### BlockBuilderStopped

```solidity
event BlockBuilderStopped(address blockBuilder)
```

Event emitted when a block builder stops operations

#### Parameters

| Name         | Type    | Description                                   |
| ------------ | ------- | --------------------------------------------- |
| blockBuilder | address | The address of the block builder that stopped |

### BlockBuilderSlashed

```solidity
event BlockBuilderSlashed(address blockBuilder, address challenger)
```

Event emitted when a block builder is slashed

#### Parameters

| Name         | Type    | Description                                                 |
| ------------ | ------- | ----------------------------------------------------------- |
| blockBuilder | address | The address of the slashed block builder                    |
| challenger   | address | The address of the challenger who submitted the fraud proof |

### BlockBuilderInfo

Block builder information.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |

```solidity
struct BlockBuilderInfo {
  string blockBuilderUrl;
  uint256 stakeAmount;
  uint256 stopTime;
  uint256 numSlashes;
  bool isValid;
}
```

### BlockBuilderInfoWithAddress

Block builder info with address.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |

```solidity
struct BlockBuilderInfoWithAddress {
  address blockBuilderAddress;
  struct IBlockBuilderRegistry.BlockBuilderInfo info;
}
```

### updateBlockBuilder

```solidity
function updateBlockBuilder(string url) external payable
```

Update block builder.

_This method is used to register or update the URL or IP address of the block builder.
The block builder must send at least 0.1 ETH to this contract to register._

#### Parameters

| Name | Type   | Description                             |
| ---- | ------ | --------------------------------------- |
| url  | string | The URL or IP address of Block builder. |

### stopBlockBuilder

```solidity
function stopBlockBuilder() external
```

Declare that the block builder has stopped.

_This method must be run before unstake._

### unstake

```solidity
function unstake() external
```

unstake after stoping block builder.

_You cannot unstake within one day of the Block Builder's last block submission.
This is because a fraud proof may be submitted against the posted block, which could result
in a reduction of the stake._

### submitBlockFraudProof

```solidity
function submitBlockFraudProof(struct FraudProofPublicInputsLib.FraudProofPublicInputs publicInputs, bytes proof) external
```

Submits a fraud proof to demonstrate that a block submitted by a block builder is invalid.

#### Parameters

| Name         | Type                                                    | Description                       |
| ------------ | ------------------------------------------------------- | --------------------------------- |
| publicInputs | struct FraudProofPublicInputsLib.FraudProofPublicInputs | Public inputs of the fraud proof. |
| proof        | bytes                                                   | The fraud proof itself.           |

### isValidBlockBuilder

```solidity
function isValidBlockBuilder(address blockBuilder) external view returns (bool)
```

Check if the block builder is valid.

_The block builder is valid if the stake amount is greater than or equal to 0.1 ETH._

#### Parameters

| Name         | Type    | Description                       |
| ------------ | ------- | --------------------------------- |
| blockBuilder | address | The address of the block builder. |

#### Return Values

| Name | Type | Description                         |
| ---- | ---- | ----------------------------------- |
| [0]  | bool | True if the block builder is valid. |

### getValidBlockBuilders

```solidity
function getValidBlockBuilders() external view returns (struct IBlockBuilderRegistry.BlockBuilderInfoWithAddress[])
```

Get the block builder information of valid block builders.

#### Return Values

| Name | Type                                                       | Description                    |
| ---- | ---------------------------------------------------------- | ------------------------------ |
| [0]  | struct IBlockBuilderRegistry.BlockBuilderInfoWithAddress[] | The block builder information. |

### setBurnAddress

```solidity
function setBurnAddress(address _burnAddress) external
```

Set the burn address.

_The burn address is used to burn the stake amount when the block builder is slashed._

#### Parameters

| Name          | Type    | Description       |
| ------------- | ------- | ----------------- |
| \_burnAddress | address | The burn address. |

## FraudProofPublicInputsLib

### FraudProofPublicInputs

Public inputs for fraud proof

_This structure contains the necessary public inputs for a fraud proof_

```solidity
struct FraudProofPublicInputs {
  bytes32 blockHash;
  uint32 blockNumber;
  address challenger;
}
```

### getHash

```solidity
function getHash(struct FraudProofPublicInputsLib.FraudProofPublicInputs inputs) internal pure returns (bytes32)
```

Calculates the hash of the public inputs

#### Parameters

| Name   | Type                                                    | Description                          |
| ------ | ------------------------------------------------------- | ------------------------------------ |
| inputs | struct FraudProofPublicInputsLib.FraudProofPublicInputs | The FraudProofPublicInputs structure |

#### Return Values

| Name | Type    | Description                       |
| ---- | ------- | --------------------------------- |
| [0]  | bytes32 | The calculated hash of the inputs |

## Byte32Lib

### split

```solidity
function split(bytes32 input) internal pure returns (uint256[])
```

Splits a bytes32 into an array of uint256, each representing 4 bytes

#### Parameters

| Name  | Type    | Description                   |
| ----- | ------- | ----------------------------- |
| input | bytes32 | The bytes32 value to be split |

#### Return Values

| Name | Type      | Description                                                          |
| ---- | --------- | -------------------------------------------------------------------- |
| [0]  | uint256[] | An array of 8 uint256 values, each representing 4 bytes of the input |

## DepositLib

### Deposit

_Represents a leaf in the Deposit tree_

```solidity
struct Deposit {
  bytes32 recipientSaltHash;
  uint32 tokenIndex;
  uint256 amount;
}
```

### getHash

```solidity
function getHash(struct DepositLib.Deposit deposit) internal pure returns (bytes32)
```

Calculates the hash of a Deposit struct

#### Parameters

| Name    | Type                      | Description                     |
| ------- | ------------------------- | ------------------------------- |
| deposit | struct DepositLib.Deposit | The Deposit struct to be hashed |

#### Return Values

| Name | Type    | Description                                |
| ---- | ------- | ------------------------------------------ |
| [0]  | bytes32 | bytes32 The calculated hash of the Deposit |

## IPlonkVerifier

### Verify

```solidity
function Verify(bytes proof, uint256[] publicInputs) external view returns (bool success)
```

Verify a Plonk proof.
Reverts if the proof or the public inputs are malformed.

#### Parameters

| Name         | Type      | Description                                            |
| ------------ | --------- | ------------------------------------------------------ |
| proof        | bytes     | serialised plonk proof (using gnark's MarshalSolidity) |
| publicInputs | uint256[] | (must be reduced)                                      |

#### Return Values

| Name    | Type | Description                              |
| ------- | ---- | ---------------------------------------- |
| success | bool | true if the proof passes false otherwise |

## WithdrawalLib

### Withdrawal

_Represents the information for a withdrawal operation_

```solidity
struct Withdrawal {
  address recipient;
  uint32 tokenIndex;
  uint256 amount;
  uint256 id;
}
```

### getHash

```solidity
function getHash(struct WithdrawalLib.Withdrawal withdrawal) internal pure returns (bytes32)
```

Calculates the hash of a Withdrawal struct

#### Parameters

| Name       | Type                            | Description                        |
| ---------- | ------------------------------- | ---------------------------------- |
| withdrawal | struct WithdrawalLib.Withdrawal | The Withdrawal struct to be hashed |

#### Return Values

| Name | Type    | Description                                   |
| ---- | ------- | --------------------------------------------- |
| [0]  | bytes32 | bytes32 The calculated hash of the Withdrawal |

## Contribution

### WEIGHT_REGISTRAR

```solidity
bytes32 WEIGHT_REGISTRAR
```

Role identifier for administers who can register weights

### CONTRIBUTOR

```solidity
bytes32 CONTRIBUTOR
```

Role identifier for contracts that can record contributions

### currentPeriod

```solidity
uint256 currentPeriod
```

The current active period for contributions

### totalContributionsInPeriod

```solidity
mapping(uint256 => mapping(bytes32 => uint256)) totalContributionsInPeriod
```

Maps periods and tags to total contributions

_period => tag => total contribution amount_

### contributionsInPeriod

```solidity
mapping(uint256 => mapping(bytes32 => mapping(address => uint256))) contributionsInPeriod
```

Maps periods, tags, and users to their individual contributions

_period => tag => user address => contribution amount_

### allWeights

```solidity
mapping(uint256 => mapping(bytes32 => uint256)) allWeights
```

Maps periods and tags to their assigned weights

_period => tag => weight_

### initialize

```solidity
function initialize() public
```

### getTags

```solidity
function getTags(uint256 periodNumber) external view returns (bytes32[])
```

Get the list of tags registered for a specific period.

#### Parameters

| Name         | Type    | Description                        |
| ------------ | ------- | ---------------------------------- |
| periodNumber | uint256 | The number of the period to query. |

#### Return Values

| Name | Type      | Description                                |
| ---- | --------- | ------------------------------------------ |
| [0]  | bytes32[] | An array of bytes32 representing the tags. |

### getWeights

```solidity
function getWeights(uint256 periodNumber) external view returns (uint256[])
```

Get the weights array for a specified period.

#### Parameters

| Name         | Type    | Description                        |
| ------------ | ------- | ---------------------------------- |
| periodNumber | uint256 | The number of the period to query. |

#### Return Values

| Name | Type      | Description                                   |
| ---- | --------- | --------------------------------------------- |
| [0]  | uint256[] | An array of uint256 representing the weights. |

### incrementPeriod

```solidity
function incrementPeriod() external
```

### registerWeights

```solidity
function registerWeights(uint256 periodNumber, bytes32[] tags, uint256[] weights) external
```

Register tags and their corresponding weights for a period.

#### Parameters

| Name         | Type      | Description                                                             |
| ------------ | --------- | ----------------------------------------------------------------------- |
| periodNumber | uint256   | The number of the period to register for.                               |
| tags         | bytes32[] | An array of bytes32 representing the tags.                              |
| weights      | uint256[] | An array of uint256 representing the weights corresponding to the tags. |

### recordContribution

```solidity
function recordContribution(bytes32 tag, address user, uint256 amount) external
```

Record a contribution for a specific tag and user.

#### Parameters

| Name   | Type    | Description                                      |
| ------ | ------- | ------------------------------------------------ |
| tag    | bytes32 | The tag associated with the contribution.        |
| user   | address | The address of the user making the contribution. |
| amount | uint256 | The amount of contribution to record.            |

### getContributionRate

```solidity
function getContributionRate(uint256 periodNumber, address user) external view returns (UD60x18)
```

Get the contribution rate of a specific user for a given period.

#### Parameters

| Name         | Type    | Description                        |
| ------------ | ------- | ---------------------------------- |
| periodNumber | uint256 | The number of the period to query. |
| user         | address | The address of the user to check.  |

#### Return Values

| Name | Type    | Description                                                                                        |
| ---- | ------- | -------------------------------------------------------------------------------------------------- |
| [0]  | UD60x18 | The contribution rate as a UD60x18 value, representing the user's share of the total contribution. |

### \_authorizeUpgrade

```solidity
function _authorizeUpgrade(address newImplementation) internal
```

\_Function that should revert when `msg.sender` is not authorized to upgrade the contract. Called by
{upgradeToAndCall}.

Normally, this function will use an xref:access.adoc[access control] modifier such as {Ownable-onlyOwner}.

````solidity
function _authorizeUpgrade(address) internal onlyOwner {}
```_

## IContribution

### InvalidInputLength

```solidity
error InvalidInputLength()
````

Error thrown when the input lengths of tags and weights do not match in registerWeights function

_This error is raised to ensure data integrity when registering weights for tags_

### getTags

```solidity
function getTags(uint256 periodNumber) external view returns (bytes32[])
```

Get the list of tags registered for a specific period.

#### Parameters

| Name         | Type    | Description                        |
| ------------ | ------- | ---------------------------------- |
| periodNumber | uint256 | The number of the period to query. |

#### Return Values

| Name | Type      | Description                                |
| ---- | --------- | ------------------------------------------ |
| [0]  | bytes32[] | An array of bytes32 representing the tags. |

### getWeights

```solidity
function getWeights(uint256 periodNumber) external view returns (uint256[])
```

Get the weights array for a specified period.

#### Parameters

| Name         | Type    | Description                        |
| ------------ | ------- | ---------------------------------- |
| periodNumber | uint256 | The number of the period to query. |

#### Return Values

| Name | Type      | Description                                   |
| ---- | --------- | --------------------------------------------- |
| [0]  | uint256[] | An array of uint256 representing the weights. |

### registerWeights

```solidity
function registerWeights(uint256 periodNumber, bytes32[] tags, uint256[] weights) external
```

Register tags and their corresponding weights for a period.

#### Parameters

| Name         | Type      | Description                                                             |
| ------------ | --------- | ----------------------------------------------------------------------- |
| periodNumber | uint256   | The number of the period to register for.                               |
| tags         | bytes32[] | An array of bytes32 representing the tags.                              |
| weights      | uint256[] | An array of uint256 representing the weights corresponding to the tags. |

### recordContribution

```solidity
function recordContribution(bytes32 tag, address user, uint256 amount) external
```

Record a contribution for a specific tag and user.

#### Parameters

| Name   | Type    | Description                                      |
| ------ | ------- | ------------------------------------------------ |
| tag    | bytes32 | The tag associated with the contribution.        |
| user   | address | The address of the user making the contribution. |
| amount | uint256 | The amount of contribution to record.            |

### getContributionRate

```solidity
function getContributionRate(uint256 periodNumber, address user) external view returns (UD60x18)
```

Get the contribution rate of a specific user for a given period.

#### Parameters

| Name         | Type    | Description                        |
| ------------ | ------- | ---------------------------------- |
| periodNumber | uint256 | The number of the period to query. |
| user         | address | The address of the user to check.  |

#### Return Values

| Name | Type    | Description                                                                                        |
| ---- | ------- | -------------------------------------------------------------------------------------------------- |
| [0]  | UD60x18 | The contribution rate as a UD60x18 value, representing the user's share of the total contribution. |

## ILiquidity

### OnlySenderCanCancelDeposit

```solidity
error OnlySenderCanCancelDeposit()
```

Error thrown when someone other than the original depositor tries to cancel a deposit

### InvalidDepositHash

```solidity
error InvalidDepositHash(bytes32 depositDataHash, bytes32 calculatedHash)
```

Error thrown when the provided deposit hash doesn't match the calculated hash during cancellation

#### Parameters

| Name            | Type    | Description                          |
| --------------- | ------- | ------------------------------------ |
| depositDataHash | bytes32 | The hash from the deposit data       |
| calculatedHash  | bytes32 | The hash calculated from given input |

### SenderIsNotScrollMessenger

```solidity
error SenderIsNotScrollMessenger()
```

Error thrown when the sender is not the Scroll Messenger in onlyWithdrawal context

### WithdrawalAddressNotSet

```solidity
error WithdrawalAddressNotSet()
```

Error thrown when the withdrawal contract address is not set

### InvalidWithdrawalAddress

```solidity
error InvalidWithdrawalAddress()
```

Error thrown when the xDomainMessageSender of the Scroll Messenger doesn't match the withdrawal contract address

### WithdrawalNotFound

```solidity
error WithdrawalNotFound(bytes32 withdrawalHash)
```

Error thrown when trying to claim a non-existent withdrawal

#### Parameters

| Name           | Type    | Description                                  |
| -------------- | ------- | -------------------------------------------- |
| withdrawalHash | bytes32 | The hash of the withdrawal that wasn't found |

### TriedToDepositZero

```solidity
error TriedToDepositZero()
```

Error thrown when trying to deposit zero amount of native/ERC20/ERC1155 tokens

### Deposited

```solidity
event Deposited(uint256 depositId, address sender, bytes32 recipientSaltHash, uint32 tokenIndex, uint256 amount, uint256 depositedAt)
```

Event emitted when a deposit is made

#### Parameters

| Name              | Type    | Description                                                                    |
| ----------------- | ------- | ------------------------------------------------------------------------------ |
| depositId         | uint256 | The unique identifier for the deposit                                          |
| sender            | address | The address that made the deposit                                              |
| recipientSaltHash | bytes32 | The hash of the recipient's intmax2 address (BLS public key) and a secret salt |
| tokenIndex        | uint32  | The index of the token being deposited                                         |
| amount            | uint256 | The amount of tokens deposited                                                 |
| depositedAt       | uint256 | The timestamp of the deposit                                                   |

### DepositsAnalyzedAndRelayed

```solidity
event DepositsAnalyzedAndRelayed(uint256 upToDepositId, uint256[] rejectedIndices, uint256 gasLimit, bytes message)
```

Event emitted when deposits are analyzed and relayed

#### Parameters

| Name            | Type      | Description                              |
| --------------- | --------- | ---------------------------------------- |
| upToDepositId   | uint256   | The highest deposit ID that was analyzed |
| rejectedIndices | uint256[] | Array of deposit IDs that were rejected  |
| gasLimit        | uint256   | The gas limit for the L2 transaction     |
| message         | bytes     | Additional message data                  |

### DepositCanceled

```solidity
event DepositCanceled(uint256 depositId)
```

Event emitted when a deposit is canceled

#### Parameters

| Name      | Type    | Description                    |
| --------- | ------- | ------------------------------ |
| depositId | uint256 | The ID of the canceled deposit |

### WithdrawalClaimable

```solidity
event WithdrawalClaimable(bytes32 withdrawalHash)
```

Event emitted when a withdrawal becomes claimable

#### Parameters

| Name           | Type    | Description                          |
| -------------- | ------- | ------------------------------------ |
| withdrawalHash | bytes32 | The hash of the claimable withdrawal |

### DirectWithdrawalsProcessed

```solidity
event DirectWithdrawalsProcessed(uint256 lastProcessedDirectWithdrawalId)
```

Event emitted when direct withdrawals are processed

#### Parameters

| Name                            | Type    | Description                                    |
| ------------------------------- | ------- | ---------------------------------------------- |
| lastProcessedDirectWithdrawalId | uint256 | The ID of the last processed direct withdrawal |

### ClaimableWithdrawalsProcessed

```solidity
event ClaimableWithdrawalsProcessed(uint256 lastProcessedClaimableWithdrawalId)
```

Event emitted when claimable withdrawals are processed

#### Parameters

| Name                               | Type    | Description                                       |
| ---------------------------------- | ------- | ------------------------------------------------- |
| lastProcessedClaimableWithdrawalId | uint256 | The ID of the last processed claimable withdrawal |

### ClaimedWithdrawal

```solidity
event ClaimedWithdrawal(address recipient, bytes32 withdrawalHash)
```

Event emitted when a withdrawal is claimed

#### Parameters

| Name           | Type    | Description                             |
| -------------- | ------- | --------------------------------------- |
| recipient      | address | The address that claimed the withdrawal |
| withdrawalHash | bytes32 | The hash of the claimed withdrawal      |

### depositNativeToken

```solidity
function depositNativeToken(bytes32 recipientSaltHash) external payable
```

Deposit native token

_recipientSaltHash is the Poseidon hash of the intmax2 address (32 bytes) and a secret salt_

#### Parameters

| Name              | Type    | Description                                           |
| ----------------- | ------- | ----------------------------------------------------- |
| recipientSaltHash | bytes32 | The hash of the recipient's address and a secret salt |

### depositERC20

```solidity
function depositERC20(address tokenAddress, bytes32 recipientSaltHash, uint256 amount) external
```

Deposit a specified amount of ERC20 token

_Requires prior approval for this contract to spend the tokens
recipientSaltHash is the Poseidon hash of the intmax2 address (32 bytes) and a secret salt_

#### Parameters

| Name              | Type    | Description                                           |
| ----------------- | ------- | ----------------------------------------------------- |
| tokenAddress      | address | The address of the ERC20 token contract               |
| recipientSaltHash | bytes32 | The hash of the recipient's address and a secret salt |
| amount            | uint256 | The amount of tokens to deposit                       |

### depositERC721

```solidity
function depositERC721(address tokenAddress, bytes32 recipientSaltHash, uint256 tokenId) external
```

Deposit an ERC721 token

_Requires prior approval for this contract to transfer the token_

#### Parameters

| Name              | Type    | Description                                           |
| ----------------- | ------- | ----------------------------------------------------- |
| tokenAddress      | address | The address of the ERC721 token contract              |
| recipientSaltHash | bytes32 | The hash of the recipient's address and a secret salt |
| tokenId           | uint256 | The ID of the token to deposit                        |

### depositERC1155

```solidity
function depositERC1155(address tokenAddress, bytes32 recipientSaltHash, uint256 tokenId, uint256 amount) external
```

Deposit a specified amount of ERC1155 tokens

#### Parameters

| Name              | Type    | Description                                           |
| ----------------- | ------- | ----------------------------------------------------- |
| tokenAddress      | address | The address of the ERC1155 token contract             |
| recipientSaltHash | bytes32 | The hash of the recipient's address and a secret salt |
| tokenId           | uint256 | The ID of the token to deposit                        |
| amount            | uint256 | The amount of tokens to deposit                       |

### analyzeAndRelayDeposits

```solidity
function analyzeAndRelayDeposits(uint256 upToDepositId, uint256[] rejectDepositIds, uint256 gasLimit) external payable
```

Trusted nodes submit the IDs of deposits that do not meet AML standards by this method

_upToDepositId specifies the last deposit id that have been analyzed. It must be greater than lastAnalyzedDeposit and less than or equal to the latest Deposit ID.
rejectDepositIndices must be greater than lastAnalyzedDeposit and less than or equal to upToDepositId._

#### Parameters

| Name             | Type      | Description                                                                                                                                            |
| ---------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| upToDepositId    | uint256   | The upper limit of the Deposit ID that has been analyzed. It must be greater than lastAnalyzedDeposit and less than or equal to the latest Deposit ID. |
| rejectDepositIds | uint256[] | An array of ids of deposits to exclude. These indices must be greater than lastAnalyzedDeposit and less than or equal to upToDepositId.                |
| gasLimit         | uint256   | The gas limit for the l2 transaction.                                                                                                                  |

### cancelDeposit

```solidity
function cancelDeposit(uint256 depositId, struct DepositLib.Deposit deposit) external
```

Method to cancel a deposit

_The deposit ID and its content should be included in the calldata_

#### Parameters

| Name      | Type                      | Description                     |
| --------- | ------------------------- | ------------------------------- |
| depositId | uint256                   | The ID of the deposit to cancel |
| deposit   | struct DepositLib.Deposit | The deposit data                |

### processWithdrawals

```solidity
function processWithdrawals(uint256 lastProcessedDirectWithdrawalId, struct WithdrawalLib.Withdrawal[] withdrawals, uint256 lastProcessedClaimableWithdrawalId, bytes32[] withdrawalHahes) external
```

Process withdrawals, called by the scroll messenger

#### Parameters

| Name                               | Type                              | Description                                       |
| ---------------------------------- | --------------------------------- | ------------------------------------------------- |
| lastProcessedDirectWithdrawalId    | uint256                           | The ID of the last processed direct withdrawal    |
| withdrawals                        | struct WithdrawalLib.Withdrawal[] | Array of withdrawals to process                   |
| lastProcessedClaimableWithdrawalId | uint256                           | The ID of the last processed claimable withdrawal |
| withdrawalHahes                    | bytes32[]                         | Array of withdrawal hashes                        |

### getLastRelayedDepositId

```solidity
function getLastRelayedDepositId() external view returns (uint256)
```

Get the ID of the last deposit relayed to L2

#### Return Values

| Name | Type    | Description                        |
| ---- | ------- | ---------------------------------- |
| [0]  | uint256 | The ID of the last relayed deposit |

### getDepositData

```solidity
function getDepositData(uint256 depositId) external view returns (struct DepositQueueLib.DepositData)
```

Get deposit data for a given deposit ID

#### Parameters

| Name      | Type    | Description           |
| --------- | ------- | --------------------- |
| depositId | uint256 | The ID of the deposit |

#### Return Values

| Name | Type                               | Description      |
| ---- | ---------------------------------- | ---------------- |
| [0]  | struct DepositQueueLib.DepositData | The deposit data |

### claimWithdrawals

```solidity
function claimWithdrawals(struct WithdrawalLib.Withdrawal[] withdrawals) external
```

Claim withdrawals for tokens that are not direct withdrawals

#### Parameters

| Name        | Type                              | Description                   |
| ----------- | --------------------------------- | ----------------------------- |
| withdrawals | struct WithdrawalLib.Withdrawal[] | Array of withdrawals to claim |

### onERC1155Received

```solidity
function onERC1155Received(address, address, uint256, uint256, bytes) external pure returns (bytes4)
```

ERC1155 token receiver function

#### Return Values

| Name | Type   | Description                  |
| ---- | ------ | ---------------------------- |
| [0]  | bytes4 | bytes4 The function selector |

## ITokenData

### TokenAddressIsZero

```solidity
error TokenAddressIsZero()
```

Error thrown when attempting to use a zero address for a token

### TokenType

Enum representing different token types

```solidity
enum TokenType {
  NATIVE,
  ERC20,
  ERC721,
  ERC1155
}
```

### TokenInfo

Struct containing information about a token

```solidity
struct TokenInfo {
  enum ITokenData.TokenType tokenType;
  address tokenAddress;
  uint256 tokenId;
}
```

### getTokenInfo

```solidity
function getTokenInfo(uint32 tokenIndex) external view returns (struct ITokenData.TokenInfo)
```

Retrieves token information for a given token index

#### Parameters

| Name       | Type   | Description            |
| ---------- | ------ | ---------------------- |
| tokenIndex | uint32 | The index of the token |

#### Return Values

| Name | Type                        | Description                                         |
| ---- | --------------------------- | --------------------------------------------------- |
| [0]  | struct ITokenData.TokenInfo | TokenInfo struct containing the token's information |

### getTokenIndex

```solidity
function getTokenIndex(enum ITokenData.TokenType tokenType, address tokenAddress, uint256 tokenId) external view returns (bool, uint32)
```

Retrieves the token index for given token parameters

#### Parameters

| Name         | Type                      | Description                                                        |
| ------------ | ------------------------- | ------------------------------------------------------------------ |
| tokenType    | enum ITokenData.TokenType | The type of the token (NATIVE, ERC20, ERC721, ERC1155)             |
| tokenAddress | address                   | The address of the token contract (zero address for native tokens) |
| tokenId      | uint256                   | The ID of the token (used for ERC721 and ERC1155)                  |

#### Return Values

| Name | Type   | Description                                       |
| ---- | ------ | ------------------------------------------------- |
| [0]  | bool   | bool Indicating whether the token index was found |
| [1]  | uint32 | uint32 The index of the token if found            |

## Liquidity

### ANALYZER

```solidity
bytes32 ANALYZER
```

Analyzer role constant

### onlyWithdrawal

```solidity
modifier onlyWithdrawal()
```

### initialize

```solidity
function initialize(address _l1ScrollMessenger, address _rollup, address _withdrawal, address _analyzer, address _contribution, address[] initialERC20Tokens) public
```

### depositNativeToken

```solidity
function depositNativeToken(bytes32 recipientSaltHash) external payable
```

Deposit native token

_recipientSaltHash is the Poseidon hash of the intmax2 address (32 bytes) and a secret salt_

#### Parameters

| Name              | Type    | Description                                           |
| ----------------- | ------- | ----------------------------------------------------- |
| recipientSaltHash | bytes32 | The hash of the recipient's address and a secret salt |

### depositERC20

```solidity
function depositERC20(address tokenAddress, bytes32 recipientSaltHash, uint256 amount) external
```

Deposit a specified amount of ERC20 token

_Requires prior approval for this contract to spend the tokens
recipientSaltHash is the Poseidon hash of the intmax2 address (32 bytes) and a secret salt_

#### Parameters

| Name              | Type    | Description                                           |
| ----------------- | ------- | ----------------------------------------------------- |
| tokenAddress      | address | The address of the ERC20 token contract               |
| recipientSaltHash | bytes32 | The hash of the recipient's address and a secret salt |
| amount            | uint256 | The amount of tokens to deposit                       |

### depositERC721

```solidity
function depositERC721(address tokenAddress, bytes32 recipientSaltHash, uint256 tokenId) external
```

Deposit an ERC721 token

_Requires prior approval for this contract to transfer the token_

#### Parameters

| Name              | Type    | Description                                           |
| ----------------- | ------- | ----------------------------------------------------- |
| tokenAddress      | address | The address of the ERC721 token contract              |
| recipientSaltHash | bytes32 | The hash of the recipient's address and a secret salt |
| tokenId           | uint256 | The ID of the token to deposit                        |

### depositERC1155

```solidity
function depositERC1155(address tokenAddress, bytes32 recipientSaltHash, uint256 tokenId, uint256 amount) external
```

Deposit a specified amount of ERC1155 tokens

#### Parameters

| Name              | Type    | Description                                           |
| ----------------- | ------- | ----------------------------------------------------- |
| tokenAddress      | address | The address of the ERC1155 token contract             |
| recipientSaltHash | bytes32 | The hash of the recipient's address and a secret salt |
| tokenId           | uint256 | The ID of the token to deposit                        |
| amount            | uint256 | The amount of tokens to deposit                       |

### analyzeAndRelayDeposits

```solidity
function analyzeAndRelayDeposits(uint256 upToDepositId, uint256[] rejectDepositIds, uint256 gasLimit) external payable
```

Trusted nodes submit the IDs of deposits that do not meet AML standards by this method

_upToDepositId specifies the last deposit id that have been analyzed. It must be greater than lastAnalyzedDeposit and less than or equal to the latest Deposit ID.
rejectDepositIndices must be greater than lastAnalyzedDeposit and less than or equal to upToDepositId._

#### Parameters

| Name             | Type      | Description                                                                                                                                            |
| ---------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| upToDepositId    | uint256   | The upper limit of the Deposit ID that has been analyzed. It must be greater than lastAnalyzedDeposit and less than or equal to the latest Deposit ID. |
| rejectDepositIds | uint256[] | An array of ids of deposits to exclude. These indices must be greater than lastAnalyzedDeposit and less than or equal to upToDepositId.                |
| gasLimit         | uint256   | The gas limit for the l2 transaction.                                                                                                                  |

### claimWithdrawals

```solidity
function claimWithdrawals(struct WithdrawalLib.Withdrawal[] withdrawals) external
```

Claim withdrawals for tokens that are not direct withdrawals

#### Parameters

| Name        | Type                              | Description                   |
| ----------- | --------------------------------- | ----------------------------- |
| withdrawals | struct WithdrawalLib.Withdrawal[] | Array of withdrawals to claim |

### cancelDeposit

```solidity
function cancelDeposit(uint256 depositId, struct DepositLib.Deposit deposit) external
```

Method to cancel a deposit

_The deposit ID and its content should be included in the calldata_

#### Parameters

| Name      | Type                      | Description                     |
| --------- | ------------------------- | ------------------------------- |
| depositId | uint256                   | The ID of the deposit to cancel |
| deposit   | struct DepositLib.Deposit | The deposit data                |

### processWithdrawals

```solidity
function processWithdrawals(uint256 _lastProcessedDirectWithdrawalId, struct WithdrawalLib.Withdrawal[] withdrawals, uint256 _lastProcessedClaimableWithdrawalId, bytes32[] withdrawalHashes) external
```

### onERC1155Received

```solidity
function onERC1155Received(address, address, uint256, uint256, bytes) external pure returns (bytes4)
```

ERC1155 token receiver function

#### Return Values

| Name | Type   | Description                  |
| ---- | ------ | ---------------------------- |
| [0]  | bytes4 | bytes4 The function selector |

### getDepositData

```solidity
function getDepositData(uint256 depositId) external view returns (struct DepositQueueLib.DepositData)
```

Get deposit data for a given deposit ID

#### Parameters

| Name      | Type    | Description           |
| --------- | ------- | --------------------- |
| depositId | uint256 | The ID of the deposit |

#### Return Values

| Name | Type                               | Description      |
| ---- | ---------------------------------- | ---------------- |
| [0]  | struct DepositQueueLib.DepositData | The deposit data |

### getLastRelayedDepositId

```solidity
function getLastRelayedDepositId() external view returns (uint256)
```

Get the ID of the last deposit relayed to L2

#### Return Values

| Name | Type    | Description                        |
| ---- | ------- | ---------------------------------- |
| [0]  | uint256 | The ID of the last relayed deposit |

### getLastDepositId

```solidity
function getLastDepositId() external view returns (uint256)
```

### \_authorizeUpgrade

```solidity
function _authorizeUpgrade(address) internal
```

## TokenData

### \_\_TokenData_init

```solidity
function __TokenData_init(address[] initialERC20Tokens) public
```

### \_getOrCreateTokenIndex

```solidity
function _getOrCreateTokenIndex(enum ITokenData.TokenType tokenType, address tokenAddress, uint256 tokenId) internal returns (uint32)
```

### \_getNativeTokenIndex

```solidity
function _getNativeTokenIndex() internal view returns (uint32)
```

### getTokenIndex

```solidity
function getTokenIndex(enum ITokenData.TokenType tokenType, address tokenAddress, uint256 tokenId) public view returns (bool, uint32)
```

Retrieves the token index for given token parameters

#### Parameters

| Name         | Type                      | Description                                                        |
| ------------ | ------------------------- | ------------------------------------------------------------------ |
| tokenType    | enum ITokenData.TokenType | The type of the token (NATIVE, ERC20, ERC721, ERC1155)             |
| tokenAddress | address                   | The address of the token contract (zero address for native tokens) |
| tokenId      | uint256                   | The ID of the token (used for ERC721 and ERC1155)                  |

#### Return Values

| Name | Type   | Description                                       |
| ---- | ------ | ------------------------------------------------- |
| [0]  | bool   | bool Indicating whether the token index was found |
| [1]  | uint32 | uint32 The index of the token if found            |

### getTokenInfo

```solidity
function getTokenInfo(uint32 tokenIndex) public view returns (struct ITokenData.TokenInfo)
```

Retrieves token information for a given token index

#### Parameters

| Name       | Type   | Description            |
| ---------- | ------ | ---------------------- |
| tokenIndex | uint32 | The index of the token |

#### Return Values

| Name | Type                        | Description                                         |
| ---- | --------------------------- | --------------------------------------------------- |
| [0]  | struct ITokenData.TokenInfo | TokenInfo struct containing the token's information |

## DepositQueueLib

A library for managing a queue of pending deposits

### TriedAnalyzeNotExists

```solidity
error TriedAnalyzeNotExists(uint256 upToDepositId, uint256 lastDepositId)
```

Error thrown when trying to analyze a non-existent deposit

#### Parameters

| Name          | Type    | Description                               |
| ------------- | ------- | ----------------------------------------- |
| upToDepositId | uint256 | The requested deposit ID to analyze up to |
| lastDepositId | uint256 | The last valid deposit ID in the queue    |

### TriedToRejectOutOfRange

```solidity
error TriedToRejectOutOfRange(uint256 rejectIndex, uint256 front, uint256 upToDepositId)
```

Error thrown when trying to reject a deposit outside the analyzed range

#### Parameters

| Name          | Type    | Description                             |
| ------------- | ------- | --------------------------------------- |
| rejectIndex   | uint256 | The index of the deposit to be rejected |
| front         | uint256 | The front index of the queue            |
| upToDepositId | uint256 | The upper bound of the analyzed range   |

### DepositQueue

Represents a queue of pending deposits

```solidity
struct DepositQueue {
  struct DepositQueueLib.DepositData[] depositData;
  uint256 front;
  uint256 rear;
}
```

### DepositData

Represents data for a single deposit

_Includes deposit hash, sender address, and rejection status_

```solidity
struct DepositData {
  bytes32 depositHash;
  address sender;
  bool isRejected;
}
```

### initialize

```solidity
function initialize(struct DepositQueueLib.DepositQueue depositQueue) internal
```

Initializes the deposit queue

_Pushes a dummy element to make the queue 1-indexed_

#### Parameters

| Name         | Type                                | Description                                      |
| ------------ | ----------------------------------- | ------------------------------------------------ |
| depositQueue | struct DepositQueueLib.DepositQueue | The storage reference to the DepositQueue struct |

### enqueue

```solidity
function enqueue(struct DepositQueueLib.DepositQueue depositQueue, bytes32 depositHash, address sender) internal returns (uint256 depositId)
```

Adds a new deposit to the queue

#### Parameters

| Name         | Type                                | Description                                      |
| ------------ | ----------------------------------- | ------------------------------------------------ |
| depositQueue | struct DepositQueueLib.DepositQueue | The storage reference to the DepositQueue struct |
| depositHash  | bytes32                             | The hash of the deposit                          |
| sender       | address                             | The address of the depositor                     |

#### Return Values

| Name      | Type    | Description                       |
| --------- | ------- | --------------------------------- |
| depositId | uint256 | The ID of the newly added deposit |

### deleteDeposit

```solidity
function deleteDeposit(struct DepositQueueLib.DepositQueue depositQueue, uint256 depositId) internal returns (struct DepositQueueLib.DepositData depositData)
```

Deletes a deposit from the queue

#### Parameters

| Name         | Type                                | Description                                      |
| ------------ | ----------------------------------- | ------------------------------------------------ |
| depositQueue | struct DepositQueueLib.DepositQueue | The storage reference to the DepositQueue struct |
| depositId    | uint256                             | The ID of the deposit to be deleted              |

#### Return Values

| Name        | Type                               | Description                     |
| ----------- | ---------------------------------- | ------------------------------- |
| depositData | struct DepositQueueLib.DepositData | The data of the deleted deposit |

### analyze

```solidity
function analyze(struct DepositQueueLib.DepositQueue depositQueue, uint256 upToDepositId, uint256[] rejectIndices) internal returns (bytes32[])
```

Analyzes deposits in the queue, marking some as rejected

_Collects deposit hashes from front to upToDepositId, skipping rejected ones_

#### Parameters

| Name          | Type                                | Description                                      |
| ------------- | ----------------------------------- | ------------------------------------------------ |
| depositQueue  | struct DepositQueueLib.DepositQueue | The storage reference to the DepositQueue struct |
| upToDepositId | uint256                             | The upper bound deposit ID for analysis          |
| rejectIndices | uint256[]                           | Array of deposit IDs to be marked as rejected    |

#### Return Values

| Name | Type      | Description                                       |
| ---- | --------- | ------------------------------------------------- |
| [0]  | bytes32[] | An array of deposit hashes that were not rejected |

### size

```solidity
function size(struct DepositQueueLib.DepositQueue depositQueue) internal pure returns (uint256)
```

Returns the size of the deposit queue

#### Parameters

| Name         | Type                                | Description                                     |
| ------------ | ----------------------------------- | ----------------------------------------------- |
| depositQueue | struct DepositQueueLib.DepositQueue | The memory reference to the DepositQueue struct |

#### Return Values

| Name | Type    | Description                         |
| ---- | ------- | ----------------------------------- |
| [0]  | uint256 | The number of deposits in the queue |

## IRollup

Interface for the Rollup contract

### OnlyScrollMessenger

```solidity
error OnlyScrollMessenger()
```

Error thrown when a non-ScrollMessenger calls a function restricted to ScrollMessenger

### OnlyLiquidity

```solidity
error OnlyLiquidity()
```

Error thrown when the xDomainMessageSender in ScrollMessenger is not the liquidity contract

### TooManySenderPublicKeys

```solidity
error TooManySenderPublicKeys()
```

Error thrown when the number of public keys exceeds 128

### TooManyAccountIds

```solidity
error TooManyAccountIds()
```

Error thrown when the number of account IDs exceeds 128

### SenderAccountIdsInvalidLength

```solidity
error SenderAccountIdsInvalidLength()
```

Error thrown when the length of account IDs bytes is not a multiple of 5

### PairingCheckFailed

```solidity
error PairingCheckFailed()
```

Error thrown when the posted block fails the pairing test

### BlockNumberOutOfRange

```solidity
error BlockNumberOutOfRange()
```

Error thrown when the specified block number is greater than the latest block number

### InvalidBlockBuilder

```solidity
error InvalidBlockBuilder()
```

Error thrown when the block poster is not a valid block builder

### DepositsProcessed

```solidity
event DepositsProcessed(uint256 lastProcessedDepositId, bytes32 depositTreeRoot)
```

Event emitted when deposits bridged from the liquidity contract are processed

#### Parameters

| Name                   | Type    | Description                                   |
| ---------------------- | ------- | --------------------------------------------- |
| lastProcessedDepositId | uint256 | The ID of the last processed deposit          |
| depositTreeRoot        | bytes32 | The root of the deposit tree after processing |

### BlockPosted

```solidity
event BlockPosted(bytes32 prevBlockHash, address blockBuilder, uint256 blockNumber, bytes32 depositTreeRoot, bytes32 signatureHash)
```

Event emitted when a new block is posted

#### Parameters

| Name            | Type    | Description                      |
| --------------- | ------- | -------------------------------- |
| prevBlockHash   | bytes32 | The hash of the previous block   |
| blockBuilder    | address | The address of the block builder |
| blockNumber     | uint256 | The number of the posted block   |
| depositTreeRoot | bytes32 | The root of the deposit tree     |
| signatureHash   | bytes32 | The hash of the signature        |

### PubKeysPosted

```solidity
event PubKeysPosted(uint256 blockNumber, uint256[] senderPublicKeys)
```

Event emitted to ensure data availability of posted public keys

#### Parameters

| Name             | Type      | Description                                      |
| ---------------- | --------- | ------------------------------------------------ |
| blockNumber      | uint256   | The block number associated with the public keys |
| senderPublicKeys | uint256[] | The array of sender public keys                  |

### AccountIdsPosted

```solidity
event AccountIdsPosted(uint256 blockNumber, bytes accountIds)
```

Event emitted to ensure data availability of posted account IDs

#### Parameters

| Name        | Type    | Description                                      |
| ----------- | ------- | ------------------------------------------------ |
| blockNumber | uint256 | The block number associated with the account IDs |
| accountIds  | bytes   | The byte sequence of account IDs                 |

### postRegistrationBlock

```solidity
function postRegistrationBlock(bytes32 txTreeRoot, bytes16 senderFlags, bytes32[2] aggregatedPublicKey, bytes32[4] aggregatedSignature, bytes32[4] messagePoint, uint256[] senderPublicKeys) external
```

Posts a registration block (for all senders' first transactions, specified by public keys)

_The function caller must have staked in the block builder registry beforehand_

#### Parameters

| Name                | Type       | Description                                                                           |
| ------------------- | ---------- | ------------------------------------------------------------------------------------- |
| txTreeRoot          | bytes32    | The root of the transaction tree                                                      |
| senderFlags         | bytes16    | Flags indicating whether senders' signatures are included in the aggregated signature |
| aggregatedPublicKey | bytes32[2] | The aggregated public key                                                             |
| aggregatedSignature | bytes32[4] | The aggregated signature                                                              |
| messagePoint        | bytes32[4] | The hash of the tx tree root to G2                                                    |
| senderPublicKeys    | uint256[]  | The public keys of the senders                                                        |

### postNonRegistrationBlock

```solidity
function postNonRegistrationBlock(bytes32 txTreeRoot, bytes16 senderFlags, bytes32[2] aggregatedPublicKey, bytes32[4] aggregatedSignature, bytes32[4] messagePoint, bytes32 publicKeysHash, bytes senderAccountIds) external
```

Posts a non-registration block (for all senders' subsequent transactions, specified by account IDs)

_The function caller must have staked in the block builder registry beforehand_

#### Parameters

| Name                | Type       | Description                                 |
| ------------------- | ---------- | ------------------------------------------- |
| txTreeRoot          | bytes32    | The root of the transaction tree            |
| senderFlags         | bytes16    | Sender flags                                |
| aggregatedPublicKey | bytes32[2] | The aggregated public key                   |
| aggregatedSignature | bytes32[4] | The aggregated signature                    |
| messagePoint        | bytes32[4] | The hash of the tx tree root to G2          |
| publicKeysHash      | bytes32    | The hash of the public keys                 |
| senderAccountIds    | bytes      | The account IDs arranged in a byte sequence |

### processDeposits

```solidity
function processDeposits(uint256 lastProcessedDepositId, bytes32[] depositHashes) external
```

Update the deposit tree branch and root

_Only Liquidity contract can call this function via Scroll Messenger_

#### Parameters

| Name                   | Type      | Description                          |
| ---------------------- | --------- | ------------------------------------ |
| lastProcessedDepositId | uint256   | The ID of the last processed deposit |
| depositHashes          | bytes32[] | The hashes of the deposits           |

### getLatestBlockNumber

```solidity
function getLatestBlockNumber() external view returns (uint32)
```

Get the block number of the latest posted block

#### Return Values

| Name | Type   | Description             |
| ---- | ------ | ----------------------- |
| [0]  | uint32 | The latest block number |

### getBlockBuilder

```solidity
function getBlockBuilder(uint32 blockNumber) external view returns (address)
```

Get the block builder for a specific block number

#### Parameters

| Name        | Type   | Description               |
| ----------- | ------ | ------------------------- |
| blockNumber | uint32 | The block number to query |

#### Return Values

| Name | Type    | Description                      |
| ---- | ------- | -------------------------------- |
| [0]  | address | The address of the block builder |

### getBlockHash

```solidity
function getBlockHash(uint32 blockNumber) external view returns (bytes32)
```

Get the block hash for a specific block number

#### Parameters

| Name        | Type   | Description               |
| ----------- | ------ | ------------------------- |
| blockNumber | uint32 | The block number to query |

#### Return Values

| Name | Type    | Description                     |
| ---- | ------- | ------------------------------- |
| [0]  | bytes32 | The hash of the specified block |

## Rollup

### lastProcessedDepositId

```solidity
uint256 lastProcessedDepositId
```

### blockHashes

```solidity
bytes32[] blockHashes
```

### blockBuilders

```solidity
address[] blockBuilders
```

### depositTreeRoot

```solidity
bytes32 depositTreeRoot
```

### onlyLiquidityContract

```solidity
modifier onlyLiquidityContract()
```

### initialize

```solidity
function initialize(address _scrollMessenger, address _liquidity, address _blockBuilderRegistry, address _contribution) public
```

### postRegistrationBlock

```solidity
function postRegistrationBlock(bytes32 txTreeRoot, bytes16 senderFlags, bytes32[2] aggregatedPublicKey, bytes32[4] aggregatedSignature, bytes32[4] messagePoint, uint256[] senderPublicKeys) external
```

Posts a registration block (for all senders' first transactions, specified by public keys)

_The function caller must have staked in the block builder registry beforehand_

#### Parameters

| Name                | Type       | Description                                                                           |
| ------------------- | ---------- | ------------------------------------------------------------------------------------- |
| txTreeRoot          | bytes32    | The root of the transaction tree                                                      |
| senderFlags         | bytes16    | Flags indicating whether senders' signatures are included in the aggregated signature |
| aggregatedPublicKey | bytes32[2] | The aggregated public key                                                             |
| aggregatedSignature | bytes32[4] | The aggregated signature                                                              |
| messagePoint        | bytes32[4] | The hash of the tx tree root to G2                                                    |
| senderPublicKeys    | uint256[]  | The public keys of the senders                                                        |

### postNonRegistrationBlock

```solidity
function postNonRegistrationBlock(bytes32 txTreeRoot, bytes16 senderFlags, bytes32[2] aggregatedPublicKey, bytes32[4] aggregatedSignature, bytes32[4] messagePoint, bytes32 publicKeysHash, bytes senderAccountIds) external
```

Posts a non-registration block (for all senders' subsequent transactions, specified by account IDs)

_The function caller must have staked in the block builder registry beforehand_

#### Parameters

| Name                | Type       | Description                                 |
| ------------------- | ---------- | ------------------------------------------- |
| txTreeRoot          | bytes32    | The root of the transaction tree            |
| senderFlags         | bytes16    | Sender flags                                |
| aggregatedPublicKey | bytes32[2] | The aggregated public key                   |
| aggregatedSignature | bytes32[4] | The aggregated signature                    |
| messagePoint        | bytes32[4] | The hash of the tx tree root to G2          |
| publicKeysHash      | bytes32    | The hash of the public keys                 |
| senderAccountIds    | bytes      | The account IDs arranged in a byte sequence |

### processDeposits

```solidity
function processDeposits(uint256 _lastProcessedDepositId, bytes32[] depositHashes) external
```

### getLatestBlockNumber

```solidity
function getLatestBlockNumber() external view returns (uint32)
```

Get the block number of the latest posted block

#### Return Values

| Name | Type   | Description             |
| ---- | ------ | ----------------------- |
| [0]  | uint32 | The latest block number |

### getBlockBuilder

```solidity
function getBlockBuilder(uint32 blockNumber) external view returns (address)
```

Get the block builder for a specific block number

#### Parameters

| Name        | Type   | Description               |
| ----------- | ------ | ------------------------- |
| blockNumber | uint32 | The block number to query |

#### Return Values

| Name | Type    | Description                      |
| ---- | ------- | -------------------------------- |
| [0]  | address | The address of the block builder |

### getBlockHash

```solidity
function getBlockHash(uint32 blockNumber) external view returns (bytes32)
```

Get the block hash for a specific block number

#### Parameters

| Name        | Type   | Description               |
| ----------- | ------ | ------------------------- |
| blockNumber | uint32 | The block number to query |

#### Return Values

| Name | Type    | Description                     |
| ---- | ------- | ------------------------------- |
| [0]  | bytes32 | The hash of the specified block |

### \_authorizeUpgrade

```solidity
function _authorizeUpgrade(address) internal
```

## BlockHashLib

### pushGenesisBlockHash

```solidity
function pushGenesisBlockHash(bytes32[] blockHashes, bytes32 initialDepositTreeRoot) internal
```

Pushes the genesis block hash to the block hashes array

#### Parameters

| Name                   | Type      | Description                                         |
| ---------------------- | --------- | --------------------------------------------------- |
| blockHashes            | bytes32[] | The storage array of block hashes                   |
| initialDepositTreeRoot | bytes32   | The initial deposit tree root for the genesis block |

### getBlockNumber

```solidity
function getBlockNumber(bytes32[] blockHashes) internal pure returns (uint32)
```

Gets the current block number based on the number of block hashes

#### Parameters

| Name        | Type      | Description                      |
| ----------- | --------- | -------------------------------- |
| blockHashes | bytes32[] | The memory array of block hashes |

#### Return Values

| Name | Type   | Description              |
| ---- | ------ | ------------------------ |
| [0]  | uint32 | The current block number |

### getPrevHash

```solidity
function getPrevHash(bytes32[] blockHashes) internal pure returns (bytes32)
```

Gets the hash of the previous block

#### Parameters

| Name        | Type      | Description                      |
| ----------- | --------- | -------------------------------- |
| blockHashes | bytes32[] | The memory array of block hashes |

#### Return Values

| Name | Type    | Description                    |
| ---- | ------- | ------------------------------ |
| [0]  | bytes32 | The hash of the previous block |

### pushBlockHash

```solidity
function pushBlockHash(bytes32[] blockHashes, bytes32 depositTreeRoot, bytes32 signatureHash) internal returns (bytes32 blockHash)
```

Pushes a new block hash to the block hashes array

#### Parameters

| Name            | Type      | Description                             |
| --------------- | --------- | --------------------------------------- |
| blockHashes     | bytes32[] | The storage array of block hashes       |
| depositTreeRoot | bytes32   | The deposit tree root for the new block |
| signatureHash   | bytes32   | The signature hash for the new block    |

#### Return Values

| Name      | Type    | Description                                |
| --------- | ------- | ------------------------------------------ |
| blockHash | bytes32 | The newly calculated and pushed block hash |

## DepositTreeLib

Library for managing a sparse Merkle tree for deposits

_Based on https://github.com/0xPolygonHermez/zkevm-contracts/blob/main/contracts/lib/DepositContract.sol_

### MerkleTreeFull

```solidity
error MerkleTreeFull()
```

Error thrown when the Merkle tree is full

### \_DEPOSIT_CONTRACT_TREE_DEPTH

```solidity
uint256 _DEPOSIT_CONTRACT_TREE_DEPTH
```

_Depth of the Merkle tree_

### DepositTree

Structure representing the deposit tree

```solidity
struct DepositTree {
  bytes32[32] _branch;
  uint256 depositCount;
  bytes32 defaultHash;
}
```

### \_MAX_DEPOSIT_COUNT

```solidity
uint256 _MAX_DEPOSIT_COUNT
```

_Maximum number of deposits (ensures depositCount fits into 32 bits)_

### initialize

```solidity
function initialize(struct DepositTreeLib.DepositTree depositTree) internal
```

Initializes the deposit tree

#### Parameters

| Name        | Type                              | Description                                     |
| ----------- | --------------------------------- | ----------------------------------------------- |
| depositTree | struct DepositTreeLib.DepositTree | The storage reference to the DepositTree struct |

### getRoot

```solidity
function getRoot(struct DepositTreeLib.DepositTree depositTree) internal pure returns (bytes32)
```

Computes and returns the Merkle root

#### Parameters

| Name        | Type                              | Description                                    |
| ----------- | --------------------------------- | ---------------------------------------------- |
| depositTree | struct DepositTreeLib.DepositTree | The memory reference to the DepositTree struct |

#### Return Values

| Name | Type    | Description              |
| ---- | ------- | ------------------------ |
| [0]  | bytes32 | The computed Merkle root |

### deposit

```solidity
function deposit(struct DepositTreeLib.DepositTree depositTree, bytes32 leafHash) internal
```

Adds a new leaf to the Merkle tree

#### Parameters

| Name        | Type                              | Description                                     |
| ----------- | --------------------------------- | ----------------------------------------------- |
| depositTree | struct DepositTreeLib.DepositTree | The storage reference to the DepositTree struct |
| leafHash    | bytes32                           | The hash of the new leaf to be added            |

### getBranch

```solidity
function getBranch(struct DepositTreeLib.DepositTree depositTree) internal view returns (bytes32[32])
```

Retrieves the current branch of the Merkle tree

#### Parameters

| Name        | Type                              | Description                                     |
| ----------- | --------------------------------- | ----------------------------------------------- |
| depositTree | struct DepositTreeLib.DepositTree | The storage reference to the DepositTree struct |

#### Return Values

| Name | Type        | Description                           |
| ---- | ----------- | ------------------------------------- |
| [0]  | bytes32[32] | The current branch of the Merkle tree |

## PairingLib

### PairingOpCodeFailed

```solidity
error PairingOpCodeFailed()
```

Error thrown when the pairing operation fails

### NEG_G1_X

```solidity
uint256 NEG_G1_X
```

_X-coordinate of the negated generator point G1_

### NEG_G1_Y

```solidity
uint256 NEG_G1_Y
```

_Y-coordinate of the negated generator point G1_

### pairing

```solidity
function pairing(bytes32[2] aggregatedPublicKey, bytes32[4] aggregatedSignature, bytes32[4] messagePoint) internal view returns (bool)
```

Performs an elliptic curve pairing operation

#### Parameters

| Name                | Type       | Description                                    |
| ------------------- | ---------- | ---------------------------------------------- |
| aggregatedPublicKey | bytes32[2] | The aggregated public key (2 32-byte elements) |
| aggregatedSignature | bytes32[4] | The aggregated signature (4 32-byte elements)  |
| messagePoint        | bytes32[4] | The message point (4 32-byte elements)         |

#### Return Values

| Name | Type | Description                                        |
| ---- | ---- | -------------------------------------------------- |
| [0]  | bool | bool True if the pairing is valid, false otherwise |

## IWithdrawal

### WithdrawalChainVerificationFailed

```solidity
error WithdrawalChainVerificationFailed()
```

Error thrown when the verification of the withdrawal proof's public input hash chain fails

### WithdrawalAggregatorMismatch

```solidity
error WithdrawalAggregatorMismatch()
```

Error thrown when the aggregator in the withdrawal proof's public input doesn't match the actual contract executor

### BlockHashNotExists

```solidity
error BlockHashNotExists(bytes32 blockHash)
```

Error thrown when the block hash in the withdrawal proof's public input doesn't exist

#### Parameters

| Name      | Type    | Description                 |
| --------- | ------- | --------------------------- |
| blockHash | bytes32 | The non-existent block hash |

### WithdrawalProofVerificationFailed

```solidity
error WithdrawalProofVerificationFailed()
```

Error thrown when the ZKP verification of the withdrawal proof fails

### TokenAlreadyExist

```solidity
error TokenAlreadyExist(uint256 tokenIndice)
```

Error thrown when attempting to add a token to direct withdrawal tokens that already exists

#### Parameters

| Name        | Type    | Description                                |
| ----------- | ------- | ------------------------------------------ |
| tokenIndice | uint256 | The index of the token that already exists |

### TokenNotExist

```solidity
error TokenNotExist(uint256 tokenIndice)
```

Error thrown when attempting to remove a non-existent token from direct withdrawal tokens

#### Parameters

| Name        | Type    | Description                         |
| ----------- | ------- | ----------------------------------- |
| tokenIndice | uint256 | The index of the non-existent token |

### ClaimableWithdrawalQueued

```solidity
event ClaimableWithdrawalQueued(uint256 claimableWithdrawalId, address recipient, struct WithdrawalLib.Withdrawal withdrawal)
```

Emitted when a claimable withdrawal is queued

#### Parameters

| Name                  | Type                            | Description                        |
| --------------------- | ------------------------------- | ---------------------------------- |
| claimableWithdrawalId | uint256                         | The ID of the claimable withdrawal |
| recipient             | address                         | The address of the recipient       |
| withdrawal            | struct WithdrawalLib.Withdrawal | The withdrawal details             |

### DirectWithdrawalQueued

```solidity
event DirectWithdrawalQueued(uint256 directWithdrawalId, address recipient, struct WithdrawalLib.Withdrawal withdrawal)
```

Emitted when a direct withdrawal is queued

#### Parameters

| Name               | Type                            | Description                     |
| ------------------ | ------------------------------- | ------------------------------- |
| directWithdrawalId | uint256                         | The ID of the direct withdrawal |
| recipient          | address                         | The address of the recipient    |
| withdrawal         | struct WithdrawalLib.Withdrawal | The withdrawal details          |

### WithdrawalsQueued

```solidity
event WithdrawalsQueued(uint256 lastDirectWithdrawalId, uint256 lastClaimableWithdrawalId)
```

Emitted when withdrawals are queued

#### Parameters

| Name                      | Type    | Description                             |
| ------------------------- | ------- | --------------------------------------- |
| lastDirectWithdrawalId    | uint256 | The ID of the last direct withdrawal    |
| lastClaimableWithdrawalId | uint256 | The ID of the last claimable withdrawal |

### submitWithdrawalProof

```solidity
function submitWithdrawalProof(struct ChainedWithdrawalLib.ChainedWithdrawal[] withdrawals, struct WithdrawalProofPublicInputsLib.WithdrawalProofPublicInputs publicInputs, bytes proof) external
```

Submit withdrawal proof from intmax2

#### Parameters

| Name         | Type                                                              | Description                            |
| ------------ | ----------------------------------------------------------------- | -------------------------------------- |
| withdrawals  | struct ChainedWithdrawalLib.ChainedWithdrawal[]                   | List of chained withdrawals            |
| publicInputs | struct WithdrawalProofPublicInputsLib.WithdrawalProofPublicInputs | Public inputs for the withdrawal proof |
| proof        | bytes                                                             | The proof data                         |

### getDirectWithdrawalTokenIndices

```solidity
function getDirectWithdrawalTokenIndices() external view returns (uint256[])
```

Get the token indices for direct withdrawals

#### Return Values

| Name | Type      | Description               |
| ---- | --------- | ------------------------- |
| [0]  | uint256[] | An array of token indices |

### addDirectWithdrawalTokenIndices

```solidity
function addDirectWithdrawalTokenIndices(uint256[] tokenIndices) external
```

Add token indices to the list of direct withdrawal token indices

#### Parameters

| Name         | Type      | Description              |
| ------------ | --------- | ------------------------ |
| tokenIndices | uint256[] | The token indices to add |

### removeDirectWithdrawalTokenIndices

```solidity
function removeDirectWithdrawalTokenIndices(uint256[] tokenIndices) external
```

Remove token indices from the list of direct withdrawal token indices

#### Parameters

| Name         | Type      | Description                 |
| ------------ | --------- | --------------------------- |
| tokenIndices | uint256[] | The token indices to remove |

## Withdrawal

### directWithdrawalTokenIndices

```solidity
struct EnumerableSet.UintSet directWithdrawalTokenIndices
```

### lastDirectWithdrawalId

```solidity
uint256 lastDirectWithdrawalId
```

### lastClaimableWithdrawalId

```solidity
uint256 lastClaimableWithdrawalId
```

### initialize

```solidity
function initialize(address _scrollMessenger, address _withdrawalVerifier, address _liquidity, address _rollup, address _contribution, uint256[] _directWithdrawalTokenIndices) public
```

### submitWithdrawalProof

```solidity
function submitWithdrawalProof(struct ChainedWithdrawalLib.ChainedWithdrawal[] withdrawals, struct WithdrawalProofPublicInputsLib.WithdrawalProofPublicInputs publicInputs, bytes proof) external
```

Submit withdrawal proof from intmax2

#### Parameters

| Name         | Type                                                              | Description                            |
| ------------ | ----------------------------------------------------------------- | -------------------------------------- |
| withdrawals  | struct ChainedWithdrawalLib.ChainedWithdrawal[]                   | List of chained withdrawals            |
| publicInputs | struct WithdrawalProofPublicInputsLib.WithdrawalProofPublicInputs | Public inputs for the withdrawal proof |
| proof        | bytes                                                             | The proof data                         |

### getDirectWithdrawalTokenIndices

```solidity
function getDirectWithdrawalTokenIndices() external view returns (uint256[])
```

Get the token indices for direct withdrawals

#### Return Values

| Name | Type      | Description               |
| ---- | --------- | ------------------------- |
| [0]  | uint256[] | An array of token indices |

### addDirectWithdrawalTokenIndices

```solidity
function addDirectWithdrawalTokenIndices(uint256[] tokenIndices) external
```

Add token indices to the list of direct withdrawal token indices

#### Parameters

| Name         | Type      | Description              |
| ------------ | --------- | ------------------------ |
| tokenIndices | uint256[] | The token indices to add |

### removeDirectWithdrawalTokenIndices

```solidity
function removeDirectWithdrawalTokenIndices(uint256[] tokenIndices) external
```

Remove token indices from the list of direct withdrawal token indices

#### Parameters

| Name         | Type      | Description                 |
| ------------ | --------- | --------------------------- |
| tokenIndices | uint256[] | The token indices to remove |

### \_authorizeUpgrade

```solidity
function _authorizeUpgrade(address) internal
```

## ChainedWithdrawalLib

Library for handling chained withdrawals in a hash chain

### ChainedWithdrawal

Represents a withdrawal linked in a hash chain, used in withdrawal proof public inputs

```solidity
struct ChainedWithdrawal {
  address recipient;
  uint32 tokenIndex;
  uint256 amount;
  bytes32 nullifier;
  bytes32 blockHash;
  uint32 blockNumber;
}
```

### verifyWithdrawalChain

```solidity
function verifyWithdrawalChain(struct ChainedWithdrawalLib.ChainedWithdrawal[] withdrawals, bytes32 lastWithdrawalHash) internal pure returns (bool)
```

Verifies the integrity of a withdrawal hash chain

#### Parameters

| Name               | Type                                            | Description                                           |
| ------------------ | ----------------------------------------------- | ----------------------------------------------------- |
| withdrawals        | struct ChainedWithdrawalLib.ChainedWithdrawal[] | Array of ChainedWithdrawals to verify                 |
| lastWithdrawalHash | bytes32                                         | The expected hash of the last withdrawal in the chain |

#### Return Values

| Name | Type | Description                                      |
| ---- | ---- | ------------------------------------------------ |
| [0]  | bool | bool True if the chain is valid, false otherwise |

## WithdrawalProofPublicInputsLib

### WithdrawalProofPublicInputs

Represents the public inputs for a withdrawal proof

```solidity
struct WithdrawalProofPublicInputs {
  bytes32 lastWithdrawalHash;
  address withdrawalAggregator;
}
```

### getHash

```solidity
function getHash(struct WithdrawalProofPublicInputsLib.WithdrawalProofPublicInputs inputs) internal pure returns (bytes32)
```

Computes the hash of the WithdrawalProofPublicInputs

#### Parameters

| Name   | Type                                                              | Description                                  |
| ------ | ----------------------------------------------------------------- | -------------------------------------------- |
| inputs | struct WithdrawalProofPublicInputsLib.WithdrawalProofPublicInputs | The WithdrawalProofPublicInputs to be hashed |

#### Return Values

| Name | Type    | Description                |
| ---- | ------- | -------------------------- |
| [0]  | bytes32 | bytes32 The resulting hash |
