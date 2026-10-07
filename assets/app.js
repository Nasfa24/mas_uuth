/**
 * CORE SCRIPT MAS UUTH MPA
 * UX Terkalibrasi: Profesional, Empatik, Elegan.
 */

const scriptURL = 'https://script.google.com/macros/s/AKfycbxOo_Z8IPxSXYgvuyxBna8ZEjGx0GLUJl2orrjaDtJZePRGmSMNYVatvXWbpLljQyzYNg/exec';

// Konfigurasi SweetAlert2 Berdasarkan Brand Identity Mas Uuth
const swalConfig = {
    backdrop: 'rgba(51, 51, 51, 0.7)', // Slate Grey Dark (Transparan Elegan)
    borderRadius: '24px', // Radius lebih lembut
    confirmButtonColor: '#50C878', // Emerald Green (Primary)
    cancelButtonColor: '#333333',  // Slate Grey (Accent)
    color: '#333333',
    background: '#FFFFFF', // Clean Slate
    customClass: { 
        title: 'fw-bold',
        popup: 'shadow-lg border-0'
    }
};

// ==========================================
// 1. FITUR MANAJEMEN CACHE GLOBAL
// ==========================================
function refreshData() {
    Swal.fire({
        ...swalConfig,
        title: 'Memperbarui...',
        text: 'Menyinkronkan data terbaru.',
        icon: 'info',
        timer: 1000,
        showConfirmButton: false
    }).then(() => {
        window.location.reload(true);
    });
}

function clearCacheAndRefresh() {
    Swal.fire({
        ...swalConfig,
        title: 'Pembersihan Sistem',
        text: 'Aplikasi akan disegarkan ke versi paling mutakhir.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: '#FFB703' // Warm Gold
    }).then(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload(true);
    });
}

// ==========================================
// 2. SISTEM PENGIRIMAN ASPIRASI (LEAD CAPTURE)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const formAspirasi = document.getElementById('formAspirasi');

    if(formAspirasi) {
        formAspirasi.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!navigator.onLine) {
                Swal.fire({ ...swalConfig, title: 'Koneksi Terputus', text: 'Mohon periksa koneksi internet Anda.', icon: 'error' });
                return;
            }

            // Proteksi Anti-Spam Bot
            const honeypot = document.getElementById('website')?.value;
            if(honeypot) {
                formAspirasi.reset();
                return; 
            }

            const nama = document.getElementById('nama').value;
            const pesan = document.getElementById('pesan').value;

            Swal.fire({
                ...swalConfig,
                title: 'Mengirimkan Pesan...',
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
                    title: 'Aspirasi Diterima!',
                    text: 'Terima kasih. Pesan Anda telah masuk ke meja tim Mas Uuth.',
                    icon: 'success'
                });
                formAspirasi.reset();
            })
            .catch(error => {
                Swal.fire({ ...swalConfig, title: 'Terjadi Kesalahan', text: 'Gagal mengirim pesan. Coba beberapa saat lagi.', icon: 'error' });
            });
        });
    }
});