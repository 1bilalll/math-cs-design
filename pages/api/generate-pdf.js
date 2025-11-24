const PDFDocument = require("pdfkit");
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY)),
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { userId } = JSON.parse(req.body);
    const db = getFirestore();
    const snap = await db.collection("users").doc(userId).get();
    const d = snap.data();

    // **PDF erişim kontrolü**
    if (d.plan === "free") {
      return res.status(403).json({
        message: "PDF sadece Standart ve Premium üyeler için geçerlidir.",
      });
    }

    const pdf = new PDFDocument();
    let chunks = [];
    pdf.on("data", (chunk) => chunks.push(chunk));
    pdf.on("end", () => {
      const buffer = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');
      res.send(buffer);
    });

    pdf.fontSize(22).text("📄 Haftalık Çalışma Raporu", { align: "center" }).moveDown();

    // PREMIUM MÜHRÜ
    if (d.plan === "premium") {
      pdf
        .fontSize(16)
        .fillColor("#B8860B")
        .text("★ PREMIUM MEMBER", { align: "right" });

      pdf
        .moveTo(390, 95)
        .lineTo(560, 95)
        .stroke("#B8860B");

      pdf.fillColor("#000");
    }

    pdf.moveDown(1.5);
    pdf.fontSize(14).text(`Kullanıcı: ${d.email}`);
    pdf.text(`Paket: ${d.plan.toUpperCase()}`);
    pdf.text(`Tarih: ${new Date().toLocaleDateString()}`);
    pdf.moveDown();

    pdf.fontSize(18).text("📌 Konu İlerlemeleri").moveDown(0.5);
    (d.topics || []).forEach((t) => {
      const status = `${t.completed ? "Tamamlandı" : "Devam Ediyor"}${t.quiz ? " | Quiz ✔" : ""}${t.final ? " | Final ✔" : ""}`;
      pdf.fontSize(13).text(`• ${t.name}: ${status}`);
    });

    pdf.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "PDF üretim hatası" });
  }
};
