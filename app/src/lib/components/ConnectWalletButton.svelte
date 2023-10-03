<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { ArrowLeftOnRectangleIcon, WalletIcon } from '@krowten/svelte-heroicons'
  import { AccountService } from '../services/AccountService'
  import { shortAddress } from '../common/Utils'
  import { EVENT_ID, NETWORK, NETWORK_ID } from '../common/Constants'
  import Address from './Address.svelte'

  const accountService = new AccountService()

  let accountAddress: string = ''
  let networkId: string = ''

  const connectWallet = async () => {
    await accountService.connect()
  }

  const disconnectWallet = async () => {
    await accountService.disconnect()
  }

  onMount(async () => {
    accountAddress = await accountService.getAccount()
    networkId = await accountService.getNetworkId()
  })

  window.addEventListener('message', (event: any) => {
    if (event.data.eventId == EVENT_ID.AccountConnected) {
      accountAddress = event.data.eventData.account
      networkId = event.data.eventData.chainId.toString()
      console.log('connectWalletButton chainId', networkId)
    }
    if (event.data.eventId == EVENT_ID.AccountDisconnected) {
      accountAddress = ''
      networkId = ''
    }
  })
</script>

{#if accountAddress == ''}
  <a href="#top" role="button" class="" on:click={connectWallet}
    ><WalletIcon width="24" />
    <span>
      {accountAddress ? shortAddress(accountAddress) : 'Connect Wallet'}
    </span></a
  >
{:else}
  <details role="list">
    <!-- svelte-ignore a11y-no-redundant-roles -->
    <summary aria-haspopup="listbox" class="" role="button"
      ><WalletIcon width="24" /><span
        >{accountAddress ? shortAddress(accountAddress) : 'Connect Wallet'}</span
      ></summary
    >
    <ul role="listbox">
      <li>
        <!-- <small>{NETWORK[networkId].name} </small> -->
        <small><Address {networkId} address={''} /></small>
      </li>
      <li>
        <a href={null} on:click={async () => await disconnectWallet()}
          ><ArrowLeftOnRectangleIcon width="24" /><span>Disconnect</span></a
        >
      </li>
    </ul>
  </details>
{/if}

<style>
  span {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }

  details[role='list'] summary + ul li {
    padding-left: 0.5rem;
  }

  details[role='list'] summary + ul li:hover {
    cursor: pointer;
  }
</style>
