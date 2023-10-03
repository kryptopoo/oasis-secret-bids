import NFT from '../abis/AuctionNFT.json'
import BlindAuction from '../abis/BlindAuction.json'
import BlindBid from '../abis/BlindBid.json'

const BLIND_AUCTION_ABI = BlindAuction.abi
const BLINK_BID_ABI = BlindBid.abi
const NFT_ABI = NFT.abi

export { BLIND_AUCTION_ABI, BLINK_BID_ABI, NFT_ABI }
