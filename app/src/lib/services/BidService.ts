import { BLINK_BID_ABI } from '../common/Abis'
import { ContractService } from './ContractService'

export class BidService extends ContractService {
  constructor(contractAddress: string) {
    super(contractAddress, BLINK_BID_ABI)
  }

  async getBid(auctionId: number) {
    const bidRes = await this.contract.getBid(auctionId)
    const bid = bidRes.toNumber()
    return bid
  }

  async getHighestBid(auctionId: number) {
    const highestBid = await this.contract.getHighestBid(auctionId)
    return highestBid
  }

  async encryptBid(auctionId: number, bidPriceInWei: string) {
    const encryptBid = await this.contract.encryptBid(auctionId, bidPriceInWei)
    return encryptBid
  }

  async commitBid(auctionId: number, bidPriceInWei: string) {
    const { encryptedBid, nonce } = await this.contract.encryptBid(auctionId, bidPriceInWei)
    console.log('encryptedBid', encryptedBid)
    console.log('nonce', nonce)
    const feeData = await this.provider.getFeeData()
    const commitBid = await this.contract.commitBid(auctionId, encryptedBid, nonce, {
      gasPrice: feeData.gasPrice,
    })
    const receipt = await commitBid.wait()
    return receipt
  }

  async closeBid(auctionId: number) {
    const feeData = await this.provider.getFeeData()
    const closeBid = await this.contract.closeBid(auctionId, {
      gasPrice: feeData.gasPrice,
    })
    const receipt = await closeBid.wait()
    return receipt
  }

  async getTotalBidders(auctionId: number) {
    const totalBidders = await this.contract.getTotalBidders(auctionId)
    return totalBidders
  }
}
