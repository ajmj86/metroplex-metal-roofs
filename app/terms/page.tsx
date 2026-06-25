'use client'

import { LegalShell, LH } from "@/components/LegalShell";
import { C, LEGAL_ENTITY, DBA_NAME, LEGAL_FULL, WEBSITE, EMAIL, PHONE } from "@/components/brand";

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service">
      <p>These Terms of Service ("Terms") govern your access to and use of {WEBSITE}, operated by {LEGAL_FULL} ("Company," "we," "us," or "our"). By accessing or using our Site, you agree to be bound by these Terms.</p>

      <LH>1. Company Identity</LH>
      <p>{DBA_NAME} is a registered assumed name (DBA) of {LEGAL_ENTITY}, a Texas limited liability company. All agreements entered into through or facilitated by this Site are agreements with {LEGAL_ENTITY}.</p>

      <LH>2. Services</LH>
      <p>{DBA_NAME} is a premium metal roofing company serving the Dallas–Fort Worth metroplex. We manage your project from initial consultation through completion, coordinating with our network of credentialed local roofing professionals to deliver a finished result that meets our quality standards.</p>
      <p>Nothing on this Site constitutes a binding contract or guarantee of services. All projects require a signed written agreement executed by an authorized representative of {LEGAL_ENTITY}.</p>

      <LH>3. Roof Visualizer Tool</LH>
      <p>Our AI-powered roof visualizer is provided for illustrative purposes only. Rendered images are computer-generated approximations and do not represent guaranteed outcomes, exact product appearances, or final installation specifications. Actual results will vary based on product selection, home architecture, lighting, and installation. By using the visualizer, you consent to the use of your property address to retrieve a publicly available street-level image of your home.</p>

      <LH>4. Estimates</LH>
      <p>Any cost ranges or preliminary figures discussed verbally or via email are non-binding until a formal written estimate is issued and signed by both parties. Written estimates are valid for 30 days from the date of issue unless otherwise stated. Final project costs are determined by confirmed measurements, material selection, current pricing at time of contract execution, and any additional materials or labor required following physical inspection of the existing roof condition, proper removal of existing roofing systems, and installation in compliance with applicable local building codes.</p>

      <LH>5. Intellectual Property</LH>
      <p>All content on this Site — including text, graphics, logos, and software — is the property of {LEGAL_ENTITY} or its licensors and is protected by applicable copyright and trademark law. You may not reproduce or distribute any Site content without our prior written permission.</p>

      <LH>6. Disclaimer of Warranties</LH>
      <p>THE SITE AND ITS CONTENT ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>

      <LH>7. Limitation of Liability</LH>
      <p>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, {LEGAL_ENTITY.toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE SITE OR OUR SERVICES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE GREATER OF AMOUNTS PAID BY YOU IN THE PRIOR 12 MONTHS OR $100.</p>

      <LH>8. Indemnification</LH>
      <p>You agree to indemnify and hold harmless {LEGAL_ENTITY} and its members, officers, and agents from claims, damages, and expenses (including attorneys' fees) arising out of your use of the Site or violation of these Terms.</p>

      <LH>9. Governing Law</LH>
      <p>These Terms are governed by the laws of the State of Texas. Disputes shall be resolved exclusively in the state or federal courts of Dallas County, Texas, and you consent to personal jurisdiction there.</p>

      <LH>10. Changes to Terms</LH>
      <p>We may modify these Terms at any time. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms.</p>

      <LH id="contact">11. Contact</LH>
      <p><strong style={{color:C.white}}>{LEGAL_FULL}</strong><br/>Dallas–Fort Worth, Texas<br/>Email: {EMAIL}<br/>Phone: {PHONE}</p>
    </LegalShell>
  );
}
