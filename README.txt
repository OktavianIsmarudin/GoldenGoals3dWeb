GOLDEN GOALS CINEMATIC — MORE THAN A SCORE
Proyek Laravel 12 mandiri, sejajar dengan proyek sebelumnya.

JALANKAN
cd "C:\Pongs\web 3d\golden-goals-cinematic"
php artisan serve --port=8002
Buka http://127.0.0.1:8002
Tidak perlu npm, Vite, MySQL atau menjalankan proyek lain.

STRUKTUR
resources/views/cinematic.blade.php : lima bagian cerita dan navigasi.
public/css/cinematic.css            : latar gelap, tipografi besar, mobile.
public/js/cinematic.js              : renderer, kamera, scroll, interaksi.
public/js/logo-geometry.js          : tujuh komponen simbol Golden Goals.
public/js/study-room.js             : meja, buku, alat tulis, rak, jendela.
routes/web.php                     : halaman utama di /.

REFERENSI
Video lokal ssstik.io_1793862259260.mp4 yang diberikan pengguna telah
diperiksa melalui enam frame sepanjang durasi 16,37 detik. Arah visual:
objek tengah, latar gelap hangat, judul sangat besar, peralihan ke ruang
meja, dan sudut kamera yang berubah mengikuti scroll.
Objeknya diganti dengan simbol Golden Goals tanpa tulisan.
Ruang meja adalah ilustrasi 3D konseptual, bukan foto/fasilitas asli.
Logo direkonstruksi dengan geometri; bukan file model 3D resmi.
Video referensi tidak dibundel atau dipublikasikan dengan website.

INTERAKSI
Scroll berpindah di antara lima adegan dengan pose kamera berbeda.
Drag memutar logo, klik menyorot komponen, panah/+/- untuk rotasi/zoom
saat canvas fokus. Spasi menjeda gerak idle; X memisahkan; R mereset
ke pose adegan saat ini. Klik Object studio untuk panel material/slider.
Material Original/Chrome/Wire, unduh PNG, layar penuh juga tersedia.
Reduced motion menonaktifkan animasi kamera dan gerak idle.
Browser tanpa WebGL menampilkan simbol SVG; konten dan tautan tetap aktif.
Font Google opsional dengan font sistem sebagai cadangan.

KONTEN
Identitas dan akun @kursuspte_whv diberikan pengguna.
Profil kelas PTE online/offline Pare merujuk profil Golden Goals di Glints:
https://glints.com/id/opportunities/jobs/tutor-bahas-inggris-pte/be26b1af-26b9-43d0-b4fe-708e971ab21e
Harga, jadwal, fasilitas nyata, hasil ujian, dan testimoni tidak dikarang.

PINDAH KOMPUTER
composer install
copy .env.example .env
php artisan key:generate
php artisan serve --port=8002

CEK
php artisan test
php artisan view:cache
node --check public/js/cinematic.js

HOSTING
Gunakan hosting PHP 8.2+ dengan ekstensi Laravel dan document root public/.
APP_ENV=production; APP_DEBUG=false; APP_URL sesuai domain.
Jangan publikasikan .env sebagai file publik.
