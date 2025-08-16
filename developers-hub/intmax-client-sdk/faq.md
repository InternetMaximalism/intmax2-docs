---
sidebar_position: 4
description: A collection of frequently asked questions and answers about the INTMAX Client SDK. This page provides explanations for common developer inquiries regarding account management, fees, transactions, security, privacy, and more.
---

# FAQ

A collection of frequently asked questions and answers about the INTMAX Client SDK. This page provides explanations for common developer inquiries regarding account management, fees, transactions, security, privacy, and more.

### Q. Does the INTMAX network support smart contracts?

No, the INTMAX network does **not** support smart contracts. Instead, interaction with the network is performed through the **Client SDK**, which provides all necessary functionalities for sending transactions, managing assets, and integrating with applications.

### Q. What is “Login” in the context of the INTMAX network?

**Login** is the process of generating an INTMAX address from a given Ethereum account. INTMAX addresses use a different signature scheme from typical EVM chains. Access is performed through an EVM-compatible wallet application in a browser.

### Q. Are an Ethereum address and an INTMAX address the same?

No, they are distinct. For more details, please refer [Account System](./overview#account-system).

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
