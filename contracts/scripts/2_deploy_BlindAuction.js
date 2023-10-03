const { network } = require("hardhat");
require("dotenv").config();

async function main() {
  const blindBidAddress = process.env.SAPPHIRE_TESTNET_BLIND_BID_ADDRESS;
  console.log("[sapphire_testnet] BlindBox address", blindBidAddress);
  if (!blindBidAddress) {
    throw new Error("[sapphire_testnet] Invalid BlindBox address");
  }

  // deployer
  const [deployer] = await ethers.getSigners();
  console.log(`[${network.name}] Deployer:`, deployer.address);

  // deploy BlindAuction
  const BlindAuctionContract = await ethers.getContractFactory("BlindAuction");
  const BlindAuction = await BlindAuctionContract.deploy(blindBidAddress);
  await BlindAuction.deployed();
  console.log(`[${network.name}] Deployed BlindAuction:`, BlindAuction.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
