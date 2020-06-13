/*
 * Options page
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2020
 */

/**
 * Saves options to Chrome storage api.
 * 
 * 0 = search enabled
 * 1 = search disabled
 */
function save_options() {
  var radios = document.getElementsByName('search');
  var value = 1;
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      value = radios[i].value;

      // only one radio can be logically checked, don't check the rest
      break;
    }
  }

  radios = document.getElementsByName('all');
  var allvalue = 1;
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      allvalue = radios[i].value;

      // only one radio can be logically checked, don't check the rest
      break;
    }
  }

  radios = document.getElementsByName('filter');
  var filtervalue = 1;
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      // do whatever you want with the checked radio
      filtervalue = radios[i].value;

      // only one radio can be logically checked, don't check the rest
      break;
    }
  }

  chrome.storage.sync.set( {'tgwf_search_disabled' : value, 'tgwf_all_disabled': allvalue, 'tgwf_filter_enabled': filtervalue} ,
      function() {
      // Update status to let user know options were saved.
    var status = document.getElementById("status");
    var newDiv = document.createElement("div");

    newDiv.className = "alert alert-success";
    newDiv.appendChild(document.createTextNode("Options saved."));
    status.appendChild(newDiv);
    setTimeout(function() {
      status.textContent = "";;
    }, 15000);
  })  
  
}
/**
 * Restores select box state to saved value from localStorage.
 *
 * 0 = search enabled
 * 1 = search disabled
 */
function restore_options() {
  chrome.storage.sync.get("tgwf_search_disabled", function(items) {
    var disable = items.tgwf_search_disabled;
    // 1 is disabled, 0 or not set is enabled
    if (disable === "1") {
      $('#searchoff').attr('checked','checked');
    } else {
      $('#searchon').attr('checked','checked');
    }
  });
  chrome.storage.sync.get("tgwf_all_disabled", function(items) {
    var disable = items.tgwf_all_disabled;
    // 1 is disabled, 0 or not set is enabled
    if (disable === "1") {
      $('#alloff').attr('checked','checked');
    } else {
      $('#allon').attr('checked','checked');
    }
  });
  chrome.storage.sync.get("tgwf_filter_enabled", function(items) {
    var enable = items.tgwf_filter_enabled;
    // 1 is disabled, 0 or not set is enabled
    if (enable === "1") {
      $('#filteron').attr('checked','checked');
    } else {
      $('#filteroff').attr('checked','checked');
    }
  });
}

$(document).ready(function(){
   $("button").click(function(event){
     save_options();
   });
   restore_options();
});