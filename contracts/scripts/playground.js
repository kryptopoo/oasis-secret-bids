require("dotenv").config();
const args = require("minimist")(process.argv.slice(2))?._;
const ethers = require("ethers");
const crypto = require("crypto");

const BlindAuctionAbi = require("../artifacts/contracts/BlindAuction.sol/BlindAuction.json").abi;
const AuctionNFTAbi = require("../artifacts/contracts/AuctionNFT.sol/AuctionNFT.json").abi;
const BlindBidAbi = require("../artifacts/contracts/BlindBid.sol/BlindBid.json").abi;

const bscProvider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
const sapphireProvider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev");
const bscSigner = new ethers.Wallet(process.env.PRIVATE_KEY, bscProvider);
const sapphireSigner = new ethers.Wallet(process.env.PRIVATE_KEY, sapphireProvider);

const blindAuctionContract = new ethers.Contract(
  process.env.BSC_TESTNET_BLIND_AUCTION_ADDRESS,
  BlindAuctionAbi,
  bscSigner
);
const nftContract = new ethers.Contract(process.env.BSC_TESTNET_NFT_ADDRESS, AuctionNFTAbi, bscSigner);
const blindBidContract = new ethers.Contract(
  process.env.SAPPHIRE_TESTNET_BLIND_BID_ADDRESS,
  BlindBidAbi,
  sapphireSigner
);

async function getAuctionCount() {
  const auctionCount = await blindAuctionContract.auctionCount();
  console.log("auctionCount", auctionCount.toNumber());
}

async function getAuction(auctionId) {
  const auction = await blindAuctionContract.auctions(auctionId);
  console.log("auction", {
    auctionId: auction.auctionId.toNumber(),
    auctioneer: auction.auctioneer,
    tokenAddress: auction.tokenAddress,
    tokenId: auction.tokenId.toNumber(),
    startTime: auction.startTime.toNumber(),
    endTime: auction.endTime.toNumber(),
    reservePrice: auction.reservePrice.toNumber(),
    highestBidder: auction.highestBidder,
    highestBid: auction.highestBid.toNumber()
  });
}

async function estimateMsgFee() {
  // const bytes = crypto.randomBytes(32);
  // console.log("bytes ", bytes.toString());
  const bytes = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 256);
  console.log("bytes", bytes);
  const estimateMsgFee = await blindAuctionContract.estimateMsgFee(bytes);
  console.log("estimateMsgFee", estimateMsgFee.toNumber());
}

async function mintNft() {
  const feeData = await bscProvider.getFeeData();
  const { maxFeePerGas, maxPriorityFeePerGas, gasPrice } = feeData;
  console.log("feeData", {
    maxFeePerGas: feeData.maxFeePerGas.toNumber(),
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas.toNumber(),
    gasPrice: feeData.gasPrice.toNumber()
  });
  const mintTx = await nftContract.safeMint(
    bscSigner.address,
    "https://bafkreiho6iybkgrvfv5yqrs5uqg3rtjvofcdfuii3s3hejkbnfcktmdjsu.ipfs.nftstorage.link",
    {
      gasPrice
    }
  );
  await mintTx.wait();
  console.log("mint nft", mintTx);
}

async function createAuction(tokenId) {
  const now = new Date().getTime();
  const tokenAddress = nftContract.address;
  // const tokenId = 1;
  const startTime = Math.round(now / 1000);
  const endTime = startTime + 1 * 24 * 60 * 60;
  const reservePrice = ethers.utils.parseEther("0.001").toNumber();

  const feeData = await bscProvider.getFeeData();
  const { maxFeePerGas, maxPriorityFeePerGas, gasPrice } = feeData;
  console.log("feeData", {
    maxFeePerGas: feeData.maxFeePerGas.toNumber(),
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas.toNumber(),
    gasPrice: feeData.gasPrice.toNumber()
  });

  console.log("NFT tokenId", tokenId);
  const tokenURI = await nftContract.tokenURI(tokenId);
  console.log("NFT tokenURI", tokenURI);
  const ownerOf = await nftContract.ownerOf(tokenId);
  console.log("NFT owner", ownerOf);

  // approve blind auction take NFT
  const approvedAddress = await nftContract.getApproved(tokenId);
  console.log("NFT approved by", approvedAddress);
  if (approvedAddress != blindAuctionContract.address) {
    const approveTx = await nftContract.approve(blindAuctionContract.address, tokenId, {
      gasPrice
    });
    await approveTx.wait();
    console.log("approve nft", approveTx);
  }

  const createTx = await blindAuctionContract.create(tokenAddress, tokenId, startTime, endTime, reservePrice, {
    gasPrice: gasPrice,
    gasLimit: 400000
  });
  console.log("create auction", createTx);

  await getAuctionCount();
}

async function getBid(auctionId) {
  const bid = await blindBidContract.getBid(auctionId);
  console.log("bid", bid.toNumber());
}

async function getHighestBid(auctionId) {
  const highestBid = await blindBidContract.getHighestBid(auctionId);
  console.log("highestBid", {
    bidder: highestBid.bidder,
    bid: highestBid.bid
  });
}

async function encryptBid(auctionId, bidPrice) {
  const encryptBid = await blindBidContract.encryptBid(auctionId, bidPrice);
  console.log("encryptBid", {
    encryptedBid: encryptBid.encryptedBid,
    nonce: encryptBid.nonce
  });
}

async function commitBid(auctionId, bidPrice) {
  const { encryptedBid, nonce } = await blindBidContract.encryptBid(auctionId, bidPrice);
  console.log("encryptedBid", encryptedBid);
  console.log("nonce", nonce);
  const feeData = await sapphireProvider.getFeeData();
  const { gasPrice } = feeData;
  console.log("feeData", {
    gasPrice: feeData.gasPrice.toNumber()
  });

  const commitBid = await blindBidContract.commitBid(auctionId, encryptedBid, nonce, {
    gasPrice: gasPrice
  });
  console.log("commitBid", commitBid);
}

async function closeBid(auctionId) {
  const feeData = await sapphireProvider.getFeeData();
  const { gasPrice } = feeData;
  console.log("feeData", {
    gasPrice: feeData.gasPrice.toNumber()
  });

  const closeBid = await blindBidContract.closeBid(auctionId, {
    gasPrice: gasPrice
  });
  console.log("closeBid", closeBid);
}

switch (args[0]) {
  case "mintNft":
    mintNft();
    break;
  case "createAuction":
    createAuction(args[1]);
    break;
  case "getAuctionCount":
    getAuctionCount();
    break;
  case "estimateMsgFee":
    estimateMsgFee();
    break;
  case "getAuction":
    getAuction(args[1]);
    break;
  case "getBid":
    getBid(args[1]);
    break;
  case "getHighestBid":
    getHighestBid(args[1]);
    break;
  case "encryptBid":
    encryptBid(args[1], args[2]);
    break;
  case "commitBid":
    commitBid(args[1], args[2], args[3]);
    break;
  case "closeBid":
    closeBid(args[1]);
    break;
  default:
    break;
}
