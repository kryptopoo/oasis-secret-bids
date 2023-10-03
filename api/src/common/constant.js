const NETWORK_ID = {
  bsc: '56',
  bsc_testnet: '97',
  eth: '1',
  eth_sepolia: '11155111',
  eth_goerli: '5',
  polygon_mumbai: '80001',
  polygon: '137',
  oasis_sapphire_testnet: '23295',
  oasis_sapphire: '23294',
}

const NETWORK = {
  [NETWORK_ID.bsc]: {
    id: NETWORK_ID.bsc,
    name: 'BSC Mainnet',
    currency: 'BNB',
    explorerUrl: 'https://bscscan.com',
    rpcUrls: ['https://bsc-dataseed.binance.org'],
  },
  [NETWORK_ID.bsc_testnet]: {
    id: NETWORK_ID.bsc_testnet,
    name: 'BSC Testnet',
    currency: 'BNB',
    explorerUrl: 'https://testnet.bscscan.com',
    rpcUrls: ['https://data-seed-prebsc-1-s1.bnbchain.org:8545'],
  },
  [NETWORK_ID.eth]: {
    id: NETWORK_ID.eth,
    name: 'Ethereum Mainnet',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrls: [],
  },
  [NETWORK_ID.eth_sepolia]: {
    id: NETWORK_ID.eth_sepolia,
    name: 'Ethereum Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrls: ['https://rpc.sepolia.org'],
  },
  [NETWORK_ID.eth_goerli]: {
    id: NETWORK_ID.eth_goerli,
    name: 'Ethereum Goerli',
    currency: 'ETH',
    explorerUrl: 'https://goerli.etherscan.io',
    rpcUrls: ['https://rpc.ankr.com/eth_goerli'],
  },
  [NETWORK_ID.polygon_mumbai]: {
    id: NETWORK_ID.polygon_mumbai,
    name: 'Polygon Mumbai',
    currency: 'MATIC',
    explorerUrl: 'https://mumbai.polygonscan.com',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
  },
  [NETWORK_ID.polygon]: {
    id: NETWORK_ID.polygon,
    name: 'Polygon Mainnet',
    currency: 'MATIC',
    explorerUrl: 'https://polygonscan.com',
    rpcUrls: ['https://polygon.llamarpc.com'],
  },
  [NETWORK_ID.oasis_sapphire_testnet]: {
    id: NETWORK_ID.oasis_sapphire_testnet,
    name: 'Oasis Sapphire Testnet',
    currency: 'ROSE',
    explorerUrl: 'https://testnet.explorer.sapphire.oasis.dev',
    rpcUrls: ['https://testnet.sapphire.oasis.dev'],
  },
  [NETWORK_ID.oasis_sapphire]: {
    id: NETWORK_ID.oasis_sapphire,
    name: 'Oasis Sapphire',
    currency: 'ROSE',
    explorerUrl: 'https://explorer.sapphire.oasis.dev',
    rpcUrls: ['https://sapphire.oasis.io'],
  },
}

const AUCTION_TYPE = {
  blind: { id: 'blind', name: 'Blind Auction' },
  lottery: { id: 'lottery', name: 'Lottery Auction' },
}

const TOKEN_TYPE = {
  erc721: { id: 'erc721', name: 'ERC721' },
  erc1155: { id: 'erc1155', name: 'ERC1155' },
  erc20: { id: 'erc20', name: 'ERC20' },
}

const CONTRACT = {
  [NETWORK_ID.bsc_testnet]: {
    AUCTION: '0x81Cc82bc50f04506720acF9197Ee1E89A6f005ad',
    BID: '0xD538C945FB8E7d936BC2BAC43C2f1720c9f24CB7',
  },
  [NETWORK_ID.polygon_mumbai]: {
    AUCTION: '0x6aa218e0Dc00C21d414c798b4dBe55F47ED7B54e',
    BID: '0xc418E7940B559325B260F9876BA4fC56BE2e1682',
  },
  [NETWORK_ID.eth_goerli]: {
    AUCTION: '0x6aa218e0Dc00C21d414c798b4dBe55F47ED7B54e',
    BID: '0x8735181034Dddc067E2708BDffbBFcBce3A464ec',
  },
}

module.exports = {
  NETWORK,
  NETWORK_ID,
  AUCTION_TYPE,
  TOKEN_TYPE,
  CONTRACT,
}
