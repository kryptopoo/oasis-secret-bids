const setInvalid = (elementId: string) => {
  document.getElementById(elementId)?.setAttribute('aria-invalid', 'true')
}

const setValid = (elementId: string) => {
  document.getElementById(elementId)?.setAttribute('aria-invalid', 'false')
}

const setVisible = (elementId: string, visible: boolean) => {
  document
    .getElementById(elementId)
    ?.setAttribute('style', `display: ${!visible ? 'none' : 'block'}`)
}

const unsetValidation = (elementId: string) => {
  document.getElementById(elementId)?.removeAttribute('aria-invalid')
  document.getElementById(elementId)?.removeAttribute('disabled')
}

const setDisable = (elementId: string) => {
  document.getElementById(elementId)?.setAttribute('disabled', 'true')
}

const unsetDisable = (elementId: string) => {
  document.getElementById(elementId)?.removeAttribute('disabled')
}

const setLoadingButton = (elementId: string, loadingText: string = '') => {
  let btn = document.getElementById(elementId)
  if (btn) {
    btn.setAttribute('aria-busy', 'true')
    if (loadingText != '') btn.textContent = loadingText
  }
}

const unsetLoadingButton = (elementId: string, text: string = '') => {
  let btn = document.getElementById(elementId)
  if (btn) {
    btn.removeAttribute('aria-busy')
    if (text != '') btn.textContent = text
  }
}

const setCopiedTooltip = (element: Element) => {
  element.setAttribute('data-tooltip', 'copied')
  setTimeout(() => {
    element.removeAttribute('data-tooltip')
  }, 1000)
}

export {
  setVisible,
  setInvalid,
  setValid,
  unsetValidation,
  setDisable,
  unsetDisable,
  setLoadingButton,
  unsetLoadingButton,
  setCopiedTooltip,
}
