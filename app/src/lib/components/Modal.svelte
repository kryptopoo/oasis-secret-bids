<script lang="ts">
  import { CheckCircleIcon, CheckIcon, ExclamationCircleIcon } from '@krowten/svelte-heroicons'
  import { Confetti } from 'svelte-confetti'

  // Config
  const isOpenClass = 'modal-is-open'
  const openingClass = 'modal-is-opening'
  const closingClass = 'modal-is-closing'
  const animationDuration = 300 // ms
  let visibleModal: any = null

  // Toggle modal
  const toggleModal = (event: any) => {
    if (event) event.preventDefault()
    const modal = document.getElementById('modal')
    console.log('modal', modal)
    typeof modal != 'undefined' && modal != null && isModalOpen(modal)
      ? closeModal(modal)
      : openModal(modal)
  }

  // Open modal
  const openModal = (modal: any) => {
    // if (isScrollbarVisible()) {
    //   document.documentElement.style.setProperty('--scrollbar-width', `${getScrollbarWidth()}px`)
    // }
    // document.documentElement.classList.add(isOpenClass, openingClass)
    // setTimeout(() => {
    //   visibleModal = modal
    //   document.documentElement.classList.remove(openingClass)
    // }, animationDuration)

    // visibleModal = modal
    modal.setAttribute('open', true)
  }

  // Close modal
  const closeModal = (modal: any) => {
    visibleModal = null
    modal.removeAttribute('open')

    // document.documentElement.classList.add(closingClass)
    // setTimeout(() => {
    //   document.documentElement.classList.remove(closingClass, isOpenClass)
    //   document.documentElement.style.removeProperty('--scrollbar-width')
    //   modal.removeAttribute('open')
    // }, animationDuration)
  }

  // Close with a click outside
  document.addEventListener('click', (event) => {
    if (visibleModal != null) {
      const modalContent = visibleModal.querySelector('article')
      const isClickInside = modalContent.contains(event.target)
      !isClickInside && closeModal(visibleModal)
    }
  })

  // Close with Esc key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && visibleModal != null) {
      closeModal(visibleModal)
    }
  })

  // Get scrollbar width
  const getScrollbarWidth = () => {}

  // Is scrollbar visible
  const isScrollbarVisible = () => {
    return document.body.scrollHeight > screen.height
  }

  // Is modal open
  const isModalOpen = (modal: any) => {
    return modal.hasAttribute('open') && modal.getAttribute('open') != 'false' ? true : false
  }

  let type = 'success'
  let message = ''
  let okClickCallback: any = undefined
  let isShowConfetti = false

  function okClick() {
    toggleModal(null)
    console.log('okClickCallback', okClickCallback)
    if (okClickCallback) okClickCallback()
  }

  export const modal = {
    toggleModal(
      modalType: string = '',
      msg: string = '',
      showConfetti: false,
      okCallback: any = undefined,
    ) {
      type = modalType
      message = msg
      okClickCallback = okCallback
      isShowConfetti = showConfetti
      toggleModal(null)
    },
  }
</script>

<!-- Modal -->
<dialog id="modal">
  <article>
    <a href="#close" aria-label="Close" class="close" data-target="modal" on:click={toggleModal} />
    <div class="center">
      {#if type == 'success'}
        <p class="success"><CheckCircleIcon width={192} /></p>
      {/if}
      {#if type == 'fail'}
        <p class="fail"><ExclamationCircleIcon width={192} /></p>
      {/if}
      <p>{message}</p>
    </div>

    <footer>
      <!-- <a href="#cancel" role="button" class="secondary" data-target="modal" on:click={toggleModal}>
        Cancel
      </a> -->
      <a href="#confirm" role="button" data-target="modal" on:click={okClick}>Got it</a>
    </footer>
  </article>

  {#if isShowConfetti}
    <div class="confetti-container">
      <Confetti
        x={[-5, 5]}
        y={[0, 0.1]}
        delay={[500, 2000]}
        infinite
        fallDistance="100vh"
        amount={200}
        size={20}
      />
    </div>
  {/if}
</dialog>

<style>
  article {
    min-width: 500px !important;
  }
  article > footer {
    margin-top: 1rem;
  }
  .success {
    color: var(--ins-color);
  }
  .fail {
    color: var(--del-color);
  }
  [role='button'] {
    min-width: 5rem;
    padding: 0.5rem 0.75rem;
  }
  .confetti-container {
    position: fixed;
    top: -50px;
    left: 0;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    overflow: hidden;
    pointer-events: none;
  }
</style>
