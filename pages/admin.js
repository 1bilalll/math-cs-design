// pages/admin.js
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // giriş yapan kişi admin mi kontrolü
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return (window.location.href = "/login");

      setUser(currentUser);

      const userSnap = await getDocs(collection(db, "users"));
      const currentUserData = userSnap.docs.find((d) => d.id === currentUser.uid)?.data();

      if (!currentUserData || currentUserData.plan !== "admin") {
        alert("Bu sayfaya erişim yetkiniz yok!");
        return (window.location.href = "/dashboard");
      }

      loadUsers();
    });

    return () => unsubscribe();
  }, []);

  async function loadUsers() {
    const snapshot = await getDocs(collection(db, "users"));
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setUsers(list);
    setLoading(false);
  }

  async function approveUser(userId, selectedPlan, selectedExam) {
    await updateDoc(doc(db, "users", userId), {
      plan: selectedPlan,
      exam: selectedExam,
      active: true,       // admin onayı ile aktif oluyor
      status: "approved", // opsiyonel
    });
    alert("Kullanıcı planı, sınavı ve onayı güncellendi!");
    loadUsers();
  }

  if (loading) return <p className="text-center mt-20">Yükleniyor...</p>;

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">🛡 Admin Panel – Kullanıcı Yönetimi</h1>

      <button
        onClick={() => {
          signOut(auth);
          window.location.href = "/login";
        }}
        className="mb-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Çıkış Yap
      </button>

      <table className="w-full border-collapse bg-white shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Durum</th>
            <th className="p-3 border">Paket</th>
            <th className="p-3 border">Sınav</th>
            <th className="p-3 border">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border">
              <td className="p-3 border">{u.email}</td>
              <td className="p-3 border">{u.active ? "Onaylandı" : "Beklemede"}</td>
              <td className="p-3 border capitalize">{u.plan || "Tanımlı değil"}</td>
              <td className="p-3 border">{u.exam || "Tanımlı değil"}</td>
              <td className="p-3 border">
                {!u.active ? (
                  <>
                    <select id={`plan-${u.id}`} className="mr-2 border rounded px-2 py-1">
                      <option value="student">Student</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                    </select>

                    <select id={`exam-${u.id}`} className="mr-2 border rounded px-2 py-1">
                      <option value="AYT">AYT</option>
                      <option value="TYT">TYT</option>
                    </select>

                    <button
                      onClick={() => {
                        const planSelect = document.getElementById(`plan-${u.id}`);
                        const examSelect = document.getElementById(`exam-${u.id}`);
                        approveUser(u.id, planSelect.value, examSelect.value);
                      }}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Onayla
                    </button>
                  </>
                ) : (
                  <span className="text-green-600 font-semibold">Onaylandı</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
