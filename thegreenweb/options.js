/*
 * Options page
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 */

/**
 * Saves options to Chrome storage api.
 *
 * 0 = search enabled
 * 1 = search disabled
 */
async function saveOptions(event) {
  event.preventDefault();
  const formSubmission = new FormData(event.target)

  // start with everything off, because a form submission only will contain
  // 'checked', or 'active' switched
  let payload = {
    "tgwf_search_disabled": 1,
    "tgwf_all_disabled": 1,
    "tgwf_filter_enabled": 1
  }

  for (const key of formSubmission.keys()) {
    switch (key) {
      case "toggle-web-search":
        payload.tgwf_search_disabled = 0
        break;
      case "toggle-link-check":
        payload.tgwf_all_disabled = 0
        break;
      case "toggle-ethical-filter":
        payload.tgwf_filter_enabled = 0
        break;
      default:
        break;
    }
  }
  try {
    //  an empty promise is returned by the storage API, so there's nothing
    // to return or inspect
    await browser.storage.local.set(payload)
    const successMessage = "Your settings have been saved. If you have any search pages open you will need to reload them to see the changes."
    acknowledgeSave(successMessage)
  } catch (error) {
    console.error(`Something went wrong syncing: ${error.message}`)
  }
}

/**
 * Fetch the settings from storage and update the state of the form to
 * include them
 */
async function loadOptions() {
  const keys = [
    "tgwf_search_disabled",
    "tgwf_all_disabled",
    "tgwf_filter_enabled"
  ]
  let results
  try {
    results = await browser.storage.local.get(keys)
    ack
  } catch (error) {
    console.error(`Something went wrong fetching from the sync: ${error.message}`)
  }
  return results
}

function updateFormSettings(results) {

  const mappings = {
    "tgwf_search_disabled": "toggle-web-search",
    "tgwf_all_disabled": "toggle-link-check",
    "tgwf_filter_enabled": "toggle-ethical-filter"
  }
  console.log(results)

  if (results) {
    for (const [key, value] of Object.entries(results)) {
      // we need to *invert* these, because we store if a
      // feture is disabled, not enabled
      if (!value) {
        const switchToUpdate = mappings[key]
        input = document.querySelector(`[name='${switchToUpdate}']`)
        input.checked = true
      }
      if (value) {
        const switchToUpdate = mappings[key]
        input = document.querySelector(`[name='${switchToUpdate}']`)
        input.checked = false
      }
    }
  }


}

/**
 * Show a message for when a user makes a submission
 * to show if it was successful or not.
 */
function acknowledgeSave(message) {
  const announcement = document.querySelector('#announcement')
  announcement.querySelector('.message').textContent = message
  announcement.classList.remove('hidden')

  // removing the hidden class makes this detectable to
  // screen readers, conveying the text to the user
  // using accessibility software
  // we need the timeout to allow the user
  // to register the layout changing before fading in
  setTimeout(function () {
    announcement.classList.add('opacity-100')
    announcement.classList.remove('opacity-0')
    }, 100
  )

}
/**
 * dismiss the alert message, fading it out,
 * then hiding it from the DOM after a short delay
 */
function dismissAlert() {
  announcement.classList.remove('opacity-100')
  announcement.classList.add('opacity-0')
  // once it's invisible, we want make it hidden, so it
  // doesn't show up to screen readers, but we want
  // to wait for the fade out first
  setTimeout(function () {
    announcement.classList.add('hidden')
    }, 100
  )

}

function catchError(err) {
  console.error(`Something went wrong fetching from storage: ${error.message}`)
}
/**
 * Resets the form, returning the settings back to
 * the saved state.
 * @param Event event - the click event from the passed reset button
 */
function resetForm(event) {
  event.preventDefault()
  event.stopPropagation()
  loadOptions().then(updateFormSettings, catchError)
}

const settingsForm = document.querySelector("form.tgwf-settings")
const resetButton = document.querySelector("button[name='reset']")
const announcement = document.querySelector('#announcement')
const closeButton = announcement.querySelector('button')

const loadReq = loadOptions()
const results = loadReq.then(updateFormSettings, catchError)

settingsForm.addEventListener("submit", saveOptions)
resetButton.addEventListener("click", resetForm)
closeButton.addEventListener('click', dismissAlert)
