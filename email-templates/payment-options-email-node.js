={{ (() => {
  const c = $('Code – Extract Fields').first().json;
  const depositAmount = $('Code – Calculate Deposit').first().json.depositAmount;
  const pdfUrl = $('Vercel – Generate Payment PDF').first().json.url;
  // built via concatenation so n8n's own expression-boundary scanner
  // doesn't mistake the placeholder text for a second expression block
  const OB = '{' + '{';
  const CB = '}' + '}';
  const stripeUrl = OB + 'STRIPE_PAYMENT_LINK' + CB;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Payment Options</title>
</head>
<body style="margin:0;padding:0;background:#FFFFFF;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
        <!-- HEADER -->
        <tr>
          <td style="background:#B8935A;padding:20px 32px 20px 16px;text-align:left;">
            <svg width="240" height="68" viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 62 L38 20 L54 42 L38 42 Z" fill="#09090A"/>
              <path d="M54 42 L70 20 L82 62 L54 62 Z" fill="#09090A" opacity="0.75"/>
              <line x1="38" y1="20" x2="70" y2="20" stroke="#09090A" stroke-width="3" stroke-linecap="round"/>
              <line x1="10" y1="62" x2="82" y2="62" stroke="#09090A" stroke-width="2" stroke-linecap="round"/>
              <line x1="28" y1="62" x2="44" y2="31" stroke="#B8935A" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
              <line x1="20" y1="62" x2="41" y2="26" stroke="#B8935A" stroke-width="1" stroke-linecap="round" opacity="0.2"/>
              <line x1="64" y1="62" x2="58" y2="31" stroke="#B8935A" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
              <line x1="74" y1="62" x2="61" y2="26" stroke="#B8935A" stroke-width="1" stroke-linecap="round" opacity="0.2"/>
              <text x="98" y="40" font-family="Georgia,'Times New Roman',serif" font-size="22" font-weight="700" letter-spacing="3" fill="#09090A" style="font-variant:small-caps">METROPLEX</text>
              <text x="98" y="62" font-family="Georgia,'Times New Roman',serif" font-size="15" font-weight="400" letter-spacing="6" fill="#09090A">METAL ROOFS</text>
              <line x1="98" y1="67" x2="310" y2="67" stroke="#09090A" stroke-width="0.5" opacity="0.5"/>
              <text x="98" y="78" font-family="Georgia,serif" font-size="8" letter-spacing="2.5" fill="#09090A" opacity="0.5">DALLAS · FORT WORTH</text>
            </svg>
          </td>
        </tr>
        <!-- BODY -->
        <tr>
          <td style="background:#FAFAF7;padding:40px 32px;">
            <!-- GREETING -->
            <p style="font-family:Georgia,serif;font-size:15px;color:#2A2A2A;margin:0 0 8px;font-weight:400;">Hi ${c.firstName},</p>
            <p style="font-family:Georgia,serif;font-size:15px;color:#2A2A2A;margin:0 0 32px;line-height:1.6;">Congratulations on signing your contract! To get your metal roofing project on the installation calendar, please submit your 50% deposit online below. We've also attached a PDF with ACH, wire, and check payment instructions in case you'd prefer one of those methods.</p>
            <!-- DEPOSIT AMOUNT -->
            <div style="border-top:1px solid #E7E0D2;border-bottom:1px solid #E7E0D2;padding:24px 0;margin-bottom:32px;text-align:center;">
              <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;color:#57534E;text-transform:uppercase;margin-bottom:8px;">50% Deposit Due</div>
              <div style="font-family:Georgia,serif;font-size:22px;color:#B8935A;font-weight:400;">$${depositAmount}</div>
            </div>
            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="padding-bottom:32px;">
                  <a href="${stripeUrl}"
                     style="display:inline-block;background:#B8935A;color:#09090A;font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:16px 32px;border-radius:4px;">
                    Pay 50% Deposit Online
                  </a>
                </td>
              </tr>
            </table>
            <!-- DISCLAIMER -->
            <p style="font-family:Arial,sans-serif;font-size:11px;color:#57534E;line-height:1.7;margin:0 0 32px;">Your 50% deposit secures your production slot on our installation calendar. The remaining balance is due upon substantial completion per your signed contract. Full payment instructions — including ACH, wire, check, and our fraud-prevention notice — are in the attached PDF. Questions? Reply to this email or call us directly.</p>
            <!-- SIGNATURE -->
            <div style="border-top:1px solid #E7E0D2;padding-top:24px;">
              <p style="font-family:Georgia,serif;font-size:13px;color:#2A2A2A;margin:0 0 4px;">Andrew</p>
              <p style="font-family:Georgia,serif;font-size:13px;color:#2A2A2A;margin:0 0 2px;">Metroplex Metal Roofs</p>
              <p style="font-family:Georgia,serif;font-size:13px;color:#2A2A2A;margin:0;">(817) 382-3338</p>
            </div>
          </td>
        </tr>
        <!-- FOOTER -->
        <tr>
          <td style="background:#FFFFFF;padding:20px 32px;text-align:center;">
            <p style="font-family:Arial,sans-serif;font-size:11px;color:#57534E;margin:0;">© 2025 Metroplex Metal Roofs · Dallas-Fort Worth, TX</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
  return {
    type: 'Email',
    contactId: c.contactId,
    subject: `${c.firstName} - Your Payment Options for Your Metroplex Metal Roofs Project`,
    html: html,
    attachments: [pdfUrl],
    locationId: '4rvwvGT5Ot8Dxyoo7UwS'
  };
})() }}
