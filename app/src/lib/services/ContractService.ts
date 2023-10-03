import { ethers } from 'ethers'

export class ContractService {
  protected provider: ethers.providers.Web3Provider
  protected contract: ethers.Contract

  constructor(contractAddress: string, contractAbi: any) {
    // this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.provider = new ethers.providers.Web3Provider((window as any).ethereum, 'any')
    const signer = this.provider.getSigner()
    this.contract = new ethers.Contract(contractAddress, contractAbi, signer)
  }
}
