# NFT Marketplace

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Ethers](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ipfs](https://ipfs.io/) (Metadata storage)
- [React routers](https://v5.reactrouter.com/) (Navigational components)
- [node.js](https://nodejs.org/en) (javascript runtime)
- [mongoDB atlas](https://www.mongodb.com/atlas/database) (local data storage)

## Requirements For Initial Setup

- Install [NodeJS](https://nodejs.org/en/), should work with any node version below 16.5.0
- Install [Hardhat](https://hardhat.org/)
- setup remote [mongoDB atlas](https://www.mongodb.com/atlas/database) database

## Setting Up

### 1. Clone/Download the Repository

### 2. Install Dependencies:

```
$ cd nft_marketplace
$ npm install
$ cd server
$ npm install
```

### 3. Boot up local development blockchain

```
$ cd nft_marketplace
$ npx hardhat node
```

### 4. boot up local node.js server

open another terminal and run below command

```
$ cd server
$ npm run dev
```

### 5. Connect development blockchain accounts to Metamask

- Copy private key of the addresses and import to Metamask
- Connect your metamask to hardhat blockchain, network 127.0.0.1:8545.
- If you have not added hardhat to the list of networks on your metamask, open up a browser, click the fox icon, then click the top center dropdown button that lists all the available networks then click add networks. A form should pop up. For the "Network Name" field enter "Hardhat". For the "New RPC URL" field enter "http://127.0.0.1:8545". For the chain ID enter "31337". Then click save.

### 6. Migrate Smart Contracts

`$ npx hardhat run src/backend/scripts/deploy.js --network localhost`

### 7. Launch Frontend

`$ npm run start`

## License

MIT
