import { ethers } from 'ethers'
import { NETWORK } from './Constants'

const convertToDateTimeString = (date: Date) => {
  let month = '' + (date.getMonth() + 1)
  let day = '' + date.getDate()
  let year = date.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  let dateString = [year, month, day].join('-')
  return `${dateString}T00:00`
}

const convertToTimestamp = (dateString: string) => {
  return Math.ceil(new Date(dateString).getTime() / 1000)
}

const shortAddress = (address: string) => {
  if (!address) return ''
  return address.substring(0, 6) + '...' + address.substring(address.length - 4)
}

const toETH = (wei: string | undefined) => {
  if (wei) return ethers.utils.formatEther(wei)
  return ''
}

const toWei = (eth: string | undefined) => {
  if (eth) return ethers.utils.parseUnits(eth, 'ether').toString()
  return '0'
}

const buildAddressUrl = (networkId: string, address: string) => {
  const explorerUrl = NETWORK[networkId]?.explorerUrl
  if (explorerUrl) {
    return `${explorerUrl}/address/${address}`
  }

  return ''
}

export { convertToDateTimeString, convertToTimestamp, shortAddress, toETH, toWei, buildAddressUrl }
