export default function ReportPDFButton({ userId, plan }) {
  const handlePDF = async () => {
    if (plan === "free") {
      return alert("📌 PDF raporu sadece Standart ve Premium üyeler için kullanılabilir.");
    }

    const res = await fetch("/api/generate-pdf", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "haftalik-rapor.pdf";
    a.click();
  };

  return (
    <button
      onClick={handlePDF}
      className={`mt-6 px-4 py-2 rounded-lg text-white ${
        plan === "free"
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-purple-600 hover:bg-purple-700"
      }`}
    >
      📄 PDF Rapor İndir
    </button>
  );
}
