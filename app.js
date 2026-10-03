// GANTI URL INI DENGAN URL WEB APP GOOGLE SCRIPT ANDA
const scriptURL = 'URL_GOOGLE_SCRIPT_ANDA_DI_SINI';

// Konfigurasi Standar SweetAlert2 sesuai Brand (Rounded, Backdrop Gelap)
const swalConfig = {
  backdrop: 'rgba(0,0,0,0.6)', // Sesuai instruksi UX Anti-Flat
  borderRadius: '16px',
  confirmButtonColor: '#50C878', // Emerald Green
  cancelButtonColor: '#333333'
};

// 1. MENCEGAH TOMBOL BACK KELUAR APLIKASI
function initAntiBack() {
  history.pushState(null, null, location.href);
}

// Penanganan khusus iOS Safari BFCache agar pushState tetap bekerja setelah di-cache
window.addEventListener('pageshow', function(event) {
  if (event.persisted) initAntiBack();
});
initAntiBack();

window.addEventListener('popstate', function(event) {
  Swal.fire({
    ...swalConfig,
    title: 'Tunggu Dulu!',
    text: 'Apakah Anda yakin ingin keluar dari halaman ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Keluar',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      history.back();
    } else {
      initAntiBack(); // Kembalikan perlindungan state palsu
    }
  });
});

// 2. NAVIGASI ANTAR HALAMAN (MPA)
function navigasi(event, tujuan) {
  event.preventDefault();
  Swal.fire({
    ...swalConfig,
    title: 'Pindah Halaman',
    text: 'Anda akan membuka halaman baru.',
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#FFB703', // Warm Gold untuk navigasi
    confirmButtonText: 'Lanjutkan',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = tujuan;
    }
  });
}

// 3. FITUR CLEAR CACHE & REFRESH
function clearCacheAndRefresh() {
  Swal.fire({
    ...swalConfig,
    title: 'Membersihkan Cache',
    text: 'Aplikasi akan diperbarui ke versi terbaru.',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  }).then(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = window.location.pathname + '?nocache=' + new Date().getTime();
  });
}

// 4. KIRIM DATA KE GOOGLE SCRIPT DENGAN PROTEKSI
const formAspirasi = document.getElementById('formAspirasi');

if(formAspirasi) {
  formAspirasi.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validasi Cek Koneksi (Offline State Error Handling)
    if (!navigator.onLine) {
      Swal.fire({
        ...swalConfig,
        title: 'Offline',
        text: 'Terjadi kesalahan jaringan. Cek koneksi Anda.',
        icon: 'error'
      });
      return;
    }

    // Proteksi Spam (Honeypot) - Jika field tersembunyi diisi, gagalkan diam-diam
    const honeypot = document.getElementById('website').value;
    if(honeypot) {
      formAspirasi.reset();
      return; 
    }

    const nama = document.getElementById('nama').value;
    const pesan = document.getElementById('pesan').value;

    Swal.fire({
      ...swalConfig,
      title: 'Mengirim Aspirasi...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama: nama, pesan: pesan })
    })
    .then(() => {
      Swal.fire({
        ...swalConfig,
        title: 'Berhasil!',
        text: 'Aspirasi Anda telah diterima oleh Tim Mas Uuth.',
        icon: 'success'
      });
      formAspirasi.reset();
    })
    .catch(error => {
      Swal.fire({
        ...swalConfig,
        title: 'Error',
        text: 'Terjadi kesalahan jaringan. Cek koneksi Anda.',
        icon: 'error'
      });
    });
  });
}