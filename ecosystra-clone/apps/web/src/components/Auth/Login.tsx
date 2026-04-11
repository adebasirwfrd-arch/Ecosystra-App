import React, { useState, useEffect, useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowRight,
  MessageSquare,
  Phone,
  ShieldCheck,
  User,
  Lock,
  ArrowLeft,
  RefreshCw,
  Smartphone,
  Key,
} from "lucide-react";

const MailIcon = Mail as any;
const ArrowRightIcon = ArrowRight as any;
const MessageSquareIcon = MessageSquare as any;
const ShieldCheckIcon = ShieldCheck as any;
const UserIcon = User as any;
const LockIcon = Lock as any;
const ArrowLeftIcon = ArrowLeft as any;
const RefreshCwIcon = RefreshCw as any;
const SmartphoneIcon = Smartphone as any;
const KeyIcon = Key as any;
import { Captcha } from "./Captcha";
import { BrevoService } from "../../services/BrevoService";
import confetti from "canvas-confetti";

interface LoginProps {
  onAuthenticated: (user: any) => void;
}

type AuthMode = "LOGIN" | "SIGNUP" | "FORGOT_PASSWORD" | "OTP" | "SUCCESS";

export const Login: React.FC<LoginProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<AuthMode>("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpChannel, setOtpChannel] = useState<"SMS" | "EMAIL">("EMAIL");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Transitions for modes
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const [direction, setDirection] = useState(1);

  const changeMode = (newMode: AuthMode) => {
    setDirection(newMode === "LOGIN" ? -1 : 1);
    setMode(newMode);
    setCaptchaVerified(false); // Reset captcha on mode change
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      changeMode("OTP");
      sendOTP();
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name && password && phoneNumber) {
      changeMode("OTP");
      sendOTP();
    }
  };

  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const getNextCooldown = (attempts: number) => {
    if (attempts < 5) return 30;
    // Escalation: 6th attempt is 1m, 7th is 2m, etc. up to 5m
    const extraMinutes = Math.min(attempts - 4, 5);
    return extraMinutes * 60;
  };

  const sendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    const generatedOtp = BrevoService.generateOTP();

    try {
      if (otpChannel === "SMS") {
        await BrevoService.sendSMS(
          phoneNumber || "+628123456789",
          generatedOtp,
        );
      } else {
        await BrevoService.sendEmail(email, generatedOtp);
      }

      const nextCooldown = getNextCooldown(resendAttempts + 1);
      setResendAttempts((prev) => prev + 1);
      setResendCooldown(nextCooldown);
    } catch (err) {
      console.error("OTP Delivery failed:", err);
      // Fallback for demo if API fails
      setResendCooldown(getNextCooldown(resendAttempts + 1));
      setResendAttempts((prev) => prev + 1);
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      handleVerifyOtp();
    }
  };

  const handleVerifyOtp = () => {
    setMode("SUCCESS");
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#0ea5e9", "#8b5cf6", "#10b981"],
    });

    setTimeout(() => {
      onAuthenticated({ email, name: name || email.split("@")[0] });
    }, 2500);
  };

  return (
    <motion.div
      className="auth-card"
      layout
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={mode}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Header */}
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <img
                src="/images/branding/ecosystra-logo.jpg"
                alt="Ecosystra"
                className="auth-brand-icon"
              />
            </div>
            <h1 className="auth-brand-title">Ecosystra</h1>
            <p className="auth-brand-subtitle">
              {mode === "LOGIN" && "Welcome back to your workspace"}
              {mode === "SIGNUP" && "Begin your journey today"}
              {mode === "FORGOT_PASSWORD" && "Recover your enterprise access"}
              {mode === "OTP" && "Verification in progress"}
              {mode === "SUCCESS" && "Access Granted"}
            </p>
          </div>

          {mode === "LOGIN" && (
            <form onSubmit={handleLoginSubmit}>
              <div className="auth-input-group">
                <label className="auth-label">Corporate Email</label>
                <div className="auth-input-wrap">
                  <MailIcon size={18} className="auth-input-icon" />
                  <input
                    type="email"
                    className="auth-input auth-input-with-icon"
                    placeholder="name@ecosystra.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <div className="auth-label-row">
                  <label className="auth-label auth-label-no-margin">
                    Password
                  </label>
                  <span
                    onClick={() => changeMode("FORGOT_PASSWORD")}
                    className="auth-inline-link"
                  >
                    Forgot?
                  </span>
                </div>
                <div className="auth-input-wrap">
                  <LockIcon size={18} className="auth-input-icon" />
                  <input
                    type="password"
                    className="auth-input auth-input-with-icon"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label auth-label-no-margin">
                  Identity Verification
                </label>
                <Captcha onVerify={() => setCaptchaVerified(true)} />
              </div>

              <button
                type="submit"
                className="auth-btn-primary"
                disabled={!captchaVerified}
              >
                Sign In <ArrowRightIcon size={18} />
              </button>

              <div className="auth-divider-row">
                <div className="auth-divider-line" />
                <span className="auth-divider-text">IDENTITY PROVIDER</span>
                <div className="auth-divider-line" />
              </div>

              <div className="auth-google-wrap">
                <GoogleLogin
                  onSuccess={() => {
                    changeMode("OTP");
                    sendOTP();
                  }}
                  onError={() => console.error("Google Login Failed")}
                  theme="filled_black"
                  shape="pill"
                  text="continue_with"
                />
              </div>

              <p className="auth-footer-text">
                New to Ecosystra?{" "}
                <span
                  onClick={() => changeMode("SIGNUP")}
                  className="auth-footer-link auth-footer-link-purple"
                >
                  Create account
                </span>
              </p>
            </form>
          )}

          {mode === "SIGNUP" && (
            <form onSubmit={handleSignupSubmit}>
              <div className="auth-input-group">
                <label className="auth-label">Full Name</label>
                <div className="auth-input-wrap">
                  <UserIcon size={18} className="auth-input-icon" />
                  <input
                    type="text"
                    className="auth-input auth-input-with-icon"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Work Email</label>
                <div className="auth-input-wrap">
                  <MailIcon size={18} className="auth-input-icon" />
                  <input
                    type="email"
                    className="auth-input auth-input-with-icon"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Secure Password</label>
                <div className="auth-input-wrap">
                  <LockIcon size={18} className="auth-input-icon" />
                  <input
                    type="password"
                    className="auth-input auth-input-with-icon"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">
                  Phone Number (Global Format)
                </label>
                <div className="auth-input-wrap">
                  <SmartphoneIcon size={18} className="auth-input-icon" />
                  <input
                    type="tel"
                    className="auth-input auth-input-with-icon"
                    placeholder="+62 812 3456 789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Captcha onVerify={() => setCaptchaVerified(true)} />

              <button
                type="submit"
                className="auth-btn-primary"
                disabled={!captchaVerified}
              >
                Create Account <ArrowRightIcon size={18} />
              </button>

              <p className="auth-footer-text">
                Already have an account?{" "}
                <span
                  onClick={() => changeMode("LOGIN")}
                  className="auth-footer-link auth-footer-link-blue"
                >
                  Sign in
                </span>
              </p>
            </form>
          )}

          {mode === "FORGOT_PASSWORD" && (
            <div>
              <div className="auth-input-group">
                <label className="auth-label">Verification Email</label>
                <div className="auth-input-wrap">
                  <MailIcon size={18} className="auth-input-icon" />
                  <input
                    type="email"
                    className="auth-input auth-input-with-icon"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                className="auth-btn-primary"
                onClick={() => {
                  changeMode("OTP");
                  sendOTP();
                }}
              >
                Reset Password <RefreshCwIcon size={18} />
              </button>

              <div
                onClick={() => changeMode("LOGIN")}
                className="auth-back-link"
              >
                <ArrowLeftIcon size={16} /> Back to Sign In
              </div>
            </div>
          )}

          {mode === "OTP" && (
            <div className="auth-otp-container">
              <div className="auth-otp-channel-row">
                <div
                  onClick={() => setOtpChannel("EMAIL")}
                  className={`auth-otp-channel-card ${otpChannel === "EMAIL" ? "active-email" : ""}`}
                >
                  <MailIcon size={28} />
                </div>
                <div
                  onClick={() => setOtpChannel("SMS")}
                  className={`auth-otp-channel-card ${otpChannel === "SMS" ? "active-sms" : ""}`}
                >
                  <SmartphoneIcon size={28} />
                </div>
              </div>

              <h2 className="auth-otp-title">Two-Factor Auth</h2>
              <p className="auth-otp-subtitle">
                Verify via{" "}
                <span
                  className={`auth-otp-channel-label ${otpChannel === "EMAIL" ? "email" : "sms"}`}
                >
                  {otpChannel}
                </span>
                {otpChannel === "EMAIL"
                  ? ` sent to ${email.slice(0, 3)}***@${email.split("@")[1]}`
                  : phoneNumber
                    ? ` sent to ${phoneNumber.slice(0, 4)}...${phoneNumber.slice(-3)}`
                    : ""}
              </p>

              <div className="otp-group">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    type="text"
                    className="otp-input"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    maxLength={1}
                  />
                ))}
              </div>

              <button className="auth-btn-primary" onClick={handleVerifyOtp}>
                Verify Authenticity <KeyIcon size={18} />
              </button>

              <div
                onClick={() => resendCooldown === 0 && sendOTP()}
                className={`auth-otp-resend ${resendCooldown > 0 ? "disabled" : ""}`}
              >
                {resendCooldown > 0 ? (
                  <>
                    {" "}
                    <RefreshCwIcon size={14} className="animate-spin" /> Resend
                    available in {resendCooldown}s{" "}
                  </>
                ) : isResending ? (
                  <>
                    {" "}
                    <RefreshCwIcon size={14} className="animate-spin" />{" "}
                    Sending...{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    Didn't receive code?{" "}
                    <span className="auth-otp-resend-action">
                      Resend Now
                    </span>{" "}
                  </>
                )}
              </div>
            </div>
          )}

          {mode === "SUCCESS" && (
            <div className="auth-success">
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  damping: 10,
                  stiffness: 100,
                  delay: 0.2,
                }}
                className="auth-success-icon-wrap"
              >
                <ShieldCheckIcon size={48} color="white" />
              </motion.div>
              <h2 className="auth-success-title">Verified!</h2>
              <p className="auth-success-subtitle">
                Securely redirecting to Ecosystra...
              </p>

              <div className="auth-success-progress">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="auth-success-progress-bar"
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
