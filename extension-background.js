// TokenScope Pro — Background Service Worker
// Manages data storage and sync

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'TOKENSCOPE_READY') {
    console.log('TokenScope Pro loaded on tab:', sender.tab.id);
    sendResponse({status: 'ready'});
  }
  if (request.type === 'TOKENSCOPE_CHECK') {
    console.log('TokenScope extension detected');
    sendResponse({status: 'installed'});
  }
});

// Initialize storage on install
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.get('tokenscope_pro_calls', function(result) {
    if (!result.tokenscope_pro_calls) {
      chrome.storage.local.set({tokenscope_pro_calls: []});
    }
  });
  console.log('TokenScope Pro initialized');
});

// Periodic sync to TokenScope dashboard (if user configures it)
chrome.alarms.create('tokenscope_sync', {periodInMinutes: 5});
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'tokenscope_sync') {
    chrome.storage.local.get('tokenscope_pro_calls', function(result) {
      var calls = result.tokenscope_pro_calls || [];
      if (calls.length > 0) {
        // Future: send to TokenScope dashboard via messaging
        console.log('TokenScope Pro sync ready:', calls.length, 'calls');
      }
    });
  }
});
