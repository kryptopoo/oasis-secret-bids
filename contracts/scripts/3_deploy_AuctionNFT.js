async function main() {
  // deployer
  const [deployer] = await ethers.getSigners();
  console.log(`[${network.name}] Deployer:`, deployer.address);

  // deploy AuctionNFT
  const AuctionNFTContract = await ethers.getContractFactory("AuctionNFT");
  
  const nftName = "Elon Musk AI";
  const nftSymbol = "ELMU";
  const nftTokenUri = "https://bafybeih36ygyzgglcnt72minorn44pj42bj2jhxchvgsuj77ccqpmm3xg4.ipfs.nftstorage.link/";

  // const nftName = "The Yoga Scarecrow";
  // const nftSymbol = "YGS";
  // const nftTokenUri = "https://nftstorage.link/ipfs/bafybeidsfanojchrrq3thmdv7qirdi7iyvug6msnuvmboq5bxd64tfriae/";

  // const nftName = "Spider Man Big Ben";
  // const nftSymbol = "SMBB";
  // const nftTokenUri = "https://nftstorage.link/ipfs/bafybeihdfw3pis2xnujaw3exhsfmkixnvp4g3gqsg23qt27pcrskm7u5vu/";
  
  const AuctionNFT = await AuctionNFTContract.deploy(nftName, nftSymbol, nftTokenUri);
  await AuctionNFT.deployed();
  console.log(`[${network.name}] Deployed AuctionNFT:`, AuctionNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
