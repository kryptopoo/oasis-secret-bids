import { convertToDateTimeString } from '../common/Utils'
import { writable } from 'svelte/store'

export type Auction = {
  uuid: string
  id: number
  address: string
  typeId: string
  name: string
  auctioneer: string
  startTime: number
  endTime: number
  reservePrice: number
  highestBidder?: string
  highestBid?: number
  closed: boolean
  tokenMetadata: {
    id: number
    address: string
    name: string
    image: string
    description?: string
    symbol?: string
    decimal?: number
  }

  // additional info
  totalBidders?: number
  networkId: string
  tokenTypeId: string
  startTimeString: string
  endTimeString: string
  // highestBidder?: string;
  // highestBid?: string
  bidAddress: string
}

export const AuctionStore = writable<Auction>({
  uuid: '',
  id: 0,
  address: '',
  name: '',
  typeId: '',

  auctioneer: '',
  startTime: 0,
  endTime: 0,
  reservePrice: 0.001,
  closed: false,
  tokenMetadata: {
    address: '',
    id: 0,
    image: '',
    name: '',
    symbol: '',
    decimal: 0,
  },

  networkId: '',

  bidAddress: '',
  tokenTypeId: 'erc721',
  startTimeString: convertToDateTimeString(new Date()),
  endTimeString: convertToDateTimeString(new Date(new Date().setDate(new Date().getDate() + 7))),
})
