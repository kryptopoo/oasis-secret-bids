<script lang="ts">
  import Layout from './Layout.svelte'
  import Tab from './components/Tab.svelte'
  import AuctionList from './components/AuctionList.svelte'
  import SkeletonCard from './components/SkeletonAuctionCard.svelte'
  import { API_URL } from './common/Constants'

  const getAuctions = async () => {
    var res = await fetch(`${API_URL}/auctions`)
    var result = await res.json()
    return result
  }

  let auctionsPromise = getAuctions()
</script>

<Layout>
  <div slot="main">
    {#await auctionsPromise}
      <Tab headers={['Active Auctions', 'Upcoming Auctions', 'Ended Auctions']}>
        <div slot="tab-content-1">
          <!-- <a href={'#'} aria-busy="true" class="loading">Loading...</a> -->

          {#each { length: 2 } as _, index}
            <div class="grid">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          {/each}
        </div>
        <div slot="tab-content-2" />
        <div slot="tab-content-3" />
      </Tab>
    {:then res}
      <Tab headers={['Active Auctions', 'Upcoming Auctions', 'Ended Auctions']}>
        <div slot="tab-content-1">
          {#if res.activeAuctions.length == 0}
            <p>No active auctions.</p>
          {:else}
            <AuctionList auctions={res.activeAuctions} />
          {/if}
        </div>
        <div slot="tab-content-2">
          {#if res.upcomingAuctions.length == 0}
            <p>No upcoming auctions.</p>
          {:else}
            <AuctionList auctions={res.upcomingAuctions} />
          {/if}
        </div>
        <div slot="tab-content-3">
          {#if res.endedAuctions.length == 0}
            <p>No ended auctions.</p>
          {:else}
            <AuctionList auctions={res.endedAuctions} />
          {/if}
        </div>
      </Tab>
    {:catch err}
      <h2>Error while loading the data</h2>
    {/await}
  </div>
</Layout>

<style>
  p {
    padding: 1rem 0 1rem 0;
    font-size: x-large;
    text-align: center;
  }
</style>
