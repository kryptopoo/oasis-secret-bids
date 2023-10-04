<script lang="ts">
  import { Link } from 'svelte-routing'
  import { NETWORK } from '../common/Constants'
  import { toETH } from '../common/Utils'
  import type { Auction } from '../models/Auction'
  import { AuctionService } from '../services/AuctionService'
  import TimeCountdown from './TimeCountdown.svelte'
  import { UserIcon } from '@krowten/svelte-heroicons'

  export let auctionUuid: string
  export let auction: Auction

  const auctionService = new AuctionService('')
  const tags = auctionService.getTags(auction)
</script>

<Link to={`/auction/${auctionUuid}`} style="text-decoration: none">
  <article>
    <img src={auction.tokenMetadata.image} alt="" style="width: 100%;" />

    <div class="timer">
      <TimeCountdown
        startTime={auction.startTime * 1000}
        endTime={auction.endTime * 1000}
        closed={auction.closed}
      />
    </div>
    <div class="tags">
      {#each tags as tag}
        <div class="tag">{tag}</div>
      {/each}
    </div>

    <div class="info">
      <div>{auction.name}</div>
      <div class="grid">
        <div>{toETH(auction.reservePrice.toString())} {NETWORK[auction.networkId]?.currency}</div>
        <div class="right">
          <span class="tag2"><UserIcon width={18} />{auction.totalBidders}</span>
        </div>
      </div>
    </div>
  </article>
</Link>

<style>
  article {
    margin: 1rem;
    padding: 0rem;
    border-radius: 1rem;
    position: relative;
    /* color: var(--color) !important; */
  }

  article:hover {
    cursor: pointer;
  }

  img {
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
  }

  .info {
    padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  }

  .timer {
    position: absolute;
    top: 59%;
    background-color: var(--primary);
    color: white;
    border-radius: 0.4rem;
    padding: 0.15rem 0.4rem 0.15rem 0.4rem;
    margin: 0.25rem 0.5rem 0.25rem 0.5rem;
  }

  .tags {
    position: absolute;
    top: 70%;
    display: flex;
    gap: 0.2rem;
    margin: 0.25rem 0.5rem 0.25rem 0.5rem;
  }

  .tag {
    background: rgba(115, 130, 140, 0.6);
    color: rgb(255, 255, 255);
    border-radius: 0.4rem;
    padding: 0.07rem 0.4rem 0.07rem 0.4rem;
    font-size: medium;
    letter-spacing: 0.5px;
    font-weight: 400;
  }

  .tag2 {
    background: rgb(245, 245, 245);
    border-radius: 0.5rem;
    padding: 0.2rem 0.3rem 0.2rem 0.3rem;
    font-size: medium;
    letter-spacing: 0.5px;
    display: inline-block;
    width: 3rem;
    text-align: center;
  }
</style>
