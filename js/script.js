/* =========================================================
   Kopi Mantul — Script utama
   Fitur: greeting nama, navigasi section, jam real-time,
          validasi form, render hasil kiriman form.
   Branch kerja: feature/coffee-portfolio
   ========================================================= */

/* ===== UTIL: Ambil elemen cepat ===== */
const $ = (sel) => document.querySelector(sel); // Pilih satu elemen
const $$ = (sel) => document.querySelectorAll(sel); // Pilih banyak elemen

/* ===== GREETING "Hai, [nama]" ===== */
function askNameAndGreet() {
  // Minta nama user saat pertama kali load
  let name = localStorage.getItem("km_name"); // Coba ambil dari storage
  if (!name) {
    // Jika belum ada
    name = prompt("Masukkan namamu untuk sapaan di halaman:", "Harli"); // Prompt input
    if (name) localStorage.setItem("km_name", name); // Simpan agar persist
  }
  // Render ke area hero
  $("#welcomeName").textContent = `Hi ${name || "Coffee Lover"}`; // Tampilkan sapaan
}

/* ===== NAVIGASI: klik menu => tampilkan section ===== */
function setActiveNav(targetId) {
  // Hapus class 'active' dari semua link
  $$(".nav-link").forEach((a) => a.classList.remove("active"));
  // Tambah class aktif ke link yang cocok target
  const activeLink = Array.from($$(".nav-link")).find((a) => a.dataset.target === targetId);
  if (activeLink) activeLink.classList.add("active");
}

function navigate(targetId) {
  // Jika ke "home", tampilkan section home saja (sesuai requirement: home menampilkan ringkasan)
  $$(".section").forEach((sec) => sec.classList.add("is-hidden")); // Sembunyi semua
  $(`#${targetId}`).classList.remove("is-hidden"); // Tampilkan target
  setActiveNav(targetId); // Tandai nav aktif
  // Scroll halus ke atas tiap pindah halaman
  window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll
}

/* ===== INIT NAV LINK LISTENER ===== */
function bindNav() {
  // Tambahkan event click ke semua link nav
  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // Cegah reload
      navigate(link.dataset.target); // Pindah section
    });
  });
}

/* ===== JAM REAL-TIME DI PANEL INFO ===== */
function startClock() {
  const el = $("#currentTime"); // Elemen waktu
  function tick() {
    const now = new Date(); // Ambil waktu sekarang
    // Format sederhana: Fri, 16 Aug 2025 21:15:09 GMT+0700
    el.textContent = `Current time: ${now.toString()}`; // Tulis string waktu
  }
  tick(); // Render awal
  setInterval(tick, 1000); // Update tiap detik
}

/* ===== VALIDASI FORM & TAMPILKAN HASIL ===== */
function bindForm() {
  const form = $("#contactForm"); // Ambil form
  const out = $("#output"); // Panel output

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Cegah submit default

    // Ambil nilai input
    const nama = $("#nama").value.trim(); // Nama pengguna
    const dob = $("#dob").value; // Tanggal lahir (YYYY-MM-DD)
    const genderEl = document.querySelector('input[name="gender"]:checked'); // Radio terpilih
    const gender = genderEl ? genderEl.value : ""; // Nilai gender
    const pesan = $("#messageText").value.trim(); // Isi pesan

    // Validasi sederhana
    const errors = []; // Array error
    if (!nama || nama.length < 2) errors.push("Nama minimal 2 huruf."); // Cek nama
    if (!dob) errors.push("Tanggal lahir wajib diisi."); // Cek tanggal
    if (!gender) errors.push("Pilih jenis kelamin."); // Cek gender
    if (!pesan || pesan.length < 5) errors.push("Pesan minimal 5 karakter."); // Cek pesan

    if (errors.length) {
      // Jika ada error
      alert("Periksa input kamu:\n- " + errors.join("\n- ")); // Tampilkan alert
      return; // Batalkan proses
    }

    // Format tanggal lebih ramah
    const dobPretty = new Date(dob + "T00:00:00").toLocaleDateString(); // Ubah format

    // Render hasil ke panel kanan
    out.innerHTML = `
      <p><strong>Nama:</strong> ${escapeHTML(nama)}</p>
      <p><strong>Tanggal Lahir:</strong> ${escapeHTML(dobPretty)}</p>
      <p><strong>Jenis Kelamin:</strong> ${escapeHTML(gender)}</p>
      <p><strong>Pesan:</strong> ${escapeHTML(pesan)}</p>
    `; // Sisipkan HTML aman

    form.reset(); // Reset form
  });
}

/* ===== KEAMANAN KECIL: Escape HTML user input ===== */
function escapeHTML(str) {
  return str.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

/* ===== INISIALISASI SAAT HALAMAN SIAP ===== */
window.addEventListener("DOMContentLoaded", () => {
  askNameAndGreet(); // Jalankan sapaan nama
  bindNav(); // Aktifkan navigasi
  startClock(); // Mulai jam real-time
  bindForm(); // Pasang handler form
  navigate("home"); // Tampilkan halaman Home saat awal
});

/* ===== OPTIONAL: dukungan klik brand ke home ===== */
function navigateHome() {
  navigate("home");
} // Helper opsional
