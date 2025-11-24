import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  const { folder, exam, topic } = req.body;

  if (!folder || !exam || !topic) {
    return res.status(400).json({ success: false, message: "Eksik parametreler" });
  }

  const filePath = path.join(process.cwd(), "content", folder, exam, `${topic}.json`);
  console.log("Quiz dosyası aranıyor:", filePath);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Dosya bulunamadı" });
    }

    const file = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(file);

    let questions = [];

    if (Array.isArray(json)) {
      questions = json;
    } else if (json.questions && Array.isArray(json.questions)) {
      questions = json.questions;
    } else {
      return res.status(400).json({ success: false, message: "Quiz formatı hatalı" });
    }

    return res.status(200).json({ success: true, data: questions });
  } catch (err) {
    console.error("Quiz dosyası okunamadı:", err);
    return res.status(500).json({ success: false, message: "Dosya okuma hatası" });
  }
}
