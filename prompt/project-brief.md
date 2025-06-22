Of course. Here is the updated and complete project document with the addition of ticket-specific vouchers and an analytics dashboard integrated directly into the MVP plan.
Dokumen Rencana Proyek: Aplikasi Manajemen Event IT (MVP)
Versi: 1.1
Tanggal: 13 Juni 2025
1. Visi Proyek
Membangun sebuah platform manajemen event yang terfokus untuk komunitas IT di Indonesia. Aplikasi ini memungkinkan para event organizer (EO) untuk dengan mudah membuat dan mengelola pendaftaran event (online, offline, dan hybrid) melalui sistem form dinamis, ticketing terintegrasi, dan promosi berbasis voucher, serta memberikan pengalaman pendaftaran yang mulus bagi peserta.
2. Konsep Aplikasi
Aplikasi ini dibangun sebagai satu platform tunggal yang memiliki dua antarmuka (wajah) utama:
CMS (Admin Panel) untuk Organizer: Area backend yang aman (membutuhkan login) di mana EO dapat melakukan semua pengaturan event, mulai dari membuat form, tiket, voucher, hingga memonitor pendaftar dan menganalisis performa event.
Halaman Publik untuk Peserta: Area frontend yang dapat diakses umum, menampilkan halaman detail event dan form pendaftaran yang interaktif.
3. Fitur Utama MVP (Minimum Viable Product)
Berikut adalah rincian fitur-fitur inti yang akan dibangun untuk versi pertama aplikasi:
3.1. Manajemen Event
Organizer dapat membuat, membaca, memperbarui, dan menghapus (CRUD) event.
Detail event mencakup: Nama Event, Tanggal & Waktu, Tipe (Online, Offline, Hybrid), Deskripsi, Lokasi/Link.
3.2. Form Builder Dinamis "Drag & Drop"
Antarmuka visual di mana organizer bisa menyusun form pendaftaran dengan cara drag & drop.
Tipe field yang didukung: Teks Singkat, Paragraf, Email, Dropdown, Checkbox.
Opsi untuk menandai setiap field sebagai "Wajib Diisi".
3.3. Modul Tiket & Harga
Organizer dapat membuat beberapa tipe tiket untuk satu event (misal: Early Bird, Regular, VIP).
Setiap tipe tiket dapat memiliki Harga dan Kuota yang spesifik.
Sistem secara otomatis akan mengurangi kuota tiket yang tersedia setelah ada pembayaran yang berhasil.
3.4. Sistem Voucher Dinamis & Tertarget
Organizer dapat membuat dan mengelola kode voucher promosi.
Voucher memiliki dua jenis diskon:
Persentase (%): Memotong harga berdasarkan persentase.
Nominal Tetap (Rp): Memotong harga dengan nominal rupiah langsung.
Penargetan Spesifik (Opsional): Organizer dapat memilih apakah sebuah voucher berlaku untuk semua tipe tiket atau hanya untuk tipe tiket tertentu (misal: voucher "DISKONVIP" hanya bisa digunakan untuk pembelian tiket VIP).
Setiap voucher memiliki properti: Kode Unik, Tipe Diskon, Nilai Diskon, Kuota Penggunaan, Tanggal Kedaluwarsa, dan Tipe Tiket yang Berlaku.
3.5. Integrasi Payment Gateway (DOKU)
Sistem terhubung dengan API DOKU untuk memproses pembayaran.
Harga final yang dikirim ke DOKU adalah harga setelah dipotong diskon voucher.
Aplikasi memiliki webhook untuk menerima notifikasi status pembayaran (Berhasil, Gagal, Pending) secara otomatis dari DOKU.
3.6. Otomatisasi Pasca-Pendaftaran
Email Konfirmasi Otomatis: Setelah pembayaran berhasil, sistem akan mengirimkan email konfirmasi ke peserta.
E-Ticket Generator: Email konfirmasi akan melampirkan e-tiket dalam format PDF sederhana, yang berisi detail event dan sebuah QR Code unik sebagai bukti pendaftaran.
3.7. Dashboard Analitik
Halaman visual di dalam CMS yang memberikan ringkasan performa event secara real-time.
Metrik yang ditampilkan:
Visualisasi pendapatan total.
Grafik penjualan per tipe tiket (misal: 50 Regular, 20 VIP).
Jumlah penggunaan setiap kode voucher.
Perbandingan jumlah pendaftar vs. total kuota.
4. Alur Pengguna (User Flow)
4.1. Alur Event Organizer:
Mendaftar dan login ke platform.
Membuat event baru dan mengisi detail dasarnya.
Masuk ke menu Form Builder untuk merancang form pendaftaran.
Masuk ke menu Tiket untuk membuat tipe tiket, harga, dan kuota.
(Opsional) Masuk ke menu Voucher untuk membuat kode promosi dan menargetkannya ke tipe tiket tertentu jika perlu.
Mempublikasikan event dan membagikan link-nya.
Memonitor pendaftar melalui daftar peserta dan melihat performa event melalui Dashboard Analitik.
4.2. Alur Peserta Event:
Mengakses link halaman event.
Membaca detail event dan mengisi form pendaftaran.
Memilih tipe tiket yang diinginkan.
(Opsional) Memasukkan kode voucher dan mengklik "Terapkan". Sistem akan memvalidasi kode tersebut untuk tipe tiket yang dipilih.
Melihat ringkasan total pembayaran (setelah diskon) dan melanjutkan ke pembayaran.
Dialihkan ke halaman pembayaran DOKU untuk menyelesaikan transaksi.
Setelah berhasil membayar, menerima email konfirmasi beserta e-tiket ber-QR code.
5. Rencana Skema Database
Users: id, name, email, password.
Events: id, user_id, title, description, event_type, start_date, end_date.
Forms: id, event_id, form_config_json.
Tickets: id, event_id, name, price, quota.
Vouchers: id, event_id, code, type ('persen'/'tetap'), value, quota, expiry_date.
VoucherTicketTypes (Tabel Penghubung): id, voucher_id, ticket_id. (Digunakan jika sebuah voucher berlaku untuk tiket spesifik).
Registrations: id, event_id, ticket_id, voucher_id (opsional), attendee_data_json, final_amount, status.
Payments: id, registration_id, doku_reference_id, status.
6. Tahapan Pembangunan (Step-by-Step)
Tahap 1: Fondasi & Backend: Desain dan buat semua tabel database (termasuk tabel penghubung untuk voucher). Siapkan proyek backend dan buat API dasar.
Tahap 2: Pembangunan CMS Inti: Implementasikan antarmuka untuk Form Builder, Manajemen Tiket, dan Manajemen Voucher (termasuk opsi penargetan tiket).
Tahap 3: Halaman Publik: Bangun halaman event publik yang dinamis, yang mampu me-render form dan pilihan tiket.
Tahap 4: Integrasi Logika & Pembayaran:
Implementasikan logika validasi voucher yang lebih kompleks (memeriksa tipe tiket yang valid).
Integrasikan API DOKU dan siapkan endpoint webhook.
Tahap 5: Otomatisasi & Visualisasi:
Buat servis untuk menghasilkan e-tiket PDF dan pengiriman email.
Bangun halaman dashboard pendaftar dan Dashboard Analitik dengan visualisasi data.
Tahap 6: Pengujian & Deployment: Lakukan pengujian end-to-end pada seluruh alur dan deploy aplikasi ke server.
7. Potensi Pengembangan di Luar MVP
Sistem kode affiliate atau referral untuk promosi.
Integrasi dengan platform email marketing untuk kampanye pra-event.
