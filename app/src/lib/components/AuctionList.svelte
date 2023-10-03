<script lang="ts">
  import type { Auction } from '../models/Auction'
  import AuctionCard from './AuctionCard.svelte'

  export let auctions: Auction[]
</script>

{#each auctions as auction, index}
  {#if index % 3 == 0}
    <div class="grid">
      <AuctionCard auction={auctions[index]} auctionUuid={auctions[index].uuid} />
      {#if index + 1 < auctions.length}
        <AuctionCard auction={auctions[index + 1]} auctionUuid={auctions[index + 1].uuid} />
      {:else}
        <div />
      {/if}
      {#if index + 2 < auctions.length}
        <AuctionCard auction={auctions[index + 2]} auctionUuid={auctions[index + 2].uuid} />
      {:else}
        <div />
      {/if}
    </div>
  {/if}
{/each}
