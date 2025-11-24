import fs from "fs";
import path from "path";
import mammoth from "mammoth";

export default async function handler(req, res) {
  const { exam, topic, subtopic, file } = req.query;

  const filePath = path.join(
    process.cwd(),
    "content",
    "exams",
    exam,
    topic,
    subtopic,
    file
  );

  // ❗ Dosya yoksa
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("");
  }

  // 🛑 TARAYICI CACHE KAPATILSIN (PDF düzeltmeleri hemen görünsün)
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  try {
    // ⭐ PDF dosyası ise
    if (file.toLowerCase().endsWith(".pdf")) {
      const pdfBuffer = fs.readFileSync(filePath);
      res.setHeader("Content-Type", "application/pdf");
      return res.status(200).send(pdfBuffer);
    }

    // ⭐ Word dosyası ise (.docx → HTML)
    if (file.toLowerCase().endsWith(".docx")) {
      const buffer = fs.readFileSync(filePath);
      const result = await mammoth.convertToHtml({ buffer });

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(result.value || "");
    }

    // ⭐ Text tabanlı dosyalar (.txt, .md vs)
    const data = fs.readFileSync(filePath, "utf8");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(data);
  } catch (error) {
    console.error("FILE READ ERROR:", error);
    return res.status(500).send("Dosya okunurken hata oluştu.");
  }
}
