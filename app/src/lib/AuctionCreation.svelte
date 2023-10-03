<script lang="ts">
  import { fade } from 'svelte/transition'
  import { navigate } from 'svelte-routing'
  import Layout from './Layout.svelte'
  import { AuctionService } from './services/AuctionService'
  import { convertToTimestamp } from './common/Utils'
  import { NftService } from './services/NftService'
  import AuctionCreateStep1 from './components/AuctionCreateStep1.svelte'
  import AuctionCreateStep2 from './components/AuctionCreateStep2.svelte'
  import AuctionCreateStep3 from './components/AuctionCreateStep3.svelte'
  import AuctionCreateStep4 from './components/AuctionCreateStep4.svelte'
  import { AuctionStore } from './models/Auction'
  import Modal from './components/Modal.svelte'
  import { ethers } from 'ethers'
  import { setLoadingButton, unsetLoadingButton } from './common/UI'

  let currentStep = 1
  let completedStep = 0

  function setCurrentStep(step: number) {
    currentStep = step
  }
  function setCompletedStep(step: number) {
    completedStep = step
  }

  const createAuction = async () => {
    setLoadingButton('btn-confirm')
    let createAuctionTx

    const nftService = new NftService($AuctionStore.tokenMetadata.address)
    const approvedAddress = await nftService.getApproved($AuctionStore.tokenMetadata.id)
    console.log('approvedAddress', approvedAddress)

    let approved =
      ethers.utils.getAddress(approvedAddress) == ethers.utils.getAddress($AuctionStore.address)
    if (!approved) {
      const approveTokenRs = await approveNft()
      approved = approveTokenRs != undefined
    }

    if (approved) {
      try {
        const auctionService = new AuctionService($AuctionStore.address)
        createAuctionTx = await auctionService.createAuction(
          $AuctionStore.name,
          $AuctionStore.tokenMetadata.address,
          $AuctionStore.tokenMetadata.id,
          convertToTimestamp($AuctionStore.startTimeString),
          convertToTimestamp($AuctionStore.endTimeString),
          $AuctionStore.reservePrice,
        )
        console.log('createAuctionTx', createAuctionTx)
      } catch (error) {
        console.log('createAuction', error)
      }
    }

    if (createAuctionTx) {
      modal.toggleModal('success', 'You have created the auction successfully.', true, () => {
        navigate('/', { replace: true })
      })
    } else modal.toggleModal('fail', 'You have created the auction failed.')

    unsetLoadingButton('btn-confirm')
  }

  const approveNft = async () => {
    let approveTx = undefined
    try {
      const nftService = new NftService($AuctionStore.tokenMetadata.address)
      approveTx = await nftService.approve($AuctionStore.address, $AuctionStore.tokenMetadata.id)
    } catch (error) {
      console.log('approveNft', error)
    }
    return approveTx
  }

  let modal: any
</script>

<Layout>
  <div slot="main">
    <article>
      <hgroup>
        <h3>Create Auction</h3>
        <!-- svelte-ignore a11y-missing-content -->
        <h2 />
      </hgroup>

      <div class="grid step-control">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class={currentStep == 1 ? 'active' : ''}
          on:click={() => {
            if (completedStep + 1 >= 1) setCurrentStep(1)
          }}
        >
          1. Creation Type
        </div>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class={currentStep == 2 ? 'active' : ''}
          on:click={() => {
            if (completedStep + 1 >= 2) setCurrentStep(2)
          }}
        >
          2. Token Information
        </div>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class={currentStep == 3 ? 'active' : ''}
          on:click={() => {
            if (completedStep + 1 >= 3) setCurrentStep(3)
          }}
        >
          3. Auction Settings
        </div>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class={currentStep == 4 ? 'active' : ''}
          on:click={() => {
            if (completedStep + 1 >= 4) setCurrentStep(4)
          }}
        >
          4. Confirmation
        </div>
      </div>

      <div id="step1" class={currentStep == 1 ? 'visible' : 'hidden'}>
        {#if currentStep == 1}
          <div transition:fade>
            <AuctionCreateStep1
              showBackButton={false}
              on:AuctionCreateStep:nextClick={() => {
                setCompletedStep(1)
                setCurrentStep(2)
              }}
              on:AuctionCreateStep:backClick={() => setCurrentStep(1)}
            />
          </div>
        {/if}
      </div>

      <div id="step2" class={currentStep == 2 ? 'visible' : 'hidden'}>
        {#if currentStep == 2}
          <div transition:fade>
            <AuctionCreateStep2
              on:AuctionCreateStep:nextClick={() => {
                setCompletedStep(2)
                setCurrentStep(3)
              }}
              on:AuctionCreateStep:backClick={() => setCurrentStep(1)}
            />
          </div>
        {/if}
      </div>

      <div id="step3" class={currentStep == 3 ? 'visible' : 'hidden'}>
        {#if currentStep == 3}
          <div transition:fade>
            <AuctionCreateStep3
              on:AuctionCreateStep:nextClick={() => {
                setCompletedStep(3)
                setCurrentStep(4)
              }}
              on:AuctionCreateStep:backClick={() => setCurrentStep(2)}
            />
          </div>
        {/if}
      </div>

      <!-- preview confirmation-->
      <div id="step4" class={currentStep == 4 ? 'visible' : 'hidden'}>
        {#if currentStep == 4}
          <div transition:fade>
            <AuctionCreateStep4 showBackButton={false} showNextButton={false} />
            <div class="grid">
              <div>
                <a
                  href={'#'}
                  class="secondary outline"
                  role="button"
                  on:click={() => setCurrentStep(3)}>Back</a
                >
              </div>
              <div class="right">
                <a href={'#'} role="button" id="btn-confirm" on:click={createAuction}>Confirm</a>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </article>
  </div>
</Layout>
<Modal bind:modal />

<style>
  article {
    padding: 2rem 4rem 2rem 4rem;
    min-height: 800px;
  }

  [role='button'] {
    min-width: 7.5rem;
    padding: 0.5rem 0.75rem;
  }

  .step-control {
    text-align: center;
    /* padding: 1rem; */
    margin-top: 0rem;
    margin-bottom: 1.5rem;
  }

  .step-control div {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 0.25rem solid var(--muted-color);
    cursor: pointer;
    font-weight: 600;
  }

  .step-control div:hover {
    background-color: var(--primary-focus);
  }

  .step-control div.active {
    border-bottom: 0.25rem solid var(--primary);
  }

  #step1,
  #step2,
  #step3,
  #step4 {
    padding: 0.25rem 6rem 0.25rem 6rem;
  }

  .visible {
    display: block;
  }

  .hidden {
    display: none;
  }
</style>
