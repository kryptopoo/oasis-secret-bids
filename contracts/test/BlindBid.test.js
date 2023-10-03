const { expect } = require("chai");

let owner, bidder1, bidder2;
let blindBid;
const auctionId = 1;
const startTime = Math.ceil((new Date().getTime() - 86400000) / 1000);
const endTime = Math.ceil((new Date().getTime() + 86400000) / 1000);
const reservePrice = 100;

describe("BlindBidTest", async function () {
  beforeEach(async function () {
    [owner, bidder1, bidder2, auctioneer] = await ethers.getSigners();
    const BlindBidTest = await ethers.getContractFactory("BlindBidTest");
    blindBid = await BlindBidTest.deploy(auctionId, auctioneer.address, startTime, endTime, reservePrice);
  });

  it("encryptBid", async function () {
    const bid = 100;
    const bidInBytes = ethers.utils.hexZeroPad(ethers.BigNumber.from(bid).toHexString(), 32);
    const [encryptedBid, nonce] = await blindBid.encryptBid(auctionId, bid);
    console.log("encryptedBid", encryptedBid);
    console.log("nonce", nonce);

    expect(encryptedBid).to.equal(bidInBytes);
  });

  it("commitBid", async function () {
    const bid = 100;

    const [encryptedBid, nonce] = await blindBid.encryptBid(auctionId, bid);
    await blindBid.commitBid(auctionId, encryptedBid, nonce, { value: bid });

    const [bidder, commitedBid] = await blindBid.getBid(auctionId);
    console.log("bidder", bidder);
    console.log("commitedBid", commitedBid);

    expect(Number(commitedBid)).to.equal(bid);
  });

  it("getHighestBid", async function () {
    const bid1 = 200;
    const bid2 = 100;

    [encryptedBid, nonce] = await blindBid.connect(bidder1).encryptBid(auctionId, bid1);
    await blindBid.connect(bidder1).commitBid(auctionId, encryptedBid, nonce, { value: bid1 });

    [encryptedBid, nonce] = await blindBid.connect(bidder2).encryptBid(auctionId, bid2);
    await blindBid.connect(bidder2).commitBid(auctionId, encryptedBid, nonce, { value: bid2 });

    [bidder, commitedBid1] = await blindBid.connect(bidder1).getBid(auctionId);
    console.log("bidder1", bidder, commitedBid1);

    [bidder, commitedBid2] = await blindBid.connect(bidder2).getBid(auctionId);
    console.log("bidder2", bidder, commitedBid2);

    [highestBidder, highestBid] = await blindBid.getHighestBid(auctionId);
    console.log("highestBidder", highestBidder, highestBid);

    expect(Number(highestBid)).to.equal(bid1);
    expect(highestBidder).to.equal(bidder1.address);
  });
});
