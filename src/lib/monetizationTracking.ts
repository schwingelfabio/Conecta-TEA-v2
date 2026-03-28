export async function trackMonetizationEvent(eventType: string, metadata?: any) {
  try {
    const response = await fetch('/api/monetization/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'anonymous', // Should be replaced with actual user ID if available
        eventType,
        pageUrl: window.location.href,
        deviceType: navigator.userAgent,
        metadata,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to log monetization event');
    }
  } catch (error) {
    console.error("[Monetization Engine] Error tracking event:", error);
  }
}
