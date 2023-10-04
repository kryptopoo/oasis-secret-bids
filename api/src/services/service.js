const ethers = require('ethers')
require('dotenv').config()
const crypto = require('crypto')
const { NETWORK, CONTRACT, AUCTION_TYPE, TOKEN_TYPE, NETWORK_ID } = require('../common/constant')

// const BlindAuctionAbi = require("../artifacts/contracts/BlindAuction.sol/BlindAuction.json").abi;
// const AuctionNFTAbi = require("../artifacts/contracts/AuctionNFT.sol/AuctionNFT.json").abi;
// const BlindBidAbi = require("../artifacts/contracts/BlindBid.sol/BlindBid.json").abi;
const BlindAuctionAbi = require('../abis/BlindAuction.json').abi
const AuctionNFTAbi = require('../abis/AuctionNFT.json').abi
const BlindBidAbi = require('../abis/BlindBid.json').abi

const getAuctionContract = (networkId) => {
  const rpcUrl = NETWORK[networkId].rpcUrls[0]
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  const auctionContract = new ethers.Contract(CONTRACT[networkId].AUCTION, BlindAuctionAbi, signer)

  return auctionContract
}

const getBidContract = (bidAddress) => {
  const rpcUrl = NETWORK[NETWORK_ID.oasis_sapphire_testnet].rpcUrls[0]
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  const auctionContract = new ethers.Contract(bidAddress, BlindBidAbi, signer)

  return auctionContract
}

const getNftContract = (networkId, address) => {
  const rpcUrl = NETWORK[networkId].rpcUrls[0]
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  const nftContract = new ethers.Contract(address, AuctionNFTAbi, signer)

  return nftContract
}

const db = require('../db/firestore')

// detect new auction and sync data
const syncData = async (networkId) => {
  const blindAuctionContract = getAuctionContract(networkId)

  const total = await db.getTotalAuctions(networkId)
  const auctionCountRs = await blindAuctionContract.auctionCount()
  const auctionCount = auctionCountRs.toNumber()

  for (let auctionId = total + 1; auctionId <= auctionCount; auctionId++) {
    let auctionObj = await fletchContractAuction(networkId, auctionId)
    auctionObj.uuid = crypto.randomUUID()
    await db.createAuction(auctionObj)
  }
}

const fletchContractAuction = async (networkId, auctionId) => {
  const blindAuctionContract = getAuctionContract(networkId)
  const auction = await blindAuctionContract.auctions(auctionId)

  // bid contract is on oasis network
  const blindBidContract = getBidContract(CONTRACT[networkId].BID)
  const totalBiddersRs = await blindBidContract.getTotalBidders(auctionId)
  const totalBidders = totalBiddersRs.toNumber()

  // nft info
  const nftContract = getNftContract(networkId, auction.tokenAddress)
  const tokenId = auction.tokenId.toNumber()
  const tokenURI = await nftContract.tokenURI(tokenId)
  const tokenRes = await fetch(tokenURI)
  let tokenMetadata = await tokenRes.json()
  tokenMetadata.id = auction.tokenId.toNumber()
  tokenMetadata.address = auction.tokenAddress
  const auctionObj = {
    id: auction.id.toNumber(),
    address: blindAuctionContract.address,
    typeId: AUCTION_TYPE.blind.id,
    name: auction.name,
    auctioneer: auction.auctioneer,
    startTime: auction.startTime.toNumber(),
    endTime: auction.endTime.toNumber(),
    reservePrice: auction.reservePrice.toNumber(),
    highestBidder: auction.highestBidder,
    highestBid: auction.highestBid.toNumber(),
    totalBidders: totalBidders,
    closed: auction.closed,
    networkId: networkId,
    tokenTypeId: TOKEN_TYPE.erc721.id,
    tokenMetadata: tokenMetadata,
    bidAddress: blindBidContract.address,
  }

  return auctionObj
}

const getAuctions = async () => {
  const networkIds = [NETWORK_ID.bsc_testnet, NETWORK_ID.polygon_mumbai, NETWORK_ID.eth_goerli]
  for (let index = 0; index < networkIds.length; index++) {
    const networkId = networkIds[index]
    await syncData(networkId)
  }

  const auctions = await db.getAllAuctions()

  return auctions
}

const getAuctionById = async (uuid) => {
  const auction = await db.getAuctionById(uuid)
  return auction
}

const updateAuctionById = async (uuid) => {
  const auction = await db.getAuctionById(uuid)
  let auctionObj = await fletchContractAuction(auction.networkId, auction.id)
  auctionObj.uuid = uuid
  return await db.updateAuction(auctionObj)
}

module.exports = {
  getAuctions,
  getAuctionById,
  updateAuctionById,
}
