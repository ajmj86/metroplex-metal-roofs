import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';
import PDFDocument from 'pdfkit';

const GOLD = '#B8935A';
const BLACK = '#09090A';
const CHARCOAL = '#2A2A2A';
const MUTED = '#57534E';
const BORDER = '#E7E0D2';

function fraudNotice(phone: string) {
  return `WIRE FRAUD ALERT: We will never change these payment instructions via email. Before wiring funds, call our office at ${phone} to verbally confirm the account and routing numbers.`;
}

function drawHeader(doc: PDFKit.PDFDocument, pageWidth: number) {
  doc.rect(0, 0, pageWidth, 100).fill(GOLD);

  // simplified roofline mark, echoing the email header's SVG icon
  doc.fillColor(BLACK).opacity(1);
  doc.polygon([50, 72], [66, 40], [78, 58], [66, 58]).fill(BLACK);
  doc.polygon([78, 58], [88, 40], [96, 72], [78, 72]).fillOpacity(0.75).fill(BLACK);
  doc.fillOpacity(1);

  doc
    .fillColor(BLACK)
    .font('Times-Bold')
    .fontSize(20)
    .text('METROPLEX', 118, 28, { characterSpacing: 3 });
  doc
    .font('Times-Roman')
    .fontSize(13)
    .text('METAL ROOFS', 118, 52, { characterSpacing: 6 });
  doc
    .fontSize(8)
    .fillOpacity(0.6)
    .text('DALLAS · FORT WORTH', 118, 74, { characterSpacing: 2 })
    .fillOpacity(1);
}

function drawSectionLabel(doc: PDFKit.PDFDocument, label: string) {
  doc
    .fillColor(MUTED)
    .font('Helvetica')
    .fontSize(9)
    .text(label.toUpperCase(), { characterSpacing: 2 });
  doc.moveDown(0.4);
}

function drawDivider(doc: PDFKit.PDFDocument) {
  const y = doc.y;
  doc.moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .lineWidth(1)
    .strokeColor(BORDER)
    .stroke();
  doc.moveDown(1);
}

function drawButton(doc: PDFKit.PDFDocument, label: string, url: string) {
  const x = doc.page.margins.left;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const height = 46;
  const y = doc.y;
  doc.roundedRect(x, y, width, height, 4).fill(GOLD);
  doc
    .fillColor(BLACK)
    .font('Helvetica-Bold')
    .fontSize(13)
    .text(label, x, y + 16, { width, align: 'center' });
  doc.link(x, y, width, height, url);
  doc.y = y + height;
  doc.moveDown(1);
}

function drawInstructionsBox(doc: PDFKit.PDFDocument, text: string) {
  const x = doc.page.margins.left;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  doc.font('Helvetica').fontSize(11);
  const boxHeight = doc.heightOfString(text, { width: width - 24 }) + 24;
  doc.rect(x, doc.y, width, boxHeight).strokeColor(BORDER).lineWidth(1).stroke();
  doc
    .fillColor(CHARCOAL)
    .font('Helvetica')
    .fontSize(11)
    .text(text, x + 12, doc.y + 12, { width: width - 24 });
  doc.y = doc.y + 12;
  doc.moveDown(1.2);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      amount,
      depositAmount,
      password,
      stripeLink,
      wireReference,
      verificationPhone,
      paymentType,
    } = body as {
      firstName?: string;
      lastName?: string;
      amount?: string;
      depositAmount?: string;
      password?: string;
      stripeLink?: string;
      wireReference?: string;
      verificationPhone?: string;
      paymentType?: 'deposit' | 'final';
    };
    const resolvedAmount = amount ?? depositAmount;
    const isFinal = paymentType === 'final';

    if (!resolvedAmount) {
      return NextResponse.json({ error: 'Missing required field: amount' }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: 'Missing required field: password' }, { status: 400 });
    }
    if (!stripeLink) {
      return NextResponse.json({ error: 'Missing required field: stripeLink' }, { status: 400 });
    }

    const bankName = process.env.WIRE_BANK_NAME?.trim() || 'PLACEHOLDER — bank name not configured yet';
    const accountHolderName =
      process.env.WIRE_ACCOUNT_HOLDER_NAME?.trim() || 'PLACEHOLDER — account holder name not configured yet';
    const routingNumber = process.env.WIRE_ROUTING_NUMBER?.trim() || 'PLACEHOLDER — routing number not configured yet';
    const accountNumber = process.env.WIRE_ACCOUNT_NUMBER?.trim() || 'PLACEHOLDER — account number not configured yet';
    const bankDetails = [
      `Bank Name: ${bankName}`,
      `Account Holder: ${accountHolderName}`,
      `Routing Number: ${routingNumber}`,
      `Account Number: ${accountNumber}`,
      `Reference / Memo: ${wireReference || 'N/A'}`,
    ].join('\n');
    const phone = verificationPhone?.trim() || '(817) 382-3338';

    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 130, bottom: 60, left: 50, right: 50 },
      userPassword: password,
      ownerPassword: randomUUID(),
      permissions: { printing: 'highResolution', modifying: false, copying: false, annotating: false },
    });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    const done = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

    drawHeader(doc, doc.page.width);

    doc.fillColor(CHARCOAL).font('Times-Roman').fontSize(13);
    doc.text(`Hi ${firstName || 'there'},`);
    doc.moveDown(0.5);
    doc.text(
      isFinal
        ? 'Congratulations on completing your project! You can submit your final payment any of three ways: pay securely online by card (and, once available, direct bank debit) using the button below, send a direct ACH bank transfer, or send a wire transfer. The ACH and wire options use the same bank details, provided below.'
        : 'Congratulations on signing your contract! You can submit your 50% deposit any of three ways: pay securely online by card (and, once available, direct bank debit) using the button below, send a direct ACH bank transfer, or send a wire transfer. The ACH and wire options use the same bank details, provided below.',
      { width: doc.page.width - 100 }
    );
    doc.moveDown(1.2);

    drawSectionLabel(doc, isFinal ? 'Final Payment Due' : '50% Deposit Due');
    doc.fillColor(GOLD).font('Times-Roman').fontSize(20).text(`$${resolvedAmount}`);
    doc.moveDown(1);
    drawDivider(doc);

    drawButton(doc, isFinal ? 'Pay Final Payment Online ->' : 'Pay Deposit Online ->', stripeLink);
    doc
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(9)
      .text(
        'Card payments are always accepted here. Once bank-debit (ACH) verification clears on our end, this same link will also accept direct bank transfers.'
      );
    doc.moveDown(1);
    drawDivider(doc);

    drawSectionLabel(doc, 'Bank Transfer Details (ACH or Wire)');
    doc
      .fillColor(CHARCOAL)
      .font('Helvetica')
      .fontSize(10)
      .text(
        'Prefer to send payment directly from your bank? ACH is typically lower/no fee and takes 1–3 business days; wire is typically same-day but a fee may apply and it is generally irreversible once sent. Both use the same account details below.'
      );
    doc.moveDown(0.6);
    drawInstructionsBox(doc, bankDetails);

    drawSectionLabel(doc, 'Check');
    doc
      .fillColor(CHARCOAL)
      .font('Helvetica')
      .fontSize(10)
      .text(`We also accept payment by check. Please contact us at ${phone} or help@metroplexmetalroofs.com to arrange delivery or mailing instructions.`);
    doc.moveDown(1.2);

    drawDivider(doc);
    const boxY = doc.y;
    const boxWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const notice = fraudNotice(phone);
    doc.font('Helvetica-Bold').fontSize(10);
    const noticeHeight = doc.heightOfString(notice, { width: boxWidth - 24 }) + 24;
    doc.rect(doc.page.margins.left, boxY, boxWidth, noticeHeight).strokeColor(GOLD).lineWidth(1.5).stroke();
    doc
      .fillColor(CHARCOAL)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(notice, doc.page.margins.left + 12, boxY + 12, { width: boxWidth - 24 });
    doc.y = boxY + noticeHeight + 20;

    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor(BORDER).stroke();
    doc.moveDown(1);
    doc.fillColor(CHARCOAL).font('Times-Roman').fontSize(11);
    doc.text('Andrew');
    doc.text('Metroplex Metal Roofs');
    doc.text(phone);

    doc.end();
    const pdfBuffer = await done;

    const filename = `payment-options/${Date.now()}-${randomUUID()}.pdf`;
    const blob = await put(filename, pdfBuffer, { access: 'public', contentType: 'application/pdf' });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (err) {
    console.error('[payment-pdf]', err);
    const message = err instanceof Error ? err.message : 'PDF generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
