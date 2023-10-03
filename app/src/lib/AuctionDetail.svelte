<script lang="ts">
  import Layout from './Layout.svelte'
  import { convertToDateTimeString, toETH, toWei } from './common/Utils'
  import { onMount } from 'svelte'
  import { BidService } from './services/BidService'
  import type { Auction } from './models/Auction'
  import { AccountService } from './services/AccountService'
  import { API_URL, AUCTION_TYPE, EVENT_ID, NETWORK, NETWORK_ID } from './common/Constants'
  import { ethers } from 'ethers'
  import Modal from './components/Modal.svelte'
  import { AuctionService } from './services/AuctionService'
  import { setLoadingButton, unsetLoadingButton } from './common/UI'
  import { fade } from 'svelte/transition'
  import Address from './components/Address.svelte'
  import TimeCountdown from './components/TimeCountdown.svelte'
  import { NftService } from './services/NftService'
  import SkeletonAuctionDetail from './components/SkeletonAuctionDetail.svelte'

  // auction uuid
  export let auctionUuid = ''

  let auctionInfo: Auction | any = {
    name: '',
    startTime: 0,
    endTime: 0,
    address: '',
    bidAddress: '',
    networkId: '',
  }
  let bidPrice = 0
  let accountAddress = ''
  let accountBalance = ''
  let networkId = ''
  let totalBiddersLoaded = true
  let isTokenClaimed = false
  let loading = false

  const accountService = new AccountService()

  const commitBid = async () => {
    setLoadingButton('btn-commit-bid')

    let commitBidTx
    try {
      const bidService = new BidService(auctionInfo.bidAddress)
      const bidPriceInWei = toWei(bidPrice.toString())
      console.log('bidPrice', bidPrice.toString())
      console.log('bidPriceInWei', bidPriceInWei.toString())
      commitBidTx = await bidService.commitBid(auctionInfo.id, bidPriceInWei.toString())
    } catch (error) {
      console.log('commitBid', error)
    }

    if (commitBidTx) {
      modal.toggleModal('success', 'You have placed a bid successfully.')

      // update auction info
      const auctionRes = await fetch(`${API_URL}/auctions/${auctionUuid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      })

      // reload total bidder
      unsetLoadingButton('btn-commit-bid')
      await loadAuction()
    } else {
      modal.toggleModal('fail', 'You have placed a bid failed.')
    }

    await loadAccount()
    unsetLoadingButton('btn-commit-bid')
  }
  const closeBid = async () => {
    setLoadingButton('btn-close-bid')

    let closeBidTx
    try {
      const bidService = new BidService(auctionInfo.bidAddress)
      closeBidTx = await bidService.closeBid(auctionInfo.id)
    } catch (error) {
      console.log('closeBid', error)
    }

    if (closeBidTx) {
      modal.toggleModal('success', 'You have closed the auction successfully.')

      // update auction info
      let closed = false
      while (!closed) {
        const auctionRes = await fetch(`${API_URL}/auctions/${auctionUuid}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        })
        const updatedAuction = await auctionRes.json()
        closed = updatedAuction.closed
      }

      // reload auction
      unsetLoadingButton('btn-close-bid')
      await loadAuction()
    } else modal.toggleModal('fail', 'You have closed the auction failed.')

    await loadAccount()
    unsetLoadingButton('btn-close-bid')
  }

  const claimToken = async () => {
    setLoadingButton('btn-claim')

    let claimTx
    try {
      const auctionService = new AuctionService(auctionInfo.address)
      claimTx = await auctionService.claim(auctionInfo.id, auctionInfo?.highestBid.toString())
    } catch (error) {
      console.log('claimToken', error)
    }
    if (claimTx) {
      modal.toggleModal('success', 'You have claimed the token successfully.')

      // update auction info
      const auctionRes = await fetch(`${API_URL}/auctions/${auctionUuid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      })

      // reload auction
      unsetLoadingButton('btn-claim')
      await loadAuction()
    } else modal.toggleModal('fail', 'You have claimed the token failed.')

    unsetLoadingButton('btn-claim')
  }

  const loadAuction = async () => {
    loading = true

    const auctionRes = await fetch(`${API_URL}/auctions/${auctionUuid}`)
    const auction = await auctionRes.json()

    console.log('auction', auction)
    auctionInfo = auction

    // check if token claimed
    if (accountAddress != '') {
      let tokenOwner = undefined
      try {
        const nftService = new NftService(auctionInfo.tokenMetadata.address)
        tokenOwner = await nftService.getOwner(auctionInfo.tokenMetadata.id)
      } catch (error) {
        console.log('getOwner', error)
      }

      console.log('tokenOwner', tokenOwner)
      if (tokenOwner) {
        isTokenClaimed =
          ethers.utils.getAddress(tokenOwner) != ethers.utils.getAddress(auctionInfo.address)
        console.log('isTokenClaimed', isTokenClaimed)
      }
    }

    loading = false
  }

  const connectWallet = async (toNetworkId: string) => {
    try {
      if (networkId.toString() != toNetworkId) {
        await accountService.changeNetwork(toNetworkId)
      }

      await accountService.connect()
    } catch (error) {
      console.log('error', error)
    }

    await loadAccount()
  }

  const loadAccount = async () => {
    accountAddress = await accountService.getAccount()

    if (accountAddress != '') {
      networkId = (await accountService.getNetworkId()).toString()
      accountBalance = toETH(await accountService.getBalance())
    }
  }

  const isWinner = () => {
    return (
      accountAddress &&
      auctionInfo.highestBidder &&
      ethers.utils.getAddress(accountAddress) == ethers.utils.getAddress(auctionInfo?.highestBidder)
    )
  }

  const isAuctioneer = () => {
    return (
      auctionInfo.auctioneer &&
      accountAddress &&
      ethers.utils.getAddress(auctionInfo.auctioneer) == ethers.utils.getAddress(accountAddress)
    )
  }

  const hasWinner = () => {
    return auctionInfo?.highestBidder != '0x0000000000000000000000000000000000000000'
  }

  onMount(async () => {
    loadAccount()
    loadAuction()
  })

  window.addEventListener('message', async (event: any) => {
    if (event.data.eventId == EVENT_ID.AccountConnected) {
      await loadAccount()
      await loadAuction()
    }
    if (event.data.eventId == EVENT_ID.AccountDisconnected) {
      networkId = ''
      accountAddress = ''
      accountBalance = ''
    }
  })

  let modal: any
</script>

<Layout>
  <div slot="main">
    {#if loading}
      <!-- <article>
        <a href={'#'} aria-busy="true" class="loading">Loading...</a>
      </article> -->
      <SkeletonAuctionDetail />
    {:else}
      <article>
        <div>
          <hgroup>
            <h1>{auctionInfo.name}</h1>
            <h2>
              {convertToDateTimeString(new Date(auctionInfo?.startTime * 1000))} - {convertToDateTimeString(
                new Date(auctionInfo?.endTime * 1000),
              )}
            </h2>
          </hgroup>
        </div>

        <div class="grid">
          <!-- Token info -->
          <div>
            <h5>Token Information</h5>
            <div class="token-info">
              <div>
                <img src={auctionInfo.tokenMetadata?.image} alt={auctionInfo.tokenMetadata?.name} />
                <div>
                  <strong>{auctionInfo.tokenMetadata?.name} #{auctionInfo.tokenMetadata?.id}</strong
                  >
                </div>
              </div>

              <div class="grid">
                <div class="label">Contract Address</div>
                <div class="content">
                  <Address
                    networkId={auctionInfo.networkId}
                    address={auctionInfo?.tokenMetadata?.address}
                  />
                </div>
              </div>
              <div class="grid">
                <div class="label">Token ID</div>
                <div class="content">{auctionInfo.tokenMetadata?.id}</div>
              </div>
            </div>
          </div>

          <div>
            <!-- Auction info -->
            <h5>Auction Information</h5>
            <div class="auction-info">
              <div class="grid">
                <div class="label">Auctioneer</div>
                <div class="content">
                  <Address networkId={auctionInfo.networkId} address={auctionInfo?.auctioneer} />
                </div>
              </div>

              <div class="grid">
                <div class="label">Auction Address</div>
                <div class="content">
                  <Address networkId={auctionInfo.networkId} address={auctionInfo?.address} />
                </div>
              </div>
              <div class="grid">
                <div class="label">Auction Type</div>
                <div class="content">{AUCTION_TYPE[auctionInfo.typeId]?.name}</div>
              </div>
              <div class="grid">
                <div class="label">Bid Address</div>
                <div class="content">
                  <Address
                    networkId={NETWORK_ID.oasis_sapphire_testnet}
                    address={auctionInfo?.bidAddress}
                  />
                </div>
              </div>

              <div class="grid">
                <div class="label">Reserve Price</div>
                <div class="content">
                  {toETH(auctionInfo?.reservePrice)}
                  {NETWORK[auctionInfo.networkId]?.currency}
                </div>
              </div>

              <div class="grid">
                <div class="label">Start Time</div>
                <div class="content">
                  {convertToDateTimeString(new Date(auctionInfo?.startTime * 1000))}
                </div>
              </div>

              <div class="grid">
                <div class="label">End Time</div>
                <div class="content">
                  {convertToDateTimeString(new Date(auctionInfo?.endTime * 1000))}
                </div>
              </div>

              <div class="grid">
                <div class="label">Participant</div>
                <div class="content">
                  {#if totalBiddersLoaded}
                    <span transition:fade>{auctionInfo?.totalBidders}</span>
                  {/if}
                </div>
              </div>
            </div>

            {#if auctionInfo.closed || auctionInfo.endTime * 1000 <= new Date().getTime()}
              <mark>
                <div class="bid" transition:fade>
                  <h5>Secret revealed</h5>

                  {#if !hasWinner()}
                    <div>The auction has no winner.</div>
                    <!-- TODO: refund NFT to auctioneer -->
                  {:else}
                    <div class="grid">
                      <div>Highest Bidder</div>
                      <div class="content">
                        <Address
                          networkId={NETWORK_ID.oasis_sapphire_testnet}
                          address={auctionInfo?.highestBidder}
                        />
                      </div>
                    </div>
                    <div class="grid">
                      <div>Highest Bid Price</div>
                      <div class="content">
                        {toETH(auctionInfo?.highestBid)}
                        {NETWORK[auctionInfo.networkId]?.currency}
                      </div>
                    </div>
                    <div>
                      {#if isTokenClaimed}
                        <div>Token is claimed already.</div>
                      {/if}
                    </div>
                  {/if}
                </div>
              </mark>
              <div>
                {#if networkId.toString() != auctionInfo?.networkId}
                  <mark
                    >You should connect wallet to {NETWORK[auctionInfo.networkId]?.name}
                    to claim the token.</mark
                  >
                  <button on:click={() => connectWallet(auctionInfo.networkId)}
                    >Connect Wallet</button
                  >
                {:else if hasWinner() && !isTokenClaimed}
                  <button
                    disabled={!isWinner()}
                    id="btn-claim"
                    class="success"
                    on:click={claimToken}>Claim Token</button
                  >
                {:else if isAuctioneer() && !isTokenClaimed}
                  <!-- TODO: refund to auctioneer -->
                  <button disabled={!isAuctioneer()} on:click={claimToken}>Withdraw Token</button>
                {/if}
              </div>
            {:else if auctionInfo.startTime * 1000 > new Date().getTime()}
              <mark>
                <TimeCountdown
                  startTime={auctionInfo.startTime * 1000}
                  endTime={auctionInfo.endTime * 1000}
                  closed={auctionInfo.closed}
                />
              </mark>
            {:else}
              <div class="bid">
                <div class="grid">
                  <div>
                    <strong>Your Bid Price ({NETWORK[auctionInfo.networkId]?.currency})</strong>
                  </div>
                  <!-- <div class="content">
                  Balance: {accountBalance}
                  {NETWORK[networkId]?.currency}
                </div> -->
                </div>
                <input type="number" placeholder="Enter amount" bind:value={bidPrice} />
                <div>
                  {#if accountAddress && networkId.toString() != NETWORK_ID.oasis_sapphire_testnet}
                    <mark
                      >You should connect wallet to {NETWORK[NETWORK_ID.oasis_sapphire_testnet]
                        ?.name}
                      to place a bid.</mark
                    >
                    <button on:click={() => connectWallet(NETWORK_ID.oasis_sapphire_testnet)}
                      >Connect Wallet</button
                    >
                  {:else}
                    <button id="btn-commit-bid" on:click={commitBid}>Place a Bid</button>
                    {#if isAuctioneer()}
                      <button id="btn-close-bid" class="danger" on:click={closeBid}
                        >Close Auction</button
                      >
                    {/if}
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        </div>
      </article>
    {/if}
  </div>
</Layout>

<Modal bind:modal />

<style>
  strong {
    font-weight: 500;
  }
  h5 {
    margin-bottom: 0.5rem;
    /* margin-top: 0.75rem; */
  }

  article {
    min-height: 850px;
  }

  mark h5 {
    color: var(--mark-color);
  }

  .label {
    color: var(--muted-color);
  }
  .content {
    text-align: right;
    font-weight: 600;
  }

  .token-info {
    border-radius: 0.5rem;
    border: 1px solid var(--form-element-border-color);
    padding: 1rem;
  }

  .auction-info div,
  .bid div {
    padding: 0.125rem;
  }

  button {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .danger {
    --background-color: var(--form-element-invalid-active-border-color);
    --border-color: var(--form-element-invalid-border-color);
  }

  .danger:hover {
    --background-color: rgba(211, 47, 47, 0.875);
    --border-color: var(--form-element-invalid-border-color);
    --box-shadow: var(--button-hover-box-shadow, 0 0 0 rgba(0, 0, 0, 0));
    --color: var(--primary-inverse);
  }

  .success {
    --background-color: var(--form-element-valid-active-border-color);
    --border-color: var(--form-element-valid-border-color);
  }

  .success:hover {
    --background-color: rgba(67, 160, 71, 0.875);
    --border-color: var(--form-element-valid-border-color);
    --box-shadow: var(--button-hover-box-shadow, 0 0 0 rgba(0, 0, 0, 0));
    --color: var(--primary-inverse);
  }
</style>
