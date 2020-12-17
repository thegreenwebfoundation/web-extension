/*
 * Options page
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 */


const TGWF_SETTINGS = [
  "annotate-search-results",
  "filter-out-grey-search-results",
  "check-outbound-links"
]

/**
 * Saves options using the Browser storage api.
 *
 *
 */
async function saveOptions(event) {
  event.preventDefault();
  const formSubmission = new FormData(event.target)

  // start with everything off, because a form submission only will contain
  // 'checked', or 'active' switches.
  let payload = {
    "annotate-search-results": 0,
    "filter-out-grey-search-results": 0,
    "check-outbound-links": 0,
  }
  // this means we only need ti check for the existence of the key
  // to set it as a truthy valye

  for (const key of formSubmission.keys()) {
    if (TGWF_SETTINGS.includes(key)) {
      payload[key] = 1
    }
  }
  try {
    //  an empty promise is returned by the storage API, so there's nothing
    // to return or inspect when we call set()
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
  let results
  try {
    results = await browser.storage.local.get(TGWF_SETTINGS)

  } catch (error) {
    console.error(`Something went wrong fetching from the sync: ${error.message}`)
  }
  return results
}

function updateFormSettings(results) {


  console.log(results)

  if (results) {

    // clear out inputs
    const inputs = document.querySelectorAll('form.tgwf-settings input')
    for (input of inputs) {
      input.checked = false
    }

    for (const [key, value] of Object.entries(results)) {
      if (value) {
        input = document.querySelector(`[name='${key}']`)
        input.checked = true
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
