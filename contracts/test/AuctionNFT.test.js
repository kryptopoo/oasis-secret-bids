const { expect } = require("chai");

var owner, auctionNFT;

describe("AuctionNFT Test", async function () {
  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const AuctionNFT = await ethers.getContractFactory("AuctionNFT");
    auctionNFT = await AuctionNFT.deploy();
  });

  it("Should able to get name", async function () {
    expect(await auctionNFT.name()).to.equal("AuctionNFT");
  });
});
