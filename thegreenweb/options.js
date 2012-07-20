/**
 * Saves options to Chrome storage api.
 * 
 * 0 = search enabled
 * 1 = search disabled
 */
function save_options() {
  search = $('#searchon').attr('checked');
  if(search == 'checked'){
    value = 0;
  }else{
    value = 1;
  }

  chrome.storage.local.set({'tgwf_search_disabled' : value},function() {
      // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "<div class=\"alert alert-success\">Options Saved.</div>";
    setTimeout(function() {
      status.innerHTML = "";
    }, 1500);    
  })  
  
}
/**
 * Restores select box state to saved value from localStorage.
 *
 * 0 = search enabled
 * 1 = search disabled
 */
function restore_options() {
  chrome.storage.local.get("tgwf_search_disabled", function(items) {
    var disable = items.tgwf_search_disabled;
    // 1 is disabled, 0 or not set is enabled
    if(disable == 1){
      $('#searchoff').attr('checked','checked');
    } else {
      $('#searchon').attr('checked','checked');
    }
  });
}

$(document).ready(function(){
   $("button").click(function(event){
     save_options();
   });
   restore_options();
});