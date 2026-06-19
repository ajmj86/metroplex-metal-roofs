import { useState, useEffect, useRef } from "react";

const BRAND = {
  bronze: "#B8935A",
  bronzeLight: "#C9A96E",
  bronzeDim: "#8B6D3E",
  black: "#09090A",
  surface: "#111112",
  surfaceAlt: "#18181A",
  border: "#2A2A2C",
  textPrimary: "#F5F0E8",
  textMuted: "#8A8680",
  textDim: "#5A5755",
  success: "#4CAF82",
  error: "#E05A4E",
};

const steps = [
  {
    id: "address",
    type: "address",
    label: "Step 1 of 7",
    headline: "Let's start with your home address.",
    subtext: "We'll use this to pull an aerial view of your roof — no site visit needed.",
    placeholder: "123 Main St, Frisco, TX 75034",
    field: "address",
    buttonLabel: "Continue →",
    icon: "📍",
  },
  {
    id: "roof_type",
    type: "choice",
    label: "Step 2 of 7",
    headline: "What's your roof looking like right now?",
    subtext: "No judgment — we're just figuring out your starting point.",
    field: "roofType",
    choices: [
      { value: "asphalt_shingles", label: "Asphalt Shingles", icon: "🏠" },
      { value: "metal_old", label: "Old Metal / Tin", icon: "🔩" },
      { value: "tile", label: "Tile or Clay", icon: "🏛️" },
      { value: "flat", label: "Flat / TPO", icon: "▬" },
      { value: "unknown", label: "Not Sure", icon: "🤷" },
    ],
  },
  {
    id: "reason",
    type: "choice",
    label: "Step 3 of 7",
    headline: "What's driving this project?",
    subtext: "This helps us tailor your options and pricing approach.",
    field: "reason",
    choices: [
      { value: "hail_damage", label: "Hail or Storm Damage", icon: "⛈️" },
      { value: "age_replace", label: "Aging Roof / End of Life", icon: "📅" },
      { value: "upgrade", label: "Upgrading for Longevity", icon: "💎" },
      { value: "selling", label: "Selling the Home", icon: "🏷️" },
      { value: "new_build", label: "New Construction", icon: "🏗️" },
    ],
  },
  {
    id: "insurance",
    type: "choice",
    label: "Step 4 of 7",
    headline: "Have you filed an insurance claim yet?",
    subtext: "If damage is involved, we can walk you through the upgrade pathway.",
    field: "insuranceClaim",
    choices: [
      { value: "yes_approved", label: "Yes — Claim Approved", icon: "✅" },
      { value: "yes_pending", label: "Yes — Still Pending", icon: "⏳" },
      { value: "no_but_considering", label: "No — But Considering It", icon: "🤔" },
      { value: "no_cash", label: "No — Paying Out of Pocket", icon: "💵" },
    ],
  },
  {
    id: "timeline",
    type: "choice",
    label: "Step 5 of 7",
    headline: "When are you looking to get this done?",
    subtext: "We work on your timeline — not ours.",
    field: "timeline",
    choices: [
      { value: "asap", label: "As Soon as Possible", icon: "🔥" },
      { value: "1_3_months", label: "Within 1–3 Months", icon: "📆" },
      { value: "3_6_months", label: "3–6 Months Out", icon: "🗓️" },
      { value: "just_researching", label: "Just Researching for Now", icon: "📚" },
    ],
  },
  {
    id: "contact",
    type: "contact",
    label: "Step 6 of 7",
    headline: "Almost there. How do we reach you?",
    subtext: "We'll send your AI-rendered roof design to this number — no spam, ever.",
    fields: ["firstName", "phone"],
  },
  {
    id: "visualizer",
    type: "cta",
    label: "Step 7 of 7",
    headline: "Your roof render is generating.",
    subtext: "We're pulling satellite imagery and running your custom metal roof design now. A specialist will follow up with your full proposal within 24 hours.",
  },
];

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div style={{ width: "100%", height: 3, background: BRAND.border, borderRadius: 99, overflow: "hidden", marginBottom: 32 }}>
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${BRAND.bronzeDim}, ${BRAND.bronze})`,
          borderRadius: 99,
          transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: `0 0 12px ${BRAND.bronze}55`,
        }}
      />
    </div>
  );
}

function ChoiceCard({ choice, selected, onClick }: { choice: any; selected: boolean; onClick: (value: string) => void }) {
  return (
    <button
      onClick={() => onClick(choice.value)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 18px",
        background: selected ? `${BRAND.bronze}18` : BRAND.surfaceAlt,
        border: `1.5px solid ${selected ? BRAND.bronze : BRAND.border}`,
        borderRadius: 12,
        cursor: "pointer",
        transition: "all 0.18s ease",
        width: "100%",
        textAlign: "left",
        boxShadow: selected ? `0 0 20px ${BRAND.bronze}22` : "none",
        transform: selected ? "scale(1.01)" : "scale(1)",
      }}
    >
      <span style={{ fontSize: 20, lineHeight: 1 }}>{choice.icon}</span>
      <span style={{
        fontSize: 15,
        fontFamily: "'Outfit', sans-serif",
        fontWeight: selected ? 600 : 400,
        color: selected ? BRAND.bronze : BRAND.textPrimary,
        letterSpacing: "-0.01em",
      }}>
        {choice.label}
      </span>
      {selected && (
        <span style={{ marginLeft: "auto", color: BRAND.bronze, fontSize: 14 }}>✓</span>
      )}
    </button>
  );
}

function AddressStep({ step, value, onChange, onNext }: { step: any; value: string; onChange: (v: string) => void; onNext: (v: string) => void }) {
  const [localVal, setLocalVal] = useState(value || "");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <input
        type="text"
        value={localVal}
        onChange={e => setLocalVal(e.target.value)}
        onKeyDown={e => e.key === "Enter" && localVal.trim() && onNext(localVal)}
        placeholder={step.placeholder}
        autoFocus
        style={{
          padding: "15px 18px",
          background: BRAND.surfaceAlt,
          border: `1.5px solid ${localVal ? BRAND.bronze : BRAND.border}`,
          borderRadius: 12,
          fontSize: 15,
          fontFamily: "'Outfit', sans-serif",
          color: BRAND.textPrimary,
          outline: "none",
          transition: "border-color 0.2s",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      <button
        onClick={() => localVal.trim() && onNext(localVal)}
        disabled={!localVal.trim()}
        style={{
          padding: "15px",
          background: localVal.trim()
            ? `linear-gradient(135deg, ${BRAND.bronzeDim}, ${BRAND.bronze})`
            : BRAND.border,
          border: "none",
          borderRadius: 12,
          color: localVal.trim() ? BRAND.black : BRAND.textDim,
          fontSize: 15,
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          cursor: localVal.trim() ? "pointer" : "not-allowed",
          transition: "all 0.2s",
          letterSpacing: "0.02em",
          boxShadow: localVal.trim() ? `0 4px 20px ${BRAND.bronze}44` : "none",
        }}
      >
        {step.buttonLabel}
      </button>
    </div>
  );
}

function ContactStep({ data, onChange, onNext }: { data: any; onChange: (v: any) => void; onNext: (v: any) => void }) {
  const [firstName, setFirstName] = useState(data.firstName || "");
  const [lastName, setLastName] = useState(data.lastName || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [email, setEmail] = useState(data.email || "");
  const [smsConsent, setSmsConsent] = useState(data.smsConsent || false);
  const [emailConsent, setEmailConsent] = useState(data.emailConsent || false);

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const isValid = 
    firstName.trim().length > 1 && 
    lastName.trim().length > 1 && 
    phone.replace(/\D/g, "").length === 10 &&
    email.includes("@");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    setter(e.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* First Name */}
      <input
        type="text"
        value={firstName}
        onChange={e => handleInputChange(e, setFirstName)}
        placeholder="First Name"
        autoFocus
        style={{
          padding: "15px 18px",
          background: BRAND.surfaceAlt,
          border: `1.5px solid ${firstName ? BRAND.bronze : BRAND.border}`,
          borderRadius: 12,
          fontSize: 15,
          fontFamily: "'Outfit', sans-serif",
          color: BRAND.textPrimary,
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
        }}
      />

      {/* Last Name */}
      <input
        type="text"
        value={lastName}
        onChange={e => handleInputChange(e, setLastName)}
        placeholder="Last Name"
        style={{
          padding: "15px 18px",
          background: BRAND.surfaceAlt,
          border: `1.5px solid ${lastName ? BRAND.bronze : BRAND.border}`,
          borderRadius: 12,
          fontSize: 15,
          fontFamily: "'Outfit', sans-serif",
          color: BRAND.textPrimary,
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
        }}
      />

      {/* Phone */}
      <input
        type="tel"
        value={phone}
        onChange={e => setPhone(formatPhone(e.target.value))}
        placeholder="(817) 555-0100"
        style={{
          padding: "15px 18px",
          background: BRAND.surfaceAlt,
          border: `1.5px solid ${phone.replace(/\D/g, "").length === 10 ? BRAND.bronze : BRAND.border}`,
          borderRadius: 12,
          fontSize: 15,
          fontFamily: "'Outfit', sans-serif",
          color: BRAND.textPrimary,
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
        }}
      />

      {/* Email */}
      <input
        type="email"
        value={email}
        onChange={e => handleInputChange(e, setEmail)}
        placeholder="your@email.com"
        style={{
          padding: "15px 18px",
          background: BRAND.surfaceAlt,
          border: `1.5px solid ${email.includes("@") ? BRAND.bronze : BRAND.border}`,
          borderRadius: 12,
          fontSize: 15,
          fontFamily: "'Outfit', sans-serif",
          color: BRAND.textPrimary,
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
        }}
      />

      {/* SMS Consent Checkbox */}
      <label style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "12px",
        cursor: "pointer",
      }}>
        <input
          type="checkbox"
          checked={smsConsent}
          onChange={e => setSmsConsent(e.target.checked)}
          style={{
            marginTop: 3,
            cursor: "pointer",
            accentColor: BRAND.bronze,
          }}
        />
        <span style={{
          fontSize: 12,
          color: BRAND.textMuted,
          fontFamily: "'Outfit', sans-serif",
          lineHeight: 1.5,
        }}>
          I agree to receive automated SMS/text messages from Metroplex Metal Roofs at the number provided. Msg & data rates may apply. Message frequency varies. Reply STOP to cancel, HELP for help.
        </span>
      </label>

      {/* Email Consent Checkbox */}
      <label style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "12px",
        cursor: "pointer",
      }}>
        <input
          type="checkbox"
          checked={emailConsent}
          onChange={e => setEmailConsent(e.target.checked)}
          style={{
            marginTop: 3,
            cursor: "pointer",
            accentColor: BRAND.bronze,
          }}
        />
        <span style={{
          fontSize: 12,
          color: BRAND.textMuted,
          fontFamily: "'Outfit', sans-serif",
          lineHeight: 1.5,
        }}>
          I agree to receive email communications from Metroplex Metal Roofs including quotes and project updates. You may unsubscribe at any time.
        </span>
      </label>

      {/* TCPA Disclosure */}
      <p style={{
        fontSize: 11,
        color: BRAND.textDim,
        fontFamily: "'Outfit', sans-serif",
        lineHeight: 1.6,
        margin: "8px 0",
      }}>
        Consent is not a condition of purchase. By clicking 'Generate My Roof Render' you agree to our{" "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{
          color: BRAND.bronze,
          textDecoration: "underline",
          cursor: "pointer",
        }}>
          Privacy Policy
        </a>
        {" "}and{" "}
        <a href="/terms" target="_blank" rel="noopener noreferrer" style={{
          color: BRAND.bronze,
          textDecoration: "underline",
          cursor: "pointer",
        }}>
          Terms of Service
        </a>
        .
      </p>

      {/* Submit Button */}
      <button
        onClick={() => isValid && onNext({ firstName, lastName, phone, email, smsConsent, emailConsent })}
        disabled={!isValid}
        style={{
          padding: "15px",
          background: isValid
            ? `linear-gradient(135deg, ${BRAND.bronzeDim}, ${BRAND.bronze})`
            : BRAND.border,
          border: "none",
          borderRadius: 12,
          color: isValid ? BRAND.black : BRAND.textDim,
          fontSize: 15,
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          cursor: isValid ? "pointer" : "not-allowed",
          transition: "all 0.2s",
          letterSpacing: "0.02em",
          boxShadow: isValid ? `0 4px 20px ${BRAND.bronze}44` : "none",
        }}
      >
        Generate My Roof Render →
      </button>
    </div>
  );
}

function ConfettiDot({ delay }: { delay: number }) {
  const colors = [BRAND.bronze, BRAND.bronzeLight, "#F5F0E8", BRAND.bronzeDim];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const left = Math.random() * 100;
  const size = 4 + Math.random() * 4;
  return (
    <div style={{
      position: "absolute",
      left: `${left}%`,
      top: "-10px",
      width: size,
      height: size,
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      background: color,
      animation: `fall ${1.5 + Math.random()}s ease-in forwards`,
      animationDelay: `${delay}ms`,
      opacity: 0,
    }} />
  );
}

function CTAStep({ formData }: { formData: any }) {
  return (
    <div style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(300px) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {Array.from({ length: 18 }).map((_, i) => (
        <ConfettiDot key={i} delay={i * 80} />
      ))}

      <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `${BRAND.bronze}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            border: `2px solid ${BRAND.bronze}`,
            animation: "pulse-ring 1.5s ease-out infinite",
          }} />
          <span style={{ fontSize: 36 }}>🏠</span>
        </div>
      </div>

      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        background: `${BRAND.success}18`,
        border: `1px solid ${BRAND.success}44`,
        borderRadius: 99,
        marginBottom: 20,
      }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: BRAND.success,
          animation: "pulse-ring 1.5s ease-out infinite",
        }} />
        <span style={{ fontSize: 12, color: BRAND.success, fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>
          Rendering in progress...
        </span>
      </div>

      <div style={{
        background: BRAND.surfaceAlt,
        border: `1px solid ${BRAND.border}`,
        borderRadius: 14,
        padding: "16px 18px",
        textAlign: "left",
        marginBottom: 20,
      }}>
        <p style={{ margin: "0 0 8px", fontSize: 11, color: BRAND.textDim, fontFamily: "'Outfit', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Your Request Summary
        </p>
        {[
          ["Address", formData.address],
          ["Current Roof", formData.roofType?.replace(/_/g, " ")],
          ["Project Type", formData.reason?.replace(/_/g, " ")],
          ["Name", formData.firstName],
          ["Phone", formData.phone],
        ].filter(([_, v]) => v).map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${BRAND.border}` }}>
            <span style={{ fontSize: 12, color: BRAND.textMuted, fontFamily: "'Outfit', sans-serif" }}>{label}</span>
            <span style={{ fontSize: 12, color: BRAND.textPrimary, fontFamily: "'Outfit', sans-serif", fontWeight: 500, textTransform: "capitalize" }}>{value}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 13, color: BRAND.textMuted, fontFamily: "'Outfit', sans-serif", lineHeight: 1.6, margin: 0 }}>
        A Metroplex Metal Roofs specialist will reach out to {formData.firstName} at {formData.phone} within 24 hours with your personalized metal roof design and proposal.
      </p>
    </div>
  );
}

interface LeadFormProps {
  address?: string;
  onComplete?: (formData: any) => void;
}

export function LeadForm({ address, onComplete }: LeadFormProps) {
  // If address is provided, skip the address step and start at step 1 (roofType)
  const startingStep = address ? 1 : 0;
  const [currentStep, setCurrentStep] = useState(startingStep);
  const [formData, setFormData] = useState(address ? { address } : {});
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef(null);

  const step = steps[currentStep];

  const goNext = (value?: any) => {
    setAnimating(true);
    setDirection(1);
    setTimeout(() => {
      if (value !== undefined && step.field) {
        setFormData(prev => ({ ...prev, [step.field as string]: value }));
      }
      setCurrentStep(s => s + 1);
      setAnimating(false);
    }, 220);
  };

  const goBack = () => {
    if (currentStep === 0) return;
    setAnimating(true);
    setDirection(-1);
    setTimeout(() => {
      setCurrentStep(s => s - 1);
      setAnimating(false);
    }, 220);
  };

  const handleChoiceSelect = (value: string) => {
    goNext(value);
  };

  const handleContactNext = (contactData: any) => {
    setAnimating(true);
    setTimeout(() => {
      const merged = { ...formData, ...contactData };
      setFormData(merged);
      setCurrentStep(s => s + 1);
      setAnimating(false);
      // Call callback when CTA step is reached — pass the full merged
      // form data (address/roofType/reason/insuranceClaim/timeline included),
      // not just the contact step's fields.
      console.log('[LeadForm] contact step done, calling onComplete with:', merged, 'onComplete defined?', Boolean(onComplete));
      if (onComplete) {
        onComplete(merged);
      }
    }, 220);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${BRAND.black}; }
        .step-enter { opacity: 0; transform: translateX(${direction > 0 ? "24px" : "-24px"}); }
        .step-visible { opacity: 1; transform: translateX(0); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .step-exit { opacity: 0; transform: translateX(${direction > 0 ? "-24px" : "24px"}); }
        input::placeholder { color: ${BRAND.textDim}; }
        input { caret-color: ${BRAND.bronze}; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: BRAND.black,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 16px",
        fontFamily: "'Outfit', sans-serif",
      }}>
        {/* Logo bar */}
        <div style={{ width: "100%", maxWidth: 460, marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28,
              height: 28,
              background: `linear-gradient(135deg, ${BRAND.bronzeDim}, ${BRAND.bronze})`,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <span style={{ fontSize: 13 }}>⬡</span>
            </div>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 15,
              fontWeight: 600,
              color: BRAND.textPrimary,
              letterSpacing: "0.02em",
            }}>
              Metroplex Metal Roofs
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: BRAND.textDim, fontFamily: "'Outfit', sans-serif" }}>
              🔒 Secure & Private
            </span>
          </div>
        </div>

        {/* Card */}
        <div style={{
          width: "100%",
          maxWidth: 460,
          background: BRAND.surface,
          borderRadius: 20,
          border: `1px solid ${BRAND.border}`,
          padding: "28px 24px 24px",
          boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px ${BRAND.border}`,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle glow top */}
          <div style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 200,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${BRAND.bronze}44, transparent)`,
          }} />

          <ProgressBar current={currentStep} total={steps.length} />

          <div
            className={animating ? "step-exit" : "step-visible"}
            style={{ minHeight: 280 }}
          >
            {/* Step label */}
            <p style={{
              fontSize: 11,
              color: BRAND.bronze,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}>
              {step.label}
            </p>

            {/* Headline */}
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(22px, 5vw, 27px)",
              fontWeight: 600,
              color: BRAND.textPrimary,
              lineHeight: 1.25,
              marginBottom: 8,
              letterSpacing: "-0.01em",
            }}>
              {step.headline}
            </h2>

            {/* Subtext */}
            {step.subtext && (
              <p style={{
                fontSize: 13,
                color: BRAND.textMuted,
                fontFamily: "'Outfit', sans-serif",
                lineHeight: 1.55,
                marginBottom: 22,
              }}>
                {step.subtext}
              </p>
            )}

            {/* Step content */}
            {step.type === "address" && step.field && (
              <AddressStep
                step={step}
                value={formData[step.field as keyof typeof formData] as string || ''}
                onChange={v => setFormData(p => ({ ...p, [step.field as string]: v }))}
                onNext={goNext}
              />
            )}

            {step.type === "choice" && step.choices && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(step.choices as any[]).map(choice => (
                  <ChoiceCard
                    key={choice.value}
                    choice={choice}
                    selected={step.field ? formData[step.field as keyof typeof formData] === choice.value : false}
                    onClick={handleChoiceSelect}
                  />
                ))}
              </div>
            )}

            {step.type === "contact" && (
              <ContactStep
                data={formData}
                onChange={v => setFormData(p => ({ ...p, ...v }))}
                onNext={handleContactNext}
              />
            )}

            {step.type === "cta" && (
              <CTAStep formData={formData} />
            )}
          </div>

          {/* Back button */}
          {currentStep > 0 && step.type !== "cta" && (
            <button
              onClick={goBack}
              style={{
                marginTop: 20,
                background: "none",
                border: "none",
                color: BRAND.textDim,
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: 0,
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = BRAND.textMuted}
              onMouseLeave={e => e.currentTarget.style.color = BRAND.textDim}
            >
              ← Back
            </button>
          )}
        </div>

        {/* Trust badges */}
        <div style={{
          width: "100%",
          maxWidth: 460,
          marginTop: 18,
          display: "flex",
          justifyContent: "center",
          gap: 20,
          flexWrap: "wrap",
        }}>
          {["⭐ 5.0 Google Rating", "🏠 DFW's Metal Roofing Specialists", "📋 Free Proposal"].map(badge => (
            <span key={badge} style={{
              fontSize: 11,
              color: BRAND.textDim,
              fontFamily: "'Outfit', sans-serif",
            }}>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
