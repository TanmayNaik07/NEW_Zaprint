"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Github, Twitter, Linkedin, Loader2, Printer, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useNavigationLoading } from "@/components/providers/navigation-loading-provider";

interface AnimatedSignInProps {
  className?: string;
}

const AnimatedSignIn: React.FC<AnimatedSignInProps> = ({ className }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { startLoading } = useNavigationLoading();

  const verified = searchParams.get('verified');
  const error = searchParams.get('error');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Email validation
  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value) {
      setIsEmailValid(validateEmail(e.target.value));
    } else {
      setIsEmailValid(true);
    }
  };

  // Handle form submission with Supabase auth
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    if (!email || !password || !validateEmail(email)) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) throw signInError;

      toast.success("Logged in successfully!");
      startLoading();
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Login error:", err);
      setFormError(err.message || "Invalid email or password");
      toast.error(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  // Create particles
  useEffect(() => {
    const canvas = document.getElementById("auth-particles") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(6, 182, 212, ${Math.random() * 0.3})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationId: number;
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const particle of particles) {
        particle.update();
        particle.draw();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className={`auth-container auth-dark ${className || ""}`}>
      <canvas id="auth-particles" className="auth-particles-canvas"></canvas>

      {/* Logo */}
      <Link href="/" className="auth-logo">
        <div className="auth-logo-icon">
          <Printer className="w-6 h-6 text-primary" />
        </div>
        <span className="auth-logo-text">Zaprint</span>
      </Link>

      <div className="auth-card">
        <div className="auth-card-inner">
          {/* Verification Messages */}
          {verified === 'true' && (
            <div className="auth-message auth-message-success">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="auth-message-title text-green-500">Email verified!</h3>
                <p className="auth-message-text">Your account has been verified. Please log in to continue.</p>
              </div>
            </div>
          )}

          {error === 'verification_failed' && (
            <div className="auth-message auth-message-error">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="auth-message-title text-red-500">Verification failed</h3>
                <p className="auth-message-text">The verification link is invalid or has expired. Please try signing up again.</p>
              </div>
            </div>
          )}

          <div className="auth-header">
            <h1>Welcome</h1>
            <p>Please sign in to continue</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className={`auth-form-field ${isEmailFocused || email ? "active" : ""} ${!isEmailValid && email ? "invalid" : ""}`}>
              <input
                type="email"
                id="signin-email"
                value={email}
                onChange={handleEmailChange}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                required
                autoComplete="email"
              />
              <label htmlFor="signin-email">Email Address</label>
              {!isEmailValid && email && (
                <span className="auth-error-message">Please enter a valid email</span>
              )}
            </div>

            <div className={`auth-form-field ${isPasswordFocused || password ? "active" : ""}`}>
              <input
                type={showPassword ? "text" : "password"}
                id="signin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                required
                autoComplete="current-password"
              />
              <label htmlFor="signin-password">Password</label>
              <button
                type="button"
                className="auth-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="auth-form-options">
              <label className="auth-remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="auth-checkmark"></span>
                Remember me
              </label>

              <a href="#" className="auth-forgot-password">
                Forgot Password?
              </a>
            </div>

            {formError && (
              <div className="auth-form-error">
                <p>{formError}</p>
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-button"
              disabled={isLoading || !email || !password || !isEmailValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="auth-separator">
            <span>or continue with</span>
          </div>

          <div className="auth-social-login">
            <button className="auth-social-button" type="button" aria-label="Sign in with Github">
              <Github size={18} />
            </button>
            <button className="auth-social-button" type="button" aria-label="Sign in with Twitter">
              <Twitter size={18} />
            </button>
            <button className="auth-social-button" type="button" aria-label="Sign in with LinkedIn">
              <Linkedin size={18} />
            </button>
          </div>

          <p className="auth-switch-prompt">
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnimatedSignIn;
