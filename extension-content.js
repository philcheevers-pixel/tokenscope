// TokenScope Pro — Content Script for claude.ai
// Intercepts API calls to extract token usage data
// Data stored locally in browser only

(function() {
  var interceptedCalls = [];

  // Intercept fetch requests to Claude API
  var originalFetch = window.fetch;
  window.fetch = function(...args) {
    var url = args[0];
    var init = args[1] || {};

    // Log API calls to claude.ai endpoints
    if (typeof url === 'string' && url.includes('api.anthropic.com')) {
      var timestamp = new Date().toISOString();
      var callData = {
        timestamp: timestamp,
        url: url,
        method: init.method || 'GET'
      };

      // Extract request body if POST
      if (init.body) {
        try {
          var body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
          callData.model = body.model;
          callData.max_tokens = body.max_tokens;
        } catch(e) {}
      }

      interceptedCalls.push(callData);

      // Sync to localStorage every 10 calls
      if (interceptedCalls.length % 10 === 0) {
        try {
          var existing = localStorage.getItem('tokenscope_pro_calls') || '[]';
          var all = JSON.parse(existing);
          all = all.concat(interceptedCalls);
          localStorage.setItem('tokenscope_pro_calls', JSON.stringify(all.slice(-1000))); // Keep last 1000
          interceptedCalls = [];
        } catch(e) {
          console.error('TokenScope storage error:', e);
        }
      }
    }

    // Call original fetch
    return originalFetch.apply(this, args).then(function(response) {
      // Clone response to read it without consuming the stream
      var cloned = response.clone();

      // Try to extract response metadata (tokens used, model served, etc)
      if (typeof url === 'string' && url.includes('api.anthropic.com')) {
        cloned.json().then(function(data) {
          if (data.usage) {
            var lastCall = interceptedCalls[interceptedCalls.length - 1];
            if (lastCall) {
              lastCall.usage = data.usage;
              lastCall.stop_reason = data.stop_reason;
            }
          }
        }).catch(function() {});
      }

      return response;
    });
  };

  // Send initial message to background script
  chrome.runtime.sendMessage({type: 'TOKENSCOPE_READY'}, function(response) {
    console.log('TokenScope Pro: ready to intercept');
  });
})();
