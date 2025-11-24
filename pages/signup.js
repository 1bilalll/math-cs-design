// pages/signup.js
import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore'a kullanıcı ekle
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        plan: "pending",    // admin onayı bekleniyor
        exam: "",           // admin atayacak
        xp: 0,
        progress: 0,
        topics: [],
        active: false,      // admin onayı bekliyor
        status: "pending",  // opsiyonel, admin panelinde kullanılıyor
        createdAt: serverTimestamp(),
      });

      alert("Kayıt başarılı! Hesabınız admin onayından sonra aktifleşecektir.");
      window.location.href = "/login";
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Bu e-posta adresi zaten kayıtlı.");
      } else if (err.code === "auth/invalid-email") {
        setError("Geçersiz e-posta formatı.");
      } else {
        setError("Kayıt sırasında bir hata oluştu.");
      }
    }

    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="email"
          className="border p-3 w-full rounded"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border p-3 w-full rounded"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Hesap oluşturuluyor..." : "Create Account"}
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 font-semibold">Login</a>
      </p>
    </div>
  );
}
