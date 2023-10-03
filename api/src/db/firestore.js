const fs = require('firebase-admin')
const serviceAccount = require('../sa.json')
fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
})

const db = fs.firestore()
const auctionCollection = db.collection('auctions')

const getTotalAuctions = async (networkId) => {
  const query = auctionCollection.where('networkId', '==', networkId)
  const res = await query.count().get()
  const total = res.data()
  return total.count
}

const createAuction = async (auction) => {
  const res = await auctionCollection.doc(auction.uuid.toString()).set(auction)
}

const updateAuction = async (auction) => {
  const res = await auctionCollection.doc(auction.uuid.toString()).set(auction)
  const updatedAuction = await getAuctionById(auction.uuid.toString())
  console.log('updateAuction', updatedAuction)
  return updatedAuction
}

const getAllAuctions = async () => {
  const snapshot = await auctionCollection.get()
  const allAuctions = snapshot.docs.map((doc) => doc.data())
  return allAuctions
}

const getAuctionById = async (uuid) => {
  const snapshot = await auctionCollection.doc(uuid.toString()).get()
  return snapshot.data()
}

module.exports = {
  getTotalAuctions,
  createAuction,
  updateAuction,
  getAllAuctions,
  getAuctionById,
}
