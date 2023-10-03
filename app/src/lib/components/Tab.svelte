<script lang="ts">
  export let headers: string[]

  import { onMount } from 'svelte'

  onMount(() => {
    const nodeList = document.querySelectorAll('[role="tab-control"] label')
    const eventListenerCallback = setActiveState.bind(null, nodeList)

    nodeList[0].classList.add('active') /** add active class to first node  */

    nodeList.forEach((node) => {
      node.addEventListener(
        'click',
        eventListenerCallback,
      ) /** add click event listener to all nodes */
    })

    /** the click handler */
    function setActiveState(nodeList: any, event: any) {
      nodeList.forEach((node: any) => {
        node.classList.remove('active') /** remove active class from all nodes */
      })
      event.target.classList.add('active') /* set active class on current node */
    }
  })
</script>

<div class="tab-container">
  <!-- svelte-ignore a11y-unknown-role -->
  <div role="tab-control">
    <div class="grid">
      {#each headers as header, index}
        <label for={`tab${index + 1}`} class={index == 0 ? 'active' : ''}>{header}</label>
      {/each}
    </div>
  </div>
  <!-- svelte-ignore a11y-unknown-role -->
  <div role="tabs">
    <section>
      <input hidden={true} type="radio" name="tabs" id="tab1" checked={true} />
      <figure>
        <slot name="tab-content-1" />
      </figure>

      <input hidden={true} type="radio" name="tabs" id="tab2" />
      <figure>
        <slot name="tab-content-2" />
      </figure>

      <input hidden={true} type="radio" name="tabs" id="tab3" />
      <figure>
        <slot name="tab-content-3" />
      </figure>
    </section>
  </div>
</div>

<style>
  .tab-container {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  [role='tabs'] {
    display: flex;
    padding: 1.5rem 0 1.5rem 0;
  }

  [role='tabs'] section {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  [role='tabs'] figure {
    flex-grow: 1;
    width: 100%;
    height: 100%;
    display: none;
  }

  [role='tabs'] [type='radio']:checked + figure {
    display: block;
    transition: 1s ease;
  }

  [role='tab-control'] label {
    cursor: pointer;
    text-align: center;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid transparent;
  }

  [role='tab-control'] label.active {
    color: var(--contract);
    font-weight: 600;
    border-bottom: 2px solid var(--primary);
    transition: 0.25s ease;
  }
</style>
