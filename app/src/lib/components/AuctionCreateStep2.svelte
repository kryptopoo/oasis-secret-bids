<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { AuctionStore } from '../models/Auction'
  import { NftService } from '../services/NftService'
  import { buildAddressUrl, shortAddress } from '../common/Utils'
  import Address from './Address.svelte'
  import { AUCTION_TYPE, TOKEN_TYPE } from '../common/Constants'
  import SkeletonTokenMetadata from './SkeletonTokenMetadata.svelte'

  export let showBackButton = true
  export let showNextButton = true

  let loading = true

  const loadNftMetadata = async () => {
    loading = true

    // reset info
    $AuctionStore.tokenMetadata.name = ''
    $AuctionStore.tokenMetadata.description = ''
    $AuctionStore.tokenMetadata.image = ''
    $AuctionStore.tokenMetadata.symbol = ''

    const tokenAddress = $AuctionStore.tokenMetadata.address
    const tokenId = Number($AuctionStore.tokenMetadata.id)

    console.log(tokenAddress, tokenId)

    if (tokenAddress != '' && tokenId > 0) {
      try {
        const nftService = new NftService(tokenAddress)
        const tokenMetadata = await nftService.getMetadata(tokenId)
        console.log('tokenMetadata', tokenMetadata)

        if (tokenMetadata) {
          $AuctionStore.tokenMetadata.name = tokenMetadata.name
          $AuctionStore.tokenMetadata.description = tokenMetadata.description
          $AuctionStore.tokenMetadata.image = tokenMetadata.image

          const symbol = await nftService.getSymbol()
          $AuctionStore.tokenMetadata.symbol = symbol
        }
      } catch (error) {
        console.log('loadNftMetadata', error)
      }
    }

    loading = false

    // const owner = await nftService.getOwner(tokenId)
    // console.log('owner', owner)

    // const approvedAddress = await nftService.getApproved(tokenId)
    // console.log('approvedAddress', approvedAddress)
  }

  const dispatch = createEventDispatcher()
  function nextClick() {
    dispatch('AuctionCreateStep:nextClick', {})
  }
  function backClick() {
    dispatch('AuctionCreateStep:backClick', {})
  }

  function validateData() {
    const isValid = $AuctionStore.tokenMetadata.address != '' && $AuctionStore.tokenMetadata.id > 0

    if (isValid) document.getElementById('btn-next-2')?.removeAttribute('disabled')
    else document.getElementById('btn-next-2')?.setAttribute('disabled', '')
  }

  onMount(async () => {
    await loadNftMetadata()
    validateData()
  })
</script>

<hgroup>
  <h4>Token Information - {TOKEN_TYPE[$AuctionStore.tokenTypeId].name}</h4>
  <h5>{AUCTION_TYPE[$AuctionStore.typeId].name}</h5>
</hgroup>

<label>
  <div class="grid">
    <div>Token address</div>
    <div class="right"><Address networkId={$AuctionStore.networkId} address={''} /></div>
  </div>

  <input
    placeholder="address..."
    bind:value={$AuctionStore.tokenMetadata.address}
    on:change={() => loadNftMetadata().then(() => validateData())}
  />
</label>

<div class="grid">
  <label>
    Token Id
    <input
      placeholder="Token Id"
      bind:value={$AuctionStore.tokenMetadata.id}
      on:keyup={() => loadNftMetadata().then(() => validateData())}
    />
  </label>
  <label>
    Token symbol
    <input placeholder="symbol" value={$AuctionStore.tokenMetadata?.symbol} readonly />
  </label>

  <!-- <input
    placeholder="Token decimal"
    value={$AuctionStore.tokenMetadata?.decimal}
    readonly
  /> -->
</div>
{#if $AuctionStore.tokenMetadata.address != '' && $AuctionStore.tokenMetadata.id > 0}
  {#if loading}
    <!-- <div>
      <a href={'#'} aria-busy="true" class="loading">Loading metadata...</a>
    </div> -->
    <SkeletonTokenMetadata />
  {:else if $AuctionStore.tokenMetadata.name != ''}
    <div>Token Preview</div>
    <div class="preview">
      <img src={$AuctionStore.tokenMetadata.image} alt={$AuctionStore.tokenMetadata.name} />
      <div class="content">
        <div class="grid">
          <div class="label">Address</div>
          <div class="right">
            <a
              href={buildAddressUrl($AuctionStore.networkId, $AuctionStore.tokenMetadata.address)}
              target="_blank"
            >
              {shortAddress($AuctionStore.tokenMetadata.address)}</a
            >
          </div>
        </div>
        <div class="grid">
          <div class="label">Id</div>
          <div class="right">{$AuctionStore.tokenMetadata.id}</div>
        </div>
        <div class="grid">
          <div class="label">Name</div>
          <div class="right">{$AuctionStore.tokenMetadata.name}</div>
        </div>
        <div class="grid">
          <div class="label">Description</div>
          <div class="right">{$AuctionStore.tokenMetadata.description}</div>
        </div>
      </div>
    </div>
  {/if}
{/if}

<div class="grid">
  {#if showBackButton}
    <div><a href={'#'} class="secondary outline" role="button" on:click={backClick}>Back</a></div>
  {/if}
  {#if showNextButton}
    <div class="right">
      <a href={'#'} role="button" id="btn-next-2" on:click={nextClick}>Next</a>
    </div>
  {/if}
</div>

<style>
  [role='button'] {
    min-width: 7.5rem;
    padding: 0.5rem 0.75rem;
  }

  .preview {
    display: flex;
    gap: 0.25rem;
    border: 1px solid;
    border-radius: 0.25rem;
    border-color: var(--form-element-border-color);
    padding: 0rem;
    margin-bottom: 1rem;
  }

  .preview img {
    width: 280px;
    height: 280px;
  }

  .preview .content {
    padding: 1rem 2rem 1rem 1rem;
    width: 440px;
  }
</style>
