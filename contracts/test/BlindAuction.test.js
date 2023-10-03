const { expect } = require("chai");

let owner, winner, blindAuction, nft;
const auctionId = 1;
const auctionName = "auction test";
const startTime = Math.ceil((new Date().getTime() - 86400000) / 1000);
const endTime = Math.ceil((new Date().getTime() + 86400000) / 1000);
const reservePrice = 100;

describe("BlindAuctionTest", async function () {
  beforeEach(async function () {
    [owner, winner] = await ethers.getSigners();
    console.log("owner", owner.address);

    // deploy NFT
    const NFT = await ethers.getContractFactory("AuctionNFT");
    nft = await NFT.deploy();
    await nft.safeMint(owner.address, "localhost");
    console.log("nft", nft.address);

    // deploy BlindAuctionTest
    // const BlindBidTest = await ethers.getContractFactory("BlindBidTest");
    // blindBid = await BlindBidTest.deploy(auctionId, auctioneer.address, startTime, endTime, reservePrice);

    const BlindAuctionTest = await ethers.getContractFactory("BlindAuctionTest");
    blindAuction = await BlindAuctionTest.deploy();
  });

  it("createAuction", async function () {
    // console.log("nft", nft);
    const tokenAddress = nft.address;
    const tokenId = 1;
    const expectedAuctionId = 1;

    // approve blind auction take NFT
    await nft.approve(blindAuction.address, tokenId);

    // create auction
    const createAuction = await blindAuction.create(
      tokenAddress,
      tokenId,
      auctionName,
      startTime,
      endTime,
      reservePrice
    );

    // assert
    const auction = await blindAuction.auctions(expectedAuctionId);
    const nftOwner = await nft.ownerOf(tokenId);

    expect(blindAuction.address).to.equal(nftOwner);
    expect(auction.id).to.equal(expectedAuctionId);
  });

  it("claim by winner", async function () {
    const tokenAddress = nft.address;
    const tokenId = 1;

    const auctionId = 1;
    const highestBidder = winner.address;
    const highestBid = 1000;

    // create auction
    await nft.approve(blindAuction.address, tokenId);
    await blindAuction.create(tokenAddress, tokenId, auctionName, startTime, endTime, reservePrice);

    // close auction
    await blindAuction.close(auctionId, highestBidder, highestBid);
    const auction = await blindAuction.auctions(auctionId);

    // claim
    await blindAuction.connect(winner).claim(auctionId, { value: highestBid });
    const blindAuctionBalance = await ethers.provider.getBalance(blindAuction.address);

    const nftOwner = await nft.ownerOf(tokenId);

    expect(highestBidder).to.equal(nftOwner);
    expect(highestBid).to.equal(blindAuctionBalance);
  });

  it("claim/withdraw by auctioneer", async function () {
    const tokenAddress = nft.address;
    const tokenId = 1;

    const auctionId = 1;
    const highestBidder = ethers.constants.AddressZero;
    const highestBid = 0;

    // create auction
    await nft.approve(blindAuction.address, tokenId);
    await blindAuction.create(tokenAddress, tokenId, auctionName, startTime, endTime, reservePrice);

    // close auction
    await blindAuction.close(auctionId, highestBidder, highestBid);
    const auction = await blindAuction.auctions(auctionId);

    // claim
    await blindAuction.claim(auctionId);

    const nftOwner = await nft.ownerOf(tokenId);

    expect(owner.address).to.equal(nftOwner);
  });
});
