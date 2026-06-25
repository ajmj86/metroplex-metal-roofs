'use client'

import { LegalShell, LH } from "@/components/LegalShell";
import { C, LEGAL_FULL, WEBSITE, EMAIL, PHONE } from "@/components/brand";

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy">
      <p>This Privacy Policy describes how {LEGAL_FULL} ("Company," "we," "us," or "our") collects, uses, and shares information about you when you visit {WEBSITE} (the "Site") or contact us in connection with our services. By using the Site, you agree to the collection and use of information in accordance with this policy.</p>

      <LH>1. Information We Collect</LH>
      <p><strong style={{color:C.white}}>Information you provide directly:</strong> When you submit a form, request an estimate, use our roof visualizer, or contact us, we may collect your name, email address, phone number, property address, and any other information you provide.</p>
      <p><strong style={{color:C.white}}>Information collected automatically:</strong> When you visit our Site we automatically collect certain technical information including your IP address, browser type, referring URL, pages viewed, and time on page. We use cookies and similar technologies for this purpose.</p>
      <p><strong style={{color:C.white}}>Visualizer tool:</strong> Our AI roof visualizer uses your provided property address to retrieve a publicly available street-level image of your home via third-party mapping services. We do not store retrieved imagery beyond your active session.</p>

      <LH>2. How We Use Your Information</LH>
      <p>We use collected information to respond to estimate requests and inquiries; provide and improve our services; communicate with you about your project; send service-related updates if you have opted in; comply with legal obligations; and prevent fraud.</p>
      <p>We do not sell your personal information to third parties.</p>

      <LH>3. How We Share Your Information</LH>
      <p><strong style={{color:C.white}}>Installation partners:</strong> To fulfill your roofing project, we may share relevant contact and property information with our network of vetted, licensed local roofing professionals. These partners are engaged solely for project execution and are not authorized to use your information for any other purpose.</p>
      <p><strong style={{color:C.white}}>CRM and marketing platforms:</strong> We use GoHighLevel as our customer relationship management platform. Your contact information may be stored and processed within that system, subject to its own privacy policies.</p>
      <p><strong style={{color:C.white}}>Legal requirements:</strong> We may disclose your information when required by law or valid legal process.</p>

      <LH>4. Cookies</LH>
      <p>Our Site uses cookies to enhance your experience and support analytics and marketing. You may disable cookies through your browser; however, some Site features may not function properly without them.</p>

      <LH>5. Data Retention</LH>
      <p>We retain your information as long as necessary to fulfill the purposes outlined here, comply with legal obligations, and resolve disputes. Project and estimate records are retained for a minimum of four years.</p>

      <LH>6. Your Rights</LH>
      <p>You may request access to, correction of, or deletion of your personal information by contacting us at {EMAIL}. We will respond to verified requests within 30 days.</p>

      <LH>7. Children's Privacy</LH>
      <p>Our Site is not directed to individuals under 18. We do not knowingly collect personal information from minors. Contact us immediately if you believe a minor has submitted information through our Site.</p>

      <LH>8. Changes to This Policy</LH>
      <p>We may update this Privacy Policy periodically. Material changes will be reflected in the "last updated" date at the top of this page.</p>

      <LH id="contact">9. Contact</LH>
      <p><strong style={{color:C.white}}>{LEGAL_FULL}</strong><br/>Dallas–Fort Worth, Texas<br/>Email: {EMAIL}<br/>Phone: {PHONE}</p>
    </LegalShell>
  );
}
