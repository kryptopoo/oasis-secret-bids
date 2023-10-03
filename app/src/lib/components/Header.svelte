<script lang="ts">
  import { Link } from 'svelte-routing'
  import ConnectWalletButton from './ConnectWalletButton.svelte'
  import CreateAuctionButton from './CreateAuctionButton.svelte'
  import Search from './Search.svelte'

  import logo from '../../assets/images/logo.png'
</script>

<!-- Nav -->
<nav class="container-fluid">
  <ul>
    <li><Link to="/"><img src={logo} alt="Secret Bids" class="logo" /></Link></li>
  </ul>
  <ul>
    <li>
      <Search />
    </li>
  </ul>
  <ul>
    <li>
      <CreateAuctionButton />
    </li>
    <li>
      <ConnectWalletButton />
    </li>
  </ul>
</nav>

<style>
  .logo {
    height: 50px;
  }
</style>
