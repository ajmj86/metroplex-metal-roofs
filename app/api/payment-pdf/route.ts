import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';
import PDFDocument from 'pdfkit';

const GOLD = '#B8935A';
const BLACK = '#09090A';
const CHARCOAL = '#2A2A2A';
const MUTED = '#57534E';
const BORDER = '#E7E0D2';

const FRAUD_NOTICE =
  'Important: Our payment instructions will never change via email. If you ever receive revised banking instructions or have any questions, please call us at our published office number to verify them before sending funds.';

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
    const { firstName, lastName, depositAmount } = body as {
      firstName?: string;
      lastName?: string;
      depositAmount?: string;
    };

    if (!depositAmount) {
      return NextResponse.json({ error: 'Missing required field: depositAmount' }, { status: 400 });
    }

    const achInstructions = process.env.ACH_INSTRUCTIONS?.trim() || '{{ACH_INSTRUCTIONS}}';
    const wireInstructions = process.env.WIRE_INSTRUCTIONS?.trim() || '{{WIRE_INSTRUCTIONS}}';

    const doc = new PDFDocument({ size: 'LETTER', margins: { top: 130, bottom: 60, left: 50, right: 50 } });
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
      'Congratulations on signing your contract! Below are your payment options for submitting your 50% deposit.',
      { width: doc.page.width - 100 }
    );
    doc.moveDown(1.2);

    drawSectionLabel(doc, '50% Deposit Due');
    doc.fillColor(GOLD).font('Times-Roman').fontSize(20).text(`$${depositAmount}`);
    doc.moveDown(1);
    drawDivider(doc);

    drawSectionLabel(doc, 'Option 1 · ACH Bank Transfer');
    doc
      .fillColor(CHARCOAL)
      .font('Helvetica')
      .fontSize(10)
      .text('Lower/no fee. Typically 1–3 business days. Can potentially be reversed or disputed within a window.');
    doc.moveDown(0.6);
    drawInstructionsBox(doc, achInstructions);

    drawSectionLabel(doc, 'Option 2 · Wire Transfer');
    doc
      .fillColor(CHARCOAL)
      .font('Helvetica')
      .fontSize(10)
      .text('Fee applies. Typically same-day. Generally irreversible once sent.');
    doc.moveDown(0.6);
    drawInstructionsBox(doc, wireInstructions);

    drawSectionLabel(doc, 'Option 3 · Check');
    doc
      .fillColor(CHARCOAL)
      .font('Helvetica')
      .fontSize(10)
      .text('We also accept payment by check. Please contact us at (817) 382-3338 or help@metroplexmetalroofs.com to arrange delivery or mailing instructions.');
    doc.moveDown(1.2);

    drawDivider(doc);
    const boxY = doc.y;
    const boxWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    doc.font('Helvetica-Bold').fontSize(10);
    const noticeHeight = doc.heightOfString(FRAUD_NOTICE, { width: boxWidth - 24 }) + 24;
    doc.rect(doc.page.margins.left, boxY, boxWidth, noticeHeight).strokeColor(GOLD).lineWidth(1.5).stroke();
    doc
      .fillColor(CHARCOAL)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(FRAUD_NOTICE, doc.page.margins.left + 12, boxY + 12, { width: boxWidth - 24 });
    doc.y = boxY + noticeHeight + 20;

    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor(BORDER).stroke();
    doc.moveDown(1);
    doc.fillColor(CHARCOAL).font('Times-Roman').fontSize(11);
    doc.text('Andrew');
    doc.text('Metroplex Metal Roofs');
    doc.text('(817) 382-3338');

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
