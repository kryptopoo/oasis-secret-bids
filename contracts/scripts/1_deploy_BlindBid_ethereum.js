const { network } = require("hardhat");

async function main() {
  // deployer
  const [deployer] = await ethers.getSigners();
  console.log(`[${network.name}] Deployer:`, deployer.address);

  // predict auction address
  const remoteNetwork = hre.config.networks["ethereum_goerli"];
  const remoteProvider = new ethers.providers.JsonRpcProvider(remoteNetwork.url);
  let nonce = await remoteProvider.getTransactionCount(deployer.address);
  const predictAuctionAddress = ethers.utils.getContractAddress({ from: deployer.address, nonce });
  console.log(`[${remoteNetwork.name}] Predict auction address:`, predictAuctionAddress);

  // deploy BlindBid
  const BlindBidContract = await ethers.getContractFactory("BlindBid");
  const BlindBid = await BlindBidContract.deploy(predictAuctionAddress, ethers.utils.formatBytes32String("ethereum"));
  await BlindBid.deployed();
  console.log(`[${network.name}] Deployed BlindBid:`, BlindBid.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
