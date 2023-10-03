<script lang="ts">
  import { NETWORK, NETWORK_ID } from '../common/Constants'
  import { buildAddressUrl, shortAddress } from '../common/Utils'

  export let networkId: string
  export let address: string
</script>

<img class="asset-logo-small" src={NETWORK[networkId]?.logo} alt={NETWORK[networkId]?.name} />
{#if address}
  <a href={buildAddressUrl(networkId, address)} target="_blank"> {shortAddress(address)}</a>
{:else}
  {NETWORK[networkId]?.name}
{/if}
