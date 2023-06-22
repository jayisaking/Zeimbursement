# Zeimbursement System Contracts
This folder contains three contracts: *[Zeimbursement.sol](contracts/Zeimbursement.sol)*, *[ECDSAVerifier.sol](contracts/ECDSAVerifier.sol)*, *[RSAVerifier.sol](contracts/RSAVerifier.sol)*

The *..Verifier* is included in *[Zeimbursement.sol](contracts/Zeimbursement.sol)*. They are used to verify proof that is uploaded.

1. Installation
    ```
    npm install
    ```
2. Test
    ```
    npx hardhat test
    ```
3. Deploy
   
   To deploy, you need to create a new .env with following items in Goerli
    ```
    API_URL = 
    API_KEY = 
    PRIVATE_KEY = 
    ETHERSCAN_API_KEY = 
    MY_ADDRESS = 
    ```
    Then run
    ```
    npx hardhat run --network goerli  ./scripts/deploy.js
    ```    
    You can add and change networks in [hardhat.config.js](./hardhat.config.js) on you own
