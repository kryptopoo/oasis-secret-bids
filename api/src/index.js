const service = require('./services/service')
const express = require('express')
const app = express()
const router = express.Router()
const port = process.env.PORT || 3001

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  next()
})

router.get('/', (req, res) => {
  res.send('Oasis Secret Bids api running...')
})

router.get('/auctions', async (req, res) => {
  const auctions = await service.getAuctions()
  const now = Math.floor(Date.now() / 1000)

  const activeAuctions = auctions.filter((a) => {
    return now >= a.startTime && now <= a.endTime && a.closed == false
  })
  const upcomingAuctions = auctions.filter((a) => {
    return now < a.startTime
  })
  const endedAuctions = auctions.filter((a) => {
    return now > a.endTime || a.closed == true
  })

  const rs = {
    activeAuctions: activeAuctions,
    upcomingAuctions: upcomingAuctions,
    endedAuctions: endedAuctions,
  }
  res.send(rs)
})

router.get('/auctions/:id', async (req, res) => {
  const id = req.params.id
  const auction = await service.getAuctionById(id)
  res.send(auction)
})

router.put('/auctions/:id', async (req, res) => {
  const id = req.params.id
  const auction = await service.updateAuctionById(id)
  res.send(auction)
})

app.use('/api', router)

const server = app.listen(port, () => {
  console.log(`Oasis Secret Bids api listening at http://localhost:${port}`)
})

server.keepAliveTimeout = 120 * 1000
server.headersTimeout = 120 * 1000
