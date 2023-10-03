import { NFT_ABI } from '../common/Abis'
import { ContractService } from './ContractService'

export interface NftMetadata {
  id: number
  name: string
  image: string
  description?: string
}

export class NftService extends ContractService {
  constructor(contractAddress: string) {
    super(contractAddress, NFT_ABI)
  }

  async getMetadata(tokenId: number) {
    const tokenURI = await this.contract.tokenURI(tokenId)
    const tokenMetadataRs = await fetch(`${tokenURI}`)
    const tokenMetadata = await tokenMetadataRs.json()
    const metadata: NftMetadata = {
      id: tokenId,
      name: tokenMetadata.name,
      image: tokenMetadata.image,
      description: tokenMetadata.description,
    }

    return metadata
  }

  async approve(to: string, tokenId: number) {
    const feeData = await this.provider.getFeeData()

    const approveTx = await this.contract.approve(to, tokenId, {
      gasPrice: feeData.gasPrice,
    })
    await approveTx.wait()
    const receipt = await approveTx.wait()
    return receipt
  }

  async getOwner(tokenId: number) {
    const ownerOf = await this.contract.ownerOf(tokenId)
    return ownerOf
  }

  async getSymbol() {
    const symbol = await this.contract.symbol()
    return symbol
  }

  async getApproved(tokenId: number) {
    // approve blind auction take NFT
    const approvedAddress = await this.contract.getApproved(tokenId)
    return approvedAddress
  }
}
