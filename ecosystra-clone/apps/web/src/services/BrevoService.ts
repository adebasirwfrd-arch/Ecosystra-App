/**
 * Brevo Service for God Tier OTP Delivery (SMS & WhatsApp)
 * Set VITE_BREVO_API_KEY in .env (see apps/web/.env.example).
 */

const BASE_URL = "https://api.brevo.com/v3";

function brevoApiKey(): string {
  const key = import.meta.env.VITE_BREVO_API_KEY as string | undefined;
  if (!key?.trim()) {
    throw new Error("Missing VITE_BREVO_API_KEY — add it to apps/web/.env for Brevo OTP.");
  }
  return key.trim();
}

export const BrevoService = {
  /**
   * Send a 6-digit OTP via SMS
   */
  sendSMS: async (phoneNumber: string, otp: string) => {
    // Normalize phone number (clean non-digits)
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    try {
      const response = await fetch(`${BASE_URL}/transactionalSMS/sms`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey(),
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          type: 'transactional',
          sender: 'Ecosystra',
          recipient: cleanPhone,
          content: `Ecosystra: Your security code is ${otp}. Valid for 5 mins.`
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send SMS');
      }

      return await response.json();
    } catch (error) {
      console.error("Brevo SMS Error:", error);
      throw error;
    }
  },

  /**
   * Send OTP via WhatsApp
   * Note: Requires a pre-approved template in Brevo for production.
   */
  sendWhatsApp: async (phoneNumber: string, otp: string) => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    try {
      const response = await fetch(`${BASE_URL}/whatsapp/sendMessage`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey(),
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          senderNumber: '447418607147', 
          contactNumbers: [cleanPhone],
          templateId: 1, 
          params: { "OTP": otp, "CODE": otp } 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Brevo WhatsApp API Error:", data);
        throw new Error(data.message || 'WhatsApp Delivery Failed');
      }

      return data;
    } catch (error) {
      console.error("Brevo WhatsApp Exception:", error);
      throw error;
    }
  },

  /**
   * Send OTP via Transactional Email
   */
  sendEmail: async (recipientEmail: string, otp: string) => {
    try {
      const response = await fetch(`${BASE_URL}/smtp/email`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey(),
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { 
            name: "Ecosystra Security", 
            email: "ade.basirwfrd@gmail.com" 
          },
          to: [{ email: recipientEmail }],
          subject: "Your Ecosystra Verification Code",
          htmlContent: `
            <div style="font-family: sans-serif; padding: 40px; background: #030712; color: white; border-radius: 24px; text-align: center;">
              <h1 style="font-size: 32px; font-weight: 800; margin-bottom: 24px;">Ecosystra</h1>
              <p style="color: rgba(255,255,255,0.4); font-size: 16px; margin-bottom: 40px;">Your secure access code is:</p>
              <div style="font-size: 48px; font-weight: 800; letter-spacing: 8px; color: #0ea5e9; margin-bottom: 40px;">${otp}</div>
              <p style="color: rgba(255,255,255,0.2); font-size: 14px;">Valid for 5 minutes. If you did not request this code, please ignore this email.</p>
            </div>
          `
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Brevo Email API Error:", data);
        throw new Error(data.message || 'Email Delivery Failed');
      }

      return data;
    } catch (error) {
      console.error("Brevo Email Exception:", error);
      throw error;
    }
  },

  /**
   * Mock OTP generator for development
   */
  generateOTP: () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
};
