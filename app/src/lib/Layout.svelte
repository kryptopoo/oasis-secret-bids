<script lang="ts">
  import Header from './components/Header.svelte'
  import Footer from './components/Footer.svelte'
</script>

<Header />
<main class="container">
  <slot name="main" />
</main>
<Footer />

<style>
</style>
