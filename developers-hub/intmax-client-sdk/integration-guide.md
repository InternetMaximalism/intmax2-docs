---
sidebar_position: 1
description: This document provides a practical guide for integrating with the INTMAX network using the intmax2-client-sdk and intmax2-server-sdk, complete with real code examples.
---

# Integration Guide

This document provides a practical guide for integrating with the INTMAX network using the **intmax2-client-sdk and intmax2-server-sdk**, complete with real code examples.

Each section covers key steps—from SDK installation and client initialization to login, token deposits and withdrawals, transaction history retrieval, and signature verification—enabling developers to build applications that leverage INTMAX’s privacy-preserving features with ease.

By following the examples in order, you’ll gain an intuitive understanding of how to effectively use the INTMAX SDK in real-world scenarios.

**Complete Documentation**

For comprehensive documentation and additional resources, visit:

[View Client SDK Reference](./client-sdk-reference.md)

# Getting Started with intmax2-client-sdk

This guide provides step-by-step examples for using the `intmax2-client-sdk` to interact with the INTMAX network. This SDK is primarily intended for use in **frontend applications**. It covers everything from setting up the client, performing login, to managing deposits, withdrawals, and transaction histories.

For the complete example code, please visit our GitHub repository:

[View Vite Example on Github](https://github.com/InternetMaximalism/intmax2-client-sdk/tree/main/examples/vite)

## Example: Vite + React + TypeScript

```bash
npm create vite@latest my-app # Select React and TypeScript
cd my-app
```

### Installation

Install the SDK using your preferred package manager:

```bash
# npm
npm i intmax2-client-sdk

# yarn
yarn add intmax2-client-sdk

# pnpm
pnpm i intmax2-client-sdk
```

### **State Variables**

A lightweight React hook for initializing, authenticating, and tearing down an INTMAX client. First, define the required state variables.

```tsx
import { useState } from "react";

import { IntMaxClient } from "intmax2-client-sdk";

export const useIntMaxClient = () => {
  const [client, setClient] = useState<IntMaxClient | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return { client, isLoggedIn, loading, error };
};
```

| **Variable** | **Purpose**                                      |
| ------------ | ------------------------------------------------ |
| client       | Holds the instantiated **IntMaxClient** or null. |
| isLoggedIn   | true once the user has successfully logged in.   |
| loading      | true while any async action is running.          |
| error        | Last error message; null when there is none.     |

### Initiate Intmax Client

Creates a new Testnet client and stores it in state.

```tsx
import { useCallback } from "react";
import { IntMaxClient } from "intmax2-client-sdk";

const initializeClient = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const newClient = await IntMaxClient.init({
      environment: "testnet",
    });

    setClient(newClient);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to initialize client";
    setError(errorMessage);
    console.error("IntMax Client initialization failed:", err);
  } finally {
    setLoading(false);
  }
}, []);
```

### Log In / Account Recovery

Creates (or recovers) the user’s INTMAX account and flips isLoggedIn to true.

```tsx
const login = useCallback(async () => {
  if (!client) {
    setError("Client not initialized");
    return;
  }

  try {
    setLoading(true);
    setError(null);
    await client.login();
    setIsLoggedIn(true);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Login failed";
    setError(errorMessage);
    console.error("Login failed:", err);
  } finally {
    setLoading(false);
  }
}, [client]);
```

### Log Out / Session Reset

Clears login status locally and invalidates the session on the server.

```tsx
const logout = useCallback(async () => {
  if (!client) return;

  try {
    setLoading(true);
    await client.logout();
    setIsLoggedIn(false);
    setError(null);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Logout failed";
    setError(errorMessage);
    console.error("Logout failed:", err);
  } finally {
    setLoading(false);
  }
}, [client]);
```

### Put Together

The following code is a complete hook:

```tsx
// hooks/useIntMaxClient.tsx
import { useState, useCallback } from "react";
import { IntMaxClient } from "intmax2-client-sdk";

export const useIntMaxClient = () => {
  const [client, setClient] = useState<IntMaxClient | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeClient = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const newClient = await IntMaxClient.init({
        environment: "testnet",
      });

      setClient(newClient);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initialize client";
      setError(errorMessage);
      console.error("IntMax Client initialization failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async () => {
    if (!client) {
      setError("Client not initialized");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await client.login();
      setIsLoggedIn(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  }, [client]);

  const logout = useCallback(async () => {
    if (!client) return;

    try {
      setLoading(true);
      await client.logout();
      setIsLoggedIn(false);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  }, [client]);

  return {
    client,
    isLoggedIn,
    loading,
    error,
    initializeClient,
    login,
    logout,
  };
};
```

The following React component demonstrates how to use the useIntMaxClient hook to manage the INTMAX client within your application.

```tsx
// App.tsx
import { useIntMaxClient } from "./hooks/useIntMaxClient";

function App() {
  const { client, isLoggedIn, loading, error, initializeClient, login, logout } = useIntMaxClient();

  if (loading) {
    return (
      <div>
        <p>Initializing IntMax2 Client...</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div>
          <p>Error: {error}</p>
        </div>
      )}

      {!client ? (
        <div>
          <h2>Welcome to INTMAX Network</h2>
          <p>Initialize the client to get started</p>
          <button onClick={initializeClient} disabled={loading}>
            {loading ? "Initializing..." : "Initialize Client"}
          </button>
        </div>
      ) : !isLoggedIn ? (
        <div>
          <h2>Login to Your Account</h2>
          <p>Connect your INTMAX account to continue</p>
          <button onClick={login} disabled={loading}>
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      ) : (
        <div>
          <div>
            <h2>Your INTMAX Account</h2>
            <p>
              Address: <code>{client.address}</code>
            </p>
          </div>
          <div>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
```

### What’s Next

The **intmax2-client-sdk** also provides functions for deposits, withdrawals, transfers, and querying transaction history. For full details, please refer to the SDK documentation.

[View Client SDK Reference](./client-sdk-reference.md)

## Example: NextJS + TypeScript

Use `create-next-app` to generate a boilerplate for a Next.js application.

Example command:

```bash
npx create-next-app@latest my-app
```

When creating a project with `create-next-app`, please select the option to disable **Turbopack**.

```
✔ Would you like to use TypeScript? … No / Yes <- Select "Yes"
✔ Would you like to use ESLint? … No / Yes <- Select "Yes"
✔ Would you like to use Tailwind CSS? … No / Yes <- Select "Yes"
✔ Would you like your code inside a `src/` directory? … No / Yes <- Select "Yes"
✔ Would you like to use App Router? (recommended) … No / Yes <- Select "Yes"
? Would you like to use Turbopack for `next dev`? › No / Yes <- Select "No"
```

Other settings are optional. Once all configurations are complete, move into the project directory.

```bash
cd my-app
```

Please modify the `next.config.ts` file located in the project root as follows:

```tsx
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
```

### Installation

Install the SDK using your preferred package manager:

```bash
# npm
npm i intmax2-client-sdk

# yarn
yarn add intmax2-client-sdk

# pnpm
pnpm i intmax2-client-sdk
```

### State Variables

A lightweight React hook for initializing, authenticating, and tearing down an INTMAX client. First, define the required state variables.

```tsx
import { useState } from "react";

import { IntMaxClient } from "intmax2-client-sdk";

export const useIntMaxClient = () => {
  const [client, setClient] = useState<IntMaxClient | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return { client, isLoggedIn, loading, error };
};
```

| **Variable** | **Purpose**                                      |
| ------------ | ------------------------------------------------ |
| client       | Holds the instantiated **IntMaxClient** or null. |
| isLoggedIn   | true once the user has successfully logged in.   |
| loading      | true while any async action is running.          |
| error        | Last error message; null when there is none.     |

### Initiate Intmax Client

Creates a new Testnet client and stores it in state.

```tsx
import { useCallback } from "react";
import { IntMaxClient } from "intmax2-client-sdk";

const initializeClient = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const newClient = await IntMaxClient.init({
      environment: "testnet",
    });

    setClient(newClient);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to initialize client";
    setError(errorMessage);
    console.error("IntMax Client initialization failed:", err);
  } finally {
    setLoading(false);
  }
}, []);
```

### Log In / Account Recovery

Creates (or recovers) the user’s INTMAX account and flips isLoggedIn to true.

```tsx
const login = useCallback(async () => {
  if (!client) {
    setError("Client not initialized");
    return;
  }

  try {
    setLoading(true);
    setError(null);
    await client.login();
    setIsLoggedIn(true);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Login failed";
    setError(errorMessage);
    console.error("Login failed:", err);
  } finally {
    setLoading(false);
  }
}, [client]);
```

### Log Out / Session Reset

Clears login status locally and invalidates the session on the server.

```tsx
const logout = useCallback(async () => {
  if (!client) return;

  try {
    setLoading(true);
    await client.logout();
    setIsLoggedIn(false);
    setError(null);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Logout failed";
    setError(errorMessage);
    console.error("Logout failed:", err);
  } finally {
    setLoading(false);
  }
}, [client]);
```

### Put Together

The following code is a complete hook:

```tsx
// src/hooks/useIntMaxClient.tsx
import { useState, useCallback } from "react";
import { IntMaxClient } from "intmax2-client-sdk";

export const useIntMaxClient = () => {
  const [client, setClient] = useState<IntMaxClient | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeClient = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const newClient = await IntMaxClient.init({
        environment: "testnet",
      });

      setClient(newClient);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initialize client";
      setError(errorMessage);
      console.error("IntMax Client initialization failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async () => {
    if (!client) {
      setError("Client not initialized");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await client.login();
      setIsLoggedIn(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  }, [client]);

  const logout = useCallback(async () => {
    if (!client) return;

    try {
      setLoading(true);
      await client.logout();
      setIsLoggedIn(false);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  }, [client]);

  return {
    client,
    isLoggedIn,
    loading,
    error,
    initializeClient,
    login,
    logout,
  };
};
```

The following React component demonstrates how to use the useIntMaxClient hook to manage the INTMAX client within your application.

```tsx
// src/app/page.tsx
import { useIntMaxClient } from '../hooks/useIntMaxClient'

default export function Home() {
  const {
    client,
    isLoggedIn,
    loading,
    error,
    initializeClient,
    login,
    logout
  } = useIntMaxClient()

  if (loading) {
    return (
      <div>
        <p>Initializing IntMax2 Client...</p>
      </div>
    )
  }

  return (
   <div>
      {error && (
        <div>
          <p>Error: {error}</p>
        </div>
      )}

      {!client ? (
        <div>
          <h2>Welcome to INTMAX Network</h2>
          <p>Initialize the client to get started</p>
          <button
            onClick={initializeClient}
            disabled={loading}
          >
            {loading ? 'Initializing...' : 'Initialize Client'}
          </button>
        </div>
      ) : !isLoggedIn ? (
        <div>
          <h2>Login to Your Account</h2>
          <p>Connect your INTMAX account to continue</p>
          <button
         onClick={login}
         disabled={loading}
       >
         {loading ? 'Connecting...' : 'Connect Wallet'}
       </button>
        </div>
      ) : (
        <div>
          <div>
            <h2>Your INTMAX Account</h2>
            <p>
              Address: <code>{client.address}</code>
            </p>
          </div>
          <div>
        <button
          onClick={logout}
        >
          Logout
        </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

### What’s Next

The **intmax2-client-sdk** also provides functions for deposits, withdrawals, transfers, and querying transaction history. For full details, please refer to the SDK documentation.

[INTMAX Client SDK Docs](./client-sdk-reference.md)

## Tips: How to Run a Local Balance Prover

To set up a local Balance Prover instance, please see Tips: [How to Run a Local Balance Prover](https://github.com/InternetMaximalism/intmax2-client-sdk/blob/main/README.md#tips-how-to-run-a-local-balance-prover)

# How to Use intmax2-server-sdk

This guide provides step-by-step examples for using the `intmax2-server-sdk` to interact with the INTMAX network. This SDK is primarily intended for use in **server-side applications** or when writing simple scripts. It covers everything from setting up the client, performing login, to managing deposits, withdrawals, and transaction histories.

## Example: NodeJS (TypeScript)

```bash
mkdir my-app
cd my-app
npm init -y
npm i --save-dev typescript tsx
npm i dotenv
```

### Installation

Install the SDK using your preferred package manager:

```bash
# npm
npm i intmax2-server-sdk

# yarn
yarn add intmax2-server-sdk

# pnpm
pnpm i intmax2-server-sdk
```

### Initiate INTMAX Client

`INTMAXClient` is a core component of the INTMAX SDK that provides seamless interaction with the INTMAX network. This class simplifies the process of integrating applications with the INTMAX network, enabling developers to interact with both the `mainnet` and `testnet` environments effortlessly.

```tsx
import { IntMaxNodeClient } from "intmax2-server-sdk";

const client = new IntMaxNodeClient({
  environment: "testnet",
  eth_private_key: process.env.ETH_PRIVATE_KEY,
  l1_rpc_url: process.env.L1_RPC_URL,
  urls: {
    balance_prover_url: "http://localhost:9001",
    use_private_zkp_server: false, // When using the balance prover locally on localhost, set `use_private_zkp_server` to false.
  }, // (Optional) URL of the balance prover service
});
```

- `environment` (String): The network environment to use (e.g., `testnet` or `mainnet`)
- `eth_private_key` (String): Ethereum private key used for signing transactions
- `l1_rpc_url` (String): RPC endpoint URL for Ethereum (e.g., Infura or Alchemy)

### Log In / Account Recovery

To use other functions in the SDK, it is essential to first log in and retrieve the token balances.
This ensures that the client is synchronized with the user’s current account state.

```tsx
await client.login();
const { balances } = await client.fetchTokenBalances();
```

### Log Out / Session Reset

Clears login status locally and invalidates the session on the server.

```tsx
await client.logout();
```

### Put Together

By using the code below, you have gained access to your account information and balance.

```tsx
import { IntMaxNodeClient } from "intmax2-server-sdk";
import "dotenv/config";

const main = async () => {
  const client = new IntMaxNodeClient({
    environment: "testnet",
    eth_private_key: process.env.ETH_PRIVATE_KEY,
    l1_rpc_url: process.env.L1_RPC_URL,
  });
  await client.login();
  const { balances } = await client.fetchTokenBalances();
  console.log(`Balances of ${client.address}:`);
  console.log(balances);
  await client.logout();
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
```

### Environment Variables

Please specify your `ETH_PRIVATE_KEY` or the Ethereum private key you intend to use.

For `L1_RPC_URL`, if you are using a testnet, specify one that can connect to the Sepolia network.

```bash
# .env
ETH_PRIVATE_KEY="0x..."
L1_RPC_URL="https://sepolia.gateway.tenderly.co"
```

Once you’ve set the environment variables, you can run the following command.

```bash
npx tsx src/index.ts
```

### **What’s Next**

The **intmax2-server-sdk** also provides functions for deposits, withdrawals, transfers, and querying transaction history. For full details, please refer to the SDK documentation.

[View Client SDK Reference](./client-sdk-reference.md)

# Conclusion

This document provides a comprehensive walkthrough for integrating with the INTMAX network using both the intmax2-client-sdk and intmax2-server-sdk. By following the examples in sequence—from initialization and login to deposits, withdrawals, and transaction history—you can efficiently build applications that interact securely and privately with the INTMAX ecosystem.
