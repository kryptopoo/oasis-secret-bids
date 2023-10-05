<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { AuctionStore } from '../models/Auction'
  import { AccountService } from '../services/AccountService'
  import {
    AUCTION_TYPE,
    AUCTION_TYPE_ID,
    EVENT_ID,
    NETWORK,
    NETWORK_ID,
    TOKEN_TYPE,
    CONTRACT,
    TOKEN_TYPE_ID,
  } from '../common/Constants'

  export let showBackButton = true
  export let showNextButton = true

  const accountService = new AccountService()

  let networks = [
    NETWORK[NETWORK_ID.bsc_testnet],
    NETWORK[NETWORK_ID.polygon_mumbai],
    NETWORK[NETWORK_ID.eth_goerli],
  ]
  let tokenTypes = [TOKEN_TYPE.erc721, TOKEN_TYPE.erc1155, TOKEN_TYPE.erc20]
  let auctionTypes = [AUCTION_TYPE.blind, AUCTION_TYPE.lottery]

  const dispatch = createEventDispatcher()
  function nextClick() {
    dispatch('AuctionCreateStep:nextClick', {})
  }
  function backClick() {
    dispatch('AuctionCreateStep:backClick', {})
  }

  function validateData() {
    const isValid =
      $AuctionStore.networkId != '' &&
      $AuctionStore.tokenTypeId != '' &&
      $AuctionStore.typeId != '' &&
      $AuctionStore.auctioneer != ''

    if (isValid) document.getElementById('btn-next')?.removeAttribute('disabled')
    else document.getElementById('btn-next')?.setAttribute('disabled', '')
  }

  const connectWallet = async () => {
    const accountService = new AccountService()
    try {
      await accountService.changeNetwork($AuctionStore.networkId)
      await accountService.connect()
    } catch (error) {
      console.log('error', error)
    }

    $AuctionStore.auctioneer = await accountService.getAccount()
  }

  window.addEventListener('message', (event: any) => {
    if (event.data.eventId == EVENT_ID.AccountConnected) {
      $AuctionStore.auctioneer = event.data.eventData.account
    }
    if (event.data.eventId == EVENT_ID.AccountDisconnected) {
      $AuctionStore.auctioneer = ''
    }
  })

  onMount(async () => {
    try {
      $AuctionStore.auctioneer = await accountService.getAccount()
    } catch (error) {}

    validateData()
  })
</script>

<hgroup>
  <h4>Creation Type</h4>
  <h5>Select auction type and network</h5>
</hgroup>

<details role="list" id="networks-dropdown">
  <summary aria-haspopup="listbox">
    {#if $AuctionStore.networkId}
      <img
        src={NETWORK[$AuctionStore.networkId]?.logo}
        alt={NETWORK[$AuctionStore.networkId].name}
      />
      {NETWORK[$AuctionStore.networkId].name}
    {:else}
      Select network
    {/if}
  </summary>
  <ul role="listbox">
    {#each networks as network}
      <li>
        <a
          href={'#'}
          on:click={async () => {
            $AuctionStore.networkId = network.id
            $AuctionStore.address = CONTRACT[$AuctionStore.networkId].AUCTION
            $AuctionStore.bidAddress = CONTRACT[$AuctionStore.networkId].BID
            document.getElementById('networks-dropdown')?.removeAttribute('open')
            validateData()

            const currentNetworkId = await accountService.getNetworkId()
            if (currentNetworkId.toString() != $AuctionStore.networkId) {
              await accountService.changeNetwork($AuctionStore.networkId)
            }
          }}><img src={NETWORK[network.id]?.logo} alt={network.name} />{network.name}</a
        >
      </li>
    {/each}
  </ul>
</details>

<details role="list" id="token-types-dropdown">
  <summary aria-haspopup="listbox"
    >{$AuctionStore.tokenTypeId
      ? TOKEN_TYPE[$AuctionStore.tokenTypeId].name
      : 'Select token type'}</summary
  >
  <ul role="listbox">
    {#each tokenTypes as tokenType}
      <li>
        {#if tokenType.id != TOKEN_TYPE_ID.erc721}
          <a href={'#'}>{tokenType.name} (Not yet support)</a>
        {:else}
          <a
            href={null}
            on:click={() => {
              $AuctionStore.tokenTypeId = tokenType.id
              document.getElementById('token-types-dropdown')?.removeAttribute('open')
              validateData()
            }}>{tokenType.name}</a
          >
        {/if}
      </li>
    {/each}
  </ul>
</details>

<details role="list" id="auction-types-dropdown">
  <summary aria-haspopup="listbox"
    >{$AuctionStore.typeId
      ? AUCTION_TYPE[$AuctionStore.typeId].name
      : 'Select auction type'}</summary
  >
  <ul role="listbox">
    {#each auctionTypes as type}
      <li>
        {#if type.id != AUCTION_TYPE_ID.blind}
          <a href={'#'}>{type.name} (Not yet support)</a>
        {:else}
          <a
            href={'#'}
            on:click={() => {
              $AuctionStore.typeId = type.id
              document.getElementById('auction-types-dropdown')?.removeAttribute('open')
              validateData()
            }}>{type.name}</a
          >
        {/if}
      </li>
    {/each}
  </ul>
</details>

<input
  name="creator"
  placeholder="Wallet Creator"
  readonly
  bind:value={$AuctionStore.auctioneer}
  on:keyup={() => validateData()}
/>

<div class="grid">
  <div>
    {#if showBackButton}
      <a href={'#'} class="secondary outline" role="button" on:click={backClick}>Back</a>
    {/if}
  </div>
  <div class="right">
    {#if showNextButton}
      <a
        href={'#'}
        role="button"
        id="btn-connect"
        on:click={connectWallet}
        class={$AuctionStore.auctioneer == '' ? 'visible' : 'hidden'}>Connect Wallet</a
      >
      <a
        href={'#'}
        role="button"
        id="btn-next"
        on:click={nextClick}
        class={$AuctionStore.auctioneer != '' ? 'visible' : 'hidden'}>Next</a
      >
    {/if}
  </div>
</div>

<style>
  [role='button'] {
    min-width: 7.5rem;
    padding: 0.5rem 0.75rem;
  }
  input:not([type='checkbox'], [type='radio']) {
    margin-bottom: 0.75rem;
  }
  img {
    margin-top: -5px;
    margin-right: 10px;
    width: 32px;
  }
  .visible {
    display: inline-block;
  }

  .hidden {
    display: none;
  }
</style>
