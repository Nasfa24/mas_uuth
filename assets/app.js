/**
 * CORE SCRIPT MAS UUTH MPA
 * Menangani History Trap, Global Caching, dan Form API
 */

// URL API Google Apps Script (Sesuai dengan deployment terakhir Anda)
const scriptURL = 'https://script.google.com/macros/s/AKfycbxOo_Z8IPxSXYgvuyxBna8ZEjGx0GLUJl2orrjaDtJZePRGmSMNYVatvXWbpLljQyzYNg/exec';

// Konfigurasi Standar SweetAlert2 sesuai Brand Identity
const swalConfig = {
    backdrop: 'rgba(51, 51, 51, 0.6)', // Slate grey transparan (Anti-Flat)
    borderRadius: '20px',
    confirmButtonColor: '#50C878', // Emerald Green
    cancelButtonColor: '#333333',  // Slate Grey Dark
    customClass: { title: 'fw-bold' }
};

// ==========================================
// 1. MENCEGAH TOMBOL BACK KELUAR APLIKASI (One-Time Soft Trap)
// ==========================================
let trapTriggered = false;

function initAntiBack() {
    history.pushState({ trap: true }, null, location.href);
}

// BFCache Handling untuk Safari/iOS
window.addEventListener('pageshow', function(event) {
    if (event.persisted) initAntiBack();
});

document.addEventListener("DOMContentLoaded", () => {
    initAntiBack();
    
    window.addEventListener('popstate', function(event) {
        if (!trapTriggered) {
            history.pushState({ trap: true }, null, location.href); 
            Swal.fire({
                ...swalConfig,
                title: 'Tunggu Sebentar!',
                text: 'Apakah Anda yakin ingin meninggalkan halaman ini?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Keluar',
                cancelButtonText: 'Batal (Tetap di sini)'
            }).then((result) => {
                if (result.isConfirmed) {
                    trapTriggered = true; 
                    history.back(); 
                }
            });
        }
    });
});

// ==========================================
// 2. FITUR CLEAR CACHE & REFRESH (Global)
// ==========================================
function refreshData() {
    window.location.reload(true);
}

function clearCacheAndRefresh() {
    Swal.fire({
        ...swalConfig,
        title: 'Membersihkan Cache',
        text: 'Sistem sedang diperbarui ke versi terbaru...',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload(true);
    });
}

// ==========================================
// 3. KIRIM DATA KE GOOGLE SCRIPT (Form Aspirasi)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const formAspirasi = document.getElementById('formAspirasi');

    if(formAspirasi) {
        formAspirasi.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validasi Cek Koneksi (Offline State)
            if (!navigator.onLine) {
                Swal.fire({ ...swalConfig, title: 'Offline', text: 'Terjadi kesalahan jaringan. Cek koneksi Anda.', icon: 'error' });
                return;
            }

            // Proteksi Spam (Honeypot) - Jika field hidden terisi, bot sedang beraksi
            const honeypot = document.getElementById('website')?.value;
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
                didOpen: () => { Swal.showLoading(); }
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
                Swal.fire({ ...swalConfig, title: 'Error', text: 'Terjadi kesalahan jaringan.', icon: 'error' });
            });
        });
    }
});