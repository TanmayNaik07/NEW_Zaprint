"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Github, Twitter, Linkedin, Loader2, Printer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useNavigationLoading } from "@/components/providers/navigation-loading-provider";

interface AnimatedSignUpProps {
  className?: string;
}

const AnimatedSignUp: React.FC<AnimatedSignUpProps> = ({ className }) => {
  const router = useRouter();
  const supabase = createClient();
  const { startLoading } = useNavigationLoading();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  // Email validation
  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle field change
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (field === "email") {
      setIsEmailValid(value ? validateEmail(value) : true);
    }
  };

  // Handle form submission with Supabase auth
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    try {
      // Validate name length
      if (formData.name.length < 3) {
        throw new Error("Full name must be at least 3 characters");
      }

      // Validate password length
      if (formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      // Validate phone number (India format: 10 digits, starts with 6-9)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        throw new Error("Phone number must be a valid 10-digit Indian number");
      }

      // Sign up with Supabase with email verification
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: formData.name,
            address: formData.address,
            phone_number: formData.phone,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        // Email confirmation required - show verification message
        toast.success("Please check your email to verify your account");
        setShowVerificationMessage(true);
      } else if (data?.session) {
        // Success! Try to create profile manually just in case trigger is gone
        try {
          await supabase.from('profiles').upsert({
            id: data.user!.id,
            email: formData.email,
            full_name: formData.name,
            address: formData.address,
            phone_number: formData.phone,
            updated_at: new Date().toISOString()
          });
        } catch (profileError) {
          console.error("Manual profile creation failed", profileError);
        }

        const isAdmin = data.user?.email?.toLowerCase() === "zaprint.official@gmail.com";
        toast.success("Account created successfully!");
        startLoading();
        router.push(isAdmin ? "/admin" : "/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setFormError(err.message || "Failed to create account");
      toast.error(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  // Create particles
  useEffect(() => {
    const canvas = document.getElementById("auth-particles-signup") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

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
        this.color = `rgba(10, 17, 40, ${Math.random() * 0.15})`;
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

  const isFieldActive = (field: string) => focusedField === field || formData[field as keyof typeof formData];

  return (
    <div className={`auth-container auth-dark ${className || ""}`}>
      <canvas id="auth-particles-signup" className="auth-particles-canvas"></canvas>

      {/* Logo */}
      <Link href="/" className="auth-logo">
        <div className="w-10 h-10 rounded-xl bg-[#0a1128] flex items-center justify-center shrink-0 p-2 shadow-md">
          <img src="/Zaprint_Logo.png" alt="Zaprint Logo" className="w-full h-full object-contain" />
        </div>
        <span className="auth-logo-text">Zaprint</span>
      </Link>

      <div className="auth-card auth-card-signup">
        <div className="auth-card-inner">
          {showVerificationMessage ? (
            <div className="auth-verification-message">
              <div className="auth-message auth-message-success">
                <h3 className="auth-message-title text-green-500">Check your email!</h3>
                <p className="auth-message-text">
                  We've sent a verification link to <strong>{formData.email}</strong>
                </p>
                <p className="auth-message-text mt-2">
                  Click the link in the email to verify your account, then return here to log in.
                </p>
              </div>
              <button
                onClick={() => {
                  startLoading();
                  router.push("/login");
                }}
                className="auth-submit-button"
                type="button"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>
              <div className="auth-header">
                <h1>Create Account</h1>
                <p>Start printing smarter in under a minute</p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className={`auth-form-field ${isFieldActive("name") ? "active" : ""}`}>
                  <input
                    type="text"
                    id="signup-name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoComplete="name"
                  />
                  <label htmlFor="signup-name">Full Name</label>
                </div>

                <div className={`auth-form-field ${isFieldActive("email") ? "active" : ""} ${!isEmailValid && formData.email ? "invalid" : ""}`}>
                  <input
                    type="email"
                    id="signup-email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoComplete="email"
                  />
                  <label htmlFor="signup-email">Email Address</label>
                  {!isEmailValid && formData.email && (
                    <span className="auth-error-message">Please enter a valid email</span>
                  )}
                </div>

                <div className={`auth-form-field ${isFieldActive("password") ? "active" : ""}`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="signup-password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoComplete="new-password"
                  />
                  <label htmlFor="signup-password">Password</label>
                  <button
                    type="button"
                    className="auth-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <span className="auth-field-hint">Must be at least 8 characters</span>
                </div>

                <div className={`auth-form-field ${isFieldActive("address") ? "active" : ""}`}>
                  <input
                    type="text"
                    id="signup-address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    onFocus={() => setFocusedField("address")}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoComplete="street-address"
                  />
                  <label htmlFor="signup-address">Address</label>
                </div>

                <div className={`auth-form-field ${isFieldActive("phone") ? "active" : ""}`}>
                  <input
                    type="tel"
                    id="signup-phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoComplete="tel"
                  />
                  <label htmlFor="signup-phone">Phone Number</label>
                  <span className="auth-field-hint">10-digit Indian number</span>
                </div>

                {formError && (
                  <div className="auth-form-error">
                    <p>{formError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="auth-submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <p className="auth-terms">
                  By signing up, you agree to our{" "}
                  <a href="#">Terms of Service</a> and{" "}
                  <a href="#">Privacy Policy</a>
                </p>
              </form>

              <p className="auth-switch-prompt">
                Already have an account? <Link href="/login">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimatedSignUp;
