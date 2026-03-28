export function sendLog(data: any) {
  try {
    fetch('/api/mordomo/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...data, 
        url: window.location.href, 
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {}); // Silently fail to avoid infinite loops
  } catch (e) {
    // Ignore
  }
}

export function trackEvent(eventName: string, data?: any) {
  sendLog({
    type: 'conversion',
    category: 'user_event',
    event: eventName,
    ...data
  });
}

export function initMonitoring() {
  // 1. Error Monitoring (Frontend)
  window.addEventListener('error', (event) => {
    sendLog({ 
      type: 'error', 
      category: 'frontend_error', 
      message: event.error?.message || event.message, 
      stack: event.error?.stack || 'No stack trace'
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    sendLog({ 
      type: 'error', 
      category: 'unhandled_promise', 
      message: event.reason?.message || String(event.reason), 
      stack: event.reason?.stack || 'No stack trace'
    });
  });

  // 2. Performance Analysis (Web Vitals - Basic)
  if ('PerformanceObserver' in window) {
    try {
      // Largest Contentful Paint (LCP) - measures loading performance
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry.startTime > 2500) { // Log only if LCP is poor (> 2.5s)
          sendLog({ type: 'performance', category: 'lcp_slow', value: lastEntry.startTime });
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // Cumulative Layout Shift (CLS) - measures visual stability
      new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries() as any[]) {
          if (!entry.hadRecentInput) clsValue += entry.value;
        }
        if (clsValue > 0.1) { // Log only if CLS is poor (> 0.1)
          sendLog({ type: 'performance', category: 'cls_poor', value: clsValue });
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // Ignore observer errors
    }
  }

  // 3. UX Issue Detection (Rage Clicks & Dead Clicks)
  let clickCount = 0;
  let lastClickTime = 0;
  
  window.addEventListener('click', (e) => {
    const now = Date.now();
    const target = e.target as HTMLElement;
    
    // Detect Rage Clicks (multiple rapid clicks on the same element)
    if (now - lastClickTime < 400) {
      clickCount++;
      if (clickCount === 3) { // Trigger on 3rd rapid click
        sendLog({ 
          type: 'ux', 
          category: 'rage_click', 
          element: target?.tagName,
          className: target?.className,
          text: target?.innerText?.substring(0, 50)
        });
      }
    } else {
      clickCount = 1;
    }
    lastClickTime = now;
  });

  // Monitor Fetch/XHR failures (API issues)
  try {
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      try {
        const response = await originalFetch.apply(this, args);
        if (!response.ok && !response.url.includes('/api/mordomo/log')) {
          sendLog({
            type: 'error',
            category: 'api_error',
            status: response.status,
            url: response.url
          });
        }
        return response;
      } catch (error: any) {
        if (args[0] && typeof args[0] === 'string' && !args[0].includes('/api/mordomo/log')) {
          sendLog({
            type: 'error',
            category: 'network_failure',
            message: error.message,
            url: args[0]
          });
        }
        throw error;
      }
    };
  } catch (e) {
    // Ignore if fetch cannot be overridden
  }
}
