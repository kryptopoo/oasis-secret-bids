<script lang="ts">
  import { Router, Link, Route } from 'svelte-routing'
  import Home from './lib/Home.svelte'
  import AuctionDetail from './lib/AuctionDetail.svelte'
  import AuctionCreation from './lib/AuctionCreation.svelte'
  import { EVENT_ID } from './lib/common/Constants'

  export let url = ''

  // handle metamask events
  const ethereum = (window as any).ethereum
  ethereum.on('accountsChanged', function (accounts: any[]) {
    if (accounts.length > 0) {
      window.postMessage({
        eventId: EVENT_ID.AccountConnected,
        eventData: {
          account: accounts[0],
          chainId: ethereum.networkVersion,
        },
      })

      localStorage.setItem('account', accounts[0])
    } else {
      window.postMessage({
        eventId: EVENT_ID.AccountDisconnected,
        eventData: {
          account: undefined,
          chainId: undefined,
        },
      })
    }

    console.log('accountsChanged', accounts)
  })

  ethereum.on('networkChanged', function (networkId: any) {
    console.log('networkChanged', networkId)
    window.postMessage({
      eventId: EVENT_ID.AccountConnected,
      eventData: {
        account: ethereum.selectedAddress,
        chainId: ethereum.networkVersion,
      },
    })
  })
</script>

<Router {url}>
  <div>
    <Route path="/"><Home /></Route>

    <Route path="/auction/:id" let:params>
      <AuctionDetail auctionUuid={params.id} />
    </Route>
    <Route path="/auction/create" component={AuctionCreation} />
  </div>
</Router>

<style>
</style>
