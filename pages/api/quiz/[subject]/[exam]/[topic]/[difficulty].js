import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { subject, exam, topic, difficulty } = req.query;

  const filePath = path.join(process.cwd(), "content", "userQuizQuestions", subject, exam, topic, `${difficulty}.json`);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
