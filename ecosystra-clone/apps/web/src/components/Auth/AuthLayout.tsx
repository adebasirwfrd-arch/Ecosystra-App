import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-mesh" />

      {/* Left side: Ecosystra illustration panel */}
      <div className="lottie-sidebar">
        <div style={{ maxWidth: '600px', width: '100%', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '40px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '60px',
              boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <img
                  src="/images/illustrations/misc/welcome.svg"
                  alt="Workspace welcome"
                  style={{ width: '100%', height: '300px', objectFit: 'contain' }}
                />
                <img
                  src="/images/illustrations/scenes/scene-01.svg"
                  alt="Workspace collaboration"
                  style={{ width: '100%', height: '140px', objectFit: 'contain', opacity: 0.9 }}
                />
              </div>
            </div>

            <div style={{ color: 'white', padding: '0 20px' }}>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                style={{ 
                  fontSize: '48px', 
                  fontWeight: '800', 
                  marginBottom: '24px', 
                  letterSpacing: '-2px',
                  background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.4))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: '1.1'
                }}
              >
                Native Ecosystra Experience
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{ 
                  fontSize: '20px', 
                  color: 'rgba(255,255,255,0.4)', 
                  maxWidth: '500px', 
                  lineHeight: '1.6',
                  fontWeight: '400'
                }}
              >
                Ecosystra auth and OTP flow, aligned with the shell design system and illustration assets.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                style={{ display: 'flex', gap: '40px', marginTop: '60px' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '24px', fontWeight: '800', color: '#0ea5e9' }}>Secure</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Auth</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '24px', fontWeight: '800', color: '#8b5cf6' }}>Fast</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>OTP</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>Native</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>UI</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="auth-form-container">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </div>
    </div>
  );
};
