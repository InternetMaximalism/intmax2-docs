---
sidebar_position: 6
---

# Other Features

## Withdraw rest amount

When mining is completed, a small amount of ETH (roughly equivalent to the gas fee) may remain in the address.
This can occur especially if the withdrawal was executed when Ethereum gas fees were high.
Below is an explanation of the procedure to withdraw this remaining ETH.

1. If there is more ETH remaining than the gas fee in the address used for mining, a "Withdraw Rest Amount" button will be displayed.
   If you wish to withdraw this amount, please click the "Withdraw Rest Amount" button.

<figure><img src="/img/user-guides/other_features_10.webp" alt="Withdraw Rest Amount" /></figure>

2. The withdrawal destination address can only be the same as the one used previously.
You cannot choose a different address freely.

<figure><img src="/img/user-guides/other_features_20.webp" alt="Withdraw Rest Amount" /></figure>

3. Review the transaction details and click the "Confirm" button.

<figure><img src="/img/user-guides/other_features_30.webp" alt="Withdraw Rest Amount" /></figure>

4. Wait until the status changes to "Sync Withdrawals".

<figure><img src="/img/user-guides/other_features_40.webp" alt="Withdraw Rest Amount" /></figure>

5. Once the status is "Completed," you can safely leave the screen.

<figure><img src="/img/user-guides/other_features_50.webp" alt="Withdraw Rest Amount" /></figure>

**NOTE**: If you close the screen during the process, please start over from the beginning of the procedure.

## Cancel Mining

You can cancel a mining session even before the lock period has matured. However, please note that if you cancel, **no rewards will be granted**, and only the deposited ETH will be returned.

1. First, click the **"Cancel Mining Session"** button.

2. A confirmation dialog will then appear, warning you that if the lock period has not yet ended, you may lose the chance to receive rewards.
By selecting **"Yes, Proceed"**, the cancellation process will continue, and you will be redirected to the withdrawal screen.

<figure>
  <img src="/img/user-guides/cancel_mining_10.webp" alt="Cancel Mining" />
  <img src="/img/user-guides/cancel_mining_20.webp" alt="Cancel Mining" />
</figure>

3. Here, you can enter the destination Ethereum address and click the **"Cancel + Withdrawal"** button to withdraw the deposited ETH.

<figure><img src="/img/user-guides/cancel_mining_30.webp" alt="Cancel Mining" /></figure>

## Withdraw ETH to a Contract Address

We would like to provide a clear explanation the procedure for withdrawing ETH to a contract address in mining.

### :warning: **Important Notice**

When specifying a withdrawal destination address, please make sure that it is **your own address**.
In particular, specifying a **contract address** or an **exchange address** as the withdrawal destination is **not covered by our support**, and we do not take any responsibility in such cases.
If you choose to send ETH to a contract address, please carefully confirm that the contract is able to **receive ETH deposits**.

### 1. Purpose

The purpose of this function is to enable the transfer of ETH that has entered a “withdrawable state” — for example, when attempting to withdraw to a contract address — so that it can actually be sent to the specified address.

**NOTE**: In contrast, when sending to a regular address (EOA), the ETH is delivered directly to the address.

### 2. When the Button Appears

- The button will be displayed when your destination account has a withdrawable ETH balance.
- If you have pending withdrawals, the button will trigger a claim process.

<figure><img src="/img/user-guides/withdraw_eth_to_contract_10.webp" alt="Withdraw ETH" /></figure>

### 3. How the Withdrawal Works

- When you click the button, you will be asked to **sign a transaction with your connected wallet**.
- This operation makes your funds available on Ethereum.

<figure><img src="/img/user-guides/withdraw_eth_to_contract_20.webp" alt="Withdraw ETH" /></figure>
