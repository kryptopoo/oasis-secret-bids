import { BigNumber, ethers } from 'ethers'
import { EVENT_ID, NETWORK, NETWORK_ID } from '../common/Constants'

export interface NftMetadata {
  id: number
  name: string
  image: string
  description?: string
}

export class AccountService {
  provider: ethers.providers.Web3Provider
  private _signer: ethers.providers.JsonRpcSigner
  // private _account: string = ''

  constructor() {
    this.provider = new ethers.providers.Web3Provider((window as any).ethereum, 'any')
    this.provider.on('network', (newNetwork, oldNetwork) => {
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      // if (oldNetwork) {
      //     window.location.reload();
      // }
    })
    this._signer = this.provider.getSigner()

    this.checkConnection()
  }

  async connect() {
    try {
      await this.provider.send('eth_requestAccounts', [])
      this._signer = this.provider.getSigner()
      // this._account = await this._signer.getAddress()
      const account = await this._signer.getAddress()
      localStorage.setItem('account', account)

      const { chainId } = await this.provider.getNetwork()
      window.postMessage({
        eventId: EVENT_ID.AccountConnected,
        eventData: {
          account: account,
          chainId: chainId,
        },
      })
    } catch (error) {
      console.log('connect', error)
    }
  }

  async disconnect() {
    try {
      // const { chainId } = await this.provider.getNetwork()
      window.postMessage({
        eventId: EVENT_ID.AccountDisconnected,
        eventData: {
          account: undefined,
          chainId: undefined,
        },
      })

      // this._account = ''
      localStorage.setItem('account', '')
    } catch (error) {
      console.log('disconnect', error)
    }
  }

  async checkConnection() {
    const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' })
    if (accounts.length) {
      // this._account = accounts[0]
      localStorage.setItem('account', accounts[0])
    }

    return accounts.length > 0
  }

  async getAccount() {
    // try {
    //   const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' })
    //   if (accounts.length) {
    //     this._account = accounts[0]
    //   }
    // } catch (error) {
    //   this._account = ''
    // }

    return localStorage.getItem('account') ?? ''
  }

  async getBalance() {
    const balance = await this._signer.getBalance()
    return balance.toString()
  }

  async getNetworkId() {
    const { chainId } = await this.provider.getNetwork()
    return chainId.toString()
  }

  async changeNetwork(networkId: string) {
    const ethereum = (window as any).ethereum
    console.log('changeNetwork', ethereum.networkVersion, networkId)
    if (ethereum.networkVersion !== networkId) {
      try {
        const chainId = ethers.utils.hexValue(BigNumber.from(networkId).toHexString())
        console.log('changeNetwork', chainId)
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainId }],
        })
      } catch (err: any) {
        console.log('changeNetwork error', err)
        // // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          const targetNetwork = NETWORK[networkId]
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: targetNetwork.name,
                chainId: ethers.utils.hexValue(BigNumber.from(networkId).toHexString()),
                nativeCurrency: {
                  name: targetNetwork.currency,
                  decimals: 18,
                  symbol: targetNetwork.currency,
                },
                blockExplorerUrls: [targetNetwork.explorerUrl],
                rpcUrls: targetNetwork.rpcUrls,
              },
            ],
          })
        }
      }
    }
  }
}
