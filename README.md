# Secret Bids
Secret Bids is an on-chain privacy-preserving auction platform that allows auctioneers to launch _secret auctions_ to sell their tokens/NFT.

Currently, the platform offers 2 types of on-chain auctions 

- Blind auction: (sealed bid auction) is a type of auction where all bidders commit their offers in sealed envelopes, without knowing the bids of the other participants. The highest bid wins the auction. 

- Lottery auction: is a type of auction where the winning bid is determined randomly


## Demo & Screenshots

[![Secret Bid Demo](https://img.youtube.com/vi/K0nSXa4VyDc/0.jpg)](https://youtu.be/K0nSXa4VyDc)


<img src="https://i.imgur.com/JzkR2zV.png" width="1000px" >

<img src="https://i.imgur.com/WAriF29.png" width="1000px" >


## Technical stack
Secret Bids includes 3 main parts:

**1. Contracts**: 

- Leverage Oasis Privacy Layer (OPL) and [Sapphire contracts library](https://www.npmjs.com/package/@oasisprotocol/sapphire-contracts)    
- Utilize Celer's Interchain Messaging <-> Sapphire integration to bridge contracts from Sapphire to other EVM networks

**2. API**: 

- Sync on-chain data from contracts to the `Firebase` database
- Expose API to serve data to client dApp

**3. dApp**: 

- Using `ethers` library to interact with Metamask
- Adopt `Svelte` framework and  `picocss` to simplify coding



## Getting Start

### Contracts

#### Compile

```
npx hardhat compile
```

To force a compilation you can use the `--force` argument, or run `npx hardhat clean` to clear the cache and delete the artifacts.

#### Test

```
npx hardhat test test/BlindAuction.test.js
npx hardhat test test/BlindBid.test.js
```

#### Deploy contract

- Deploy `BlindBid` contract to Oasis Sapphire
```
npx hardhat run scripts/1_deploy_BlindBid_bsc.js --network sapphire_testnet
npx hardhat run scripts/1_deploy_BlindBid_polygon.js --network sapphire_testnet
npx hardhat run scripts/1_deploy_BlindBid_ethereum.js --network sapphire_testnet
```

- Configure `SAPPHIRE_TESTNET_BLIND_BID_ADDRESS` with above address 
- Deploy `BlindAuction` contract to remote networks
```
npx hardhat run scripts/2_deploy_BlindAuction.js --network <bsc_testnet|polygon_mumbai|ethereum_goerli>
```

- Deploy `AuctionNFT` contract to remote networks
```
npx hardhat run scripts/3_deploy_AuctionNFT.js --network <bsc_testnet|polygon_mumbai|ethereum_goerli>
```

#### Verify contract

- With BSC, Ethereum and Polygon

```
npx hardhat verify --network <network-name> <address> 
```

- With Oasis Sapphire, it's needed to be verified on explorer directly

#### Flatten contract

```
npx hardhat flatten contracts/BlindBid.sol > FlattenedBlindBid.sol
```


#### Start API 

- Locate to `/api`
- Download service account file from Firestore, and name as `sa.json`
- Start api
```bash
npm start
```

#### Start app

- Locate to `/app`
- Install packages `npm install`
- Copy and update  `.env.example` into `.env`, configure `VITE_API_URL`
- Start app
```bash
npm run dev
```

#### Playground

You can run script below to quickly play arround with contracts

```
node scripts/playground.js mintNft
node scripts/playground.js createAuction <nft_token_id>
node scripts/playground.js getAuctionCount
...
```


## Deployment contracts

| Contract     | Network          | Address |
| --------     | -------          | ------- |
| BlindBid     | Sapphire -> BSC Testnet      | 0xD538C945FB8E7d936BC2BAC43C2f1720c9f24CB7    |
|              | Sapphire -> Polygon Mumbai   | 0xc418E7940B559325B260F9876BA4fC56BE2e1682    |
|              | Sapphire -> Ethereum Goerli  | 0x8735181034Dddc067E2708BDffbBFcBce3A464ec    |
| BlindAuction | BSC Testnet      | 0x81Cc82bc50f04506720acF9197Ee1E89A6f005ad    |
|              | Polygon Mumbai   | 0x6aa218e0Dc00C21d414c798b4dBe55F47ED7B54e    |
|              | Ethereum Goerli  | 0x6aa218e0Dc00C21d414c798b4dBe55F47ED7B54e    |
| AuctionNFT   | BSC Testnet      | 0xC6590023b4EFDd65B04F3b17bdd9c07D3a0E881e    |
|              | Polygon Mumbai   | 0xb823136ee7eeda9DbC1Cb55641C1F2C2Ed0DDDa6    |
|              | Ethereum Goerli  | 0xb823136ee7eeda9DbC1Cb55641C1F2C2Ed0DDDa6    |


## What's next
- Offer more auction types
- Support more token standards ERC1155, ERC20...
- Support all networks as Oasis integrated
- Improve UI/UX