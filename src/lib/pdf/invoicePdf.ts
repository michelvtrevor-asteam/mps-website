import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type InvoicePdfInput = {
  invoiceNumber: string;
  studentName: string;
  programName: string;
  amountRupees: string;
  dueDate: string;
  status: string;
};

export async function generateInvoicePdf(input: InvoicePdfInput) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  const margin = 50;

  // Header Color Bar (Premium Style)
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width: width,
    height: 120,
    color: rgb(1, 0.176, 0.522), // Brand Pink: #FF2D85
  });

  // School Name and Info
  page.drawText("Maanvi’s Preschool", {
    x: margin,
    y: height - 60,
    size: 28,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText("Kakinada, Andhra Pradesh, India", {
    x: margin,
    y: height - 85,
    size: 11,
    font: font,
    color: rgb(1, 1, 1),
  });

  // Invoice Title
  let y = height - 170;
  page.drawText("FEE INVOICE", {
    x: margin,
    y,
    size: 22,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText(`Date: ${new Date().toLocaleDateString('en-IN')}`, {
    x: width - margin - 120,
    y: y + 2,
    size: 10,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Main Details Card
  y -= 50;
  page.drawRectangle({
    x: margin,
    y: y - 180,
    width: width - (margin * 2),
    height: 180,
    borderColor: rgb(0.9, 0.9, 0.9),
    borderWidth: 1,
    color: rgb(0.98, 0.98, 0.98),
  });

  const rows: Array<[string, string]> = [
    ["Invoice Reference", input.invoiceNumber],
    ["Student Name", input.studentName],
    ["Program / Batch", input.programName],
    ["Total Amount", input.amountRupees.includes("₹") ? input.amountRupees.replace("₹", "Rs. ") : `Rs. ${input.amountRupees}`],
    ["Payment Due By", input.dueDate],
    ["Invoice Status", input.status],
  ];

  let rowY = y - 40;
  for (const [label, value] of rows) {
    page.drawText(label.toUpperCase(), {
      x: margin + 30,
      y: rowY,
      size: 9,
      font: fontBold,
      color: rgb(0.5, 0.5, 0.5),
    });
    page.drawText(value, {
      x: margin + 180,
      y: rowY,
      size: 11,
      font: font,
      color: rgb(0, 0, 0),
    });
    rowY -= 25;
  }

  // Footer / Notes
  y -= 250;
  page.drawText("Notes & Instructions:", {
    x: margin,
    y,
    size: 11,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  y -= 20;
  const notes = [
    "• This is a computer-generated invoice and does not require a signature.",
    "• Please pay by the due date to avoid late fees.",
    "• Payment can be made via UPI, Cash at the school office, or Bank Transfer.",
    "• Keep this copy for your records and future reference.",
  ];

  for (const note of notes) {
    page.drawText(note, {
      x: margin,
      y,
      size: 9,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 15;
  }

  // Footer Accent
  page.drawRectangle({
    x: margin,
    y: 40,
    width: width - (margin * 2),
    height: 2,
    color: rgb(0.9, 0.9, 0.9),
  });

  page.drawText("Thank you for choosing Maanvi’s Preschool for your child's journey!", {
    x: margin,
    y: 25,
    size: 9,
    font: font,
    color: rgb(0.6, 0.6, 0.6),
  });

  return pdfDoc.save();
}

