---
sidebar_position: 11
---

# Customizing the Look of the Popup/Iframe

When integrating the INTMAX Wallet SDK into your dApp, you might want to customize the appearance of the popup or iframe that users interact with when signing and sending transactions. This includes setting the name, logo, and other metadata to ensure the wallet interface aligns with your brand. Below is an example of how to achieve this using the SDK.

## Example

**Here's how you can customize the look of the popup/iframe:**

1. **Define DApp Metadata**: Set up the metadata for your dApp. This includes the name, description, and icons that will be displayed in the popup/iframe. The icons array can include your custom logo.

   ```javascript
   // Define the default wallet URL for the INTMAX wallet or alternative wallet
   const DEFAULT_WALLET_URL = "https://wallet.intmax.io";

   // Define the path to your preferred icon, assuming the logo.png is in the public folder
   const DEFAULT_DAPP_ICON = `${window.location.origin}/logo.png`;

   const DAPP_METADATA = {
     name: "My Custom DApp", // Use your brand/project name here
     description:
       "This dApp allows users to interact with our custom smart contract.", // Use an appropriate description here
     icons: [DEFAULT_DAPP_ICON], // Use the defined icon path to your icon or logo here
   };
   ```

2. **Customize the SDK Initialization**: When creating the SDK instance, pass in your custom metadata along with the wallet URL. You can also customize the wallet window's appearance by specifying the mode (e.g., `iframe` or `popup`).

   ```javascript
   // Function to create an SDK instance, taking the wallet URL as an argument
   const createsSDK = (walletUrl: string) => {
     return intmaxDappClient({
       wallet: {
         url: walletUrl,
         name: "Custom Wallet", // Name of wallet
         window: { mode: "popup" }, // Choose between 'iframe' or 'popup'
       },
       metadata: DAPP_METADATA, // Pass the DApp metadata
       providers: { eip155: ethereumProvider() }, // Define the Ethereum provider
     });
   };

   const sdk = createsSDK(DEFAULT_WALLET_URL);
   ```

3. **Integrate with Your DApp**: Use the customized SDK instance in your dApp as you would normally. The popup or iframe that appears when the user interacts with the wallet will now reflect your custom branding.

   ```javascript
   const Voting = () => {
     const [accounts, setAccounts] = useState<string[]>([]);

     const handleConnect = async () => {
       const intmaxWalletProvider = sdk.provider("eip155:137"); // 137 is Polygon mainnet network, change to network of choice
       await intmaxWalletProvider.request({ method: "eth_requestAccounts", params: [] });
       const accounts = (await intmaxWalletProvider.request({ method: "eth_accounts", params: [] })) as string[];
       setAccounts(accounts);
     };

     return (
       <div>
         <button onClick={handleConnect}>
           {accounts.length > 0 ? `Connected: ${accounts[0]}` : 'Connect Wallet'}
         </button>
       </div>
     );
   };
   ```

## Important Notes

- **Background and Text Color**: The background and text color of the popup/iframe will be inherited from the wallet integrated into the dApp. This ensures a consistent visual experience across different parts of your application.
- **Customization Options**: You can customize the popup/iframe with your dApp's name, logo, and description by setting these properties in the `DAPP_METADATA` object. The `icons` array should contain the path to your logo image, which will be displayed in the popup/iframe.
- Ensure that `logo.png` is located in the `public` directory of your project. This allows the image to be served correctly using the absolute path.
- The `createsSDK` function can be called with a custom wallet URL or use `DEFAULT_WALLET_URL` as needed.
