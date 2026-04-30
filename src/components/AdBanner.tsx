import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  slot?: string;
}

export default function AdBanner({ className = '', format = 'auto', slot }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && adRef.current) {
        // Prevent duplicate initialization on the same element
        if (!adRef.current.getAttribute('data-adsbygoogle-status')) {
          const adsbygoogle = (window as any).adsbygoogle || [];
          adsbygoogle.push({});
        }
      }
    } catch (e: any) {
      // Ignore the common specific AdSense error
      if (e.message && e.message.includes('already have ads')) {
        return;
      }
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`w-full flex justify-center py-4 overflow-hidden ${className}`}>
      <ins className="adsbygoogle"
           ref={adRef}
           style={{ display: 'block', width: '100%', maxWidth: '728px', minHeight: '90px', textAlign: 'center' }}
           data-ad-client="ca-pub-6367623066928336"
           data-ad-slot={slot}
           data-ad-format={format}
           data-full-width-responsive="true"></ins>
    </div>
  );
}
