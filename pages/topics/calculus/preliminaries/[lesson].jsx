import { useRouter } from "next/router";

export default function Lesson() {
  const router = useRouter();
  const { lesson } = router.query;

  const data = {
    1: {
      youtube: "https://www.youtube.com/embed/VIDEO_ID_1",
      pdf: "/pdfs/preliminaries1.pdf",
    },
    2: {
      youtube: "https://www.youtube.com/embed/VIDEO_ID_2",
      pdf: "/pdfs/preliminaries2.pdf",
    },
  };

  const content = data[lesson];

  if (!content) return <p style={{ padding: 24 }}>İçerik bulunamadı.</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-3xl font-bold mb-6">Preliminaries Lesson {lesson}</h1>

      <div style={{ marginBottom: 30 }}>
        <iframe
          width="560"
          height="315"
          src={content.youtube}
          allowFullScreen
        />
      </div>

      <a href={content.pdf} target="_blank" className="underline text-xl font-semibold">
        PDF Özetini Aç
      </a>
    </div>
  );
}

