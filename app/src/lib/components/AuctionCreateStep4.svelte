<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { AuctionStore, type Auction } from '../models/Auction'
  import { shortAddress } from '../common/Utils'
  import { AUCTION_TYPE, NETWORK, NETWORK_ID, TOKEN_TYPE } from '../common/Constants'
  import Address from './Address.svelte'

  export let showBackButton = true
  export let showNextButton = true

  const dispatch = createEventDispatcher()
  function nextClick() {
    dispatch('AuctionCreateStep:nextClick', {})
  }
  function backClick() {
    dispatch('AuctionCreateStep:backClick', {})
  }
</script>

<!-- preview confirmation-->
<hgroup>
  <h4>Creation Confirmation</h4>
  <h5>{AUCTION_TYPE[$AuctionStore?.typeId].name}</h5>
</hgroup>

<div class="preview">
  <div class="strong-label">{$AuctionStore.name}</div>

  <!-- token info -->
  <div class="strong-label">Token {TOKEN_TYPE[$AuctionStore.tokenTypeId].name}</div>
  <div class="grid">
    <div class="label">Token address</div>
    <div class="right">
      <Address networkId={$AuctionStore.networkId} address={$AuctionStore.tokenMetadata?.address} />
    </div>
  </div>
  <div class="grid">
    <div class="label">Token id</div>
    <div class="right">{$AuctionStore.tokenMetadata?.id}</div>
  </div>
  <div class="grid">
    <div class="label">Token name</div>
    <div class="right">{$AuctionStore.tokenMetadata?.name}</div>
  </div>
  <div class="grid">
    <div class="label">Token symbol</div>
    <div class="right">{$AuctionStore.tokenMetadata?.symbol}</div>
  </div>

  <!-- auction setting info -->
  <div class="strong-label">Auction Settings</div>
  <div class="grid">
    <div class="label">Auction address</div>
    <div class="right">
      <Address networkId={$AuctionStore.networkId} address={$AuctionStore.address} />
    </div>
  </div>
  <div class="grid">
    <div class="label">Bid address</div>
    <div class="right">
      <Address networkId={NETWORK_ID.oasis_sapphire_testnet} address={$AuctionStore.bidAddress} />
    </div>
  </div>
  <div class="grid">
    <div class="label">Auction type</div>
    <div class="right">{AUCTION_TYPE[$AuctionStore?.typeId].name}</div>
  </div>
  <div class="grid">
    <div class="label">Start time</div>
    <div class="right">{$AuctionStore.startTimeString}</div>
  </div>
  <div class="grid">
    <div class="label">End time</div>
    <div class="right">{$AuctionStore.endTimeString}</div>
  </div>
  <div class="grid">
    <div class="label">Reserve price</div>
    <div class="right">
      {$AuctionStore.reservePrice}
      {NETWORK[$AuctionStore.networkId]?.currency}
    </div>
  </div>
</div>

<mark>Token is required an approval transfer to the Auction contract</mark>

<div class="grid">
  {#if showBackButton}
    <div><a href={'#'} class="secondary outline" role="button" on:click={backClick}>Back</a></div>
  {/if}
  {#if showNextButton}
    <div class="right">
      <a id="btn-next-4" href={'#'} role="button" on:click={nextClick}>Next</a>
    </div>
  {/if}
</div>

<style>
  [role='button'] {
    min-width: 7.5rem;
    padding: 0.5rem 0.75rem;
  }

  .grid {
    padding: 0.1rem 0rem 0.1rem 0rem;
  }

  .label {
    color: var(--muted-color);
  }
  .strong-label {
    font-weight: 600;
    font-size: x-large;
    padding: 0.75rem 0rem 0.25rem 0rem;
  }

  .preview {
    gap: 1rem;
    border: 1px solid;
    border-radius: 0.25rem;
    border-color: var(--form-element-border-color);
    padding: 0rem 1rem 0.75rem 1rem;
    margin-bottom: 1rem;
  }
</style>
