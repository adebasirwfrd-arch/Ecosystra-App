import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

const ShieldCheckIcon = ShieldCheck as any;
const Loader2Icon = Loader2 as any;

interface CaptchaProps {
  onVerify: () => void;
}

declare global {
  interface Window {
    onloadTurnstileCallback: () => void;
    turnstile: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

export const Captcha: React.FC<CaptchaProps> = ({ onVerify }) => {
  const [status, setStatus] = useState<'loading' | 'active' | 'success'>('loading');
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    let isCleanup = false;

    const renderTurnstile = () => {
      if (isCleanup || !containerRef.current || !window.turnstile || widgetId.current) return;

      try {
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: '1x00000000000000000000AA', // Testing Sitekey (Always Passes)
          callback: (token: string) => {
            setStatus('success');
            setTimeout(onVerify, 500);
          },
          'error-callback': (err: any) => {
            console.error("Turnstile Error:", err);
            setStatus('active'); // Still show it so user can try again
          },
          'expired-callback': () => {
            console.warn("Turnstile Expired");
            setStatus('active');
          },
          theme: 'dark',
          appearance: 'always'
        });
        setStatus('active');
      } catch (err) {
        console.error("Turnstile render error:", err);
        setStatus('active');
      }
    };

    if (window.turnstile) {
      renderTurnstile();
    } else {
      if (!document.getElementById('turnstile-script')) {
        const script = document.createElement('script');
        script.id = 'turnstile-script';
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (!isCleanup) renderTurnstile();
        };
        document.head.appendChild(script);
      } else {
        const interval = setInterval(() => {
          if (window.turnstile) {
            renderTurnstile();
            clearInterval(interval);
          }
        }, 100);
        return () => {
          isCleanup = true;
          clearInterval(interval);
        };
      }
    }

    return () => {
      isCleanup = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch (e) {}
        widgetId.current = null;
      }
    };
  }, [onVerify]);

  return (
    <div className="turnstile-wrapper" style={{ marginTop: '24px', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>
          Identity Verification
        </p>
      </div>

      <div 
        style={{ 
          minHeight: '65px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '16px',
          padding: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          position: 'relative'
        }}
      >
        {status === 'loading' && (
          <div style={{ display: 'flex', color: 'rgba(255,255,255,0.4)', gap: '8px', alignItems: 'center' }}>
            <Loader2Icon className="animate-spin" size={18} />
            <span style={{ fontSize: '14px' }}>Securing session...</span>
          </div>
        )}
        
        <div 
          ref={containerRef} 
          style={{ 
            width: '100%', 
            display: status === 'active' ? 'flex' : 'none', 
            justifyContent: 'center' 
          }} 
        />

        {status === 'success' && (
          <div style={{ display: 'flex', color: '#10b981', gap: '8px', fontWeight: '600', alignItems: 'center' }}>
            <ShieldCheckIcon size={18} />
            <span style={{ fontSize: '14px' }}>Verified Human</span>
          </div>
        )}
      </div>
    </div>
  );
};

