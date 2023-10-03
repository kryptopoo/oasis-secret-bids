<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { AuctionStore } from '../models/Auction'
  import { AUCTION_TYPE, NETWORK, NETWORK_ID } from '../common/Constants'
  import Address from './Address.svelte'
  import { buildAddressUrl } from '../common/Utils'

  // export let auction: Auction
  export let showBackButton = true
  export let showNextButton = true

  const dispatch = createEventDispatcher()
  function nextClick() {
    dispatch('AuctionCreateStep:nextClick', {})
  }
  function backClick() {
    dispatch('AuctionCreateStep:backClick', {})
  }

  function validateData() {
    const isValid =
      $AuctionStore.address != '' && $AuctionStore.name != '' && $AuctionStore.reservePrice > 0

    if (isValid) document.getElementById('btn-next-3')?.removeAttribute('disabled')
    else document.getElementById('btn-next-3')?.setAttribute('disabled', '')
  }

  onMount(() => {
    validateData()
  })
</script>

<hgroup>
  <h4>Auction Setting</h4>
  <h5>{AUCTION_TYPE[$AuctionStore?.typeId].name}</h5>
</hgroup>

<div>
  <label>
    <div class="grid">
      <div>Auction Address</div>
      <div class="right">
        <Address networkId={$AuctionStore.networkId} address={''} />
      </div>
    </div>
    <input type="text" placeholder="address" value={$AuctionStore?.address} readonly />
    <small
      ><a target="_blank" href={buildAddressUrl($AuctionStore.networkId, $AuctionStore?.address)}
        >View on explorer</a
      ></small
    >
  </label>

  <label>
    <div class="grid">
      <div>Bid Address</div>
      <div class="right">
        <Address networkId={NETWORK_ID.oasis_sapphire_testnet} address={''} />
      </div>
    </div>

    <input type="text" placeholder="address" value={$AuctionStore?.bidAddress} readonly />
    <small
      ><a
        target="_blank"
        href={buildAddressUrl(NETWORK_ID.oasis_sapphire_testnet, $AuctionStore?.bidAddress)}
        >View on explorer</a
      ></small
    >
  </label>

  <label>
    Name
    <input
      type="text"
      placeholder="Name"
      bind:value={$AuctionStore.name}
      on:keyup={() => validateData()}
    />
  </label>
  <div class="grid">
    <label>
      Start Time
      <input
        type="datetime-local"
        placeholder="Start Time"
        bind:value={$AuctionStore.startTimeString}
      />
    </label>
    <label>
      End Time
      <input
        type="datetime-local"
        placeholder="End Time"
        bind:value={$AuctionStore.endTimeString}
      />
    </label>
  </div>

  <label>
    Reserve Price
    <input
      type="number"
      placeholder="Reserve Price"
      bind:value={$AuctionStore.reservePrice}
      on:change={() => validateData()}
    />
  </label>
</div>

<div class="grid">
  <div>
    {#if showBackButton}
      <a href={'#'} class="secondary outline" role="button" on:click={backClick}>Back</a>
    {/if}
  </div>
  <div class="right">
    {#if showNextButton}
      <a id="btn-next-3" href={'#'} role="button" on:click={nextClick}>Next</a>
    {/if}
  </div>
</div>

<style>
  [role='button'] {
    min-width: 7.5rem;
    padding: 0.5rem 0.75rem;
  }
</style>
