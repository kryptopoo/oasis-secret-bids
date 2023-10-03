import { ethers } from 'ethers'
import { BLIND_AUCTION_ABI } from '../common/Abis'
import { ContractService } from './ContractService'
import type { Auction } from '../models/Auction'
import { AUCTION_TYPE, NETWORK, NETWORK_ID, TOKEN_TYPE } from '../common/Constants'

export class AuctionService extends ContractService {
  constructor(contractAddress: string) {
    super(contractAddress, BLIND_AUCTION_ABI)
  }

  async createAuction(
    name: string,
    tokenAddress: string,
    tokenId: number,
    startTime: number,
    endTime: number,
    reservePriceInEth: number,
  ) {
    const feeData = await this.provider.getFeeData()

    const reservePrice = ethers.utils.parseEther(reservePriceInEth.toString()).toNumber()
    const createTx = await this.contract.create(
      tokenAddress,
      tokenId,
      name,
      startTime,
      endTime,
      reservePrice,
      {
        gasPrice: feeData.gasPrice,
        gasLimit: 400000,
        value: 1000000000000000,
      },
    )
    const receipt = await createTx.wait()
    return receipt
  }

  async claim(auctionId: number, priceInWei: string) {
    const feeData = await this.provider.getFeeData()
    const claimTx = await this.contract.claim(auctionId, {
      gasPrice: feeData.gasPrice,
      value: priceInWei,
    })
    const receipt = await claimTx.wait()
    return receipt
  }

  getTags(auction: Auction) {
    let tags = []

    if (auction.typeId == AUCTION_TYPE.blind.id) tags.push('Blind')
    else if (auction.typeId == AUCTION_TYPE.lottery.id) tags.push('Lottery')

    if (auction.tokenTypeId == TOKEN_TYPE.erc721.id) tags.push('ERC721')
    else if (auction.tokenTypeId == TOKEN_TYPE.erc1155.id) tags.push('ERC1155')
    else if (auction.tokenTypeId == TOKEN_TYPE.erc20.id) tags.push('ERC20')

    // TODO: update on mainnet
    tags.push(NETWORK[auction.networkId].name)

    return tags
  }

  getStatus(auction: Auction) {
    let now = new Date().getTime()
    let startTime = auction.startTime * 1000
    let endTime = auction.endTime * 1000

    let isActive = startTime <= now && endTime > now
    let isUpcomming = startTime > now

    return isActive ? 'Active' : isUpcomming ? 'Upcomming' : 'Closed'
  }
}
